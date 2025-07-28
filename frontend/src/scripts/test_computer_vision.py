import json
import base64
import io
from PIL import Image, ImageDraw
import numpy as np

def create_test_rice_image(rice_type="basmati"):
    """Create a synthetic rice image for testing"""
    
    # Create a white background
    width, height = 800, 600
    image = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(image)
    
    # Rice grain parameters based on type
    grain_params = {
        'basmati': {'length': 40, 'width': 12, 'color': (245, 240, 235), 'count': 50},
        'jasmine': {'length': 35, 'width': 15, 'color': (250, 245, 240), 'count': 45},
        'brown': {'length': 30, 'width': 14, 'color': (180, 150, 120), 'count': 40},
        'arborio': {'length': 25, 'width': 18, 'color': (255, 250, 245), 'count': 35},
        'sushi': {'length': 20, 'width': 16, 'color': (248, 245, 242), 'count': 30},
        'wild': {'length': 50, 'width': 8, 'color': (60, 40, 30), 'count': 25}
    }
    
    params = grain_params.get(rice_type, grain_params['basmati'])
    
    # Draw rice grains
    np.random.seed(42)  # For reproducible results
    for i in range(params['count']):
        # Random position
        x = np.random.randint(50, width - 50)
        y = np.random.randint(50, height - 50)
        
        # Add some variation to grain size
        length = params['length'] + np.random.randint(-5, 6)
        width_grain = params['width'] + np.random.randint(-3, 4)
        
        # Random rotation
        angle = np.random.randint(0, 180)
        
        # Create grain shape (ellipse)
        bbox = [x - length//2, y - width_grain//2, x + length//2, y + width_grain//2]
        
        # Add color variation
        color = tuple(max(0, min(255, c + np.random.randint(-10, 11))) for c in params['color'])
        
        draw.ellipse(bbox, fill=color, outline=None)
    
    return image

def image_to_base64(image):
    """Convert PIL image to base64 string"""
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG', quality=90)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"

def test_python_analyzer():
    """Test the Python rice analyzer with synthetic images"""
    
    print("🧪 Testing Python Rice Analyzer")
    print("=" * 50)
    
    try:
        from advanced_rice_analyzer import AdvancedRiceAnalyzer
        analyzer = AdvancedRiceAnalyzer()
        print("✅ Python analyzer imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import analyzer: {e}")
        print("💡 Make sure to install dependencies: python scripts/install_cv_dependencies.py")
        return False
    
    # Test different rice types
    rice_types = ['basmati', 'jasmine', 'brown', 'arborio', 'sushi', 'wild']
    
    results = {}
    
    for rice_type in rice_types:
        print(f"\n🌾 Testing {rice_type.title()} Rice:")
        print("-" * 30)
        
        try:
            # Create test image
            test_image = create_test_rice_image(rice_type)
            base64_image = image_to_base64(test_image)
            
            # Analyze with Python
            result = analyzer.analyze_rice_image(base64_image)
            
            print(f"🎯 Detected: {result['type']}")
            print(f"📊 Confidence: {result['confidence']:.1%}")
            
            if 'python_analysis' in result:
                analysis = result['python_analysis']
                print(f"🔍 Method: {analysis.get('method', 'Unknown')}")
                print(f"🌾 Grain Count: {analysis.get('grain_count', 'N/A')}")
                print(f"📏 Aspect Ratio: {analysis.get('avg_aspect_ratio', 'N/A')}")
            
            results[rice_type] = {
                'detected': result['type'],
                'confidence': result['confidence'],
                'success': result['type'] != 'Analysis Error'
            }
            
        except Exception as e:
            print(f"❌ Error testing {rice_type}: {e}")
            results[rice_type] = {'success': False, 'error': str(e)}
    
    # Summary
    print("\n📋 Test Summary:")
    print("=" * 50)
    
    successful_tests = sum(1 for r in results.values() if r.get('success', False))
    total_tests = len(results)
    
    print(f"✅ Successful tests: {successful_tests}/{total_tests}")
    
    for rice_type, result in results.items():
        if result.get('success'):
            print(f"  🌾 {rice_type.title()}: {result['detected']} ({result['confidence']:.1%})")
        else:
            print(f"  ❌ {rice_type.title()}: Failed")
    
    if successful_tests == total_tests:
        print("\n🎉 All tests passed! Python integration is working perfectly.")
    else:
        print(f"\n⚠️  {total_tests - successful_tests} tests failed. Check the errors above.")
    
    return successful_tests == total_tests

if __name__ == "__main__":
    test_python_analyzer()
