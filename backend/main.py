import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from utils.blacklist import get_blacklist_status
from utils.ai_analysis import run_ai_analysis
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Fish-Pish Backend")

# Allow CORS for the extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str
    anchor_text: str

@app.get("/")
async def root():
    return {"message": "Fish-Pish API is online"}

@app.post("/analyze")
async def analyze_url(request: AnalyzeRequest):
    url = request.url
    anchor_text = request.anchor_text
    
    # Phase A: Blacklist Layer (includes Whitelist)
    blacklist_res = await get_blacklist_status(url)
    if blacklist_res["status"] == "WHITELISTED":
        return {
            "overall_score": 0,
            "status": "SAFE",
            "details": {
                "blacklist": blacklist_res,
                "ai_scores": {"semantic_score": 0, "llm_score": 0, "nlp_score": 0, "favicon_score": 0},
                "intent": "WHITELISTED",
                "explanation": "This domain is on the trusted whitelist."
            }
        }
    
    # Phase B: AI Analysis Layer
    ai_results = await run_ai_analysis(url, anchor_text)
    
    # If explicitly blacklisted, override overall score but keep AI details
    if blacklist_res["is_malicious"]:
        overall_score = 100
        status = "VERIFIED_PHISH"
    else:
        overall_score = ai_results["overall_score"]
        if overall_score >= 70:
            status = "DANGER"
        elif overall_score >= 40:
            status = "SUSPICIOUS"
        else:
            status = "SAFE"
            
    return {
        "overall_score": overall_score,
        "status": status,
        "details": {
            "blacklist": blacklist_res,
            "ai_results": ai_results,
            "intent": ai_results.get("llm_intent"),
            "explanation": ai_results.get("llm_explanation")
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
