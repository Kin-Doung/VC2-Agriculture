import json
from rice_classifier import RiceClassifier

def test_classifier():
    """Test the rice classifier with sample data"""
    classifier = RiceClassifier()
    
    print("Rice Classifier Test")
    print("===================")
    
    # Test with empty/invalid data
    result = classifier.analyze_image("")
    print(f"Empty image test: {result['type']}")
    
    # Display rice database
    print("\nSupported Rice Types:")
    print("--------------------")
    for rice_type, info in classifier.rice_database.items():
        print(f"• {info['name']}")
        print(f"  Description: {info['description']}")
        print(f"  Characteristics: {', '.join(info['characteristics'][:2])}...")
        print()

if __name__ == "__main__":
    test_classifier()
