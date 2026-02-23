import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from utils.blacklist import get_blacklist_status
from utils.ai_analysis import run_ai_analysis, run_email_analysis
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
    anchor_text: str = ""
    context: str = "No context provided"
    page_content: str = "" # Email body or page text
    dom: str = "" # Full DOM structure
    screenshot: str = "" # Base64 encoded screenshot
    dom_offsets: dict = {} # Optional visual coordinates

class EmailAnalyzeRequest(BaseModel):
    raw_headers: str
    body: str

class SandboxRequest(BaseModel):
    url: str

@app.post("/sandbox")
async def sandbox_preview(request: SandboxRequest):
    """
    Fetches the URL content safely on the server side (no client execution).
    Returns the HTML, headers, and a 'safe' preview flag.
    """
    import requests
    try:
        # User-Agent to mimic a real browser to avoid instant blocks
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # Disable SSL verification for sandbox to allow visiting shady sites
        response = requests.get(request.url, headers=headers, timeout=5, verify=False)
        
        return {
            "status": "success",
            "code": response.status_code,
            "headers": dict(response.headers),
            "content": response.text[:100000], # Limit size for safety
            "preview_url": f"https://image.thum.io/get/width/1200/crop/800/{request.url}" # Free screenshot API for demo
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

class ChatRequest(BaseModel):
    message: str
    context_data: dict # The previous analysis results

@app.post("/chat")
async def chat_with_sentinel(request: ChatRequest):
    print(f"DEBUG: Received Chat Request: {request.message}") # Debug Log
    try:
        from utils.ai_analysis import get_llm_client
        client = get_llm_client()
        
        # Construct system prompt with context
        analysis_context = request.context_data
        system_prompt = f"""You are Sentinel, an elite cybersecurity analyst AI residing in the user's browser.
        
        CURRENT THREAT CONTEXT:
        URL: {analysis_context.get('url', 'Unknown')}
        Verdict: {analysis_context.get('status', 'Unknown')}
        Risk Score: {analysis_context.get('overall_score', 0)}/100
        Explanation: {analysis_context.get('details', {}).get('explanation', 'None')}
        Detected Threats: {analysis_context.get('details', {}).get('reasons', [])}
        
        USER QUESTION: "{request.message}"
        
        INSTRUCTIONS:
        1.  **Be Specific:** Don't just say "it's phishing". Use the data provided. 
            - If reasons include "Homograph Attack", explain: "The URL uses a fake Cyrillic 'a' to look like 'PayPal'."
            - If reasons include "Visual Spoof", explain: "The logo matches Google, but the URL is `g.150160.xyz`."
        2.  **Educational Tone:** Teach the user *why* it's bad.
        3.  **Concise but Detailed:** Keep it under 4 sentences, but pack them with the *specific evidence* found in the context.
        4.  **No Generic Fluff:** Avoid "It is important to stay safe..." boilerplate. Get straight to the threat.
        """
        
        groq_models = [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192", # Legacy fallback if still active for some keys
            "mixtral-8x7b-32768"
        ]

        completion = None
        last_error = None

        for model in groq_models:
            try:
                print(f"DEBUG: Trying model {model}...")
                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.message}
                    ],
                    temperature=0.7,
                    max_tokens=150
                )
                print(f"DEBUG: Success with model {model}")
                break # Success!
            except Exception as e:
                print(f"DEBUG: Model {model} failed: {e}")
                last_error = e
                continue # Try next model

        if not completion:
             raise last_error or Exception("All models failed")
        
        response_text = completion.choices[0].message.content
        return {"response": response_text}
        
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": f"I'm having trouble connecting to the Sentinel Brain right now. Error: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "Fish-Pish Backend: Sentinel Layer Active"}

@app.post("/analyze")
async def analyze_url(request: AnalyzeRequest):
    try:
        url = request.url
        anchor_text = request.anchor_text
        context = request.context
        page_content = request.page_content
        dom = request.dom
        screenshot = request.screenshot
        
        # Phase A: Blacklist Layer (includes Whitelist)
        blacklist_res = await get_blacklist_status(url)
        if isinstance(blacklist_res, dict) and blacklist_res.get("status") == "WHITELISTED":
            return {
                "overall_score": 0,
                "status": "SAFE",
                "details": {
                    "blacklist": blacklist_res,
                    "ai_results": {"risk_narrative": [], "reasons": []},
                    "intent": "WHITELISTED",
                    "explanation": "This domain is on the trusted whitelist."
                }
            }
        
        # Phase B: AI Analysis Layer (Sentinel Brain)
        ai_results = await run_ai_analysis(url, anchor_text, context, page_content, dom, screenshot)
        
        # If explicitly blacklisted, override overall score but keep AI details
        if blacklist_res["is_malicious"]:
            overall_score = 100
            status = "VERIFIED_PHISH"
            explanation = "This domain is known to be malicious."
        else:
            overall_score = ai_results["overall_score"]
            status = ai_results["verdict"] # Use the AI's calculated verdict
            explanation = ai_results.get("llm_explanation", "Analysis complete.")
                
        return {
            "overall_score": overall_score,
            "status": status,
            "details": {
                "blacklist": blacklist_res,
                "ai_results": ai_results, # Contains risk_narrative
                "explanation": explanation
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "overall_score": 0,
            "status": "ERROR",
            "details": {
                "error": str(e),
                "explanation": "An internal error occurred during analysis."
            }
        }

@app.post("/analyze/email")
async def analyze_email(request: EmailAnalyzeRequest):
    try:
        results = await run_email_analysis(request.raw_headers, request.body)
        return {
            "overall_score": results["overall_score"],
            "status": results["verdict"],
            "details": {
                "ai_results": results,
                "explanation": "Email analysis complete."
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "overall_score": 0,
            "status": "ERROR",
            "details": {
                "error": str(e),
                "explanation": "An internal error occurred during analysis."
            }
        }

@app.post("/analyze/email")
async def analyze_email(request: EmailAnalyzeRequest):
    try:
        results = await run_email_analysis(request.raw_headers, request.body)
        return {
            "overall_score": results["overall_score"],
            "status": results["verdict"],
            "details": {
                "ai_results": results,
                "explanation": "Email analysis complete."
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "overall_score": 0,
            "status": "ERROR",
            "details": {
                "error": str(e),
                "explanation": "An internal error occurred during email analysis."
            }
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)