# setup_training.py
# Setup script to install all required packages and dependencies

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def check_gpu():
    """Check if GPU is available"""
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ GPU available: {torch.cuda.get_device_name(0)}")
            print(f"   Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f}GB")
            return True
        else:
            print("💻 No GPU detected - training will use CPU (slower)")
            return False
    except ImportError:
        print("⚠️  PyTorch not installed yet")
        return False

def main():
    """Main setup function"""
    print("🚀 BORANA TRANSLATION MODEL - SETUP")
    print("=" * 50)
    
    # Required packages
    packages = [
        "torch",
        "transformers>=4.30.0", 
        "datasets",
        "evaluate",
        "sentencepiece",
        "sacrebleu",
        "protobuf",
        "accelerate",  # For distributed training
        "numpy",
        "pandas"
    ]
    
    print("📦 Installing required packages...")
    
    failed_packages = []
    for package in packages:
        print(f"Installing {package}...")
        if install_package(package):
            print(f"✅ {package} installed successfully")
        else:
            print(f"❌ Failed to install {package}")
            failed_packages.append(package)
    
    if failed_packages:
        print(f"\n⚠️  Some packages failed to install: {failed_packages}")
        print("Try installing them manually:")
        for pkg in failed_packages:
            print(f"   pip install {pkg}")
    else:
        print("\n✅ All packages installed successfully!")
    
    # Check GPU availability
    print(f"\n🖥️  Checking hardware...")
    check_gpu()
    
    # Check data files
    print(f"\n📁 Checking data files...")
    data_files = ["data/train.json", "data/validation.json", "data/test.json"]
    missing_files = []
    
    for file_path in data_files:
        if os.path.exists(file_path):
            print(f"✅ Found: {file_path}")
        else:
            print(f"❌ Missing: {file_path}")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n⚠️  Missing data files. Please run txt_extraction.py first!")
    else:
        print(f"\n✅ All data files found!")
    
    # Final setup check
    print(f"\n🎯 SETUP SUMMARY")
    print(f"   - Packages: {'✅ Ready' if not failed_packages else '❌ Some failed'}")
    print(f"   - Data files: {'✅ Ready' if not missing_files else '❌ Missing files'}")
    print(f"   - Hardware: {'🖥️  GPU Ready' if check_gpu() else '💻 CPU Only'}")
    
    if not failed_packages and not missing_files:
        print(f"\n🚀 READY TO TRAIN! Run: python model_training.py")
    else:
        print(f"\n⚠️  Please fix the issues above before training")

if __name__ == "__main__":
    main()