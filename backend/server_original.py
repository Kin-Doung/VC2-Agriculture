# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import base64
# from io import BytesIO
# from PIL import Image, UnidentifiedImageError
# import numpy as np
# import cv2
# import logging
# from datetime import datetime
# import hashlib
# import uuid
# import requests
# import sqlite3
# import os
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import img_to_array

# # Suppress TensorFlow oneDNN warnings
# os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173"
# ]}})

# # Logging setup
# class RequestIdFilter(logging.Filter):
#     def filter(self, record):
#         if not hasattr(record, 'request_id'):
#             record.request_id = 'global'
#         return True

# os.makedirs('logs', exist_ok=True)

# logging.basicConfig(
#     level=logging.DEBUG,
#     format='%(asctime)s - %(levelname)s - [RequestID: %(request_id)s] - %(message)s',
#     handlers=[
#         logging.FileHandler('logs/server.log'),
#         logging.StreamHandler()
#     ]
# )
# logger = logging.getLogger()
# logger.addFilter(RequestIdFilter())
# QUANTITY_CACHE = {}
# RICE_PARAMS = {
#     "min_area": 120,
#     "max_area": 500,
#     "shape_factor": 0.65
# }

# def init_variety_database():
#     conn = sqlite3.connect('paddy_varieties.db')
#     cursor = conn.cursor()

#     cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='varieties'")
#     table_exists = cursor.fetchone()

#     cursor.execute('''
#         CREATE TABLE IF NOT EXISTS varieties (
#             name TEXT PRIMARY KEY,
#             type TEXT,
#             hsv_lower TEXT,
#             hsv_upper TEXT,
#             shape_factor REAL,
#             intensity_range TEXT,
#             length_mm REAL,
#             width_mm REAL,
#             length_width_ratio REAL,
#             confidence_threshold REAL,
#             reference_image_path TEXT
#         )
#     ''')

#     if table_exists:
#         cursor.execute("PRAGMA table_info(varieties)")
#         columns = [col[1] for col in cursor.fetchall()]
#         if 'type' not in columns:
#             cursor.execute('ALTER TABLE varieties ADD COLUMN type TEXT')
#             logger.info("Added type column to varieties table")
#         if 'confidence_threshold' not in columns:
#             cursor.execute('ALTER TABLE varieties ADD COLUMN confidence_threshold REAL')
#             logger.info("Added confidence_threshold column to varieties table")
#         if 'reference_image_path' not in columns:
#             cursor.execute('ALTER TABLE varieties ADD COLUMN reference_image_path TEXT')
#             logger.info("Added reference_image_path column to varieties table")

