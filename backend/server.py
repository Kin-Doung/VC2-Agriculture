from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import numpy as np
import cv2
import os
import random
import logging

# Optional: TensorFlow model
USE_MODEL = False
MODEL_PATH = "rice_model.h5"

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rice types (must match model class order if using model)
RICE_TYPES = [
    {"type": "Basmati", "details": "Long-grain rice used in Indian cuisine", "image_path": "images/rice-1.jpg"},
    {"type": "Jasmine", "details": "Fragrant rice used in Thai cuisine", "image_path": "images/rice.jpg"},
]

# Load reference images for ORB
def load_reference_images():
    reference_images = {}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    for rice in RICE_TYPES:
        image_path = os.path.join(base_dir, rice["image_path"])
        if os.path.exists(image_path):
            img = cv2.imread(image_path)
            if img is not None:
                reference_images[rice["type"]] = img
            else:
                logger.warning(f"Could not load image {image_path}")
        else:
            logger.warning(f"Image {image_path} not found")
    return reference_images

REFERENCE_IMAGES = load_reference_images()

# Optional: Load model
model = None
if USE_MODEL:
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.warning(f"Model not loaded: {e}")
        USE_MODEL = False

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

# ORB classification with rice/non-rice check
def classify_rice_orb(image):
    if not REFERENCE_IMAGES:
        result = random.choice(RICE_TYPES)
        result["confidence"] = random.uniform(0.8, 0.99)
        return result

    is_good_quality, message = check_image_quality(image)
    if not is_good_quality:
        return {"type": "Unknown", "confidence": 0.0, "details": message}

    img_array = np.array(image)
    img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    img_gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create()
    kp1, des1 = orb.detectAndCompute(img_gray, None)

    if des1 is None or len(kp1) < 10:
        return {"type": "Unknown", "confidence": 0.0, "details": "No features detected in input image"}

    best_match = {"type": "Unknown", "confidence": 0.0, "details": "Image does not appear to contain rice"}
    max_matches = 0
    MIN_MATCHES_FOR_RICE = 20  # Threshold for rice-like features

    for rice_type, ref_img in REFERENCE_IMAGES.items():
        ref_gray = cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY)
        kp2, des2 = orb.detectAndCompute(ref_gray, None)

        if des2 is None or len(kp2) < 10:
            continue

        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)
        num_matches = len(matches)

        # Check if the image has enough matches to be considered rice
        if num_matches >= MIN_MATCHES_FOR_RICE and num_matches > max_matches:
            max_matches = num_matches
            confidence = min(num_matches / 100.0, 0.99)
            best_match = {
                "type": rice_type,
                "confidence": confidence,
                "details": next(r["details"] for r in RICE_TYPES if r["type"] == rice_type)
            }

    return best_match

# Model classification
def classify_rice_model(image):
    try:
        img = image.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        predictions = model.predict(img_array)
        class_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][class_idx])
        rice_type = RICE_TYPES[class_idx]
        return {
            "type": rice_type["type"],
            "confidence": round(confidence, 3),
            "details": rice_type["details"]
        }
    except Exception as e:
        return {"type": "Unknown", "confidence": 0.0, "details": f"Model error: {str(e)}"}

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

        if USE_MODEL and model:
            result = classify_rice_model(image)
        else:
            result = classify_rice_orb(image)

        return jsonify(result), 200

    except UnidentifiedImageError:
        return jsonify({"error": "Invalid or corrupted image data."}), 400
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)