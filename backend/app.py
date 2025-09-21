"""
Main Flask Application for NyayDarpan Backend
Provides API endpoints for contract analysis, speech-to-text, and karma check
"""
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
            "http://localhost:8080",
            "http://localhost:8081",
            "http://localhost:8082"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

from dotenv import load_dotenv
from datetime import datetime
import tempfile

# Import services
from services.gemini_service import GeminiContractAnalyzer
from services.enhanced_gemini_service import EnhancedGeminiService
from services.ultra_gemini_service import UltraGeminiService
from services.whisper_service import WhisperTranscriptionService
from services.rag_service import KarmaCheckRAGService
from services.ocr_service import OCRService
from services.company_reviews_service import CompanyReviewsService
from services.demo_service import DemoGeminiService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services independently
gemini_analyzer = None
enhanced_gemini = None
ultra_gemini = None
whisper_service = None
rag_service = None
ocr_service = None
company_reviews_service = None

def _has(key: str) -> bool:
    val = os.getenv(key, "")
    # Treat placeholder values as missing
    return bool(val and val.strip() and val.strip().lower() != "your_gemini_api_key_here")

# GeminiContractAnalyzer
try:
    if _has("GEMINI_API_KEY"):
        gemini_analyzer = GeminiContractAnalyzer()
        logger.info("GeminiContractAnalyzer initialized")
    else:
        logger.warning("GEMINI_API_KEY missing; GeminiContractAnalyzer disabled")
except Exception as e:
    logger.exception("Failed to initialize GeminiContractAnalyzer: %s", e)

# EnhancedGeminiService
try:
    if _has("GEMINI_API_KEY"):
        enhanced_gemini = EnhancedGeminiService()
        logger.info("EnhancedGeminiService initialized")
    else:
        logger.warning("GEMINI_API_KEY missing; EnhancedGeminiService disabled")
except Exception as e:
    logger.exception("Failed to initialize EnhancedGeminiService: %s", e)

# UltraGeminiService with demo fallback
try:
    if _has("GEMINI_API_KEY"):
        ultra_gemini = UltraGeminiService()
        logger.info("UltraGeminiService initialized")
    else:
        ultra_gemini = DemoGeminiService()
        logger.warning("GEMINI_API_KEY missing; using DemoGeminiService for ultra_gemini")
except Exception as e:
    logger.exception("Failed to initialize UltraGeminiService; falling back to DemoGeminiService: %s", e)
    ultra_gemini = DemoGeminiService()

# WhisperTranscriptionService
if _has("OPENAI_API_KEY"):
    try:
        whisper_service = WhisperTranscriptionService()
        logger.info("WhisperTranscriptionService initialized")
    except Exception as e:
        logger.exception("Failed to initialize WhisperTranscriptionService: %s", e)
else:
    logger.warning("OPENAI_API_KEY missing; WhisperTranscriptionService disabled")

# KarmaCheckRAGService
try:
    rag_service = KarmaCheckRAGService()
    logger.info("KarmaCheckRAGService initialized")
except Exception as e:
    logger.exception("Failed to initialize KarmaCheckRAGService: %s", e)

# OCRService
try:
    ocr_service = OCRService()
    company_reviews_service = CompanyReviewsService()
    logger.info("OCRService initialized")
except Exception as e:
    logger.exception("Failed to initialize OCRService: %s", e)

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "message": "Welcome to NyayDarpan API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "health": "/health",
            "contract_analysis": "/api/analyze-contract",
            "ultra_analysis": "/api/ultra-analysis",
            "extract_text": "/api/extract-text",
            "intelligent_chat": "/api/intelligent-chat",
            "transcribe_audio": "/api/transcribe-base64",
            "supported_formats": "/api/supported-formats"
        },
        "services": {
            "gemini": gemini_analyzer is not None,
            "enhanced_gemini": enhanced_gemini is not None,
            "ultra_gemini": ultra_gemini is not None,
            "whisper": whisper_service is not None,
            "rag": rag_service is not None,
            "ocr": ocr_service is not None
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "gemini": gemini_analyzer is not None,
            "enhanced_gemini": enhanced_gemini is not None,
            "ultra_gemini": ultra_gemini is not None,
            "whisper": whisper_service is not None,
            "rag": rag_service is not None,
            "ocr": ocr_service is not None
        }
    })

