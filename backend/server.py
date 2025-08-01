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
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Logging with timestamp
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Store first scan quantities
QUANTITY_CACHE = {}

# Generic rice parameters for quantity/quality analysis
RICE_PARAMS = {
    "min_area": 120,  # Average min area for rice grains
    "max_area": 500,  # Average max area for rice grains
    "shape_factor": 0.65  # Average shape factor for rice
}

# Quality checker
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

# Generate a simple hash of the image for consistency checking
def generate_image_hash(image):
    img_array = np.array(image.resize((64, 64)))  # Resize for faster hashing
    return hashlib.sha256(img_array.tobytes()).hexdigest()

# Detect if rice is husked or unhusked
def detect_husk_status(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        
        # Define color ranges for husk (brownish tones) and polished rice (white/gray tones)
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
            return False, 0.0  # Default to husked with no confidence
        
        husk_ratio = husk_pixels / total_pixels
        is_husked = husk_ratio < 0.5  # If husk pixels are less than 50%, consider it husked
        confidence = 1.0 - abs(husk_ratio - 0.5) * 2  # Confidence based on how clear the distinction is
        
        return is_husked, round(confidence, 3)
    except Exception as e:
        logger.error(f"Error detecting husk status: {str(e)}")
        return False, 0.0

# Detect if the image contains rice
def is_rice_image(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        # Preprocess for rice detection
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3
        )
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Check for rice-like grains
        rice_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if len(rice_grains) < 10:  # Minimum number of grains to consider it rice
            return False, 0.0, "Image does not appear to contain rice"
        
        # Estimate confidence based on number of detected grains
        confidence = min(len(rice_grains) / 100.0, 1.0)
        return True, confidence, "Rice detected"
    except Exception as e:
        logger.error(f"Error detecting rice: {str(e)}")
        return False, 0.0, f"Error detecting rice: {str(e)}"

# Analyze rice quantity and quality based on husk status
def analyze_rice_quantity_quality(image, is_husked=True):
    try:
        # Check cache first
        image_hash = generate_image_hash(image)
        cache_key = f"rice_{is_husked}_{image_hash}"
        if cache_key in QUANTITY_CACHE:
            logger.info(f"Using cached quantity for rice (husked: {is_husked})")
            return QUANTITY_CACHE[cache_key]

        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

        # Preprocess: Enhance contrast, reduce noise, and apply adaptive thresholding
        img_cv = cv2.convertScaleAbs(img_cv, alpha=1.3, beta=10)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)  # Noise reduction
        
        # Adjust thresholding based on husk status
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 
            15 if is_husked else 21, 3 if is_husked else 5
        )

        # Morphological operations to clean up the thresholded image
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2 if is_husked else 3)

        # Find contours to detect grains
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        total_area = img_cv.shape[0] * img_cv.shape[1]

        # Use generic rice parameters
        min_area = RICE_PARAMS["min_area"] * (1.2 if not is_husked else 1.0)  # Adjust for husk
        max_area = RICE_PARAMS["max_area"] * (1.2 if not is_husked else 1.0)
        shape_factor = RICE_PARAMS["shape_factor"]

        rice_area = sum(cv2.contourArea(c) for c in contours if min_area <= cv2.contourArea(c) <= max_area)
        quantity_percent = (rice_area / total_area) * 100 if total_area > 0 else 0.0

        # Quality: Identify bad grains based on shape and discoloration
        bad_grains = 0
        total_grains = len([c for c in contours if min_area <= cv2.contourArea(c) <= max_area])
        for contour in contours:
            area = cv2.contourArea(contour)
            if area < min_area or area > max_area:
                continue
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

        bad_percent = (bad_grains / total_grains) * 100 if total_grains > 0 else 0.0

        result = {
            "quantity_percent": round(quantity_percent, 2),
            "bad_percent": round(bad_percent, 2),
            "total_grains": total_grains
        }

        # Store in cache
        QUANTITY_CACHE[cache_key] = result
        logger.info(f"Cached quantity for rice (husked: {is_husked}): {result}")

        return result
    except Exception as e:
        logger.error(f"Error analyzing quantity/quality: {str(e)}")
        return {"quantity_percent": 0.0, "bad_percent": 0.0, "total_grains": 0}

@app.route("/api/scan-rice", methods=["POST"])
def scan_rice():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        base64_string = data["image"]
        if not base64_string.startswith("data:image/"):
            return jsonify({"error": "Invalid image format. Use JPG or PNG."}), 400

        base64_string = base64_string.split(",")[1]
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data)).convert("RGB")

        # Check image quality
        is_good_quality, quality_message = check_image_quality(image)
        if not is_good_quality:
            return jsonify({"error": quality_message}), 400

        # Detect if image contains rice
        is_rice, rice_confidence, rice_message = is_rice_image(image)
        if not is_rice:
            return jsonify({"error": rice_message}), 400

        # Detect husk status
        is_husked, husk_confidence = detect_husk_status(image)
        logger.info(f"Detected husk status: {'Husked' if is_husked else 'Unhusked'} with confidence {husk_confidence} at {datetime.now().strftime('%H:%M:%S %Y-%m-%d')}")

        # Analyze quantity and quality
        quantity_quality = analyze_rice_quantity_quality(image, is_husked)

        # Combine results
        result = {
            "is_rice": True,
            "confidence": rice_confidence,
            "details": rice_message,
            "husked": is_husked,
            "husk_confidence": husk_confidence,
            "quantity_percent": quantity_quality["quantity_percent"],
            "bad_percent": quantity_quality["bad_percent"],
            "total_grains": quantity_quality["total_grains"],
            "farmer_recommendation": "General advice: Use well-drained or flooded fields depending on rice variety. Harvest after 110-160 days. Consult local agricultural extension for best practices."
        }

        return jsonify(result), 200

    except UnidentifiedImageError:
        return jsonify({"error": "Invalid or corrupted image data."}), 400
    except Exception as e:
        logger.error(f"Error: {str(e)} at {datetime.now().strftime('%H:%M:%S %Y-%m-%d')}")
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)