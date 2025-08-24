from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import numpy as np
import os
import logging
from datetime import datetime
import sys
import traceback

# Enable TensorFlow model (set to False if model is unavailable)
USE_MODEL = False
MODEL_PATH = "rice_model.h5"

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log environment details
logger.info(f"Python version: {sys.version}")
has_cv2 = False
try:
    import cv2
    has_cv2 = True
    logger.info(f"OpenCV version: {cv2.__version__}")
except ImportError:
    logger.error("OpenCV (cv2) not found. Install with 'pip install opencv-python-headless'.")
try:
    import tensorflow as tf
    logger.info(f"TensorFlow version: {tf.__version__}")
except ImportError:
    logger.error("TensorFlow not found. Install with 'pip install tensorflow'.")

# Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    logger.info("Health check requested")
    return jsonify({"status": "healthy"}), 200

# Rice types
RICE_TYPES = [
    {"type": "Basmati", "details": "Long-grain rice used in Indian cuisine", "image_paths": ["images/basmati1.jpg"]},
    {"type": "Sen Kra Ob", "details": "Fragrant rice used in Thai cuisine", "image_paths": ["images/sen_kra_ob1.jpg"]},
    {"type": "Phka Rumduol", "details": "Fragrant rice used in Thai cuisine", "image_paths": ["images/romdul1.png"]},
    {"type": "Neang Khon", "details": "Fragrant rice used in Thai cuisine", "image_paths": ["images/neang_khon1.png"]},
    {"type": "Sro 54", "details": "Fragrant rice used in Thai cuisine", "image_paths": ["images/sro54_1.png"]},
    {"type": "Neang Am", "details": "Fragrant rice used in Thai cuisine", "image_paths": ["images/neang_am1.png"]},
]

# Load reference images
def load_reference_images():
    reference_images = {}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    for rice in RICE_TYPES:
        reference_images[rice["type"]] = []
        for image_path in rice.get("image_paths", [rice.get("image_path")]):
            full_path = os.path.join(base_dir, image_path)
            if os.path.exists(full_path):
                try:
                    img = cv2.imread(full_path) if has_cv2 else np.array(Image.open(full_path).convert("RGB"))
                    if img is not None:
                        reference_images[rice["type"]].append(img)
                        logger.info(f"Loaded reference image: {full_path}")
                    else:
                        logger.warning(f"Could not load image {full_path}")
                except Exception as e:
                    logger.error(f"Failed to load {full_path}: {str(e)}")
            else:
                logger.warning(f"Image {full_path} not found")
    if not any(len(imgs) > 0 for imgs in reference_images.values()):
        logger.warning("No valid reference images found, using placeholders")
        return {r["type"]: [np.zeros((100, 100, 3), dtype=np.uint8)] for r in RICE_TYPES}
    return reference_images

REFERENCE_IMAGES = load_reference_images()

# Load model
model = None
if USE_MODEL:
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Model not loaded: {str(e)} with traceback: {traceback.format_exc()}")
        USE_MODEL = False

# Resize image to fit maximum width
def resize_image(image, max_width=800, min_size=150):
    try:
        width, height = image.size
        if width > max_width:
            new_width = max_width
            new_height = int(height * (new_width / width))
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            logger.info(f"Resized image from {width}x{height} to {new_width}x{new_height}")
        if image.size[0] < min_size or image.size[1] < min_size:
            logger.warning(f"Resized image too small: {image.size}. Minimum required {min_size}x{min_size}")
            return None
        return image
    except Exception as e:
        logger.error(f"Image resize error: {str(e)} with traceback: {traceback.format_exc()}")
        return None

# Preprocess image (with fallback)
def preprocess_image(image):
    try:
        img_array = np.array(image)
        if has_cv2:
            img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            img_gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
            img_eq = cv2.equalizeHist(img_gray)
            img_blur = cv2.GaussianBlur(img_eq, (3, 3), 0)
            return img_cv, img_gray
        else:
            logger.warning("OpenCV not available, using raw image")
            return img_array, img_array
    except Exception as e:
        logger.error(f"Preprocessing error: {str(e)} with traceback: {traceback.format_exc()}")
        return None, None