#     initial_varieties = [
#         ("Phka Rumduol", "Long Grain", "[5, 60, 60]", "[25, 255, 255]", 0.69, "[85, 205]", 7.0, 2.0, 3.5, 0.6, "static/reference_images/phka_rumduol.jpg"),
#         ("Phka Romeat", "Long Grain", "[5, 58, 58]", "[25, 255, 255]", 0.71, "[84, 204]", 6.1, 2.2, 2.77, 0.6, "static/reference_images/phka_romeat.jpg"),
#         ("Phka Rumdeng", "Long Grain", "[5, 30, 30]", "[40, 255, 255]", 0.71, "[82, 202]", 5.8, 2.3, 2.52, 0.5, "static/reference_images/phka_rumdeng.jpg"),
#         ("Phka Malis", "Long Grain", "[8, 48, 52]", "[28, 255, 255]", 0.72, "[80, 200]", 6.5, 2.0, 3.25, 0.65, "static/reference_images/phka_malis.jpg"),
#         ("Somali", "Long Grain", "[6, 50, 50]", "[26, 255, 255]", 0.69, "[80, 200]", 6.4, 2.1, 3.05, 0.6, "static/reference_images/somali.jpg"),
#         ("Neang Malis", "Long Grain", "[7, 50, 50]", "[27, 255, 255]", 0.69, "[80, 200]", 6.4, 2.1, 3.05, 0.6, "static/reference_images/neang_malis.jpg"),
#         ("Basmati", "Long Grain", "[10, 30, 60]", "[30, 200, 255]", 0.65, "[90, 210]", 7.0, 1.8, 3.89, 0.65, "static/reference_images/basmati.jpg"),
#         ("Sen Kra'ob", "Long Grain", "[20, 40, 180]", "[40, 80, 255]", 0.68, "[80, 200]", 7.2, 2.0, 3.6, 0.4, "static/reference_images/sen_kraob.jpg"),
#         ("Sen Pidao", "Long Grain", "[10, 40, 50]", "[30, 200, 255]", 0.75, "[90, 210]", 6.2, 2.1, 2.95, 0.6, "static/reference_images/sen_pidao.jpg"),
#         ("Phka Knhei", "Long Grain", "[5, 52, 52]", "[25, 255, 255]", 0.71, "[82, 202]", 6.3, 2.1, 3.0, 0.6, "static/reference_images/phka_knhei.jpg"),
#         ("IR64", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/ir64.jpg"),
#         ("IRRI-6", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/irri6.jpg"),
#         ("IRRI-9", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/irri9.jpg"),
#         ("Chul'sa", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/chulsa.jpg"),
#         ("Riang Chey", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/riang_chey.jpg"),
#         ("Damnoeb Srov Krahorm", "Short Grain", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/damnoeb_srov_krahorm.jpg"),
#         ("Neang Khon", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/neang_khon.jpg"),
#         ("Phka Sla", "Sticky Rice", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/phka_sla.jpg"),
#         ("OM5451", "Long Grain", "[12, 35, 60]", "[32, 190, 255]", 0.69, "[88, 208]", 7.1, 2.0, 3.55, 0.6, "static/reference_images/om5451.jpg"),
#         ("CARDI-1", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi1.jpg"),
#         ("Phka Chan Sen", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/phka_chan_sen.jpg"),
#         ("Neang Minh", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/neang_minh.jpg"),
#         ("Kraham", "Short Grain", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/kraham.jpg"),
#         ("Srov Krahorm", "Short Grain", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/srov_krahorm.jpg"),
#         ("Phka Damnoeb", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/phka_damnoeb.jpg"),
#         ("Neang Ngu", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/neang_ngu.jpg"),
#         ("Srov Damnoeb", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/srov_damnoeb.jpg"),
#         ("Phka Srov", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/phka_srov.jpg"),
#         ("Neang Chey", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/neang_chey.jpg"),
#         ("Kampong Speu", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/kampong_speu.jpg"),
#         ("Sticky Rice", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/sticky_rice.jpg"),
#         ("Black Sticky Rice", "Sticky Rice", "[0, 20, 50]", "[20, 100, 200]", 0.72, "[60, 180]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/black_sticky_rice.jpg"),
#         ("White Sticky Rice", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/white_sticky_rice.jpg"),
#         ("Phka Sla Thom", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/phka_sla_thom.jpg"),
#         ("Srov Leu", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/srov_leu.jpg"),
#         ("Khao Niew", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/khao_niew.jpg"),
#         ("Phka Sticky", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/phka_sticky.jpg"),
#         ("Neang Khmau", "Sticky Rice", "[0, 20, 50]", "[20, 100, 200]", 0.72, "[60, 180]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/neang_khmau.jpg"),
#         ("Srov Kmao", "Sticky Rice", "[0, 20, 50]", "[20, 100, 200]", 0.72, "[60, 180]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/srov_kmao.jpg"),
#         ("Phka Romchang", "Sticky Rice", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.6, "static/reference_images/phka_romchang.jpg"),
#         ("Sen Pidor", "Long Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/sen_pidor.jpg"),
#         ("Phka Meun", "Long Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/phka_meun.jpg"),
#         ("Phka Rumdoul", "Long Grain", "[5, 60, 60]", "[25, 255, 255]", 0.72, "[85, 205]", 6.0, 2.2, 2.73, 0.65, "static/reference_images/phka_rumdoul.jpg"),
#         ("IR504", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/ir504.jpg"),
#         ("IR66", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/ir66.jpg"),
#         ("IR68", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/ir68.jpg"),
#         ("IR72", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.89, "[80, 200]", 5.0, 2.5, 2.0, 0.6, "static/reference_images/ir72.jpg"),
#         ("CARDI-2", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi2.jpg"),
#         ("CARDI-3", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi3.jpg"),
#         ("Chhlat", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/chhlat.jpg"),
#         ("CARDI-Drought-1", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi_drought1.jpg"),
#         ("CARDI-Drought-2", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi_drought2.jpg"),
#         ("CARDI-Flood-1", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi_flood1.jpg"),
#         ("CARDI-Flood-2", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/cardi_flood2.jpg"),
#         ("IRRI-Drought-1", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/irri_drought1.jpg"),
#         ("IRRI-Flood-1", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/irri_flood1.jpg"),
#         ("Phka Resilient", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/phka_resilient.jpg"),
#         ("Sen Resilient", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/sen_resilient.jpg"),
#         ("Neang Drought", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/neang_drought.jpg"),
#         ("Srov Flood", "Medium Grain", "[5, 40, 50]", "[25, 200, 255]", 0.65, "[80, 200]", 5.2, 2.4, 2.17, 0.6, "static/reference_images/srov_flood.jpg"),
#         ("Neang Yin", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/neang_yin.jpg"),
#         ("Phka Kravan", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/phka_kravan.jpg"),
#         ("Srov Krahom", "Short Grain", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/srov_krahom.jpg"),
#         ("Neang Khnong", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/neang_khnong.jpg"),
#         ("Phka Leu", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/phka_leu.jpg"),
#         ("Srov Thom", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/srov_thom.jpg"),
#         ("Neang Meas", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/neang_meas.jpg"),
#         ("Phka Kngok", "Medium Grain", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/phka_kngok.jpg"),
#         ("Srov Krahom Leu", "Short Grain", "[10, 50, 60]", "[30, 220, 255]", 0.70, "[90, 210]", 5.5, 2.5, 2.2, 0.6, "static/reference_images/srov_krahom_leu.jpg"),
#         ("Neang Veng", "Short Grain", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.6, "static/reference_images/neang_veng.jpg"),
#         ("Local Traditional 1", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional1.jpg"),
#         ("Local Traditional 2", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional2.jpg"),
#         ("Local Traditional 3", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional3.jpg"),
#         ("Local Traditional 4", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional4.jpg"),
#         ("Local Traditional 5", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional5.jpg"),
#         ("Local Traditional 6", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional6.jpg"),
#         ("Local Traditional 7", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional7.jpg"),
#         ("Local Traditional 8", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional8.jpg"),
#         ("Local Traditional 9", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional9.jpg"),
#         ("Local Traditional 10", "Local", "[8, 45, 55]", "[28, 210, 255]", 0.67, "[85, 205]", 5.5, 2.4, 2.29, 0.55, "static/reference_images/local_traditional10.jpg"),
#         ("Local Traditional 11", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional11.jpg"),
#         ("Local Traditional 12", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional12.jpg"),
#         ("Local Traditional 13", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional13.jpg"),
#         ("Local Traditional 14", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional14.jpg"),
#         ("Local Traditional 15", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional15.jpg"),
#         ("Local Traditional 16", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional16.jpg"),
#         ("Local Traditional 17", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional17.jpg"),
#         ("Local Traditional 18", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional18.jpg"),
#         ("Local Traditional 19", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional19.jpg"),
#         ("Local Traditional 20", "Local", "[8, 50, 50]", "[28, 200, 255]", 0.68, "[80, 200]", 5.5, 2.5, 2.2, 0.55, "static/reference_images/local_traditional20.jpg"),
#         ("Heirloom 1", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom1.jpg"),
#         ("Heirloom 2", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom2.jpg"),
#         ("Heirloom 3", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom3.jpg"),
#         ("Heirloom 4", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom4.jpg"),
#         ("Heirloom 5", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom5.jpg"),
#         ("Heirloom 6", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom6.jpg"),
#         ("Heirloom 7", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom7.jpg"),
#         ("Heirloom 8", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom8.jpg"),
#         ("Heirloom 9", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom9.jpg"),
#         ("Heirloom 10", "Heirloom", "[0, 20, 100]", "[20, 100, 255]", 0.72, "[70, 190]", 4.5, 2.5, 1.8, 0.55, "static/reference_images/heirloom10.jpg"),
#         ("Jasmine", "Long Grain", "[10, 30, 60]", "[30, 200, 255]", 0.65, "[90, 210]", 7.0, 1.8, 3.89, 0.65, "static/reference_images/jasmine.jpg")
#     ]

