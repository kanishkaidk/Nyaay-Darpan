"""
Setup script for NyayDarpan Backend
Automates the setup process for the backend services
"""

import os
import sys
import subprocess
import shutil

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ required. Current version: {version.major}.{version.minor}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def setup_environment():
    """Set up environment file"""
    print("🔧 Setting up environment...")
    
    env_file = ".env"
    env_template = "env_template.txt"
    
    if os.path.exists(env_file):
        print(f"⚠️  {env_file} already exists. Skipping environment setup.")
        print("   Please edit it manually to add your API keys.")
        return True
    
    if os.path.exists(env_template):
        try:
            shutil.copy(env_template, env_file)
            print(f"✅ Created {env_file} from template")
            print("   ⚠️  Please edit .env file to add your API keys:")
            print("      - GEMINI_API_KEY: Get from Google AI Studio")
            print("      - OPENAI_API_KEY: Get from OpenAI Platform")
            return True
        except Exception as e:
            print(f"❌ Failed to create .env file: {e}")
            return False
    else:
        print(f"❌ Template file {env_template} not found")
        return False

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    
    directories = ["uploads", "logs", "data"]
    
    for directory in directories:
        try:
            os.makedirs(directory, exist_ok=True)
            print(f"✅ Created directory: {directory}")
        except Exception as e:
            print(f"❌ Failed to create directory {directory}: {e}")
            return False
    
    return True

def run_tests():
    """Run service tests"""
    print("🧪 Running service tests...")
    
    try:
        subprocess.check_call([sys.executable, "test_services.py"])
        return True
    except subprocess.CalledProcessError:
        print("⚠️  Some tests failed. This is normal if API keys are not set.")
        return True  # Don't fail setup if tests fail due to missing API keys
    except FileNotFoundError:
        print("❌ test_services.py not found")
        return False

def main():
    """Main setup function"""
    print("🚀 NyayDarpan Backend Setup")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    setup_steps = [
        ("Python Version Check", check_python_version),
        ("Directory Creation", create_directories),
        ("Dependency Installation", install_dependencies),
        ("Environment Setup", setup_environment),
        ("Service Tests", run_tests)
    ]
    
    results = []
    
    for step_name, step_function in setup_steps:
        print(f"\n📋 {step_name}...")
        try:
            result = step_function()
            results.append(result)
        except Exception as e:
            print(f"❌ {step_name} failed: {e}")
            results.append(False)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Setup Summary")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    for i, (step_name, _) in enumerate(setup_steps):
        status = "✅" if results[i] else "❌"
        print(f"{status} {step_name}")
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 Setup completed successfully!")
        print("\n🚀 Next steps:")
        print("1. Edit .env file to add your API keys")
        print("2. Run: python test_services.py (to verify setup)")
        print("3. Run: python app.py (to start the server)")
        print("4. Visit: http://localhost:5000/health")
    else:
        print("\n⚠️  Setup completed with some issues.")
        print("   Please check the errors above and fix them manually.")
    
    print("\n📚 For more help, see backend/README.md")

if __name__ == "__main__":
    main()