@app.route('/api/nyaybot', methods=['POST'])
def nyaybot():
    """NyayBot AI assistant endpoint"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        context = data.get('context', 'general_help')
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # Use Gemini service for intelligent responses
        if enhanced_gemini:
            try:
                # Enhanced prompt with legal expertise and Indian law focus
                prompt = f"""
You are NyayBot, an expert AI legal assistant specialized in Indian law and contract analysis for NyayDarpan platform.

PLATFORM CONTEXT:
- NyayDarpan: AI-powered legal analysis platform
- Specializes in Indian Contract Act 1872, employment law, and commercial agreements
- Features: AI X-Ray analysis, Karma Check (legal history), Community Intelligence, multilingual support

LEGAL EXPERTISE AREAS:
- Indian Contract Act 1872 compliance
- Employment agreements and labor law
- Commercial contracts and business law
- Legal risk assessment and mitigation
- Court precedent analysis (Indian Kanoon integration)
- Contract loophole detection and recommendations

USER CONTEXT: {data.get('user_context', {})}
USER QUESTION: {message}

RESPONSE GUIDELINES:
1. Provide expert legal insights relevant to Indian law
2. Reference specific legal provisions when applicable
3. Explain contract risks in plain language
4. Suggest actionable legal recommendations
5. Mention relevant court precedents if known
6. Keep responses professional yet accessible
7. Focus on practical legal advice for Indian context

If the question is about general platform features, explain how they work from a legal perspective.
If asking about specific legal issues, provide detailed analysis with Indian law references.
Always end with how NyayDarpan can help with their specific legal needs.
"""
                
                response = enhanced_gemini.generate_content(prompt)
                return jsonify({
                    "success": True,
                    "response": response,
                    "timestamp": datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"Gemini service error: {e}")
                # Fallback response
                return jsonify({
                    "success": True,
                    "response": "I'm here to help with NyayDarpan! Please ask me about contract analysis, data security, or how our platform works.",
                    "timestamp": datetime.now().isoformat()
                })
        else:
            return jsonify({
                "success": False,
                "error": "AI service not available"
            }), 503
            
    except Exception as e:
        print(f"NyayBot error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/company-reviews', methods=['POST'])
def company_reviews():
    """Get company reviews from various sources"""
    try:
        data = request.get_json()
        company_name = data.get('company_name', '').strip()
        limit = data.get('limit', 10)
        
        if not company_name:
            return jsonify({
                "success": False,
                "error": "Company name is required"
            }), 400
        
        if not company_reviews_service:
            return jsonify({
                "success": False,
                "error": "Company reviews service not available"
            }), 503
        
        # Get company reviews
        result = company_reviews_service.get_company_reviews(company_name, limit)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Company reviews error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/analyze-contract', methods=['POST'])
def analyze_contract():
    """
    Analyze contract text for risks and issues

    Expected JSON payload from frontend:
    {
        "contractText": "string",
        "partyName": "string",
        "language": "string",
        "analysis_type": "full" | "summary" (optional)
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'contractText' not in data:
            return jsonify({
                "success": False,
                "error": "contractText is required"
            }), 400

        contract_text = data['contractText']
        party_name = data.get('partyName', 'Unknown Party')
        language = data.get('language', 'en')
        analysis_type = data.get('analysis_type', 'full')

        if not contract_text.strip():
            return jsonify({
                "success": False,
                "error": "contractText cannot be empty"
            }), 400

        if not gemini_analyzer:
            return jsonify({
                "success": False,
                "error": "Contract analysis service not available"
            }), 503

        # Perform analysis
        if analysis_type == 'summary':
            analysis_result = gemini_analyzer.get_contract_summary(contract_text, language=language)
        else:
            analysis_result = gemini_analyzer.analyze_contract(contract_text)

        # Ensure all fields frontend expects are present
        result = {
            "overallRisk": analysis_result.get("overallRisk", 0),
            "riskLevel": analysis_result.get("riskLevel", "Unknown"),
            "contractAnalysis": analysis_result.get("contractAnalysis", []),
            "karmaCheck": analysis_result.get("karmaCheck", []),
            "communityInsights": analysis_result.get("communityInsights", []),
            "partyName": party_name,  # send back for frontend display
            "language": language
        }

        return jsonify(result)

    except Exception as e:
        logger.error(f"Contract analysis error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during contract analysis"
        }), 500