#     cursor.executemany('''
#         INSERT OR REPLACE INTO varieties (name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold, reference_image_path)
#         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#     ''', initial_varieties)
#     conn.commit()
#     conn.close()

#     for variety in initial_varieties:
#         ref_image_path = variety[10]
#         if not os.path.exists(ref_image_path):
#             logger.warning(f"Reference image not found: {ref_image_path}")

# init_variety_database()

# try:
#     CNN_MODEL = load_model("paddy_model.h5")
#     logger.info("CNN model loaded successfully")
# except Exception as e:
#     logger.error(f"Failed to load CNN model: {str(e)}")
#     CNN_MODEL = None

# def check_image_quality(image):
#     try:
#         img_array = np.array(image)
#         img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
#         gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
#         laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
#         brightness = np.mean(img_array)
#         if laplacian_var < 80:
#             return False, "Image is too blurry. Please use a clearer image."
#         if brightness < 100 or brightness > 200:
#             return False, "Inconsistent lighting. Use diffused LED light (5500K recommended)."
#         height, width = img_cv.shape[:2]
#         if height < 100 or width < 100:
#             return False, "Image is too small. Minimum size is 100x100 pixels."
#         if height * width > 4000 * 4000:
#             return False, "Image is too large. Maximum resolution is 4000x4000 pixels."
#         return True, "Image quality is sufficient."
#     except Exception as e:
#         return False, f"Error checking image quality: {str(e)}"

