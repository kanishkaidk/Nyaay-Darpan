# Nyaay-Darpan

AI-native legal co-pilot that reviews contracts end to end, flags risks, and delivers actionable guidance before you sign.

## Overview

- Frontend: Vite + React for multilingual, responsive workflows.
- Backend: Flask API layer powering analysis, RAG retrieval, and automation.
- AI stack: Google Gemini, OpenAI Whisper, FAISS/Pinecone for knowledge-grounded responses.
- Hosted on Vercel (frontend) and Render (backend) with Supabase for auth and persistence.

## Key Differentiators

- Full contract scan with clause-level obligations, risk labels, and recommended next steps.
- Legal compliance score with prioritized remediation checklist and red-flag alerts.
- Behavioral karma check on counterparties using precedent data and public records.
- People’s Ledger surfacing community experience for better negotiation leverage.
- Time, cost, and clarity advantage by distilling legalese into plain-language actions.

## Feature Highlights

- Secure contract upload or text paste, instant AI-generated reports.
- Multilingual UX with conversational NyayBot assistant and voice-to-text intake.
- RAG-driven clause retrieval ensuring explainable, cited answers.
- Role-based access with Supabase auth and protected routes.
- Visual dashboards for compliance scoring, risk heatmaps, and obligation summaries.

## Quick Start

```bash
git clone <YOUR_GIT_URL>
cd Nyaay-Darpan

# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd ../backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open the frontend at `http://localhost:5173` and configure backend API URL in `frontend/.env`.

## Usage Flow

1. Sign in via Supabase auth and create a workspace.
2. Upload a contract PDF or paste clauses; optional voice input leverages Whisper.
3. Review the AI report: clause-level insights, compliance score, karma check, and ledger notes.
4. Export recommendations or share secure links for team review.

## Repository Structure

```
backend/
│── app.py                 # Flask API entrypoint
│── services/              # Gemini, Whisper, OCR, RAG helpers
│── scripts/               # Data ingestion and scraping tools
│── requirements.txt       # Python dependencies
frontend/
│── src/                   # React application logic
│   ├── pages/             # Input, report, chat, auth routes
│   ├── components/        # UI kit, chat interface, layouts
│   ├── integrations/      # Supabase clients and types
│   └── hooks/             # Auth, toasts, device detection
output/
│── Screenshot 2025-11-10 220514.png  # System architecture reference
│── WhatsApp Image 2025-09-21 at 22.46.53_41d88ca8.jpg  # Product visual
│── WhatsApp Video 2025-09-21 at 17.29.37_18e107f2.mp4  # Demo recording
```

## Tech Stack

- React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS.
- Flask, Python, Supabase, Embeddings + RAG (FAISS or Pinecone).
- Google Gemini for legal reasoning, OpenAI Whisper for speech intake.
- Vercel (frontend), Render (backend), GitHub Actions for CI/CD.

## Architecture

![System Architecture](output/Screenshot%202025-11-10%20220514.png)

![Product Snapshot](output/WhatsApp%20Image%202025-09-21%20at%2022.46.53_41d88ca8.jpg)

<video src="output/WhatsApp%20Video%202025-09-21%20at%2017.29.37_18e107f2.mp4" controls width="100%" preload="metadata">
  Your browser does not support the video tag.
</video>

## Importance

- Reduces contract review cycles from hours to minutes with AI-backed confidence.
- De-risks deals by exposing counterparty behavior before commitments.
- Democratizes legal literacy for SMBs and individuals with plain-language insights.
- Supports compliance teams with auditable, explainable recommendations.

## Environment Variables

Create environment files from templates and populate API keys:

```
cp frontend/env.template frontend/.env
cp backend/env_template.txt backend/.env
```

Set Gemini, Whisper, Supabase, and Pinecone credentials before running services.

## Deployment Notes

- Frontend: `npm run build` followed by Vercel deployment.
- Backend: Containerize Flask app or use Render Blueprint; ensure background workers for long-running scans.
- Configure Supabase policies for secure document access and history.

## Roadmap

- Deeper compliance playbooks by sector.
- Advanced negotiation assistant with clause rewrite suggestions.
- Expanded ledger analytics with crowdsourced contract outcomes.

## License

Proprietary. All rights reserved.