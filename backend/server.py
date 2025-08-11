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
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

app = Flask(__name__)
# Relax CORS for development (add common dev ports)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173"
]}})

# Logging with timestamp and request ID
import logging
import uuid

# Create a filter that adds request_id to all log records if not present
class RequestIdFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, 'request_id'):
            record.request_id = 'global'
        return True

# Basic logging config
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [RequestID: %(request_id)s] - %(message)s'
)

# Attach the filter
logger = logging.getLogger()
logger.addFilter(RequestIdFilter())
# Store first scan quantities
QUANTITY_CACHE = {}

# Generic rice parameters
RICE_PARAMS = {
    "min_area": 120,
    "max_area": 500,
    "shape_factor": 0.65
}

# Initialize SQLite database for paddy varieties
def init_variety_database():
    conn = sqlite3.connect('paddy_varieties.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS varieties (
            name TEXT PRIMARY KEY,
            hsv_lower TEXT,
            hsv_upper TEXT,
            shape_factor REAL,
            intensity_range TEXT,
            length_mm REAL,
            width_mm REAL,
            length_width_ratio REAL
        )
    ''')
    # Expanded variety database with refined Phka Malis parameters
    initial_varieties = [
        ("Phka Rumduol", "[5, 60, 60]", "[25, 255, 255]", 0.72, "[85, 205]", 6.0, 2.2, 2.73),
        ("Phka Romeat", "[5, 58, 58]", "[25, 255, 255]", 0.71, "[84, 204]", 6.1, 2.2, 2.77),
        ("Phka Rumdeng", "[5, 55, 55]", "[25, 250, 255]", 0.71, "[82, 202]", 5.8, 2.3, 2.52),
        ("Phka Malis", "[5, 50, 50]", "[25, 255, 255]", 0.7, "[80, 200]", 6.5, 2.0, 3.25),
        ("Somali", "[5, 50, 50]", "[25, 255, 255]", 0.7, "[80, 200]", 6.5, 2.0, 3.25),
        ("Neang Malis", "[5, 50, 50]", "[25, 255, 255]", 0.7, "[80, 200]", 6.5, 2.0, 3.25),
        ("Basmati", "[10, 30, 60]", "[30, 200, 255]", 0.8, "[90, 210]", 7.0, 1.8, 3.89),
        ("Sen Kra'ob", "[8, 60, 70]", "[28, 255, 255]", 0.68, "[80, 200]", 5.5, 2.4, 2.29),
        ("Sen Pidao", "[10, 40, 50]", "[30, 200, 255]", 0.75, "[90, 210]", 6.2, 2.1, 2.95),
        ("Phka Knhei", "[5, 52, 52]", "[25, 255, 255]", 0.71, "[82, 202]", 6.3, 2.1, 3.0),
        ("IR64", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("IRRI-6", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("IRRI-9", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("Chul'sa", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Riang Chey", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Damnoeb Srov Krahorm", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.4, 2.29),
        ("Neang Khon", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Phka Sla", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("OM5451", "[12, 35, 60]", "[32, 190, 255]", 0.73, "[88, 208]", 5.7, 2.3, 2.48),
        ("CARDI-1", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Phka Chan Sen", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Neang Minh", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Kraham", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2),
        ("Srov Krahorm", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2),
        ("Phka Damnoeb", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Neang Ngu", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Srov Damnoeb", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Phka Srov", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Neang Chey", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Kampong Speu", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Black Sticky Rice", "[0, 20, 50]", "[20, 100, 200]", 0.6, "[60, 180]", 4.5, 2.5, 1.8),
        ("White Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Phka Sla Thom", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Srov Leu", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Khao Niew", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Phka Sticky", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Neang Khmau", "[0, 20, 50]", "[20, 100, 200]", 0.6, "[60, 180]", 4.5, 2.5, 1.8),
        ("Srov Kmao", "[0, 20, 50]", "[20, 100, 200]", 0.6, "[60, 180]", 4.5, 2.5, 1.8),
        ("Phka Romchang", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Sen Pidor", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Phka Meun", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Phka Rumdoul", "[5, 60, 60]", "[25, 255, 255]", 0.72, "[85, 205]", 6.0, 2.2, 2.73),
        ("IR504", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("IR66", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("IR68", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("IR72", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.0, 2.5, 2.0),
        ("CARDI-2", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("CARDI-3", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Chhlat", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("CARDI-Drought-1", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("CARDI-Drought-2", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("CARDI-Flood-1", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("CARDI-Flood-2", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("IRRI-Drought-1", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("IRRI-Flood-1", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Phka Resilient", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Sen Resilient", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Neang Drought", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Srov Flood", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17),
        ("Neang Yin", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Phka Kravan", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Srov Krahom", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2),
        ("Neang Khnong", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Phka Leu", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Srov Thom", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Neang Meas", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Phka Kngok", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Srov Krahom Leu", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2),
        ("Neang Veng", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 1", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 2", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 3", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 4", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 5", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 6", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 7", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 8", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 9", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 10", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29),
        ("Local Traditional 11", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 12", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 13", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 14", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 15", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 16", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 17", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 18", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 19", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Local Traditional 20", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2),
        ("Heirloom 1", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 2", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 3", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 4", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 5", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 6", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 7", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 8", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 9", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8),
        ("Heirloom 10", "[0, 20, 100]", "[20, 100, 255]", 0.6, "[70, 190]", 4.5, 2.5, 1.8)
    ]
    cursor.executemany('''
        INSERT OR REPLACE INTO varieties (name, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_varieties)
    conn.commit()
    conn.close()