# def generate_image_hash(image):
#     img_array = np.array(image.resize((64, 64)))
#     return hashlib.sha256(img_array.tobytes()).hexdigest()

# def detect_husk_status(image):
#     try:
#         img_array = np.array(image)
#         img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
#         hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
        
#         husk_lower = np.array([10, 50, 50])
#         husk_upper = np.array([30, 255, 255])
#         rice_lower = np.array([0, 0, 150])
#         rice_upper = np.array([180, 50, 255])
        
#         husk_mask = cv2.inRange(hsv, husk_lower, husk_upper)
#         rice_mask = cv2.inRange(hsv, rice_lower, rice_upper)
        
#         husk_pixels = cv2.countNonZero(husk_mask)
#         rice_pixels = cv2.countNonZero(rice_mask)
        
#         total_pixels = husk_pixels + rice_pixels
#         if total_pixels == 0:
#             return False, 0.0
        
#         husk_ratio = husk_pixels / total_pixels
#         is_husked = husk_ratio < 0.5
#         confidence = 1.0 - abs(husk_ratio - 0.5) * 2
        
#         return is_husked, round(confidence, 3)
#     except Exception as e:
#         logger.error(f"Error detecting husk status: {str(e)}")
#         return False, 0.0

# def get_reference_data(variety_name):
#     try:
#         conn = sqlite3.connect('paddy_varieties.db')
#         cursor = conn.cursor()
#         cursor.execute('''
#             SELECT name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold, reference_image_path
#             FROM varieties WHERE name = ?
#         ''', (variety_name,))
#         variety = cursor.fetchone()
#         conn.close()
#         if variety:
#             reference_image_path = variety[10]
#             reference_image_base64 = None
#             if os.path.exists(reference_image_path):
#                 with open(reference_image_path, "rb") as img_file:
#                     reference_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')
#             return {
#                 "name": variety[0],
#                 "type": variety[1],
#                 "hsv_lower": variety[2],
#                 "hsv_upper": variety[3],
#                 "shape_factor": variety[4],
#                 "intensity_range": variety[5],
#                 "length_mm": variety[6],
#                 "width_mm": variety[7],
#                 "length_width_ratio": variety[8],
#                 "confidence_threshold": variety[9],
#                 "reference_image_base64": reference_image_base64
#             }
#         return None
#     except Exception as e:
#         logger.error(f"Error fetching reference data: {str(e)}")
#         return None

# def detect_paddy_variety(image, is_husked):
#     try:
#         conn = sqlite3.connect('paddy_varieties.db')
#         cursor = conn.cursor()
#         cursor.execute("SELECT name, type, hsv_lower, hsv_upper, shape_factor, intensity_range, length_mm, width_mm, length_width_ratio, confidence_threshold FROM varieties")
#         varieties = cursor.fetchall()
#         conn.close()

#         img_array = np.array(image)
#         img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
#         hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
#         gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
#         gray = cv2.GaussianBlur(gray, (5, 5), 0)
#         thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
#         contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
#         variety_counts = {v[0]: 0 for v in varieties}
#         total_grains = 0
        
