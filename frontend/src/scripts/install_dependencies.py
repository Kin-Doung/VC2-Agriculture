import subprocess
import sys

def install_dependencies():
    """Install required Python packages for rice classification"""
    packages = [
        'opencv-python',
        'pillow',
        'numpy'
    ]
    
    print("Installing computer vision dependencies...")
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to install {package}: {e}")
            return False
    
    print("\n✓ All dependencies installed successfully!")
    print("Rice scanner now has full computer vision capabilities.")
    return True

if __name__ == "__main__":
    install_dependencies()