# Quality checker
def check_image_quality(image):
    try:
        img_array = np.array(image)
        if has_cv2:
            img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            img_gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
            
            laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()
            if laplacian_var < 30:
                return False, "Image is too blurry. Please use a clearer image."
            
            height, width = img_cv.shape[:2]
            if height < 150 or width < 150:
                return False, "Image is too small. Minimum size is 150x150 pixels."
            
            mean_intensity = np.mean(img_gray)
            if mean_intensity < 20 or mean_intensity > 230:
                return False, "Image lighting is too dark or too bright."
            
            edges = cv2.Canny(img_gray, 30, 100)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            rice_like = len(contours) > 0
            if not rice_like:
                return False, "Image does not appear to contain rice grains."
            
            return True, "Image quality is sufficient."
        else:
            logger.warning("OpenCV not available, skipping advanced quality check")
            height, width, _ = img_array.shape
            if height < 150 or width < 150:
                return False, "Image is too small. Minimum size is 150x150 pixels."
            return True, "Basic quality check passed (OpenCV unavailable)"
    except Exception as e:
        logger.error(f"Quality check error: {str(e)} with traceback: {traceback.format_exc()}")
        return False, f"Error checking image quality: {str(e)}"

# ORB classification (with fallback)
def classify_rice_orb(image):
    logger.info("Starting ORB classification")
    if not REFERENCE_IMAGES or all(len(imgs) == 0 for imgs in REFERENCE_IMAGES.values()):
        logger.warning("No valid reference images available")
        return {
            "paddy_name": "Unknown",
            "pure_paddy_percent": 0.0,
            "mixed_paddy_percent": 100.0,
            "good_paddy_score": 0.0,
            "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": "No reference images available"
        }

    is_good_quality, message = check_image_quality(image)
    if not is_good_quality:
        logger.info(f"Image rejected: {message}")
        return {
            "paddy_name": "Unknown",
            "pure_paddy_percent": 0.0,
            "mixed_paddy_percent": 100.0,
            "good_paddy_score": 0.0,
            "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": message
        }

    try:
        img_cv, img_gray = preprocess_image(image)
        if not has_cv2:
            logger.warning("OpenCV not available, skipping ORB classification")
            return {
                "paddy_name": "Unknown",
                "pure_paddy_percent": 0.0,
                "mixed_paddy_percent": 100.0,
                "good_paddy_score": 0.0,
                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "details": "ORB classification unavailable (OpenCV missing)"
            }
        orb = cv2.ORB_create(nfeatures=2000, scaleFactor=1.2, nlevels=8)
        kp1, des1 = orb.detectAndCompute(img_gray, None)

        if des1 is None or len(kp1) < 5:
            logger.warning(f"Insufficient keypoints detected: {len(kp1)}")
            return {
                "paddy_name": "Unknown",
                "pure_paddy_percent": 0.0,
                "mixed_paddy_percent": 100.0,
                "good_paddy_score": 0.0,
                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "details": "Insufficient features detected"
            }

        best_match = {
            "paddy_name": "Unknown",
            "pure_paddy_percent": 0.0,
            "mixed_paddy_percent": 100.0,
            "good_paddy_score": 0.0,
            "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": "No rice detected"
        }
        max_matches = 0
        dynamic_threshold = max(15, len(kp1) * 0.03)

        for rice_type, ref_imgs in REFERENCE_IMAGES.items():
            for ref_img in ref_imgs:
                try:
                    ref_gray = cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY)
                    ref_gray = cv2.equalizeHist(ref_gray)
                    kp2, des2 = orb.detectAndCompute(ref_gray, None)

                    if des2 is None or len(kp2) < 5:
                        continue

                    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
                    matches = bf.match(des1, des2)
                    num_matches = len(matches)
                    logger.info(f"Matches for {rice_type}: {num_matches}")

                    if num_matches > max_matches:
                        max_matches = num_matches
                        confidence = min(num_matches / 50.0, 0.99)
                        if num_matches >= dynamic_threshold or num_matches > 0:
                            best_match = {
                                "paddy_name": rice_type,
                                "pure_paddy_percent": round(confidence * 100, 2),
                                "mixed_paddy_percent": round((1 - confidence) * 100, 2),
                                "good_paddy_score": round(confidence * 100, 2),
                                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                "details": next(r["details"] for r in RICE_TYPES if r["type"] == rice_type)
                            }
                        else:
                            best_match = {
                                "paddy_name": rice_type,
                                "pure_paddy_percent": 20.0,
                                "mixed_paddy_percent": 80.0,
                                "good_paddy_score": 20.0,
                                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                "details": next(r["details"] for r in RICE_TYPES if r["type"] == rice_type)
                            }
                except Exception as e:
                    logger.error(f"Error in matching for {rice_type}: {str(e)} with traceback: {traceback.format_exc()}")
                    continue

        logger.info(f"Best match: {best_match['paddy_name']} with {max_matches} matches")
        return best_match
    except Exception as e:
        logger.error(f"ORB classification error: {str(e)} with traceback: {traceback.format_exc()}")
        return {
            "paddy_name": "Unknown",
            "pure_paddy_percent": 0.0,
            "mixed_paddy_percent": 100.0,
            "good_paddy_score": 0.0,
            "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": f"Classification error: {str(e)}"
        }

