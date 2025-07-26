import base64
import io
import json
import sys
from PIL import Image
import numpy as np
from scipy.stats import wasserstein_distance

class RiceClassifier:
    def __init__(self):
        self.rice_database = {
            'phka_romduol': {
                'name': 'Phka Romduol',
                'description': 'A premium long-grain jasmine rice known for its natural aroma, soft texture, and high quality, often exported under the Malys Angkor certification.',
                'characteristics': [
                    'Long, slender grains (>7mm)',
                    'Strong jasmine aroma',
                    'Soft and fluffy when cooked',
                    'World’s Best Rice award winner (2012-2014, 2018, 2022)'
                ],
                'color_range': [(245, 240, 235), (255, 255, 250)],  # Translucent, similar to jasmine
                'grain_length': 'long',
                'reference_image': '../../images/phka_romduol.jpg'  # Unique file path
            },
            'phka_romeat': {
                'name': 'Phka Romeat',
                'description': 'A fragrant long-grain jasmine rice with high similarity to Thai Hom Mali, known for its soft texture and natural aroma.',
                'characteristics': [
                    'Long grains (>7mm)',
                    'Premium jasmine fragrance',
                    'Soft and fluffy when cooked',
                    'Part of Malys Angkor certification'
                ],
                'color_range': [(245, 240, 235), (255, 255, 250)],  # Translucent, jasmine-like
                'grain_length': 'long',
                'reference_image': '../../images/phka_romeat.jpg'  # Unique file path
            },
            'neang_minh': {
                'name': 'Neang Minh',
                'description': 'A medium-grain white rice grown in the rainy season, popular for its savory taste and soft texture.',
                'characteristics': [
                    'Medium grains (5-6mm)',
                    'Non-fragrant, savory flavor',
                    'Soft when cooked',
                    'Common in Cambodian restaurants'
                ],
                'color_range': [(240, 235, 230), (255, 250, 245)],  # Slightly off-white, typical for white rice
                'grain_length': 'medium',
                'reference_image': '../../images/neang_minh.jpg'  # Unique file path
            },
            'phka_rumdeng': {
                'name': 'Phka Rumdeng',
                'description': 'A long-grain jasmine rice with a mild aroma and soft texture, part of the Malys Angkor certification.',
                'characteristics': [
                    'Long grains (>7mm)',
                    'Mild jasmine aroma',
                    'Soft and slightly sticky when cooked',
                    'Harvested in November/December'
                ],
                'color_range': [(245, 240, 235), (255, 255, 250)],  # Translucent, jasmine-like
                'grain_length': 'long',
                'reference_image': '../../images/phka_rumdeng.jpg'  # Unique file path
            },
            'sen_kra_ob': {
                'name': 'Sen Kra Ob',
                'description': 'A fragrant long-grain rice grown in the dry season, known for its premium quality and mild jasmine-like flavor.',
                'characteristics': [
                    'Long grains (>7mm)',
                    'Mild fragrance',
                    'Soft and chewy when cooked',
                    'Popular for Cambodian fried rice'
                ],
                'color_range': [(245, 240, 235), (255, 255, 250)],  # Translucent, similar to jasmine
                'grain_length': 'long',
                'reference_image': '../../images/sen_kra_ob.jpg'  # Unique file path
            }
        }
    
    def analyze_image(self, image_base64):
        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            img_array = np.array(image)
            
            # Analyze image
            color_analysis = self._analyze_color(img_array)
            histogram = self._compute_histogram(img_array)
            classification = self._classify_rice(color_analysis, histogram)
            
            return classification
            
        except Exception as e:
            return {
                'type': 'Unknown Rice',
                'confidence': 0.0,
                'description': f'Could not analyze image: {str(e)}',
                'characteristics': ['Analysis failed']
            }
    
    def _analyze_color(self, img_array):
        avg_color = np.mean(img_array, axis=(0, 1))
        brightness = np.mean(avg_color)
        
        return {
            'average_rgb': avg_color,
            'brightness': brightness
        }
    
    def _compute_histogram(self, img_array):
        # Compute histogram for RGB channels
        hist_r, _ = np.histogram(img_array[:, :, 0], bins=256, range=(0, 256), density=True)
        hist_g, _ = np.histogram(img_array[:, :, 1], bins=256, range=(0, 256), density=True)
        hist_b, _ = np.histogram(img_array[:, :, 2], bins=256, range=(0, 256), density=True)
        return np.concatenate([hist_r, hist_g, hist_b])
    
    def _classify_rice(self, color_analysis, input_histogram):
        scores = {}
        
        for rice_type, properties in self.rice_database.items():
            score = 0
            avg_color = color_analysis['average_rgb']
            color_range = properties['color_range']
            
            # Color matching
            if (color_range[0][0] <= avg_color[0] <= color_range[1][0] and
                color_range[0][1] <= avg_color[1] <= color_range[1][1] and
                color_range[0][2] <= avg_color[2] <= color_range[1][2]):
                score += 0.4  # Weight for color matching
            
            # Brightness analysis
            brightness = color_analysis['brightness']
            if rice_type == 'neang_minh' and brightness < 200:
                score += 0.2
            elif rice_type != 'neang_minh' and brightness > 200:
                score += 0.2
            
            # Image histogram comparison (if reference image exists)
            if properties['reference_image']:
                try:
                    # Load reference image from file path
                    ref_image = Image.open(properties['reference_image']).convert('RGB')
                    ref_array = np.array(ref_image)
                    ref_histogram = self._compute_histogram(ref_array)
                    
                    # Compute Wasserstein distance (Earth Mover's Distance) between histograms
                    hist_distance = wasserstein_distance(input_histogram, ref_histogram)
                    similarity = max(0, 1 - hist_distance / 10)  # Normalize to [0, 1]
                    score += 0.4 * similarity  # Weight histogram comparison
                except Exception as e:
                    print(f"Error processing reference image for {rice_type}: {str(e)}")
            
            scores[rice_type] = min(score + np.random.uniform(0.05, 0.1), 0.95)
        
        best_match = max(scores.items(), key=lambda x: x[1])
        rice_type, confidence = best_match
        rice_info = self.rice_database[rice_type]
        
        return {
            'type': rice_info['name'],
            'confidence': confidence,
            'description': rice_info['description'],
            'characteristics': rice_info['characteristics']
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'No image data provided'}))
        return
    
    image_base64 = sys.argv[1]
    classifier = RiceClassifier()
    result = classifier.analyze_image(image_base64)
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()