#         for contour in contours:
#             area = cv2.contourArea(contour)
#             if RICE_PARAMS["min_area"] <= area <= RICE_PARAMS["max_area"]:
#                 total_grains += 1
#                 x, y, w, h = cv2.boundingRect(contour)
#                 hsv_grain = hsv[y:y+h, x:x+w]
#                 gray_grain = gray[y:y+h, x:x+w]
#                 perimeter = cv2.arcLength(contour, True)
#                 circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
#                 l_w_ratio = w / h if h > 0 else 0
#                 intensity = np.mean(gray_grain)
#                 max_score = 0
#                 assigned_variety = None
#                 for variety in varieties:
#                     name, v_type, hsv_lower_str, hsv_upper_str, v_shape_factor, intensity_range_str, v_length, v_width, v_l_w_ratio, v_confidence_threshold = variety
#                     hsv_lower = np.array(eval(hsv_lower_str))
#                     hsv_upper = np.array(eval(hsv_upper_str))
#                     intensity_range = eval(intensity_range_str)
#                     mask = cv2.inRange(hsv_grain, hsv_lower, hsv_upper)
#                     hsv_score = cv2.countNonZero(mask) / (w * h) if (w * h) > 0 else 0
#                     shape_score = 1 - abs(circularity - v_shape_factor) / v_shape_factor if v_shape_factor > 0 else 0
#                     ratio_score = 1 - abs(l_w_ratio - v_l_w_ratio) / v_l_w_ratio if v_l_w_ratio > 0 else 0
#                     intensity_score = 1 if intensity_range[0] <= intensity <= intensity_range[1] else 0
#                     if v_type == "Long Grain":
#                         combined_score = 0.7 * hsv_score + 0.1 * shape_score + 0.1 * ratio_score + 0.1 * intensity_score
#                     else:
#                         combined_score = 0.5 * hsv_score + 0.2 * shape_score + 0.2 * ratio_score + 0.1 * intensity_score
#                     logger.debug(f"Variety: {name}, Combined Score: {combined_score}, Threshold: {v_confidence_threshold}")
#                     if combined_score > max_score and combined_score >= v_confidence_threshold:
#                         max_score = combined_score
#                         assigned_variety = name
#                 if assigned_variety and max_score >= 0.5:
#                     variety_counts[assigned_variety] += 1
#                 else:
#                     variety_counts["Unknown"] = variety_counts.get("Unknown", 0) + 1
        
#         if total_grains < 10:
#             logger.info("Insufficient grains detected")
#             return "Unknown"
        
#         dominant_variety = max(variety_counts, key=variety_counts.get)
#         pure_paddy_percent = variety_counts[dominant_variety] / total_grains if total_grains > 0 else 0.0
        
#         cnn_variety = None
#         cnn_confidence = 0.0
#         if CNN_MODEL:
#             img_resized = image.resize((224, 224))
#             img_array = img_to_array(img_resized) / 255.0
#             prediction = CNN_MODEL.predict(img_array[np.newaxis, ...])
#             cnn_index = np.argmax(prediction)
#             cnn_confidence = float(np.max(prediction))
#             cnn_variety = next((v[0] for v in varieties if v[0] == varieties[cnn_index][0]), "Unknown")
#             logger.info(f"CNN prediction: {cnn_variety} with confidence {cnn_confidence}")

#         final_variety = cnn_variety if CNN_MODEL and cnn_confidence > 0.7 and cnn_confidence > pure_paddy_percent else dominant_variety
        
#         if final_variety == "Unknown" or pure_paddy_percent < 0.6:
#             logger.info(f"No match found, returning: Unknown")
#             return "Unknown"
        
#         logger.info(f"Matched paddy variety: {final_variety}")
#         return final_variety
#     except Exception as e:
#         logger.error(f"Error detecting paddy variety: {str(e)}")
#         return "Unknown"

# def is_rice_image(image):
#     try:
#         img_array = np.array(image)
#         img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
#         gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
#         gray = cv2.GaussianBlur(gray, (5, 5), 0)
#         thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
        
#         contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
#         rice_grains = [c for c in contours if RICE_PARAMS["min_area"] <= cv2.contourArea(c) <= RICE_PARAMS["max_area"]]
#         if len(rice_grains) < 10:
#             return False, 0.0, "Image does not appear to contain sufficient rice grains"
        
