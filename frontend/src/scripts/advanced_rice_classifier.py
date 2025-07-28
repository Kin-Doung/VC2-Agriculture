import base64
import io
import json
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import cv2

class AdvancedRiceClassifier:
    def __init__(self):
        self.rice_database = {
            'basmati': {
                'name': 'Basmati Rice',
                'description': 'Long-grain aromatic rice with distinctive nutty flavor and fluffy texture.',
                'characteristics': [
                    'Long, slender grains (6-7mm)',
                    'Length-to-width ratio: 3:1 or higher',
                    'Translucent white color',
                    'Aromatic fragrance'
                ],
                'visual_features': {
                    'aspect_ratio': (2.8, 4.0),
                    'color_range': [(240, 235, 220), (255, 255, 255)],
                    'grain_length': 'long',
                    'shape': 'elongated'
                }
            },
            'jasmine': {
                'name': 'Jasmine Rice',
                'description': 'Fragrant long-grain rice with subtle floral aroma and slightly sticky texture.',
                'characteristics': [
                    'Medium to long grains (5-6mm)',
                    'Length-to-width ratio: 2.5:1 to 3:1',
                    'Slightly translucent',
                    'Sweet, floral aroma'
                ],
                'visual_features': {
                    'aspect_ratio': (2.3, 3.2),
                    'color_range': [(245, 240, 235), (255, 250, 245)],
                    'grain_length': 'medium-long',
                    'shape': 'oval'
                }
            },
            'brown': {
                'name': 'Brown Rice',
                'description': 'Whole grain rice with bran layer intact, providing more nutrients and fiber.',
                'characteristics': [
                    'Brown/tan colored bran layer',
                    'Various grain lengths available',
                    'Nutty flavor and chewy texture',
                    'Higher fiber content'
                ],
                'visual_features': {
                    'aspect_ratio': (2.0, 3.5),
                    'color_range': [(160, 130, 100), (200, 170, 140)],
                    'grain_length': 'variable',
                    'shape': 'oval'
                }
            },
            'arborio': {
                'name': 'Arborio Rice',
                'description': 'Short-grain rice with high starch content, perfect for creamy risottos.',
                'characteristics': [
                    'Short, plump grains (4-5mm)',
                    'Length-to-width ratio: 1.5:1 to 2:1',
                    'High starch content',
                    'Creamy when cooked'
                ],
                'visual_features': {
                    'aspect_ratio': (1.4, 2.2),
                    'color_range': [(250, 245, 240), (255, 255, 255)],
                    'grain_length': 'short',
                    'shape': 'plump'
                }
            },
            'sushi': {
                'name': 'Sushi Rice (Japonica)',
                'description': 'Short-grain rice that becomes sticky when cooked, perfect for sushi.',
                'characteristics': [
                    'Short, round grains',
                    'Length-to-width ratio: 1.2:1 to 1.8:1',
                    'Sticky when cooked',
                    'Slightly sweet flavor'
                ],
                'visual_features': {
                    'aspect_ratio': (1.1, 1.9),
                    'color_range': [(248, 245, 242), (255, 255, 255)],
                    'grain_length': 'short',
                    'shape': 'round'
                }
            },
            'wild': {
                'name': 'Wild Rice',
                'description': 'Actually a grass seed with dark color and nutty, earthy flavor.',
                'characteristics': [
                    'Dark brown to black color',
                    'Long, slender grains',
                    'Nutty, earthy flavor',
                    'Chewy texture'
                ],
                'visual_features': {
                    'aspect_ratio': (3.0, 5.0),
                    'color_range': [(20, 15, 10), (80, 60, 40)],
                    'grain_length': 'long',
                    'shape': 'elongated'
                }
            }
        }
    
    def analyze_image(self, image_base64):
        try:
            # Decode and process image
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array for OpenCV processing
            img_array = np.array(image)
            
            # Preprocess image
            processed_img = self._preprocess_image(img_array)
            
            # Detect if image contains rice-like objects
            rice_detection = self._detect_rice_grains(processed_img)
            
            if not rice_detection['contains_rice']:
                return {
                    'type': 'Not Rice Detected',
                    'confidence': 0.0,
                    'description': f'No rice grains detected. Image appears to contain {rice_detection["detected_object"]}.',
                    'characteristics': [
                        f'Detected: {rice_detection["detected_object"]}',
                        'No grain-like structures found',
                        'Try an image with clearly visible rice grains',
                        'Ensure good lighting and focus'
                    ]
                }
            
            # Analyze rice characteristics
            grain_features = self._analyze_grain_features(processed_img)
            
            # Classify rice type
            classification = self._classify_rice_type(grain_features)
            
            return classification
            
        except Exception as e:
            return {
                'type': 'Analysis Error',
                'confidence': 0.0,
                'description': f'Could not analyze image: {str(e)}',
                'characteristics': ['Image processing failed', 'Try a different image', 'Ensure image is not corrupted']
            }
    
    def _preprocess_image(self, img_array):
        """Preprocess image for better grain detection"""
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Enhance contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # Reduce noise
        denoised = cv2.bilateralFilter(enhanced, 9, 75, 75)
        
        return {
            'original': img_array,
            'gray': gray,
            'enhanced': enhanced,
            'denoised': denoised
        }
    
    def _detect_rice_grains(self, processed_img):
        """Detect if image contains rice-like grain structures"""
        img = processed_img['denoised']
        
        # Edge detection to find grain boundaries
        edges = cv2.Canny(img, 50, 150)
        
        # Find contours (potential grain shapes)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Analyze contours for grain-like properties
        grain_like_contours = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if 50 < area < 5000:  # Filter by reasonable grain size
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = float(w) / h if h > 0 else 0
                
                # Check if shape is grain-like (elongated or oval)
                if 0.3 < aspect_ratio < 6.0:
                    grain_like_contours.append({
                        'contour': contour,
                        'area': area,
                        'aspect_ratio': aspect_ratio,
                        'bbox': (x, y, w, h)
                    })
        
        # Determine if image contains rice
        contains_rice = len(grain_like_contours) > 10  # Need multiple grains
        
        # Detect what else might be in the image
        detected_object = "unknown objects"
        if len(contours) > 100 and len(grain_like_contours) < 5:
            detected_object = "complex objects (possibly tools or manufactured items)"
        elif len(contours) < 10:
            detected_object = "simple shapes or solid colors"
        elif not contains_rice and len(grain_like_contours) > 5:
            detected_object = "food items (possibly pasta or other grains)"
        
        return {
            'contains_rice': contains_rice,
            'grain_contours': grain_like_contours,
            'detected_object': detected_object,
            'total_contours': len(contours)
        }
    
    def _analyze_grain_features(self, processed_img):
        """Analyze visual features of detected rice grains"""
        img_color = processed_img['original']
        img_gray = processed_img['denoised']
        
        # Re-detect grains for feature analysis
        rice_detection = self._detect_rice_grains(processed_img)
        grain_contours = rice_detection['grain_contours']
        
        if not grain_contours:
            return None
        
        # Analyze grain characteristics
        aspect_ratios = [grain['aspect_ratio'] for grain in grain_contours]
        areas = [grain['area'] for grain in grain_contours]
        
        # Color analysis
        colors = []
        for grain in grain_contours[:20]:  # Sample first 20 grains
            x, y, w, h = grain['bbox']
            grain_region = img_color[y:y+h, x:x+w]
            if grain_region.size > 0:
                avg_color = np.mean(grain_region.reshape(-1, 3), axis=0)
                colors.append(avg_color)
        
        avg_color = np.mean(colors, axis=0) if colors else [200, 200, 200]
        
        return {
            'avg_aspect_ratio': np.mean(aspect_ratios),
            'aspect_ratio_std': np.std(aspect_ratios),
            'avg_area': np.mean(areas),
            'area_std': np.std(areas),
            'avg_color': avg_color,
            'grain_count': len(grain_contours),
            'aspect_ratios': aspect_ratios
        }
    
    def _classify_rice_type(self, grain_features):
        """Classify rice type based on analyzed features"""
        if not grain_features:
            return self._get_default_classification()
        
        scores = {}
        
        for rice_type, properties in self.rice_database.items():
            score = 0
            visual_features = properties['visual_features']
            
            # Aspect ratio matching
            target_ratio_min, target_ratio_max = visual_features['aspect_ratio']
            actual_ratio = grain_features['avg_aspect_ratio']
            
            if target_ratio_min <= actual_ratio <= target_ratio_max:
                score += 0.4
            else:
                # Penalty for being outside range
                distance = min(abs(actual_ratio - target_ratio_min), abs(actual_ratio - target_ratio_max))
                score += max(0, 0.4 - distance * 0.1)
            
            # Color matching
            target_color_min, target_color_max = visual_features['color_range']
            actual_color = grain_features['avg_color']
            
            color_match = 0
            for i in range(3):  # RGB channels
                if target_color_min[i] <= actual_color[i] <= target_color_max[i]:
                    color_match += 1
            
            score += (color_match / 3) * 0.3
            
            # Grain count (more grains = more confidence)
            if grain_features['grain_count'] > 20:
                score += 0.2
            elif grain_features['grain_count'] > 10:
                score += 0.1
            
            # Consistency bonus (low standard deviation in measurements)
            if grain_features['aspect_ratio_std'] < 0.5:
                score += 0.1
            
            scores[rice_type] = min(score, 1.0)
        
        # Find best match
        best_match = max(scores.items(), key=lambda x: x[1])
        rice_type, confidence = best_match
        
        rice_info = self.rice_database[rice_type]
        
        return {
            'type': rice_info['name'],
            'confidence': confidence,
            'description': rice_info['description'],
            'characteristics': rice_info['characteristics'],
            'analysis_details': {
                'detected_grains': grain_features['grain_count'],
                'avg_aspect_ratio': round(grain_features['avg_aspect_ratio'], 2),
                'dominant_color': [int(c) for c in grain_features['avg_color']]
            }
        }
    
    def _get_default_classification(self):
        return {
            'type': 'Generic Rice',
            'confidence': 0.5,
            'description': 'Rice grains detected but specific variety unclear.',
            'characteristics': [
                'Rice grains visible',
                'Specific variety unclear',
                'Try a clearer image for better identification'
            ]
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'No image data provided'}))
        return
    
    image_base64 = sys.argv[1]
    classifier = AdvancedRiceClassifier()
    result = classifier.analyze_image(image_base64)
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
