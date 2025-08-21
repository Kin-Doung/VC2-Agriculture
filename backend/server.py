
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
import uuid
import requests
import sqlite3
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

print(f"TensorFlow version: {tf.__version__}")
print("Imports successful")

# Suppress TensorFlow oneDNN warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]}})

# Logging setup
class RequestIdFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, 'request_id'):
            record.request_id = 'no-request-id'
        return True

os.makedirs('logs', exist_ok=True)

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - [RequestID: %(request_id)s] - %(message)s',
    handlers=[
        logging.FileHandler('logs/server.log'),
        logging.StreamHandler()
    ]
)

root_logger = logging.getLogger()
root_logger.addFilter(RequestIdFilter())

logger = logging.getLogger(__name__)

QUANTITY_CACHE = {}
RICE_PARAMS = {
    "min_area": 120,
    "max_area": 500,
    "shape_factor": 0.65
}

def init_variety_database():
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    conn = sqlite3.connect('paddy_varieties.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='varieties'")
    table_exists = cursor.fetchone()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS varieties (
            name TEXT PRIMARY KEY,
            type TEXT,
            hsv_lower TEXT,
            hsv_upper TEXT,
            shape_factor REAL,
            intensity_range TEXT,
            length_mm REAL,
            width_mm REAL,
            length_width_ratio REAL,
            confidence_threshold REAL,
            reference_image_path TEXT
        )
    ''')

    if table_exists:
        cursor.execute("PRAGMA table_info(varieties)")
        columns = [col[1] for col in cursor.fetchall()]
        if 'type' not in columns:
            cursor.execute('ALTER TABLE varieties ADD COLUMN type TEXT')
        if 'confidence_threshold' not in columns:
            cursor.execute('ALTER TABLE varieties ADD COLUMN confidence_threshold REAL')
        if 'reference_image_path' not in columns:
            cursor.execute('ALTER TABLE varieties ADD COLUMN reference_image_path TEXT')

    initial_varieties = [
        ("Phka Rumduol", "Long Grain", "[5, 60, 60]", "[25, 255, 255]", 0.69, "[85, 205]", 7.0, 2.0, 3.5, 0.6, "static/reference_images/phka_rumduol.jpg"),
        ("Phka Romeat", "Long Grain", "[5, 58, 58]", "[25, 255, 255]", 0.71, "[84, 204]", 6.1, 2.2, 2.77, 0.6, "static/reference_images/phka_romeat.jpg"),
        ("Jasmine", "Long Grain", "[10, 30, 60]", "[30, 200, 255]", 0.65, "[90, 210]", 7.0, 1.8, 3.89, 0.65, "static/reference_images/jasmine.jpg"),
        ("Basmati", "Long Grain", "[5, 40, 60]", "[20, 200, 255]", 0.70, "[80, 200]", 7.5, 1.5, 5.0, 0.6, "static/reference_images/basmati.jpg"),
        ("Sen Pidao", "Long Grain", "[5, 50, 50]", "[25, 255, 255]", 0.68, "[80, 200]", 6.5, 2.1, 3.1, 0.6, "static/reference_images/sen_pidao.jpg"),
        ("IR64", "Medium Grain", "[10, 50, 60]", "[30, 200, 255]", 0.67, "[85, 205]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/ir64.jpg")
    ]

    cursor.executemany('''
        INSERT OR REPLACE INTO varieties (name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold, reference_image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_varieties)
    conn.commit()
    conn.close()

    for variety in initial_varieties:
        ref_image_path = variety[10]
        if not os.path.exists(ref_image_path):
            logger_with_id.warning(f"Reference image not found: {ref_image_path}. Please ensure it exists.")
init_variety_database()

try:
    CNN_MODEL = load_model("paddy_model.h5")
    logger.info("CNN model loaded successfully", extra={'request_id': 'global'})
except Exception as e:
    logger.error(f"Failed to load CNN model: {str(e)}. Falling back to feature-based detection.", extra={'request_id': 'global'})
    CNN_MODEL = None

def check_image_quality(image):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        brightness = np.mean(img_array)
        height, width = img_cv.shape[:2]
        message_parts = []
        if laplacian_var < 80:
            message_parts.append("Image is too blurry. Increase focus or use a higher-resolution camera.")
        if brightness < 100 or brightness > 200:
            message_parts.append("Inconsistent lighting. Use diffused LED light (5500K recommended) with brightness 100-200.")
        if height < 100 or width < 100:
            message_parts.append("Image is too small. Minimum size is 100x100 pixels.")
        if height * width > 4000 * 4000:
            message_parts.append("Image is too large. Maximum resolution is 4000x4000 pixels.")
        if message_parts:
            return False, "; ".join(message_parts)
        return True, "Image quality is sufficient."
    except Exception as e:
        logger_with_id.error(f"Error checking image quality: {str(e)}")
        return False, f"Error checking image quality: {str(e)}"

def generate_image_hash(image):
    img_array = np.array(image.resize((64, 64)))
    return hashlib.sha256(img_array.tobytes()).hexdigest()

def detect_husk_status(image):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
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
        logger_with_id.error(f"Error detecting husk status: {str(e)}")
        return False, 0.0

def get_reference_data(variety_name):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        conn = sqlite3.connect('paddy_varieties.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold, reference_image_path
            FROM varieties WHERE name = ?
        ''', (variety_name,))
        variety = cursor.fetchone()
        conn.close()
        if variety:
            reference_image_path = variety[10]
            reference_image_base64 = None
            if os.path.exists(reference_image_path):
                with open(reference_image_path, "rb") as img_file:
                    reference_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')
            return {
                "name": variety[0],
                "type": variety[1],
                "hsv_lower": variety[2],
                "hsv_upper": variety[3],
                "shape_factor": variety[4],
                "intensity_range": variety[5],
                "length_mm": variety[6],
                "width_mm": variety[7],
                "length_width_ratio": variety[8],
                "confidence_threshold": variety[9],
                "reference_image_base64": reference_image_base64
            }
        return None
    except Exception as e:
        logger_with_id.error(f"Error fetching reference data: {str(e)}")
        return None

def detect_paddy_variety(image, is_husked):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        conn = sqlite3.connect('paddy_varieties.db')
        cursor = conn.cursor()
        cursor.execute("SELECT name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold FROM varieties")
        varieties = cursor.fetchall()
        conn.close()

        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        variety_scores = {v[0]: {"count": 0, "scores": []} for v in varieties}
        total_grains = 0
        scanned_features = {"lengths": [], "widths": [], "ratios": [], "shape_factors": []}
        
        for contour in contours:
            area = cv2.contourArea(contour)
            if RICE_PARAMS["min_area"] <= area <= RICE_PARAMS["max_area"]:
                total_grains += 1
                x, y, w, h = cv2.boundingRect(contour)
                hsv_grain = hsv[y:y+h, x:x+w]
                gray_grain = gray[y:y+h, x:x+w]
                perimeter = cv2.arcLength(contour, True)
                circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
                l_w_ratio = w / h if h > 0 else 0
                intensity = np.mean(gray_grain)
                scanned_features["lengths"].append(w)
                scanned_features["widths"].append(h)
                scanned_features["ratios"].append(l_w_ratio)
                scanned_features["shape_factors"].append(circularity)
                
                for variety in varieties:
                    name, v_type, hsv_lower_str, hsv_upper_str, v_shape_factor, intensity_range_str, v_length, v_width, v_l_w_ratio, v_confidence_threshold = variety
                    hsv_lower = np.array(eval(hsv_lower_str))
                    hsv_upper = np.array(eval(hsv_upper_str))
                    intensity_range = eval(intensity_range_str)
                    
                    mask = cv2.inRange(hsv_grain, hsv_lower, hsv_upper)
                    hsv_score = cv2.countNonZero(mask) / (w * h) if (w * h) > 0 else 0
                    shape_score = 1 - abs(circularity - v_shape_factor) / max(v_shape_factor, 0.1) if v_shape_factor > 0 else 0
                    ratio_score = 1 - abs(l_w_ratio - v_l_w_ratio) / max(v_l_w_ratio, 0.1) if v_l_w_ratio > 0 else 0
                    intensity_score = 1 if intensity_range[0] <= intensity <= intensity_range[1] else 0
                    length_score = 1 - abs(w - v_length) / max(v_length, 0.1) if v_length > 0 else 0
                    width_score = 1 - abs(h - v_width) / max(v_width, 0.1) if v_width > 0 else 0
                    
                    if v_type == "Long Grain":
                        combined_score = (
                            0.5 * hsv_score +
                            0.15 * shape_score +
                            0.15 * ratio_score +
                            0.10 * intensity_score +
                            0.10 * length_score +
                            0.10 * width_score
                        )
                    else:
                        combined_score = (
                            0.4 * hsv_score +
                            0.2 * shape_score +
                            0.2 * ratio_score +
                            0.1 * intensity_score +
                            0.05 * length_score +
                            0.05 * width_score
                        )
                    
                    if combined_score >= v_confidence_threshold:
                        variety_scores[name]["scores"].append(combined_score)
                        variety_scores[name]["count"] += 1
                    logger_with_id.debug(f"Variety: {name}, Combined Score: {combined_score:.3f}, Threshold: {v_confidence_threshold}")

        if total_grains < 10:
            return "Unknown (Insufficient Grains)", "Unknown", 0.5, 0.0, 1.0, scanned_features, "Insufficient grains detected. Please provide an image with at least 10 rice grains."

        dominant_variety = max(variety_scores, key=lambda k: variety_scores[k]["count"] if variety_scores[k]["scores"] else 0)
        pure_paddy_percent = variety_scores[dominant_variety]["count"] / total_grains if total_grains > 0 else 0.0
        mixed_percentage = 1 - pure_paddy_percent
        
        cnn_variety = None
        cnn_confidence = 0.0
        if CNN_MODEL:
            try:
                img_resized = image.resize((224, 224))
                img_array = img_to_array(img_resized) / 255.0
                prediction = CNN_MODEL.predict(img_array[np.newaxis, ...], verbose=0)
                cnn_index = np.argmax(prediction)
                cnn_confidence = float(np.max(prediction))
                cnn_variety = next((v[0] for v in varieties if v[0] == varieties[cnn_index][0]), "Unknown (Local/Hybrid)")
                logger_with_id.info(f"CNN prediction: {cnn_variety} with confidence {cnn_confidence:.3f}")
            except Exception as e:
                logger_with_id.warning(f"CNN prediction failed: {str(e)}. Falling back to feature-based detection.")
                cnn_variety = "Unknown"
                cnn_confidence = 0.0

        type = "Pure" if pure_paddy_percent >= 0.6 else "Mixed"
        if not variety_scores[dominant_variety]["scores"]:
            dominant_variety = "Unknown (Local/Hybrid)"
            type = "Local/Hybrid"
        
        hsv_confidence = pure_paddy_percent
        shape_confidence = 0.0
        ratio_confidence = 0.0
        valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if valid_grains and dominant_variety != "Unknown (Local/Hybrid)":
            for variety in varieties:
                if variety[0] == dominant_variety:
                    shape_confidence = sum(1 for c in valid_grains if abs((4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0) - variety[4]) < 0.15) / len(valid_grains)
                    ratios = [cv2.boundingRect(c)[2] / cv2.boundingRect(c)[3] if cv2.boundingRect(c)[3] > 0 else 0 for c in valid_grains]
                    avg_ratio = sum(ratios) / len(ratios) if ratios else 0
                    ratio_confidence = 1 - abs(avg_ratio - variety[8]) / max(variety[8], 0.1) if variety[8] > 0 else 0
        
        confidence = (
            0.6 * cnn_confidence + 0.3 * hsv_confidence + 0.05 * shape_confidence + 0.05 * ratio_confidence
            if CNN_MODEL and cnn_confidence > 0.7 else
            0.5 * hsv_confidence + 0.25 * shape_confidence + 0.25 * ratio_confidence
        )
        
        final_variety = cnn_variety if CNN_MODEL and cnn_confidence > 0.7 and cnn_confidence > hsv_confidence else dominant_variety
        
        if type == "Mixed":
            display_name = f"{final_variety} (Mixed)"
        elif type == "Local/Hybrid":
            display_name = final_variety
        else:
            display_name = final_variety
        
        scanned_features["avg_length"] = sum(scanned_features["lengths"]) / len(scanned_features["lengths"]) if scanned_features["lengths"] else 0
        scanned_features["avg_width"] = sum(scanned_features["widths"]) / len(scanned_features["widths"]) if scanned_features["widths"] else 0
        scanned_features["avg_ratio"] = sum(scanned_features["ratios"]) / len(scanned_features["ratios"]) if scanned_features["ratios"] else 0
        scanned_features["avg_shape_factor"] = sum(scanned_features["shape_factors"]) / len(scanned_features["shape_factors"]) if scanned_features["shape_factors"] else 0

        warning_message = ""
        if final_variety == "Unknown (Local/Hybrid)" or final_variety == "Unknown (Insufficient Grains)":
            warning_message = "Variety not recognized. Ensure the variety is in the database or improve image quality."
        elif confidence < 0.6:
            warning_message = f"Low confidence ({confidence:.3f}). Consider verifying manually."

        logger_with_id.info(f"Detected paddy: {display_name} with confidence {confidence:.3f}, pure: {pure_paddy_percent:.3f}, mixed: {mixed_percentage:.3f}")
        return display_name, type, round(confidence, 3), round(pure_paddy_percent, 3), round(mixed_percentage, 3), scanned_features, warning_message
    except Exception as e:
        logger_with_id.error(f"Error detecting paddy variety: {str(e)}")
        return "Unknown (Error)", "Unknown", 0.5, 0.0, 1.0, {}, f"Error detecting variety: {str(e)}"

def is_rice_image(image):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        rice_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if len(rice_grains) < 10:
            return False, 0.0, "Image contains fewer than 10 detectable rice grains"
        
        confidence = min(len(rice_grains) / 100.0, 1.0)
        return True, confidence, "Paddy detected"
    except Exception as e:
        logger_with_id.error(f"Error detecting rice: {str(e)}")
        return False, 0.0, f"Error detecting rice: {str(e)}"

def detect_defects(image, contour):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        x, y, w, h = cv2.boundingRect(contour)
        grain_roi = np.array(image)[y:y+h, x:x+w]
        edges = cv2.Canny(grain_roi, 100, 200)
        if np.sum(edges) > 1000:
            return "Cracked"
        gray_roi = cv2.cvtColor(grain_roi, cv2.COLOR_RGB2GRAY)
        if np.mean(gray_roi) < 50:
            return "Fungal"
        return "Intact"
    except Exception as e:
        logger_with_id.error(f"Error detecting defects: {str(e)}")
        return "Unknown"

def identify_grain_variety(image, contour, varieties, is_husked):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        x, y, w, h = cv2.boundingRect(contour)
        hsv_grain = hsv[y:y+h, x:x+w]
        gray_grain = gray[y:y+h, x:x+w]
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
        l_w_ratio = w / h if h > 0 else 0
        intensity = np.mean(gray_grain)
        
        variety_scores = []
        for variety in varieties:
            name, v_type, hsv_lower_str, hsv_upper_str, v_shape_factor, intensity_range_str, v_length, v_width, v_l_w_ratio, v_confidence_threshold = variety
            hsv_lower = np.array(eval(hsv_lower_str))
            hsv_upper = np.array(eval(hsv_upper_str))
            intensity_range = eval(intensity_range_str)
            
            mask = cv2.inRange(hsv_grain, hsv_lower, hsv_upper)
            hsv_score = cv2.countNonZero(mask) / (w * h) if (w * h) > 0 else 0
            shape_score = 1 - abs(circularity - v_shape_factor) / max(v_shape_factor, 0.1) if v_shape_factor > 0 else 0
            ratio_score = 1 - abs(l_w_ratio - v_l_w_ratio) / max(v_l_w_ratio, 0.1) if v_l_w_ratio > 0 else 0
            intensity_score = 1 if intensity_range[0] <= intensity <= intensity_range[1] else 0
            length_score = 1 - abs(w - v_length) / max(v_length, 0.1) if v_length > 0 else 0
            width_score = 1 - abs(h - v_width) / max(v_width, 0.1) if v_width > 0 else 0
            
            if v_type == "Long Grain":
                combined_score = (
                    0.5 * hsv_score +
                    0.15 * shape_score +
                    0.15 * ratio_score +
                    0.10 * intensity_score +
                    0.10 * length_score +
                    0.10 * width_score
                )
            else:
                combined_score = (
                    0.4 * hsv_score +
                    0.2 * shape_score +
                    0.2 * ratio_score +
                    0.1 * intensity_score +
                    0.05 * length_score +
                    0.05 * width_score
                )
            
            if combined_score >= v_confidence_threshold:
                variety_scores.append((name, combined_score))
        
        if variety_scores:
            best_variety = max(variety_scores, key=lambda x: x[1])
            return best_variety[0], best_variety[1]
        return "Unknown", 0.0
    except Exception as e:
        logger_with_id.error(f"Error identifying grain variety: {str(e)}")
        return "Unknown", 0.0

def analyze_rice_quantity_quality(image, is_husked=True):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        image_hash = generate_image_hash(image)
        cache_key = f"rice_{is_husked}_{image_hash}"
        if cache_key in QUANTITY_CACHE:
            logger_with_id.info(f"Using cached quantity for rice (husked: {is_husked})")
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

        conn = sqlite3.connect('paddy_varieties.db')
        cursor = conn.cursor()
        cursor.execute("SELECT name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold FROM varieties")
        varieties = cursor.fetchall()
        conn.close()

        bad_grains = 0
        total_grains = len([c for c in contours if min_area <= cv2.contourArea(c) <= max_area])
        shape_uniformity = 0.0
        valid_grains = []
        grain_areas = []
        defect_counts = {"Cracked": 0, "Fungal": 0, "Intact": 0}
        grain_varieties = []

        annotated_img = img_cv.copy()
        for contour in contours:
            area = cv2.contourArea(contour)
            if min_area <= area <= max_area:
                valid_grains.append(contour)
                grain_areas.append(area)
                perimeter = cv2.arcLength(contour, True)
                circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
                defect = detect_defects(image, contour)
                defect_counts[defect] += 1
                variety_name, variety_confidence = identify_grain_variety(image, contour, varieties, is_husked)
                grain_varieties.append({"contour": contour, "variety": variety_name, "confidence": variety_confidence})
                
                x, y, w, h = cv2.boundingRect(contour)
                grain_roi = gray[y:y+h, x:x+w]
                mean_intensity = np.mean(grain_roi)
                if defect != "Intact" or circularity < shape_factor * 0.85 or circularity > shape_factor * 1.15:
                    bad_grains += 1
                else:
                    if mean_intensity < 70 or mean_intensity > 210:
                        bad_grains += 1
                shape_uniformity += abs(circularity - shape_factor)
                
                if variety_name != "Unknown":
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    font_scale = max(0.4, min(0.6, w / 100))
                    text_size = cv2.getTextSize(variety_name, font, font_scale, 1)[0]
                    text_x = x + w + 5
                    text_y = y + h // 2 + text_size[1] // 2
                    if text_x + text_size[0] > img_cv.shape[1]:
                        text_x = x - text_size[0] - 5
                    cv2.putText(annotated_img, variety_name, (text_x, text_y), font, font_scale, (0, 255, 0), 1, cv2.LINE_AA)
                    cv2.rectangle(annotated_img, (x, y), (x + w, y + h), (0, 255, 0), 1)

        if valid_grains:
            shape_uniformity = 1 - (shape_uniformity / len(valid_grains)) / shape_factor if len(valid_grains) > 0 else 0.0
            average_grain_area = sum(grain_areas) / len(grain_areas) if grain_areas else 0.0
            grain_density = (total_grains / total_area) * 1000000 if total_area > 0 else 0.0
        else:
            shape_uniformity = 0.0
            average_grain_area = 0.0
            grain_density = 0.0

        bad_percent = (bad_grains / total_grains) * 100 if total_grains > 0 else 0.0

        _, buffer = cv2.imencode('.jpg', annotated_img)
        annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')

        result = {
            "quantity_percent": round(quantity_percent, 2),
            "bad_percent": round(bad_percent, 2),
            "total_grains": total_grains,
            "average_grain_area": round(average_grain_area, 2),
            "grain_density": round(grain_density, 2),
            "shape_uniformity": round(shape_uniformity * 100, 2),
            "defect_counts": defect_counts,
            "annotated_image_base64": annotated_image_base64
        }

        QUANTITY_CACHE[cache_key] = result
        logger_with_id.info(f"Cached quantity for rice (husked: {is_husked}): {result}")
        return result
    except Exception as e:
        logger_with_id.error(f"Error analyzing quantity/quality: {str(e)}")
        return {
            "quantity_percent": 0.0,
            "bad_percent": 0.0,
            "total_grains": 0,
            "average_grain_area": 0.0,
            "grain_density": 0.0,
            "shape_uniformity": 0.0,
            "defect_counts": {"Cracked": 0, "Fungal": 0, "Intact": 0},
            "annotated_image_base64": ""
        }

def verify_variety(variety, image_features):
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        response = requests.post("https://mock-api.irri.org/verify", json=image_features, timeout=5)
        return response.json().get("verified_variety", variety)
    except Exception as e:
        logger_with_id.warning(f"External API verification failed: {str(e)}. Using original variety.")
        return variety

def compare_with_expected_variety(scanned_paddy_name, scanned_features, expected_variety, request_id):
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})
    try:
        cleaned_scanned_name = scanned_paddy_name.split(" (Mixed)")[0]
        is_match = cleaned_scanned_name == expected_variety
        
        reference_data = get_reference_data(expected_variety)
        feature_comparison = {}
        
        if reference_data:
            feature_comparison = {
                "length_deviation": abs(scanned_features.get("avg_length", 0) - reference_data["length_mm"]),
                "width_deviation": abs(scanned_features.get("avg_width", 0) - reference_data["width_mm"]),
                "ratio_deviation": abs(scanned_features.get("avg_ratio", 0) - reference_data["length_width_ratio"]),
                "shape_factor_deviation": abs(scanned_features.get("avg_shape_factor", 0) - reference_data["shape_factor"])
            }
            thresholds = {"length_deviation": 0.7, "width_deviation": 0.7, "ratio_deviation": 0.4, "shape_factor_deviation": 0.15}
            features_within_threshold = all(feature_comparison[k] <= thresholds[k] for k in feature_comparison)
        else:
            features_within_threshold = False
            logger_with_id.warning(f"Expected variety '{expected_variety}' not found in database")
        
        comparison_result = {
            "is_match": is_match and features_within_threshold,
            "name_match": is_match,
            "features_within_threshold": features_within_threshold,
            "feature_comparison": feature_comparison,
            "message": "Scanned variety matches expected variety" if is_match and features_within_threshold else
                       f"Scanned variety ({scanned_paddy_name}) does not match expected variety ({expected_variety})"
        }
        
        if not is_match:
            comparison_result["message"] += " due to variety name mismatch"
        if not features_within_threshold and reference_data:
            comparison_result["message"] += " due to feature deviations exceeding thresholds"
        if not reference_data:
            comparison_result["message"] = f"Expected variety '{expected_variety}' not found in database"
        
        logger_with_id.info(f"Comparison result: {comparison_result}")
        return comparison_result
    except Exception as e:
        logger_with_id.error(f"Error comparing with expected variety: {str(e)}")
        return {
            "is_match": False,
            "name_match": False,
            "features_within_threshold": False,
            "feature_comparison": {},
            "message": f"Error comparing varieties: {str(e)}"
        }

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S +07")}), 200

@app.route("/api/scan-rice", methods=["POST"])
def scan_rice():
    request_id = str(uuid.uuid4())
    logger_with_id = logging.LoggerAdapter(logger, {'request_id': request_id})

    try:
        if not request.is_json:
            logger_with_id.error("Request is not JSON")
            return jsonify({"success": False, "error": "Request must be JSON"}), 400

        data = request.get_json()
        logger_with_id.info(f"Received request data: {data}")
        if not data or "image" not in data:
            logger_with_id.error("No image provided in request")
            return jsonify({"success": False, "error": "No image provided"}), 400

        base64_string = data["image"]
        expected_variety = data.get("expected_variety", None)
        if base64_string.startswith("data:image/"):
            try:
                base64_string = base64_string.split(",")[1]
            except IndexError:
                logger_with_id.error("Invalid data URI format")
                return jsonify({"success": False, "error": "Invalid data URI format. Expected format: data:image/jpeg;base64,..."}), 400

        try:
            base64_string = base64_string + "=" * (4 - len(base64_string) % 4) if len(base64_string) % 4 != 0 else base64_string
            image_data = base64.b64decode(base64_string)
        except (base64.binascii.Error, ValueError) as e:
            logger_with_id.error(f"Invalid base64 string: {str(e)}")
            return jsonify({"success": False, "error": f"Invalid base64 string: {str(e)}"}), 400

        try:
            image = Image.open(BytesIO(image_data)).convert("RGB")
        except UnidentifiedImageError as e:
            logger_with_id.error(f"Invalid or corrupted image data: {str(e)}")
            return jsonify({"success": False, "error": "Invalid or corrupted image data. Use JPG or PNG."}), 400

        uploads_dir = "uploads"
        os.makedirs(uploads_dir, exist_ok=True)
        image_hash = generate_image_hash(image)
        upload_path = os.path.join(uploads_dir, f"{image_hash}.jpg")
        image.save(upload_path, "JPEG")
        logger_with_id.info(f"Saved uploaded image to {upload_path}")

        is_good_quality, quality_message = check_image_quality(image)
        if not is_good_quality:
            logger_with_id.error(f"Image quality check failed: {quality_message}")
            return jsonify({"success": False, "error": quality_message}), 400

        is_rice, rice_confidence, rice_message = is_rice_image(image)
        if not is_rice:
            logger_with_id.error(f"Rice detection failed: {rice_message}")
            return jsonify({"success": False, "error": rice_message}), 400

        is_husked, husk_confidence = detect_husk_status(image)
        logger_with_id.info(f"Detected husk status: {'Husked' if is_husked else 'Unhusked'} with confidence {husk_confidence}")

        paddy_name, type, confidence, pure_paddy_percent, mixed_paddy_percent, scanned_features, warning_message = detect_paddy_variety(image, is_husked)

        image_features = {
            "hsv_histogram": np.histogram(np.array(image.convert("HSV"))[..., 0], bins=180)[0].tolist(),
            "shape_factor": RICE_PARAMS["shape_factor"]
        }
        verified_paddy_name = verify_variety(paddy_name, image_features)

        reference_data = get_reference_data(verified_paddy_name.split(" (Mixed)")[0] if "(Mixed)" in verified_paddy_name else verified_paddy_name)
        quantity_quality = analyze_rice_quantity_quality(image, is_husked)

        bad_weight = 0.5
        quantity_weight = 0.3
        shape_weight = 0.2
        good_paddy_score = (
            (100 - min(quantity_quality["bad_percent"], 100)) * bad_weight +
            min(quantity_quality["quantity_percent"], 100) * quantity_weight +
            quantity_quality["shape_uniformity"] * shape_weight
        )

        last_scan_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S +07")

        result = {
            "success": True,
            "paddy_name": verified_paddy_name,
            "paddy_type": type,
            "mixed_paddy_percent": round(mixed_paddy_percent * 100, 2),
            "pure_paddy_percent": round(pure_paddy_percent * 100, 2),
            "good_paddy_score": round(good_paddy_score, 2),
            "last_scan_time": last_scan_time,
            "scanned_features": {
                "avg_length": round(scanned_features.get("avg_length", 0), 2),
                "avg_width": round(scanned_features.get("avg_width", 0), 2),
                "avg_ratio": round(scanned_features.get("avg_ratio", 0), 2),
                "avg_shape_factor": round(scanned_features.get("avg_shape_factor", 0), 2)
            },
            "reference_data": reference_data,
            "scanned_image_base64": base64_string,
            "annotated_image_base64": quantity_quality["annotated_image_base64"],
            "warning_message": warning_message
        }

        if expected_variety:
            comparison_result = compare_with_expected_variety(
                verified_paddy_name,
                scanned_features,
                expected_variety,
                request_id
            )
            result["comparison"] = comparison_result

        logger_with_id.info(f"Scan result: {result}")
        return jsonify(result), 200

    except Exception as e:
        logger_with_id.error(f"Unexpected error: {str(e)}")
        return jsonify({"success": False, "error": f"Failed to process image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
