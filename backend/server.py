from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import numpy as np
import cv2
import logging
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "*"]}})  # Allow all origins for testing

# Logging with timestamp
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Store first scan quantities
QUANTITY_CACHE = {}

# Generic rice parameters
RICE_PARAMS = {
    "min_area": 120,
    "max_area": 500,
    "shape_factor": 0.65
}

# Paddy variety parameters
PADDY_VARIETIES = {
    "Jasmine": {"hsv_range": ([5, 50, 50], [25, 255, 255]), "shape_factor": 0.7, "intensity_range": (80, 200)},
    "Basmati": {"hsv_range": ([10, 30, 60], [30, 200, 255]), "shape_factor": 0.8, "intensity_range": (90, 210)},
    "Sticky Rice": {"hsv_range": ([0, 20, 100], [20, 100, 255]), "shape_factor": 0.6, "intensity_range": (70, 190)},
    "Phka Rumduol": {"hsv_range": ([5, 60, 60], [25, 255, 255]), "shape_factor": 0.72, "intensity_range": (85, 205)},
    "Phka Rumdeng": {"hsv_range": ([5, 55, 55], [25, 250, 255]), "shape_factor": 0.71, "intensity_range": (82, 202)},
    "Sen Kra'op": {"hsv_range": ([8, 50, 70], [28, 255, 255]), "shape_factor": 0.68, "intensity_range": (80, 200)},
    "Sen Pidao": {"hsv_range": ([10, 40, 50], [30, 200, 255]), "shape_factor": 0.75, "intensity_range": (90, 210)},
    "OM5451": {"hsv_range": ([12, 35, 60], [32, 190, 255]), "shape_factor": 0.73, "intensity_range": (88, 208)}
}