# Model classification
def classify_rice_model(image):
    try:
        img = image.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        try:
            import tensorflow as tf
            predictions = model.predict(img_array, verbose=0)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx])
            
            if confidence < 0.5:
                return classify_rice_orb(image)
            
            rice_type = RICE_TYPES[class_idx % len(RICE_TYPES)]
            return {
                "paddy_name": rice_type["type"],
                "pure_paddy_percent": round(confidence * 100, 2),
                "mixed_paddy_percent": round((1 - confidence) * 100, 2),
                "good_paddy_score": round(confidence * 100, 2),
                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "details": rice_type["details"]
            }
        except ImportError:
            logger.warning("TensorFlow not available, falling back to ORB")
            return classify_rice_orb(image)
        except Exception as e:
            logger.error(f"Model error: {str(e)} with traceback: {traceback.format_exc()}")
            return classify_rice_orb(image)
    except Exception as e:
        logger.error(f"Model error: {str(e)} with traceback: {traceback.format_exc()}")
        return classify_rice_orb(image)

# Ensemble classification
def classify_rice_ensemble(image):
    try:
        model_result = classify_rice_model(image) if USE_MODEL and model else None
        orb_result = classify_rice_orb(image)
        
        if not model_result:
            return orb_result
        
        if model_result["paddy_name"] == orb_result["paddy_name"] and model_result["pure_paddy_percent"] > 70:
            combined_confidence = (model_result["pure_paddy_percent"] * 0.7 + orb_result["pure_paddy_percent"] * 0.3) / 100
            return {
                "paddy_name": model_result["paddy_name"],
                "pure_paddy_percent": round(combined_confidence * 100, 2),
                "mixed_paddy_percent": round((1 - combined_confidence) * 100, 2),
                "good_paddy_score": round(combined_confidence * 100, 2),
                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "details": model_result["details"]
            }
        elif model_result["pure_paddy_percent"] > 80:
            return model_result
        elif orb_result["pure_paddy_percent"] > 20:
            return orb_result
        else:
            return {
                "paddy_name": "Unknown",
                "pure_paddy_percent": 0.0,
                "mixed_paddy_percent": 100.0,
                "good_paddy_score": 0.0,
                "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "details": "Low confidence in classification"
            }
    except Exception as e:
        logger.error(f"Ensemble classification error: {str(e)} with traceback: {traceback.format_exc()}")
        return {
            "paddy_name": "Unknown",
            "pure_paddy_percent": 0.0,
            "mixed_paddy_percent": 100.0,
            "good_paddy_score": 0.0,
            "last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": f"Ensemble error: {str(e)}"
        }

# API endpoint for scanning rice
@app.route("/api/scan-rice", methods=["POST"])
def scan_rice():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            logger.warning("No image provided in request")
            return jsonify({"error": "No image provided"}), 400

        base64_string = data["image"]
        logger.debug(f"Received base64 string length: {len(base64_string)}")
        if not base64_string.startswith("data:image/"):
            logger.warning("Invalid image format in request")
            return jsonify({"error": "Invalid image format. Use JPG or PNG."}), 400

        # Validate and resize base64 string
        try:
            base64_string = base64_string.split(",")[1]
            if not base64_string:
                raise ValueError("Empty base64 data")
            image_data = base64.b64decode(base64_string, validate=True)
            image = Image.open(BytesIO(image_data)).convert("RGB")
            image = resize_image(image)
            if image is None:
                return jsonify({"error": "Image resize failed or too small."}), 400
            logger.info(f"Image size after resize: {image.size}")
        except (base64.binascii.Error, UnidentifiedImageError, ValueError) as e:
            logger.error(f"Image decoding error: {str(e)} with traceback: {traceback.format_exc()}")
            return jsonify({"error": "Invalid or corrupted image data."}), 400

        result = classify_rice_ensemble(image)
        logger.info(f"Scan result: {result}")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error processing image: {str(e)} with traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# API endpoint for feedback
@app.route("/api/feedback", methods=["POST"])
def feedback():
    data = request.get_json()
    logger.info(f"Feedback received: {data}")
    with open("feedback.log", "a") as f:
        f.write(f"{datetime.now()}: {data}\n")
    return jsonify({"status": "Feedback received"}), 200

if __name__ == "__main__":
    logger.info("Server starting on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)  