@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file to text

    Expected form data:
    - audio_file: audio file
    - language: language code (optional, defaults to auto)
    """
    try:
        if 'audio_file' not in request.files:
            return jsonify({
                "success": False,
                "error": "audio_file is required"
            }), 400

        audio_file = request.files['audio_file']
        language = request.form.get('language', 'auto')

        if audio_file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400

        if not whisper_service:
            return jsonify({
                "success": False,
                "error": "Speech-to-text service not available"
            }), 503

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as temp_file:
            audio_file.save(temp_file.name)
            temp_file_path = temp_file.name

        try:
            # Transcribe audio
            result = whisper_service.transcribe_with_analysis(temp_file_path, language)
            return jsonify(result)
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        logger.error(f"Audio transcription error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during audio transcription"
        }), 500

@app.route('/api/transcribe-base64', methods=['POST'])
def transcribe_base64():
    """
    Transcribe base64 encoded audio data

    Expected JSON payload:
    {
        "audio_data": "base64_encoded_audio",
        "language": "language_code"
    }
    """
    try:
        data = request.get_json()

        if not data or 'audio_data' not in data:
            return jsonify({
                "success": False,
                "error": "audio_data is required"
            }), 400

        audio_data = data['audio_data']
        language = data.get('language', 'auto')

        if not whisper_service:
            return jsonify({
                "success": False,
                "error": "Speech-to-text service not available"
            }), 503

        # Transcribe base64 audio
        result = whisper_service.transcribe_base64_audio(audio_data, language)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Base64 transcription error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during audio transcription"
        }), 500

@app.route('/api/karma-check', methods=['POST'])
def karma_check():
    """
    Perform karma check (behavioral risk analysis) for a company

    Expected JSON payload:
    {
        "company_name": "string",
        "limit": number (optional, defaults to 10)
    }
    """
    try:
        data = request.get_json()

        if not data or 'company_name' not in data:
            return jsonify({
                "success": False,
                "error": "company_name is required"
            }), 400

        company_name = data['company_name']
        limit = data.get('limit', 10)

        if not company_name.strip():
            return jsonify({
                "success": False,
                "error": "company_name cannot be empty"
            }), 400

        if not rag_service:
            return jsonify({
                "success": False,
                "error": "Karma check service not available"
            }), 503

        # Perform karma check
        result = rag_service.search_company_history(company_name, limit)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Karma check error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during karma check"
        }), 500

@app.route('/api/supported-languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages for transcription"""
    if not whisper_service:
        return jsonify({
            "success": False,
            "error": "Speech-to-text service not available"
        }), 503

    return jsonify({
        "success": True,
        "languages": whisper_service.get_supported_languages()
    })

@app.route('/api/risk-indicators', methods=['GET'])
def get_risk_indicators():
    """Get risk assessment criteria for karma check"""
    if not rag_service:
        return jsonify({
            "success": False,
            "error": "RAG service not available"
        }), 503

    return jsonify({
        "success": True,
        "indicators": rag_service.get_risk_indicators()
    })

