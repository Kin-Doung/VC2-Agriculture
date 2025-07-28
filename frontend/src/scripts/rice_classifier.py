import base64
import io
import json
import sys
from PIL import Image
import numpy as np

class RiceClassifier:
    def __init__(self):
        self.rice_database = {
            'basmati': {
                'name': 'Basmati Rice',
                'description': 'Long-grain aromatic rice with a distinctive nutty flavor and fluffy texture when cooked.',
                'characteristics': [
                    'Long, slender grains (6-7mm)',
                    'Aromatic fragrance',
                    'Light and fluffy when cooked',
                    'Popular in Indian and Middle Eastern cuisine'
                ],
                'color_range': [(240, 230, 200), (255, 250, 240)],
                'grain_length': 'long'
            },
            'jasmine': {
                'name': 'Jasmine Rice',
                'description': 'Fragrant long-grain rice with a subtle floral aroma and slightly sticky texture.',
                'characteristics': [
                    'Medium to long grains (5-6mm)',
                    'Sweet, floral aroma',
                    'Slightly sticky texture',
                    'Common in Thai cuisine'
                ],
                'color_range': [(245, 240, 235), (255, 255, 250)],
                'grain_length': 'medium-long'
            },
            'arborio': {
                'name': 'Arborio Rice',
                'description': 'Short-grain rice with high starch content, perfect for creamy risottos.',
                'characteristics': [
                    'Short, plump grains (4-5mm)',
                    'High starch content',
                    'Creamy texture when cooked',
                    'Ideal for risotto'
                ],
                'color_range': [(250, 245, 240), (255, 255, 255)],
                'grain_length': 'short'
            },
            'brown': {
                'name': 'Brown Rice',
                'description': 'Whole grain rice with the bran layer intact, providing more nutrients and fiber.',
                'characteristics': [
                    'Brown/tan colored',
                    'Nutty flavor',
                    'Chewy texture',
                    'Higher in fiber and nutrients'
                ],
                'color_range': [(160, 130, 100), (200, 170, 140)],
                'grain_length': 'medium'
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
            classification = self._classify_rice(color_analysis)
            
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
    
    def _classify_rice(self, color_analysis):
        scores = {}
        
        for rice_type, properties in self.rice_database.items():
            score = 0
            avg_color = color_analysis['average_rgb']
            color_range = properties['color_range']
            
            # Color matching
            if (color_range[0][0] <= avg_color[0] <= color_range[1][0] and
                color_range[0][1] <= avg_color[1] <= color_range[1][1] and
                color_range[0][2] <= avg_color[2] <= color_range[1][2]):
                score += 0.6
            
            # Brightness analysis
            brightness = color_analysis['brightness']
            if rice_type in ['brown'] and brightness < 150:
                score += 0.3
            elif rice_type not in ['brown'] and brightness > 200:
                score += 0.3
            
            scores[rice_type] = min(score + np.random.uniform(0.1, 0.2), 0.95)
        
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
