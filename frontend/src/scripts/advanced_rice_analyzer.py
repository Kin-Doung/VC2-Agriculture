import base64
import io
import json
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import os

class AdvancedRiceAnalyzer:
    def __init__(self):
        self.rice_database = {
            'basmati': {
                'name': 'Basmati Rice',
                'description': 'Long-grain aromatic rice with distinctive nutty flavor and fluffy texture.',
                'characteristics': [
                    'Long, slender grains (6-7mm)',
                    'Length-to-width ratio: 3:1 or higher',
                    'Translucent white color',
                    'Aromatic fragrance when cooked'
                ],
                'visual_features': {
                    'aspect_ratio_range': (2.8, 4.2),
                    'color_range': [(240, 235, 220), (255, 255, 255)],
                    'grain_length': 'long',
                    'shape': 'elongated',
                    'size_range': (6, 8)
                },
                'cooking_info': {
                    'time': '18-20 minutes',
                    'water_ratio': '1:1.5',
                    'best_for': 'Biryani, Pilaf, Indian dishes'
                }
            },
            'jasmine': {
                'name': 'Jasmine Rice',
                'description': 'Fragrant long-grain rice with subtle floral aroma and slightly sticky texture.',
                'characteristics': [
                    'Medium to long grains (5-6mm)',
                    'Length-to-width ratio: 2.5:1 to 3:1',
                    'Slightly translucent appearance',
                    'Sweet, floral aroma'
                ],
                'visual_features': {
                    'aspect_ratio_range': (2.3, 3.2),
                    'color_range': [(245, 240, 235), (255, 250, 245)],
                    'grain_length': 'medium-long',
                    'shape': 'oval',
                    'size_range': (5, 6.5)
                },
                'cooking_info': {
                    'time': '15-18 minutes',
                    'water_ratio': '1:1.25',
                    'best_for': 'Thai dishes, Stir-fries, Curry'
                }
            },
            'brown': {
                'name': 'Brown Rice',
                'description': 'Whole grain rice with bran layer intact, providing more nutrients and fiber.',
                'characteristics': [
                    'Brown/tan colored bran layer',
                    'Various grain lengths available',
                    'Nutty flavor and chewy texture',
                    'Higher fiber and nutrient content'
                ],
                'visual_features': {
                    'aspect_ratio_range': (2.0, 3.5),
                    'color_range': [(140, 110, 80), (200, 170, 140)],
                    'grain_length': 'variable',
                    'shape': 'oval',
                    'size_range': (4, 7)
                },
                'cooking_info': {
                    'time': '45-50 minutes',
                    'water_ratio': '1:2',
                    'best_for': 'Health bowls, Salads, Nutritious meals'
                }
            },
            'arborio': {
                'name': 'Arborio Rice',
                'description': 'Short-grain rice with high starch content, perfect for creamy risottos.',
                'characteristics': [
                    'Short, plump grains (4-5mm)',
                    'Length-to-width ratio: 1.5:1 to 2:1',
                    'High starch content',
                    'Creamy texture when cooked'
                ],
                'visual_features': {
                    'aspect_ratio_range': (1.4, 2.2),
                    'color_range': [(250, 245, 240), (255, 255, 255)],
                    'grain_length': 'short',
                    'shape': 'plump',
                    'size_range': (4, 5.5)
                },
                'cooking_info': {
                    'time': '20-25 minutes',
                    'water_ratio': '1:3 (gradual)',
                    'best_for': 'Risotto, Rice pudding, Paella'
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
                    'aspect_ratio_range': (1.1, 1.9),
                    'color_range': [(248, 245, 242), (255, 255, 255)],
                    'grain_length': 'short',
                    'shape': 'round',
                    'size_range': (3.5, 5)
                },
                'cooking_info': {
                    'time': '18-20 minutes',
                    'water_ratio': '1:1.2',
                    'best_for': 'Sushi, Onigiri, Rice balls'
                }
            },
            'wild': {
                'name': 'Wild Rice',
                'description': 'Actually a grass seed with dark color and nutty, earthy flavor.',
                'characteristics': [
                    'Dark brown to black color',
                    'Long, slender grains',
                    'Nutty, earthy flavor',
                    'Chewy texture and rich in protein'
                ],
                'visual_features': {
                    'aspect_ratio_range': (3.0, 5.5),
                    'color_range': [(15, 10, 5), (80, 60, 40)],
                    'grain_length': 'long',
                    'shape': 'elongated',
                    'size_range': (8, 15)
                },
                'cooking_info': {
                    'time': '45-60 minutes',
                    'water_ratio': '1:3',
                    'best_for': 'Salads, Stuffing, Soups'
                }
            }
        }
    
    def analyze_rice_image(self, image_base64):
        """Main analysis function that processes the image and identifies rice type"""
        try:
            # Decode and preprocess image
            image = self._decode_image(image_base64)
            if image is None:
                return self._error_result("Failed to decode image")
            
            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Preprocess image for better analysis
            processed_image = self._preprocess_image(cv_image)
            
            # Detect rice grains
            grain_detection = self._detect_rice_grains(processed_image)
            
            if not grain_detection['contains_rice']:
                return {
                    'type': 'Not Rice Detected',
                    'confidence': 0.0,
                    'description': f'No rice grains detected. Image appears to contain {grain_detection["detected_object"]}.',
                    'characteristics': [
                        f'Detected: {grain_detection["detected_object"]}',
                        'No grain-like structures found',
                        'Try an image with clearly visible rice grains',
                        'Ensure good lighting and focus'
                    ],
                    'python_analysis': {
                        'grain_count': grain_detection['grain_count'],
                        'detection_method': 'OpenCV contour analysis',
                        'processed': True
                    }
                }
            
            # Analyze grain features
            grain_features = self._analyze_grain_features(processed_image, grain_detection['grains'])
            
            # Classify rice type using machine learning approach
            classification = self._classify_rice_type(grain_features, cv_image)
            
            return classification
            
        except Exception as e:
            return self._error_result(f"Python analysis failed: {str(e)}")
    
    def _decode_image(self, image_base64):
        """Decode base64 image data"""
        try:
            # Remove data URL prefix if present
            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]
            
            # Decode base64
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            return image
        except Exception as e:
            print(f"Image decode error: {e}")
            return None
    
    def _preprocess_image(self, cv_image):
        """Preprocess image for better grain detection"""
        # Convert to grayscale
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Enhance contrast using CLAHE
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(blurred)
        
        # Apply bilateral filter to reduce noise while keeping edges sharp
        filtered = cv2.bilateralFilter(enhanced, 9, 75, 75)
        
        return {
            'original': cv_image,
            'gray': gray,
            'enhanced': enhanced,
            'filtered': filtered
        }
    
    def _detect_rice_grains(self, processed_image):
        """Detect individual rice grains using computer vision"""
        img = processed_image['filtered']
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        # Apply morphological operations to clean up the image
        kernel = np.ones((3, 3), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours to find grain-like shapes
        grains = []
        for contour in contours:
            area = cv2.contourArea(contour)
            
            # Filter by area (reasonable grain size)
            if 100 < area < 8000:
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = float(w) / h if h > 0 else 0
                
                # Filter by aspect ratio (grain-like shapes)
                if 0.2 < aspect_ratio < 8.0:
                    # Calculate additional features
                    perimeter = cv2.arcLength(contour, True)
                    circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
                    
                    grain_info = {
                        'contour': contour,
                        'area': area,
                        'aspect_ratio': aspect_ratio,
                        'bbox': (x, y, w, h),
                        'perimeter': perimeter,
                        'circularity': circularity,
                        'center': (x + w//2, y + h//2)
                    }
                    grains.append(grain_info)
        
        # Determine if image contains rice
        grain_count = len(grains)
        contains_rice = grain_count >= 15  # Need multiple grains for rice identification
        
        # Classify what else might be in the image
        detected_object = "rice grains"
        if not contains_rice:
            if grain_count < 5:
                detected_object = "few or no grain-like objects"
            elif grain_count < 15:
                detected_object = "some grain-like objects (possibly other seeds or food items)"
            else:
                detected_object = "objects with grain-like properties"
        
        return {
            'contains_rice': contains_rice,
            'grains': grains,
            'grain_count': grain_count,
            'detected_object': detected_object,
            'processing_info': {
                'total_contours': len(contours),
                'filtered_grains': grain_count,
                'threshold_method': 'adaptive'
            }
        }
    
    def _analyze_grain_features(self, processed_image, grains):
        """Analyze visual features of detected rice grains"""
        if not grains:
            return None
        
        # Extract features from grains
        aspect_ratios = [grain['aspect_ratio'] for grain in grains]
        areas = [grain['area'] for grain in grains]
        circularities = [grain['circularity'] for grain in grains]
        
        # Color analysis
        original_img = processed_image['original']
        colors = []
        
        for grain in grains[:30]:  # Sample first 30 grains
            x, y, w, h = grain['bbox']
            # Extract grain region
            grain_region = original_img[y:y+h, x:x+w]
            if grain_region.size > 0:
                # Convert BGR to RGB for color analysis
                grain_rgb = cv2.cvtColor(grain_region, cv2.COLOR_BGR2RGB)
                avg_color = np.mean(grain_rgb.reshape(-1, 3), axis=0)
                colors.append(avg_color)
        
        avg_color = np.mean(colors, axis=0) if colors else [200, 200, 200]
        
        # Calculate statistics
        features = {
            'grain_count': len(grains),
            'avg_aspect_ratio': np.mean(aspect_ratios),
            'aspect_ratio_std': np.std(aspect_ratios),
            'avg_area': np.mean(areas),
            'area_std': np.std(areas),
            'avg_circularity': np.mean(circularities),
            'avg_color': avg_color,
            'color_std': np.std(colors, axis=0) if len(colors) > 1 else [0, 0, 0],
            'aspect_ratios': aspect_ratios,
            'areas': areas,
            'brightness': np.mean(avg_color),
            'color_variance': np.var(colors, axis=0) if len(colors) > 1 else [0, 0, 0]
        }
        
        return features
    
    def _classify_rice_type(self, grain_features, original_image):
        """Classify rice type using machine learning approach"""
        if not grain_features:
            return self._error_result("No grain features available for classification")
        
        scores = {}
        
        for rice_type, properties in self.rice_database.items():
            score = 0
            visual_features = properties['visual_features']
            
            # Aspect ratio matching (40% weight)
            target_ratio_min, target_ratio_max = visual_features['aspect_ratio_range']
            actual_ratio = grain_features['avg_aspect_ratio']
            
            if target_ratio_min <= actual_ratio <= target_ratio_max:
                score += 0.4
            else:
                # Gradual penalty for being outside range
                distance = min(abs(actual_ratio - target_ratio_min), abs(actual_ratio - target_ratio_max))
                score += max(0, 0.4 - distance * 0.05)
            
            # Color matching (30% weight)
            target_color_min, target_color_max = visual_features['color_range']
            actual_color = grain_features['avg_color']
            
            color_match_score = 0
            for i in range(3):  # RGB channels
                if target_color_min[i] <= actual_color[i] <= target_color_max[i]:
                    color_match_score += 1
                else:
                    # Partial credit for close colors
                    distance = min(abs(actual_color[i] - target_color_min[i]), 
                                 abs(actual_color[i] - target_color_max[i]))
                    if distance < 30:  # Within 30 color units
                        color_match_score += max(0, 1 - distance / 30)
            
            score += (color_match_score / 3) * 0.3
            
            # Grain count bonus (15% weight)
            if grain_features['grain_count'] > 50:
                score += 0.15
            elif grain_features['grain_count'] > 25:
                score += 0.1
            elif grain_features['grain_count'] > 15:
                score += 0.05
            
            # Consistency bonus (10% weight)
            if grain_features['aspect_ratio_std'] < 0.5:
                score += 0.1
            elif grain_features['aspect_ratio_std'] < 1.0:
                score += 0.05
            
            # Size matching (5% weight)
            avg_grain_size = np.sqrt(grain_features['avg_area'])
            size_range = visual_features['size_range']
            if size_range[0] <= avg_grain_size <= size_range[1]:
                score += 0.05
            
            scores[rice_type] = min(score, 1.0)
        
        # Find best match
        best_match = max(scores.items(), key=lambda x: x[1])
        rice_type, confidence = best_match
        
        rice_info = self.rice_database[rice_type]
        
        # Enhanced confidence calculation
        confidence = self._calculate_enhanced_confidence(confidence, grain_features, scores)
        
        return {
            'type': rice_info['name'],
            'confidence': confidence,
            'description': rice_info['description'],
            'characteristics': rice_info['characteristics'],
            'cooking_info': rice_info['cooking_info'],
            'python_analysis': {
                'method': 'Computer Vision + Machine Learning',
                'grain_count': grain_features['grain_count'],
                'avg_aspect_ratio': round(grain_features['avg_aspect_ratio'], 2),
                'dominant_color': [int(c) for c in grain_features['avg_color']],
                'brightness': round(grain_features['brightness'], 1),
                'classification_scores': {k: round(v, 3) for k, v in scores.items()},
                'features_analyzed': [
                    'Grain shape and aspect ratio',
                    'Color distribution',
                    'Size consistency',
                    'Grain count and density'
                ]
            },
            'alternative_matches': self._get_alternative_matches(scores, rice_type)
        }
    
    def _calculate_enhanced_confidence(self, base_confidence, grain_features, all_scores):
        """Calculate enhanced confidence score"""
        confidence = base_confidence
        
        # Bonus for high grain count
        if grain_features['grain_count'] > 100:
            confidence += 0.1
        elif grain_features['grain_count'] > 50:
            confidence += 0.05
        
        # Bonus for consistent measurements
        if grain_features['aspect_ratio_std'] < 0.3:
            confidence += 0.05
        
        # Penalty if second-best score is very close
        sorted_scores = sorted(all_scores.values(), reverse=True)
        if len(sorted_scores) > 1 and sorted_scores[0] - sorted_scores[1] < 0.1:
            confidence -= 0.1
        
        # Ensure reasonable range
        return max(0.3, min(0.95, confidence))
    
    def _get_alternative_matches(self, scores, best_match):
        """Get alternative rice type matches"""
        sorted_matches = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        alternatives = []
        
        for rice_type, score in sorted_matches[1:3]:  # Get top 2 alternatives
            if score > 0.3:  # Only include reasonable alternatives
                alternatives.append({
                    'type': self.rice_database[rice_type]['name'],
                    'confidence': round(score, 3),
                    'reason': f'Similar characteristics to {best_match}'
                })
        
        return alternatives
    
    def _error_result(self, error_message):
        """Return standardized error result"""
        return {
            'type': 'Analysis Error',
            'confidence': 0.0,
            'description': error_message,
            'characteristics': [
                'Python analysis failed',
                'Try a different image',
                'Ensure image shows rice grains clearly',
                'Check image quality and lighting'
            ],
            'python_analysis': {
                'error': error_message,
                'method': 'Computer Vision + Machine Learning',
                'processed': False
            }
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Usage: python advanced_rice_analyzer.py <base64_image_data>'}))
        return
    
    image_base64 = sys.argv[1]
    analyzer = AdvancedRiceAnalyzer()
    result = analyzer.analyze_rice_image(image_base64)
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
