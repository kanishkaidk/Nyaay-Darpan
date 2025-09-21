# NyayDarpan Backend 🏛️

AI-Powered Contract Analysis Backend Services

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

```bash
# Copy the template and fill in your API keys
cp env_template.txt .env
```

Edit `.env` and add your API keys:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Run the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── env_template.txt           # Environment variables template
├── services/
│   ├── gemini_service.py      # Contract analysis with Gemini
│   ├── whisper_service.py     # Speech-to-text with Whisper
│   └── rag_service.py         # Karma Check RAG system
└── scripts/
    └── scrape_kanoon.py       # Indian Kanoon scraper
```

## 🔧 API Endpoints

### Contract Analysis
- `POST /api/analyze-contract` - Analyze contract text for risks
- `POST /api/analyze-contract` - Get contract summary

### Speech-to-Text
- `POST /api/transcribe-audio` - Transcribe uploaded audio file
- `POST /api/transcribe-base64` - Transcribe base64 audio data
- `GET /api/supported-languages` - Get supported languages

### Karma Check (Behavioral Risk)
- `POST /api/karma-check` - Analyze company legal history
- `GET /api/risk-indicators` - Get risk assessment criteria

### Health & Info
- `GET /health` - Service health check

## 🤖 Services Overview

### 1. Gemini Contract Analyzer
- **Purpose**: AI-powered contract X-Ray analysis
- **Features**:
  - Risk scoring (1-10)
  - Identifies unfair clauses
  - Finds contradictions
  - Missing protections analysis
  - Key terms extraction

### 2. Whisper Speech-to-Text
- **Purpose**: Convert voice questions to text
- **Features**:
  - Multiple language support (Hindi, English, regional languages)
  - Audio file upload
  - Base64 audio support
  - Confidence analysis

### 3. RAG Karma Check Service
- **Purpose**: Behavioral risk analysis of counterparties
- **Features**:
  - Company legal history search
  - Risk scoring based on cases
  - Automated recommendations
  - Indian legal context

## 📊 Example API Usage

### Contract Analysis
```bash
curl -X POST http://localhost:5000/api/analyze-contract \
  -H "Content-Type: application/json" \
  -d '{
    "contract_text": "Your contract text here...",
    "analysis_type": "full"
  }'
```

### Audio Transcription
```bash
curl -X POST http://localhost:5000/api/transcribe-audio \
  -F "audio_file=@recording.wav" \
  -F "language=hi"
```

### Karma Check
```bash
curl -X POST http://localhost:5000/api/karma-check \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechCorp India",
    "limit": 10
  }'
```

## 🔒 Security Features

- API key authentication
- File size limits (25MB for audio)
- Input validation
- Error handling
- CORS enabled for frontend integration

## 🛠️ Development

### Testing Individual Services

```bash
# Test Gemini service
python services/gemini_service.py

# Test Whisper service
python services/whisper_service.py

# Test RAG service
python services/rag_service.py
```

### Scraping Legal Data

```bash
# Run the Indian Kanoon scraper
python scripts/scrape_kanoon.py
```

## 📈 Accuracy & Quality Tips

### Contract Analysis
- Use clear, well-formatted contract text
- Include all relevant clauses
- Gemini works best with complete contracts
- Review AI suggestions with legal expertise

### Speech-to-Text
- Use good quality audio recordings
- Specify language when known
- Whisper supports Hindi-English mixed speech
- Always allow user to edit transcripts

### Karma Check
- Company name should be exact and official
- More data = better accuracy
- Consider multiple name variations
- Combine with other due diligence

## 🔄 Integration with Frontend

The backend is designed to work with the React frontend:

1. **Contract Analysis**: Frontend sends contract text → Backend returns structured analysis
2. **Voice Input**: Frontend records audio → Backend transcribes → Frontend processes text
3. **Karma Check**: Frontend sends company name → Backend returns risk assessment

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment variables
export FLASK_DEBUG=False
export PORT=5000
export GEMINI_API_KEY=your_production_key
export OPENAI_API_KEY=your_production_key
```

### Docker Deployment (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 📞 Support

- Check service health: `GET /health`
- Review logs for debugging
- Ensure API keys are valid
- Test with sample data first

---

**Made with ❤️ for the Indian legal community**

*Empowering citizens with AI-driven legal insights*