# Initialize database
init_variety_database()

# Load CNN model (assumes pre-trained model exists)
try:
    CNN_MODEL = load_model("paddy_variety_classifier.h5")
except Exception as e:
    logger.error(f"Failed to load CNN model: {str(e)}")
    CNN_MODEL = None

def check_image_quality(image):
    try:
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        brightness = np.mean(img_array)
        if laplacian_var < 80:
            return False, "Image is too blurry. Please use a clearer image."
        if brightness < 100 or brightness > 200:
            return False, "Inconsistent lighting. Use diffused LED light (5500K recommended)."
        height, width = img_cv.shape[:2]
        if height < 100 or width < 100:
            return False, "Image is too small. Minimum size is 100x100 pixels."
        if height * width > 4000 * 4000:
            return False, "Image is too large. Maximum resolution is 4000x4000 pixels."
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
        # Fetch varieties from database
        conn = sqlite3.connect('paddy_varieties.db')
        cursor = conn.cursor()
        cursor.execute("SELECT name, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio FROM varieties")
        varieties = cursor.fetchall()
        conn.close()

        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        # Segment grains
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        variety_counts = {v[0]: 0 for v in varieties}
        total_grains = 0
        
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
                max_score = 0
                assigned_variety = None
                for variety in varieties:
                    name, hsv_lower_str, hsv_upper_str, v_shape_factor, intensity_range_str, v_length, v_width, v_l_w_ratio = variety
                    hsv_lower = np.array(eval(hsv_lower_str))
                    hsv_upper = np.array(eval(hsv_upper_str))
                    intensity_range = eval(intensity_range_str)
                    mask = cv2.inRange(hsv_grain, hsv_lower, hsv_upper)
                    hsv_score = cv2.countNonZero(mask) / (w * h)
                    shape_score = 1 - abs(circularity - v_shape_factor) / v_shape_factor if v_shape_factor > 0 else 0
                    ratio_score = 1 - abs(l_w_ratio - v_l_w_ratio) / v_l_w_ratio if v_l_w_ratio > 0 else 0
                    intensity_score = 1 if intensity_range[0] <= intensity <= intensity_range[1] else 0
                    combined_score = 0.5 * hsv_score + 0.2 * shape_score + 0.2 * ratio_score + 0.1 * intensity_score
                    if combined_score > max_score:
                        max_score = combined_score
                        assigned_variety = name
                if assigned_variety and max_score > 0.5:
                    variety_counts[assigned_variety] += 1
                else:
                    # Assign to 'Unknown' or ignore
                    pass
        
        if total_grains == 0:
            return "Unknown (Mixed)", "Mixed", 0.5, 0.0, 1.0
        
        dominant_variety = max(variety_counts, key=variety_counts.get)
        pure_paddy_percent = variety_counts[dominant_variety] / total_grains
        mixed_percentage = 1 - pure_paddy_percent
        
        # CNN-based classification (if model is available)
        cnn_variety = None
        cnn_confidence = 0.0
        if CNN_MODEL:
            img_resized = image.resize((224, 224))
            img_array = img_to_array(img_resized) / 255.0
            prediction = CNN_MODEL.predict(img_array[np.newaxis, ...])
            cnn_variety = varieties[np.argmax(prediction)][0]
            cnn_confidence = float(np.max(prediction))
            logger.info(f"CNN prediction: {cnn_variety} with confidence {cnn_confidence}")

        # Modified logic to always show variety name, with purity indicator
        type = "Pure" if pure_paddy_percent > 0.5 else "Mixed"  # Lowered threshold to 50%
        
        # Special case for Phka Malis - keep stricter standard
        if dominant_variety == "Phka Malis":
            if pure_paddy_percent > 0.7:
                type = "Pure"
            else:
                type = "Mixed"
        
        hsv_confidence = pure_paddy_percent
        
        # Shape and size analysis for confidence
        shape_confidence = 0.0
        ratio_confidence = 0.0
        valid_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
        if valid_grains:
            for variety in varieties:
                if variety[0] == dominant_variety:
                    shape_confidence = sum(1 for c in valid_grains if abs(4 * np.pi * cv2.contourArea(c) / (cv2.arcLength(c, True) ** 2) if cv2.arcLength(c, True) > 0 else 0 - variety[3]) < 0.15) / len(valid_grains)
                    ratios = [cv2.boundingRect(c)[2] / cv2.boundingRect(c)[3] if cv2.boundingRect(c)[3] > 0 else 0 for c in valid_grains]
                    avg_ratio = sum(ratios) / len(ratios) if ratios else 0
                    ratio_confidence = 1 - abs(avg_ratio - variety[7]) / variety[7] if variety[7] > 0 else 0
        
        # Combine CNN and rule-based confidence with higher weight for CNN
        if CNN_MODEL and cnn_variety == dominant_variety:
            confidence = (0.6 * cnn_confidence + 0.3 * hsv_confidence + 0.05 * shape_confidence + 0.05 * ratio_confidence)
        else:
            confidence = (0.5 * hsv_confidence + 0.25 * shape_confidence + 0.25 * ratio_confidence)
        final_variety = cnn_variety if CNN_MODEL and cnn_confidence > hsv_confidence and cnn_variety == dominant_variety else dominant_variety
        
        # Format the return to always show variety name
        if type == "Mixed":
            display_name = f"{final_variety} (Mixed)"
        else:
            display_name = final_variety
            
        logger.info(f"Detected paddy: {display_name} with confidence {confidence:.3f}, pure: {pure_paddy_percent:.3f}, mixed: {mixed_percentage:.3f}")
        return display_name, type, round(confidence, 3), round(pure_paddy_percent, 3), round(mixed_percentage, 3)
    except Exception as e:
        logger.error(f"Error detecting paddy variety: {str(e)}")
        return "Unknown (Mixed)", "Mixed", 0.5, 0.0, 1.0

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

