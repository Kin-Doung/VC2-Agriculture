import subprocess
import sys
import os

def install_dependencies():
    """Install required computer vision and machine learning packages"""
    
    packages = [
        'opencv-python==4.8.1.78',
        'pillow>=9.0.0',
        'numpy>=1.21.0',
        'scikit-image>=0.19.0',
        'matplotlib>=3.5.0'
    ]
    
    print("🔧 Installing Advanced Computer Vision Dependencies...")
    print("=" * 60)
    
    for package in packages:
        try:
            print(f"📦 Installing {package}...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", package, "--upgrade"
            ])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")
            return False
    
    print("\n🎉 All computer vision dependencies installed successfully!")
    print("\n📋 Installed packages:")
    for package in packages:
        print(f"  • {package}")
    
    print("\n🚀 Rice scanner now has advanced Python-powered analysis!")
    print("Features enabled:")
    print("  • OpenCV grain detection")
    print("  • Machine learning classification")
    print("  • Advanced image preprocessing")
    print("  • Color and shape analysis")
    
    return True

def test_installation():
    """Test if all packages are properly installed"""
    print("\n🧪 Testing installation...")
    
    try:
        import cv2
        print(f"✅ OpenCV version: {cv2.__version__}")
        
        import numpy as np
        print(f"✅ NumPy version: {np.__version__}")
        
        from PIL import Image
        print(f"✅ Pillow (PIL) available")
        
        import skimage
        print(f"✅ Scikit-image version: {skimage.__version__}")
        
        import matplotlib
        print(f"✅ Matplotlib version: {matplotlib.__version__}")
        
        print("\n🎯 All packages working correctly!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

if __name__ == "__main__":
    success = install_dependencies()
    if success:
        test_installation()
    else:
        print("\n❌ Installation failed. Please check your Python environment.")