def check_image_quality(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < 80:
            return False, "Image is too blurry. Please use a clearer image."
        height, width = img_cv.shape[:2]
        if height < 100 or width < 100:
            return False, "Image is too small. Minimum size is 100x100 pixels."
        return True, "Image quality is sufficient."
    except Exception as e:
        return False, f"Error checking image quality: {str(e)}"

def generate_image_hash(image):
    img_array = np.array(image.resize((64, 64)))
    return hashlib.sha256(img_array.tobytes()).hexdigest()

def detect_husk_status(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        
        husk_lower = np.array([10, 50, 50])
        husk_upper = np.array([30, 255, 255])
        rice_lower = np.array([0, 0, 150])
        rice_upper = np.array([180, 50, 255])
        
        husk_mask = cv2.inRange(hsv, husk_lower, husk_upper)
        rice_mask = cv2.inRange(hsv, rice_lower, rice_upper)
        
        husk_pixels = cv2.countNonZero(husk_mask)
        rice_pixels = cv2.countNonZero(rice_mask)
        
        total_pixels = husk_pixels + rice_pixels
        if total_pixels == 0:
            return False, 0.0
        
        husk_ratio = husk_pixels / total_pixels
        is_husked = husk_ratio < 0.5
        confidence = 1.0 - abs(husk_ratio - 0.5) * 2
        
        return is_husked, round(confidence, 3)
    except Exception as e:
        logger.error(f"Error detecting husk status: {str(e)}")
        return False, 0.0

def detect_paddy_variety(image, is_husked):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        variety_scores = []
        total_pixels = 0
        
        for variety, params in PADDY_VARIETIES.items():
            lower, upper = params["hsv_range"]
            mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
            pixels = cv2.countNonZero(mask)
            total_pixels += pixels
            variety_scores.append({"name": variety, "pixels": pixels, "shape_factor": params["shape_factor"]})
        
        dominant_variety = None
        max_percentage = 0
        if total_pixels == 0:
            logger.warning("No valid pixels detected for variety analysis")
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
            if valid_grains:
                avg_circularity = sum(4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0 for c in valid_grains) / len(valid_grains)
                closest_variety = min(PADDY_VARIETIES.items(), key=lambda x: abs(x[1]["shape_factor"] - avg_circularity))[0]
                return closest_variety, "Mixed", 0.5
        
        for variety in variety_scores:
            percentage = variety["pixels"] / total_pixels if total_pixels > 0 else 0
            if percentage > max_percentage:
                max_percentage = percentage
                dominant_variety = variety["name"]
        
        if not dominant_variety:
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
            if valid_grains:
                avg_circularity = sum(4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0 for c in valid_grains) / len(valid_grains)
                closest_variety = min(PADDY_VARIETIES.items(), key=lambda x: abs(x[1]["shape_factor"] - avg_circularity))[0]
                return closest_variety, "Mixed", 0.5
        
        type = "Pure" if max_percentage > 0.8 else "Mixed"
        confidence = max_percentage
        
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        
        if valid_grains and dominant_variety:
            shape_confidence = sum(1 for c in valid_grains if abs(4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0 - PADDY_VARIETIES[dominant_variety]["shape_factor"]) < 0.15) / len(valid_grains) if valid_grains else 0
            confidence = (confidence + shape_confidence) / 2
        
        logger.info(f"Detected paddy: {dominant_variety} ({type}) with confidence {confidence:.3f}")
        return dominant_variety, type, round(confidence, 3)
    except Exception as e:
        logger.error(f"Error detecting paddy variety: {str(e)}")
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if valid_grains:
            avg_circularity = sum(4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0 for c in valid_grains) / len(valid_grains)
            closest_variety = min(PADDY_VARIETIES.items(), key=lambda x: abs(x[1]["shape_factor"] - avg_circularity))[0]
            return closest_variety, "Mixed", 0.5
        return "Phka Rumduol", "Mixed", 0.5

def is_rice_image(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        rice_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if len(rice_grains) < 10:
            return False, 0.0, "Image does not appear to contain rice"
        
        confidence = min(len(rice_grains) / 100.0, 1.0)
        return True, confidence, "Paddy detected"
    except Exception as e:
        logger.error(f"Error detecting rice: {str(e)}")
        return False, 0.0, f"Error detecting rice: {str(e)}"

def analyze_rice_quantity_quality(image, is_husked=True):
    try:
        image_hash = generate_image_hash(image)
        cache_key = f"rice_{is_husked}_{image_hash}"
        if cache_key in QUANTITY_CACHE:
            logger.info(f"Using cached quantity for rice (husked: {is_husked})")
            return QUANTITY_CACHE[cache_key]

        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

        img_cv = cv2.convertScaleAbs(img_cv, alpha=1.3, beta=10)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 
            15 if is_husked else 21, 3 if is_husked else 5
        )

        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2 if is_husked else 3)

        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        total_area = img_cv.shape[0] * img_cv.shape[1]

        min_area = RICE_PARAMS["min_area"] * (1.2 if not is_husked else 1.0)
        max_area = RICE_PARAMS["max_area"] * (1.2 if not is_husked else 1.0)
        shape_factor = RICE_PARAMS["shape_factor"]

        rice_area = sum(cv2.contourArea(c) for c in contours if min_area <= cv2.contourArea(c) <= max_area)
        quantity_percent = (rice_area / total_area) * 100 if total_area > 0 else 0.0

        bad_grains = 0
        total_grains = len([c for c in contours if min_area <= cv2.contourArea(c) <= max_area])
        shape_uniformity = 0.0
        valid_grains = []

        for contour in contours:
            area = cv2.contourArea(contour)
            if min_area <= area <= max_area:
                valid_grains.append(contour)
                perimeter = cv2.arcLength(contour, True)
                circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
                if circularity < shape_factor * (0.85 if is_husked else 0.80) or circularity > shape_factor * (1.15 if is_husked else 1.20):
                    bad_grains += 1
                else:
                    x, y, w, h = cv2.boundingRect(contour)
                    grain_roi = gray[y:y+h, x:x+w]
                    mean_intensity = np.mean(grain_roi)
                    if mean_intensity < (70 if is_husked else 60) or mean_intensity > (210 if is_husked else 200):
                        bad_grains += 1
                shape_uniformity += abs(circularity - shape_factor)

        if valid_grains:
            shape_uniformity = 1 - (shape_uniformity / len(valid_grains)) / shape_factor if len(valid_grains) > 0 else 0.0
        else:
            shape_uniformity = 0.0

        bad_percent = (bad_grains / total_grains) * 100 if total_grains > 0 else 0.0

        result = {
            "quantity_percent": round(quantity_percent, 2),
            "bad_percent": round(bad_percent, 2),
            "total_grains": total_grains,
            "shape_uniformity": round(shape_uniformity * 100, 2)  # Percentage of uniformity
        }

        QUANTITY_CACHE[cache_key] = result
        logger.info(f"Cached quantity for rice (husked: {is_husked}): {result}")

        return result
    except Exception as e:
        logger.error(f"Error analyzing quantity/quality: {str(e)}")
        return {"quantity_percent": 0.0, "bad_percent": 0.0, "total_grains": 0, "shape_uniformity": 0.0}

@app.route("/api/scan-rice", methods=["POST"])
def scan_rice():
    try:
        data = request.get_json()
        logger.info(f"Received request data: {data}")
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        base64_string = data["image"]
        if not base64_string.startswith("data:image/"):
            return jsonify({"error": "Invalid image format. Use JPG or PNG."}), 400

        base64_string = base64_string.split(",")[1]
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data)).convert("RGB")

        is_good_quality, quality_message = check_image_quality(image)
        if not is_good_quality:
            return jsonify({"error": quality_message}), 400

        is_rice, rice_confidence, rice_message = is_rice_image(image)
        if not is_rice:
            return jsonify({"error": rice_message}), 400

        is_husked, husk_confidence = detect_husk_status(image)
        logger.info(f"Detected husk status: {'Husked' if is_husked else 'Unhusked'} with confidence {husk_confidence} at {datetime.now().strftime('%H:%M:%S %Y-%m-%d')}")

        paddy_name, type, confidence = detect_paddy_variety(image, is_husked)

        quantity_quality = analyze_rice_quantity_quality(image, is_husked)

        # Calculate good paddy score (0-100)
        bad_weight = 0.4  # 40% weight on bad percent
        quantity_weight = 0.3  # 30% weight on quantity percent
        shape_weight = 0.2  # 20% weight on shape uniformity
        husk_weight = 0.1  # 10% weight on husk confidence
        good_paddy_score = (
            (100 - min(quantity_quality["bad_percent"], 100)) * bad_weight +  # Invert bad percent
            min(quantity_quality["quantity_percent"], 100) * quantity_weight +  # Cap at 100
            quantity_quality["shape_uniformity"] * shape_weight +
            (husk_confidence * 100) * husk_weight
        )

        result = {
            "paddy_name": paddy_name,
            "type": type,
            "bad_paddy_percent": quantity_quality["bad_percent"],
            "quantity_percent": quantity_quality["quantity_percent"],
            "shape_uniformity": quantity_quality["shape_uniformity"],
            "husk_confidence": round(husk_confidence * 100, 2),  # Convert to percentage
            "good_paddy_score": round(good_paddy_score, 2),  # Overall quality score
            "quality_summary": "Good" if good_paddy_score > 75 else "Average" if good_paddy_score > 50 else "Poor"
        }

        logger.info(f"Scan result: {result}")
        return jsonify(result), 200

    except UnidentifiedImageError:
        return jsonify({"error": "Invalid or corrupted image data."}), 400
    except Exception as e:
        logger.error(f"Error: {str(e)} at {datetime.now().strftime('%H:%M:%S %Y-%m-%d')}")
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)