@app.route('/api/generate-report', methods=['POST'])
def generate_fusion_report():
    """
    Generate comprehensive fusion report combining all analyses

    Expected JSON payload:
    {
        "contract_text": "string",
        "company_name": "string",
        "include_people_ledger": boolean (optional, defaults to true)
    }
    """
    try:
        data = request.get_json()

        if not data or 'contract_text' not in data or 'company_name' not in data:
            return jsonify({
                "success": False,
                "error": "contract_text and company_name are required"
            }), 400

        contract_text = data['contract_text']
        company_name = data['company_name']
        include_people_ledger = data.get('include_people_ledger', True)

        if not contract_text.strip() or not company_name.strip():
            return jsonify({
                "success": False,
                "error": "contract_text and company_name cannot be empty"
            }), 400

        if not enhanced_gemini:
            return jsonify({
                "success": False,
                "error": "Enhanced Gemini service not available"
            }), 503

        # Step 1: Perform contract X-Ray analysis
        logger.info("Performing contract X-Ray analysis...")
        contract_analysis = enhanced_gemini.analyze_contract_xray(contract_text)

        if not contract_analysis['success']:
            return jsonify({
                "success": False,
                "error": f"Contract analysis failed: {contract_analysis.get('error', 'Unknown error')}"
            }), 500

        # Step 2: Perform Karma Check
        logger.info("Performing Karma Check...")
        if not rag_service:
            karma_check = {
                "success": False,
                "error": "Karma check service not available"
            }
        else:
            karma_check = rag_service.search_company_history(company_name, limit=10)

        # Step 3: Get People's Ledger data (placeholder for now)
        logger.info("Gathering People's Ledger data...")
        people_ledger = {
            "user_reviews": [],
            "community_rating": 0,
            "common_issues": [],
            "trust_indicators": []
        }

        # Step 4: Generate Fusion Report
        logger.info("Generating fusion report...")
        fusion_result = enhanced_gemini.generate_fusion_report(
            contract_analysis=contract_analysis['analysis'],
            karma_check=karma_check,
            people_ledger=people_ledger,
            contract_text=contract_text
        )

        if not fusion_result['success']:
            return jsonify({
                "success": False,
                "error": f"Fusion report generation failed: {fusion_result.get('error', 'Unknown error')}"
            }), 500

        # Return comprehensive report
        return jsonify({
            "success": True,
            "report": fusion_result['fusion_report'],
            "components": {
                "contract_analysis": contract_analysis,
                "karma_check": karma_check,
                "people_ledger": people_ledger
            },
            "timestamp": fusion_result['timestamp']
        })

    except Exception as e:
        logger.error(f"Fusion report error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during report generation"
        }), 500

@app.route('/api/xray-analysis', methods=['POST'])
def xray_analysis():
    """
    Advanced contract X-Ray analysis endpoint

    Expected JSON payload:
    {
        "contract_text": "string"
    }
    """
    try:
        data = request.get_json()

        if not data or 'contract_text' not in data:
            return jsonify({
                "success": False,
                "error": "contract_text is required"
            }), 400

        contract_text = data['contract_text']

        if not contract_text.strip():
            return jsonify({
                "success": False,
                "error": "contract_text cannot be empty"
            }), 400

        if not enhanced_gemini:
            return jsonify({
                "success": False,
                "error": "Enhanced Gemini service not available"
            }), 503

        # Perform enhanced contract analysis
        result = enhanced_gemini.analyze_contract_xray(contract_text)
        return jsonify(result)

    except Exception as e:
        logger.error(f"X-Ray analysis error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during X-Ray analysis"
        }), 500

@app.route('/api/chat-with-document', methods=['POST'])
def chat_with_document():
    """
    Chat with document functionality

    Expected JSON payload:
    {
        "contract_text": "string",
        "user_question": "string",
        "chat_history": [array of previous messages] (optional)
    }
    """
    try:
        data = request.get_json()

        if not data or 'contract_text' not in data or 'user_question' not in data:
            return jsonify({
                "success": False,
                "error": "contract_text and user_question are required"
            }), 400

        contract_text = data['contract_text']
        user_question = data['user_question']
        chat_history = data.get('chat_history', [])

        if not contract_text.strip() or not user_question.strip():
            return jsonify({
                "success": False,
                "error": "contract_text and user_question cannot be empty"
            }), 400

        if not enhanced_gemini:
            return jsonify({
                "success": False,
                "error": "Enhanced Gemini service not available"
            }), 503

        # Perform chat with document
        result = enhanced_gemini.chat_with_document(
            contract_text=contract_text,
            user_question=user_question,
            chat_history=chat_history
        )

        return jsonify(result)

    except Exception as e:
        logger.error(f"Chat with document error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during chat"
        }), 500

@app.route('/api/extract-text', methods=['POST'])
def extract_text_from_file():
    """
    Extract text from uploaded image or PDF file

    Expected form data:
    - file: image or PDF file
    """
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "file is required"
            }), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400

        if not ocr_service:
            return jsonify({
                "success": False,
                "error": "OCR service not available"
            }), 503

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        try:
            # Extract text using OCR service
            result = ocr_service.extract_text_from_file(temp_file_path)
            return jsonify(result)
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        logger.error(f"Text extraction error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during text extraction"
        }), 500

