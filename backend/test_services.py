"""
Test script for NyayDarpan backend services
Run this to verify all services are working correctly
"""

import os
import sys
import json
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_gemini_service():
    """Test Gemini contract analysis service"""
    print("🧪 Testing Gemini Contract Analyzer...")
    
    try:
        from services.gemini_service import GeminiContractAnalyzer
        
        # Check if API key is set
        if not os.getenv('GEMINI_API_KEY'):
            print("❌ GEMINI_API_KEY not found in environment variables")
            return False
        
        # Initialize service
        analyzer = GeminiContractAnalyzer()
        
        # Test with sample contract
        sample_contract = """
        SERVICE AGREEMENT
        
        This agreement is between Company ABC (Client) and Service Provider XYZ.
        
        Terms:
        1. Service Provider will deliver software development services.
        2. Payment of ₹50,000 will be made within 30 days of invoice.
        3. Client reserves the right to terminate without notice.
        4. Service Provider is liable for all damages regardless of fault.
        5. All disputes will be resolved through arbitration in Mumbai.
        
        This agreement is governed by Indian Contract Act, 1872.
        """
        
        # Test contract analysis
        result = analyzer.analyze_contract(sample_contract)
        
        if result['success']:
            print("✅ Gemini service working correctly")
            print(f"   Risk Score: {result['analysis'].get('overall_risk_score', 'N/A')}")
            return True
        else:
            print(f"❌ Gemini service error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Gemini service test failed: {e}")
        return False

def test_whisper_service():
    """Test Whisper speech-to-text service"""
    print("🧪 Testing Whisper Speech-to-Text Service...")
    
    try:
        from services.whisper_service import WhisperTranscriptionService
        
        # Check if API key is set
        if not os.getenv('OPENAI_API_KEY'):
            print("❌ OPENAI_API_KEY not found in environment variables")
            return False
        
        # Initialize service
        whisper_service = WhisperTranscriptionService()
        
        # Test supported languages
        languages = whisper_service.get_supported_languages()
        
        if languages:
            print("✅ Whisper service working correctly")
            print(f"   Supported languages: {len(languages['supported_languages'])}")
            return True
        else:
            print("❌ Whisper service configuration error")
            return False
            
    except Exception as e:
        print(f"❌ Whisper service test failed: {e}")
        return False

def test_rag_service():
    """Test RAG Karma Check service"""
    print("🧪 Testing RAG Karma Check Service...")
    
    try:
        from services.rag_service import KarmaCheckRAGService
        
        # Initialize service
        rag_service = KarmaCheckRAGService()
        
        # Test karma check
        result = rag_service.search_company_history("Test Company", limit=5)
        
        if result['success']:
            print("✅ RAG service working correctly")
            print(f"   Risk Level: {result.get('risk_level', 'N/A')}")
            return True
        else:
            print(f"❌ RAG service error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ RAG service test failed: {e}")
        return False

def test_flask_app():
    """Test Flask application startup"""
    print("🧪 Testing Flask Application...")
    
    try:
        from app import app
        
        # Test app initialization
        with app.test_client() as client:
            # Test health endpoint
            response = client.get('/health')
            
            if response.status_code == 200:
                data = response.get_json()
                print("✅ Flask app working correctly")
                print(f"   Services status: {data.get('services', {})}")
                return True
            else:
                print(f"❌ Flask app health check failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Flask app test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 NyayDarpan Backend Service Tests")
    print("=" * 50)
    
    # Check environment setup
    print("📋 Checking environment setup...")
    
    env_vars = {
        'GEMINI_API_KEY': os.getenv('GEMINI_API_KEY'),
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY')
    }
    
    missing_vars = [var for var, value in env_vars.items() if not value]
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("   Please set these in your .env file")
        print("   Some tests may fail without proper API keys\n")
    else:
        print("✅ All required environment variables are set\n")
    
    # Run tests
    tests = [
        test_gemini_service,
        test_whisper_service,
        test_rag_service,
        test_flask_app
    ]
    
    results = []
    
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            results.append(False)
        
        print()  # Add spacing between tests
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print("📊 Test Results Summary")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready to use.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        print("   Make sure to set up your API keys in .env file")
    
    print("\n🚀 To start the server, run: python app.py")

if __name__ == "__main__":
    main()
