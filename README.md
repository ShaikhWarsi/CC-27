# Fish-Pish: Agent-Grade Phishing Detection Ecosystem

Fish-Pish is a full-stack cybersecurity tool designed to analyze links in real-time. It consists of a high-performance Python FastAPI backend and a premium Chrome Extension.

## Features
- **Waterfall Logic**: 
  - **Phase A**: Instant blacklist checking via Google Safe Browsing and PhishTank.
  - **Phase B**: Multi-model AI analysis (Semantic Search, LLM Intent, NLP Logic).
- **Premium UI**: Glassmorphism floating popup with real-time risk gauge.
- **Privacy-First**: No API keys exposed in the frontend. All intelligence processing happens on the backend.

## Structure
- `backend/`: Python FastAPI app.
- `extension/`: Chrome Extension (Manifest V3).

## Setup Instructions

### 1. Backend Setup
1. Open a terminal in the `backend/` directory.
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   - Rename `.env.example` to `.env`.
   - Add your `GOOGLE_SAFE_BROWSING_API_KEY`, `GEMINI_API_KEY`, and `PHISHTANK_API_KEY`.
5. Run the server:
   ```bash
   python main.py
   ```

### 2. Chrome Extension Setup
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `extension/` folder in this project.

## How to Use
- Hover over any link on any website for **600ms**.
- A floating popup will appear showing the safety status and risk score.
- Expand "Technical Analysis" to see individual engine scores.

## Technologies Used
- **Backend**: FastAPI, Sentence-Transformers, spaCy, Google Generative AI (Gemini).
- **Extension**: Vanilla JS/CSS (Manifest V3).