#         confidence = min(len(rice_grains) / 100.0, 1.0)
#         return True, confidence, "Paddy detected"
#     except Exception as e:
#         logger.error(f"Error detecting rice: {str(e)}")
#         return False, 0.0, f"Error detecting rice: {str(e)}"

# def detect_defects(image, contour):
#     try:
#         x, y, w, h = cv2.boundingRect(contour)
#         grain_roi = np.array(image)[y:y+h, x:x+w]
#         edges = cv2.Canny(grain_roi, 100, 200)
#         if np.sum(edges) > 1000:
#             return "Cracked"
#         gray_roi = cv2.cvtColor(grain_roi, cv2.COLOR_RGB2GRAY)
#         if np.mean(gray_roi) < 50:
#             return "Fungal"
#         return "Intact"
#     except Exception as e:
#         logger.error(f"Error detecting defects: {str(e)}")
#         return "Unknown"

# def analyze_rice_quantity_quality(image, is_husked=True):
#     try:
#         image_hash = generate_image_hash(image)
#         cache_key = f"rice_{is_husked}_{image_hash}"
#         if cache_key in QUANTITY_CACHE:
#             logger.info(f"Using cached quantity for rice (husked: {is_husked})")
#             return QUANTITY_CACHE[cache_key]

#         img_array = np.array(image)
#         img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
#         gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

#         img_cv = cv2.convertScaleAbs(img_cv, alpha=1.3, beta=10)
#         gray = cv2.GaussianBlur(gray, (5, 5), 0)
        
#         thresh = cv2.adaptiveThreshold(
#             gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 
#             15 if is_husked else 21, 3 if is_husked else 5
#         )

#         kernel = np.ones((3, 3), np.uint8)
#         thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2 if is_husked else 3)

#         contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#         total_area = img_cv.shape[0] * img_cv.shape[1]

#         min_area = RICE_PARAMS["min_area"] * (1.2 if not is_husked else 1.0)
#         max_area = RICE_PARAMS["max_area"] * (1.2 if not is_husked else 1.0)
#         shape_factor = RICE_PARAMS["shape_factor"]

#         rice_area = sum(cv2.contourArea(c) for c in contours if min_area <= cv2.contourArea(c) <= max_area)
#         quantity_percent = (rice_area / total_area) * 100 if total_area > 0 else 0.0

#         bad_grains = 0
#         total_grains = len([c for c in contours if min_area <= cv2.contourArea(c) <= max_area])
#         shape_uniformity = 0.0
#         valid_grains = []
#         grain_areas = []
#         defect_counts = {"Cracked": 0, "Fungal": 0, "Intact": 0}

#         for contour in contours:
#             area = cv2.contourArea(contour)
#             if min_area <= area <= max_area:
#                 valid_grains.append(contour)
#                 grain_areas.append(area)
#                 perimeter = cv2.arcLength(contour, True)
#                 circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
#                 defect = detect_defects(image, contour)
#                 defect_counts[defect] += 1
#                 if defect != "Intact" or circularity < shape_factor * (0.85 if is_husked else 0.80) or circularity > shape_factor * (1.15 if is_husked else 1.20):
#                     bad_grains += 1
#                 else:
#                     x, y, w, h = cv2.boundingRect(contour)
#                     grain_roi = gray[y:y+h, x:x+w]
#                     mean_intensity = np.mean(grain_roi)
#                     if mean_intensity < (70 if is_husked else 60) or mean_intensity > (210 if is_husked else 200):
#                         bad_grains += 1
#                 shape_uniformity += abs(circularity - shape_factor)

#         if valid_grains:
#             shape_uniformity = 1 - (shape_uniformity / len(valid_grains)) / shape_factor if len(valid_grains) > 0 else 0.0
#             average_grain_area = sum(grain_areas) / len(grain_areas) if grain_areas else 0.0
#             grain_density = (total_grains / total_area) * 1000000 if total_area > 0 else 0.0
#         else:
#             shape_uniformity = 0.0
#             average_grain_area = 0.0
#             grain_density = 0.0

#         bad_percent = (bad_grains / total_grains) * 100 if total_grains > 0 else 0.0

#         result = {
#             "quantity_percent": round(quantity_percent, 2),
#             "bad_percent": round(bad_percent, 2),
#             "total_grains": total_grains,
#             "average_grain_area": round(average_grain_area, 2),
#             "grain_density": round(grain_density, 2),
#             "shape_uniformity": round(shape_uniformity * 100, 2),
#             "defect_counts": defect_counts
#         }