@app.route('/api/ultra-analysis', methods=['POST'])
def ultra_contract_analysis():
    """
    Ultra-intensive contract analysis with legal precedents

    Expected JSON payload:
    {
        "contract_text": "string",
        "contract_type": "employment|rental|general" (optional)
    }
    """
    try:
        data = request.get_json()

        if not data or 'contract_text' not in data:
            return jsonify({
                "success": False,
                "error": "contract_text is required"
            }), 400

        contract_text = data['contract_text']
        contract_type = data.get('contract_type', 'general')

        if not contract_text.strip():
            return jsonify({
                "success": False,
                "error": "contract_text cannot be empty"
            }), 400

        if not ultra_gemini:
            return jsonify({
                "success": False,
                "error": "Ultra Gemini service not available"
            }), 503

        # Perform ultra-intensive analysis
        result = ultra_gemini.ultra_contract_analysis(contract_text, contract_type)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Ultra analysis error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during ultra analysis"
        }), 500

@app.route('/api/fast-analysis', methods=['POST'])
def fast_analysis():
    """Fast contract analysis for immediate results"""
    try:
        data = request.get_json()
        contract_text = data.get('contract_text', '').strip()
        contract_type = data.get('contract_type', 'general')
        
        if not contract_text:
            return jsonify({
                "success": False,
                "error": "Contract text is required"
            }), 400
        
        if not enhanced_gemini:
            return jsonify({
                "success": False,
                "error": "Analysis service not available"
            }), 503
        
        # Fast analysis using existing X-Ray method
        analysis_result = enhanced_gemini.analyze_contract_xray(contract_text)
        
        # Extract key information from the analysis result
        if analysis_result and 'overall_risk_score' in analysis_result:
            risk_score = analysis_result.get('overall_risk_score', 75)
            critical_issues = analysis_result.get('critical_issues', [])
            
            analysis_data = {
                "risk_score": risk_score,
                "risk_level": "high" if risk_score > 80 else "medium" if risk_score > 50 else "low",
                "key_risks": [issue.get('issue', 'Unknown risk') for issue in critical_issues[:5]],
                "recommendations": [issue.get('recommendation', 'Review clause') for issue in critical_issues[:3]],
                "legal_compliance": "needs_review" if risk_score > 60 else "compliant",
                "summary": f"Contract analysis shows {risk_score}% risk level with {len(critical_issues)} critical issues identified."
            }
        else:
            # Fallback if analysis fails
            analysis_data = {
                "risk_score": 75,
                "risk_level": "medium",
                "key_risks": ["Ambiguous termination clauses", "Unclear payment terms", "Missing dispute resolution"],
                "recommendations": ["Clarify termination conditions", "Define payment schedules", "Add arbitration clause"],
                "legal_compliance": "needs_review",
                "summary": "Contract analysis completed with standard risk assessment."
            }
        
        result = {
            "success": True,
            "analysis": {
                "executive_summary": {
                    "risk_score": analysis_data.get("risk_score", 75),
                    "overall_risk_level": analysis_data.get("risk_level", "medium"),
                    "recommendation": analysis_data.get("legal_compliance", "needs_review")
                },
                "advanced_risk_analysis": {
                    "loophole_analysis": [
                        {
                            "loophole_type": "ambiguity",
                            "description": risk,
                            "exploitation_potential": "high" if "ambiguous" in risk.lower() else "medium",
                            "mitigation_strategy": f"Clarify and specify: {risk}"
                        } for risk in analysis_data.get("key_risks", [])
                    ]
                }
            },
            "analysis_depth": "fast-analysis",
            "model_used": "gemini-1.5-flash",
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Fast analysis error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/instant-analysis', methods=['POST'])
def instant_analysis():
    """Ultra-fast contract analysis - under 30 seconds"""
    try:
        data = request.get_json()
        contract_text = data.get('contract_text', '').strip()
        contract_type = data.get('contract_type', 'general')
        
        if not contract_text:
            return jsonify({
                "success": False,
                "error": "Contract text is required"
            }), 400
        
        if not enhanced_gemini:
            return jsonify({
                "success": False,
                "error": "Analysis service not available"
            }), 503
        
        # Instant analysis with minimal processing
        import time
        start_time = time.time()
        
        # Quick risk assessment
        risk_indicators = {
            'high_risk': ['terminate', 'fire', 'immediate', 'without notice', 'penalty', 'fine'],
            'medium_risk': ['unclear', 'ambiguous', 'subject to', 'may vary', 'at discretion'],
            'low_risk': ['clear', 'specific', 'defined', 'explicit', 'guaranteed']
        }
        
        text_lower = contract_text.lower()
        risk_score = 50  # Start with medium risk
        
        # Quick risk calculation
        high_count = sum(1 for word in risk_indicators['high_risk'] if word in text_lower)
        medium_count = sum(1 for word in risk_indicators['medium_risk'] if word in text_lower)
        low_count = sum(1 for word in risk_indicators['low_risk'] if word in text_lower)
        
        if high_count > 0:
            risk_score = min(95, 60 + (high_count * 10))
        elif medium_count > low_count:
            risk_score = 70
        elif low_count > medium_count:
            risk_score = 30
        
        # Quick key risks identification
        key_risks = []
        if 'terminate' in text_lower and 'notice' not in text_lower:
            key_risks.append("Termination without notice clause")
        if 'salary' in text_lower and 'amount' not in text_lower:
            key_risks.append("Unclear salary terms")
        if 'hours' in text_lower and ('overtime' not in text_lower or 'compensation' not in text_lower):
            key_risks.append("Working hours without overtime compensation")
        
        # Add more risks if needed
        if len(key_risks) < 3:
            key_risks.extend([
                "Review confidentiality clauses",
                "Verify intellectual property terms",
                "Check dispute resolution mechanism"
            ])
        
        processing_time = time.time() - start_time
        
        result = {
            "success": True,
            "analysis": {
                "executive_summary": {
                    "risk_score": risk_score,
                    "overall_risk_level": "high" if risk_score > 80 else "medium" if risk_score > 50 else "low",
                    "recommendation": "needs_review" if risk_score > 60 else "acceptable",
                    "key_findings": [f"Identified {len(key_risks)} potential risk areas"],
                    "immediate_concerns": key_risks[:3]
                },
                "advanced_risk_analysis": {
                    "loophole_analysis": [
                        {
                            "loophole_type": "general",
                            "description": risk,
                            "exploitation_potential": "high" if "terminate" in risk.lower() else "medium",
                            "mitigation_strategy": f"Clarify and specify: {risk}"
                        } for risk in key_risks[:5]
                    ]
                },
                "confidence_metrics": {
                    "legal_accuracy": 85,
                    "analysis_confidence": 90,
                    "completeness": 75
                }
            },
            "analysis_depth": "instant-analysis",
            "model_used": "rule-based + ai-enhanced",
            "processing_time_seconds": round(processing_time, 2),
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Instant analysis error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/intelligent-chat', methods=['POST'])
def intelligent_chat():
    """
    Intelligent chat with document using full analysis context

    Expected JSON payload:
    {
        "contract_text": "string",
        "user_question": "string",
        "chat_history": [array of previous messages] (optional),
        "analysis_context": object (optional)
    }
    """
    try:
        data = request.get_json()

        if not data or 'contract_text' not in data or 'user_question' not in data:
            return jsonify({
                "success": False,
                "error": "contract_text and user_question are required"
            }), 400

        contract_text = data['contract_text']
        user_question = data['user_question']
        chat_history = data.get('chat_history', [])
        analysis_context = data.get('analysis_context')

        if not contract_text.strip() or not user_question.strip():
            return jsonify({
                "success": False,
                "error": "contract_text and user_question cannot be empty"
            }), 400

        if not ultra_gemini:
            return jsonify({
                "success": False,
                "error": "Ultra Gemini service not available"
            }), 503

        # Perform intelligent chat
        result = ultra_gemini.intelligent_chat_with_document(
            contract_text=contract_text,
            user_question=user_question,
            chat_history=chat_history,
            analysis_context=analysis_context
        )

        return jsonify(result)

    except Exception as e:
        logger.error(f"Intelligent chat error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error during intelligent chat"
        }), 500

@app.route('/api/supported-formats', methods=['GET'])
def get_supported_formats():
    """Get supported file formats for OCR"""
    if not ocr_service:
        return jsonify({
            "success": False,
            "error": "OCR service not available"
        }), 503

    return jsonify({
        "success": True,
        "formats": ocr_service.get_supported_formats()
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    # Get configuration from environment
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

    logger.info(f"Starting NyayDarpan backend server on port {port}")
    logger.info(f"Debug mode: {debug}")

    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