def detect_defects(image, contour):
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
        logger.error(f"Error detecting defects: {str(e)}")
        return "Unknown"

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
        grain_areas = []
        defect_counts = {"Cracked": 0, "Fungal": 0, "Intact": 0}

        for contour in contours:
            area = cv2.contourArea(contour)
            if min_area <= area <= max_area:
                valid_grains.append(contour)
                grain_areas.append(area)
                perimeter = cv2.arcLength(contour, True)
                circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
                defect = detect_defects(image, contour)
                defect_counts[defect] += 1
                if defect != "Intact" or circularity < shape_factor * (0.85 if is_husked else 0.80) or circularity > shape_factor * (1.15 if is_husked else 1.20):
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
            average_grain_area = sum(grain_areas) / len(grain_areas) if grain_areas else 0.0
            grain_density = (total_grains / total_area) * 1000000 if total_area > 0 else 0.0
        else:
            shape_uniformity = 0.0
            average_grain_area = 0.0
            grain_density = 0.0

        bad_percent = (bad_grains / total_grains) * 100 if total_grains > 0 else 0.0

        result = {
            "quantity_percent": round(quantity_percent, 2),
            "bad_percent": round(bad_percent, 2),
            "total_grains": total_grains,
            "average_grain_area": round(average_grain_area, 2),
            "grain_density": round(grain_density, 2),
            "shape_uniformity": round(shape_uniformity * 100, 2),
            "defect_counts": defect_counts
        }

        QUANTITY_CACHE[cache_key] = result
        logger.info(f"Cached quantity for rice (husked: {is_husked}): {result}")
        return result
    except Exception as e:
        logger.error(f"Error analyzing quantity/quality: {str(e)}")
        return {
            "quantity_percent": 0.0,
            "bad_percent": 0.0,
            "total_grains": 0,
            "average_grain_area": 0.0,
            "grain_density": 0.0,
            "shape_uniformity": 0.0,
            "defect_counts": {"Cracked": 0, "Fungal": 0, "Intact": 0}
        }

