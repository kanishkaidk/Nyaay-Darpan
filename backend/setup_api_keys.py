#!/usr/bin/env python3
"""
NyayDarpan API Key Setup Script
Helps you configure your API keys properly
"""

import os
from dotenv import load_dotenv

def setup_api_keys():
    print("🔑 NyayDarpan API Key Setup")
    print("=" * 50)
    
    # Load current .env
    load_dotenv()
    
    # Check current keys
    gemini_key = os.getenv('GEMINI_API_KEY', '')
    openai_key = os.getenv('OPENAI_API_KEY', '')
    
    print(f"Current Gemini API Key: {'✅ Set' if gemini_key and gemini_key != 'your_gemini_api_key_here' else '❌ Not Set'}")
    print(f"Current OpenAI API Key: {'✅ Set' if openai_key and openai_key != 'your_openai_api_key_here' else '❌ Not Set'}")
    
    if gemini_key == 'your_gemini_api_key_here' or not gemini_key:
        print("\n🚨 Gemini API Key Issue Found!")
        print("You need to set up your Gemini API key.")
        print("\n📝 Steps to get your API key:")
        print("1. Go to: https://aistudio.google.com/app/apikey")
        print("2. Click 'Create API Key'")
        print("3. Copy the key (starts with 'AIzaSy...')")
        print("4. Run this script again with: python setup_api_keys.py --gemini YOUR_KEY_HERE")
        
        return False
    
    if openai_key == 'your_openai_api_key_here' or not openai_key:
        print("\n⚠️  OpenAI API Key Not Set")
        print("This is optional for voice features. You can get it from: https://platform.openai.com/api-keys")
    
    print("\n✅ API Keys are properly configured!")
    return True

def update_env_file(gemini_key=None, openai_key=None):
    """Update .env file with new API keys"""
    env_content = []
    
    # Read current .env
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            env_content = f.readlines()
    
    # Update keys
    updated = False
    for i, line in enumerate(env_content):
        if line.startswith('GEMINI_API_KEY=') and gemini_key:
            env_content[i] = f'GEMINI_API_KEY={gemini_key}\n'
            updated = True
        elif line.startswith('OPENAI_API_KEY=') and openai_key:
            env_content[i] = f'OPENAI_API_KEY={openai_key}\n'
            updated = True
    
    # Write back
    with open('.env', 'w') as f:
        f.writelines(env_content)
    
    if updated:
        print("✅ .env file updated successfully!")
    else:
        print("❌ No changes made to .env file")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if '--gemini' in sys.argv:
            gemini_idx = sys.argv.index('--gemini') + 1
            if gemini_idx < len(sys.argv):
                gemini_key = sys.argv[gemini_idx]
                update_env_file(gemini_key=gemini_key)
                print(f"✅ Gemini API Key set: {gemini_key[:10]}...")
            else:
                print("❌ Please provide Gemini API key after --gemini")
        
        if '--openai' in sys.argv:
            openai_idx = sys.argv.index('--openai') + 1
            if openai_idx < len(sys.argv):
                openai_key = sys.argv[openai_idx]
                update_env_file(openai_key=openai_key)
                print(f"✅ OpenAI API Key set: {openai_key[:10]}...")
    else:
        setup_api_keys()