#         QUANTITY_CACHE[cache_key] = result
#         logger.info(f"Cached quantity for rice (husked: {is_husked}): {result}")
#         return result
#     except Exception as e:
#         logger.error(f"Error analyzing quantity/quality: {str(e)}")
#         return {
#             "quantity_percent": 0.0,
#             "bad_percent": 0.0,
#             "total_grains": 0,
#             "average_grain_area": 0.0,
#             "grain_density": 0.0,
#             "shape_uniformity": 0.0,
#             "defect_counts": {"Cracked": 0, "Fungal": 0, "Intact": 0}
#         }

# def verify_variety(variety, image_features):
#     try:
#         response = requests.post("https://mock-api.irri.org/verify", json=image_features, timeout=5)
#         return response.json().get("verified_variety", variety)
#     except Exception as e:
#         logger.error(f"Error verifying variety with external API: {str(e)}")
#         return variety

# @app.route("/api/health", methods=["GET"])
# def health():
#     return jsonify({"status": "ok"}), 200

# @app.route("/api/scan-rice", methods=["POST"])
# def scan_rice():
#     request_id = str(uuid.uuid4())
#     extra = {"request_id": request_id}
#     logger = logging.LoggerAdapter(logging.getLogger(__name__), extra)

#     try:
#         if not request.is_json:
#             logger.error("Request is not JSON")
#             return jsonify({"success": False, "error": "Request must be JSON"}), 400

#         data = request.get_json()
#         logger.info(f"Received request data: {data}")
#         if not data or "image" not in data:
#             logger.error("No image provided in request")
#             return jsonify({"success": False, "error": "No image provided"}), 400

#         base64_string = data["image"]
#         if base64_string.startswith("data:image/"):
#             try:
#                 base64_string = base64_string.split(",")[1]
#             except IndexError:
#                 logger.error("Invalid data URI format")
#                 return jsonify({"success": False, "error": "Invalid data URI format. Expected format: data:image/jpeg;base64,..."}), 400

#         try:
#             base64_string = base64_string + "=" * (4 - len(base64_string) % 4) if len(base64_string) % 4 != 0 else base64_string
#             image_data = base64.b64decode(base64_string)
#         except (base64.binascii.Error, ValueError) as e:
#             logger.error(f"Invalid base64 string: {str(e)}")
#             return jsonify({"success": False, "error": f"Invalid base64 string: {str(e)}"}), 400

#         try:
#             image = Image.open(BytesIO(image_data)).convert("RGB")
#         except UnidentifiedImageError as e:
#             logger.error(f"Invalid or corrupted image data: {str(e)}")
#             return jsonify({"success": False, "error": "Invalid or corrupted image data. Use JPG or PNG."}), 400

#         uploads_dir = "uploads"
#         os.makedirs(uploads_dir, exist_ok=True)
#         image_hash = generate_image_hash(image)
#         upload_path = os.path.join(uploads_dir, f"{image_hash}.jpg")
#         image.save(upload_path, "JPEG")
#         logger.info(f"Saved uploaded image to {upload_path}")

#         is_good_quality, quality_message = check_image_quality(image)
#         if not is_good_quality:
#             logger.error(f"Image quality check failed: {quality_message}")
#             return jsonify({"success": False, "error": quality_message}), 400

#         is_rice, rice_confidence, rice_message = is_rice_image(image)
#         if not is_rice:
#             logger.error(f"Rice detection failed: {rice_message}")
#             return jsonify({"success": False, "error": rice_message}), 400

#         is_husked, husk_confidence = detect_husk_status(image)
#         logger.info(f"Detected husk status: {'Husked' if is_husked else 'Unhusked'} with confidence {husk_confidence}")

#         paddy_name = detect_paddy_variety(image, is_husked)
        
#         image_features = {
#             "hsv_histogram": np.histogram(np.array(image.convert("HSV"))[..., 0], bins=180)[0].tolist(),
#             "shape_factor": RICE_PARAMS["shape_factor"]
#         }
#         verified_paddy_name = verify_variety(paddy_name, image_features)

#         result = {
#             "success": True,
#             "paddy_name": verified_paddy_name
#         }

#         logger.info(f"Scan result: {result}")
#         return jsonify(result), 200

#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         return jsonify({"success": False, "error": f"Failed to process image: {str(e)}"}), 500

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)