def verify_variety(variety, image_features):
    try:
        # Mock external API call (replace with actual IRRI or similar API)
        response = requests.post("https://mock-api.irri.org/verify", json=image_features, timeout=5)
        return response.json().get("verified_variety", variety)
    except Exception as e:
        logger.error(f"Error verifying variety with external API: {str(e)}")
        return variety

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint to verify server availability."""
    return jsonify({"status": "ok"}), 200

@app.route("/api/scan-rice", methods=["POST"])
def scan_rice():
    request_id = str(uuid.uuid4())
    extra = {"request_id": request_id}
    logger = logging.LoggerAdapter(logging.getLogger(__name__), extra)

    try:
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({"success": False, "error": "Request must be JSON"}), 400

        data = request.get_json()
        logger.info(f"Received request data: {data}")
        if not data or "image" not in data:
            logger.error("No image provided in request")
            return jsonify({"success": False, "error": "No image provided"}), 400

        base64_string = data["image"]
        if base64_string.startswith("data:image/"):
            try:
                base64_string = base64_string.split(",")[1]
            except IndexError:
                logger.error("Invalid data URI format")
                return jsonify({"success": False, "error": "Invalid data URI format. Expected format: data:image/jpeg;base64,..."}), 400

        try:
            base64_string = base64_string + "=" * (4 - len(base64_string) % 4) if len(base64_string) % 4 != 0 else base64_string
            image_data = base64.b64decode(base64_string)
        except (base64.binascii.Error, ValueError) as e:
            logger.error(f"Invalid base64 string: {str(e)}")
            return jsonify({"success": False, "error": f"Invalid base64 string: {str(e)}"}), 400

        try:
            image = Image.open(BytesIO(image_data)).convert("RGB")
        except UnidentifiedImageError as e:
            logger.error(f"Invalid or corrupted image data: {str(e)}")
            return jsonify({"success": False, "error": "Invalid or corrupted image data. Use JPG or PNG."}), 400

        is_good_quality, quality_message = check_image_quality(image)
        if not is_good_quality:
            logger.error(f"Image quality check failed: {quality_message}")
            return jsonify({"success": False, "error": quality_message}), 400

        is_rice, rice_confidence, rice_message = is_rice_image(image)
        if not is_rice:
            logger.error(f"Rice detection failed: {rice_message}")
            return jsonify({"success": False, "error": rice_message}), 400

        is_husked, husk_confidence = detect_husk_status(image)
        logger.info(f"Detected husk status: {'Husked' if is_husked else 'Unhusked'} with confidence {husk_confidence}")

        paddy_name, type, confidence, pure_paddy_percent, mixed_paddy_percent = detect_paddy_variety(image, is_husked)

        image_features = {
            "hsv_histogram": np.histogram(np.array(image.convert("HSV"))[..., 0], bins=180)[0].tolist(),
            "shape_factor": RICE_PARAMS["shape_factor"]
        }
        verified_paddy_name = verify_variety(paddy_name, image_features)

        quantity_quality = analyze_rice_quantity_quality(image, is_husked)

        bad_weight = 0.5  # Higher weight for defects
        quantity_weight = 0.3
        shape_weight = 0.2
        good_paddy_score = (
            (100 - min(quantity_quality["bad_percent"], 100)) * bad_weight +
            min(quantity_quality["quantity_percent"], 100) * quantity_weight +
            quantity_quality["shape_uniformity"] * shape_weight
        )

        last_scan_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        result = {
            "success": True,
            "paddy_name": verified_paddy_name,
            "mixed_paddy_percent": round(mixed_paddy_percent * 100, 2),
            "pure_paddy_percent": round(pure_paddy_percent * 100, 2),
            "good_paddy_score": round(good_paddy_score, 2),
            "last_scan_time": last_scan_time
        }

        logger.info(f"Scan result: {result}")
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"success": False, "error": f"Failed to process image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)