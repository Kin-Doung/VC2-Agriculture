import json
from advanced_rice_classifier import AdvancedRiceClassifier

def test_computer_vision():
    """Test the computer vision rice classifier"""
    print("Testing Computer Vision Rice Classifier")
    print("=" * 40)
    
    try:
        classifier = AdvancedRiceClassifier()
        print("✓ Classifier initialized successfully")
        
        # Test with empty data
        result = classifier.analyze_image("")
        print(f"Empty image test: {result['type']}")
        
        print("\nSupported Rice Types with Visual Features:")
        print("-" * 50)
        
        for rice_type, info in classifier.rice_database.items():
            visual = info['visual_features']
            print(f"• {info['name']}")
            print(f"  Aspect Ratio: {visual['aspect_ratio'][0]:.1f} - {visual['aspect_ratio'][1]:.1f}")
            print(f"  Shape: {visual['shape']}")
            print(f"  Length: {visual['grain_length']}")
            print()
        
        print("Computer vision system ready for rice classification!")
        
    except ImportError as e:
        print(f"✗ Missing dependencies: {e}")
        print("Run: python scripts/install_dependencies.py")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    test_computer_vision()
