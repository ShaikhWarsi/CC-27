import os
import json
import re
from urllib.parse import urlparse
from sentence_transformers import SentenceTransformer, util
from groq import Groq
from typing import Dict, Optional, List, Any
import aiohttp
from PIL import Image
import imagehash
import io
import tldextract
import asyncio
from dotenv import load_dotenv
from utils.forensics import get_domain_age, check_dns_records, analyze_headers, check_homoglyphs, check_threat_intel

# Load env immediately
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize models
st_model = SentenceTransformer('all-MiniLM-L6-v2')

# Load golden list
GOLDEN_LIST_PATH = os.path.join(os.path.dirname(__file__), '..', 'golden_list.json')
try:
    with open(GOLDEN_LIST_PATH, 'r') as f:
        GOLDEN_LIST = json.load(f)
except:
    GOLDEN_LIST = []

# Configure Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

def get_llm_client():
    return client

# Layer 3: Urgency Detection Keywords
URGENCY_KEYWORDS = [
    "immediately", "urgent", "24 hours", "suspended", "verify", "unauthorized",
    "locked", "breach", "password", "expire", "action required", "limit", "wallet",
    "terminate", "deactivate", "compliance"
]

async def check_urgency(text: str) -> dict:
    """Layer 3: Check for social engineering triggers in text."""
    text_lower = text.lower()
    triggers = [kw for kw in URGENCY_KEYWORDS if kw in text_lower]
    score = len(triggers) * 20  # 20 points per trigger
    return {
        "score": min(score, 100),
        "triggers": triggers,
        "is_urgent": len(triggers) > 0
    }

async def semantic_search_check(url: str, anchor_text: str) -> int:
    """Layer 1: Compare anchor text and domain against golden list."""
    domain = urlparse(url).netloc.lower()
    
    # Check if domain itself is in golden list (true positive)
    is_legit_domain = any(item['d'] in domain for item in GOLDEN_LIST)
    if is_legit_domain:
        return 0
    
    # Encode anchor text and golden brands
    brand_names = [item['b'] for item in GOLDEN_LIST]
    if not brand_names:
        return 0
        
    anchor_embedding = st_model.encode(anchor_text, convert_to_tensor=True)
    brand_embeddings = st_model.encode(brand_names, convert_to_tensor=True)
    
    # Compute cosine similarity
    similarities = util.cos_sim(anchor_embedding, brand_embeddings)[0]
    max_sim_idx = similarities.argmax()
    max_sim_score = similarities[max_sim_idx].item()
    
    matched_brand = GOLDEN_LIST[max_sim_idx]
    
    # If anchor text is very similar to a brand but the domain is NOT that brand's domain
    if max_sim_score > 0.7 and matched_brand['d'] not in domain:
        return int(max_sim_score * 100)
    
    return 0

async def favicon_check(url: str, session: aiohttp.ClientSession) -> int:
    """Layer 2: Visual Doppelganger Detection (Favicon Hash vs Domain)."""
    current_hash = None
    parsed = urlparse(url)
    favicon_url = f"{parsed.scheme}://{parsed.netloc}/favicon.ico"
    
    try:
        async with session.get(favicon_url, timeout=2) as response:
            if response.status == 200:
                img_data = await response.read()
                img = Image.open(io.BytesIO(img_data))
                current_hash = str(imagehash.average_hash(img))
    except:
        return 0
        
    if not current_hash:
        return 0
        
    try:
        ext = tldextract.extract(url)
        current_domain = f"{ext.domain}.{ext.suffix}"
    except:
        return 0
    
    # Known brand hashes (Simulated for this hackathon context)
    known_hashes = {
        "1f1f1f1f1f1f1f1f": "google.com",
        "0000ffffffff0000": "facebook.com",
        "a5a5a5a5a5a5a5a5": "paypal.com", 
        "3f3f3f3f3f3f3f3f": "microsoft.com",
        "0101010101010101": "apple.com"
    }
    
    for khash, kdomain in known_hashes.items():
        try:
            dist = imagehash.hex_to_hash(current_hash) - imagehash.hex_to_hash(khash)
            if dist < 5 and kdomain not in current_domain:
                return 90 # High confidence visual doppelganger
        except:
            continue
            
    return 0

def extract_json_from_llm(text: str) -> Dict[str, Any]:
    """Extract JSON object from LLM response text."""
    try:
        # Find JSON between ```json and ``` or just braces
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {}
    except:
        return {}

async def run_email_analysis(raw_headers: str, body: str) -> Dict:
    """
    Analyzes raw email content for phishing indicators.
    """
    results = {
        "overall_score": 0,
        "verdict": "SAFE",
        "risk_narrative": [],
        "reasons": [],
        "psychological_triggers": []
    }
    
    risk_score = 0
    narrative = []
    reasons = []

    # 1. Header Forensics
    header_analysis = analyze_headers(raw_headers)
    results['header_details'] = header_analysis.get('details', {}) # Pass full details (including Received chain) to frontend
    
    if header_analysis['verdict'] == "SUSPICIOUS":
        risk_score += 40
        for flag in header_analysis['flags']:
            narrative.append(f"Header Issue: {flag}")
            reasons.append({"type": "HEADER_FORENSICS", "detail": flag, "severity": "HIGH"})
    
    # 2. Extract and check domains from headers
    from_email = header_analysis['details'].get('from')
    if from_email:
        domain = from_email.split('@')[-1]
        
        # Domain Age
        age_data = get_domain_age(domain)
        if age_data and 'age_days' in age_data:
            if age_data['age_days'] < 30:
                risk_score += 50
                msg = f"New Domain: Sender domain '{domain}' was registered only {age_data['age_days']} days ago."
                narrative.append(msg)
                reasons.append({"type": "DOMAIN_AGE", "detail": msg, "severity": "CRITICAL"})
        
        # DNS Records
        dns_records = check_dns_records(domain)
        if not dns_records['MX']:
            risk_score += 30
            msg = f"Invalid Sender: Domain '{domain}' has no MX records (cannot receive email)."
            narrative.append(msg)
            reasons.append({"type": "DNS_CHECK", "detail": msg, "severity": "HIGH"})

    # 3. Urgency Check (Regex Fallback)
    urgency = await check_urgency(body)
    if urgency["is_urgent"]:
        risk_score += 30
        msg = f"Urgency Detected: Email uses pressure tactics ({', '.join(urgency['triggers'])})."
        narrative.append(msg)
        reasons.append({"type": "URGENCY", "detail": msg, "severity": "MEDIUM"})
        # Always populate basic triggers first
        results['psychological_triggers'] = [{"text": t, "category": "Urgency", "explanation": "Keyword match"} for t in urgency['triggers']]

    # 4. Link Analysis in Body
    links = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', body)
    for link in links:
        # Check Homoglyphs
        homo_res = check_homoglyphs(link)
        if homo_res.get("suspicious"):
            risk_score += 40
            msg = f"Suspicious Link: {link} uses mixed scripts/punycode."
            narrative.append(msg)
            reasons.append({"type": "HOMOGRAPH_ATTACK", "detail": msg, "severity": "HIGH"})
        
        # Check Threat Intel
        ti_res = check_threat_intel(link)
        if ti_res.get("listed"):
            risk_score += 50
            msg = f"Malicious Link: {link} is blacklisted."
            narrative.append(msg)
            reasons.append({"type": "THREAT_INTEL", "detail": msg, "severity": "CRITICAL"})

    # 5. Psychological Heatmap (LLM)
    if client:
        try:
            system_prompt = """You are a Phishing Psychology Expert. Analyze the email body.
            Identify specific phrases that use:
            - Urgency (Red)
            - Authority (Orange)
            - Greed/Curiosity (Yellow)
            
            Output JSON:
            {
                "triggers": [
                    {"text": "phrase found", "category": "Urgency" | "Authority" | "Greed", "explanation": "why"}
                ],
                "intent_analysis": "One sentence summary of the psychological manipulation."
            }
            """
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Email Body:\n{body[:2000]}"}
                ],
                temperature=0.1
            )
            
            psy_data = extract_json_from_llm(completion.choices[0].message.content)
            if psy_data and psy_data.get('triggers'):
                results['psychological_triggers'] = psy_data.get('triggers', [])
                risk_score += 20
                if psy_data.get('intent_analysis'):
                    narrative.append(f"Psychology: {psy_data.get('intent_analysis')}")

            # Generate Auto-Draft Response (Standout Feature)
            # Check risk_score directly as verdict is not yet finalized
            if risk_score > 40: 
                draft_prompt = """You are a Cybersecurity Assistant.
                Write a polite but firm email reply to the sender of this phishing attempt.
                Do NOT engage with the scam. Instead, state that this email has been reported to the security team and the domain has been flagged.
                Keep it professional.
                """
                draft_completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": draft_prompt},
                        {"role": "user", "content": f"Phishing Email:\n{body[:500]}"}
                    ],
                    temperature=0.1
                )
                results['auto_draft_response'] = draft_completion.choices[0].message.content

        except Exception as e:
            print(f"Psychology LLM Error: {e}")

    # Final Scoring
    results['overall_score'] = min(risk_score, 100)
    if results['overall_score'] > 70:
        results['verdict'] = "MALICIOUS"
    elif results['overall_score'] > 40:
        results['verdict'] = "SUSPICIOUS"
    else:
        results['verdict'] = "SAFE"
        
    results['risk_narrative'] = narrative
    results['reasons'] = reasons
    return results

async def run_ai_analysis(url: str, anchor_text: str, context: str = "", page_content: str = "", dom: str = "", screenshot: str = "") -> Dict:
    """
    Sentinel Layer Analysis:
    1. Semantic Brand Matching
    2. Homograph Attack Detection
    3. Visual Doppelganger Check (Using VLM)
    4. Urgency Detection
    5. Contextual LLM Reasoning (Junior Security Analyst Persona)
    """
    results = {
        "overall_score": 0,
        "verdict": "SAFE",
        "risk_narrative": [],
        "reasons": [] # Structured reasons for the frontend
    }
    
    risk_score = 0
    narrative = []
    reasons = []
    
    async with aiohttp.ClientSession() as session:
        # Layer 1: Semantic
        semantic_score = await semantic_search_check(url, anchor_text)
        if semantic_score > 60:
            risk_score += 60 
            msg = f"Brand Impersonation: Link text mimics a known brand but URL is mismatched."
            narrative.append(msg)
            reasons.append({"type": "IMPERSONATION", "detail": msg, "severity": "HIGH"})
        
        # Layer 2.5: Homograph Check (Enhanced)
        homograph_res = check_homoglyphs(url)
        if homograph_res.get("suspicious"):
            risk_score += 90
            msg = f"Homograph Attack: URL uses mixed scripts (Latin/Cyrillic) or Punycode to deceive."
            narrative.append(msg)
            reasons.append({"type": "HOMOGRAPH_ATTACK", "detail": msg, "severity": "CRITICAL"})

        # Layer 2.6: Threat Intel (Mock/Real)
        ti_res = check_threat_intel(url)
        if ti_res.get("listed"):
             risk_score += 100
             msg = f"Threat Intelligence: URL is blacklisted by {ti_res.get('source')}."
             narrative.append(msg)
             reasons.append({"type": "THREAT_INTEL", "detail": msg, "severity": "CRITICAL"})

        # Layer 2.7: Domain Age
        domain = urlparse(url).netloc
        age_data = get_domain_age(domain)
        if age_data and 'age_days' in age_data:
            # Store creation date for frontend display if available
            results['domain_age'] = age_data
            if age_data['age_days'] < 7:
                 risk_score += 60
                 msg = f"New Domain: {domain} was registered only {age_data['age_days']} days ago."
                 narrative.append(msg)
                 reasons.append({"type": "DOMAIN_AGE", "detail": msg, "severity": "HIGH"})
            
        # Layer 2: Visual Doppelganger (VLM Upgrade)
        # Replaced imagehash with VLM if screenshot is available
        if screenshot and client:
            try:
                # Prepare VLM prompt
                vlm_system = "You are an expert Phishing Detection Vision AI. Analyze the screenshot."
                vlm_user = f"""
                Look at this screenshot of a website. 
                1. What major brand does this page visually look like? (e.g. Microsoft, PayPal, Google, LinkedIn).
                2. If it looks like a generic page, say "Generic".
                3. Does it contain a login form?
                
                URL: {url}
                
                Output JSON: {{ "brand_visual_match": "BrandName" or "None", "has_login": boolean, "confidence": int (0-100) }}
                """
                
                # Check if it's a data URL
                image_url = screenshot
                
                completion = client.chat.completions.create(
                    model="llama-3.2-11b-vision-preview",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": vlm_user},
                                {"type": "image_url", "image_url": {"url": image_url}}
                            ]
                        }
                    ],
                    temperature=0.1,
                    max_tokens=300
                )
                
                vlm_response = completion.choices[0].message.content
                vlm_data = extract_json_from_llm(vlm_response)
                
                if vlm_data:
                    visual_brand = vlm_data.get("brand_visual_match", "None")
                    has_login = vlm_data.get("has_login", False)
                    
                    if visual_brand != "None" and visual_brand.lower() != "generic":
                        # Check if the URL actually matches the detected visual brand
                        # Simple heuristic: is the brand name in the domain?
                        domain = urlparse(url).netloc.lower()
                        # Allow fuzzy matching or specific brand domains (e.g. microsoft.com, login.microsoftonline.com)
                        is_safe_domain = False
                        
                        # Check against Golden List for authorized domains for this brand
                        for item in GOLDEN_LIST:
                            if item['b'].lower() == visual_brand.lower():
                                if item['d'] in domain:
                                    is_safe_domain = True
                                    break
                        
                        # Fallback simple check
                        if visual_brand.lower() in domain:
                            is_safe_domain = True
                            
                        if not is_safe_domain:
                            risk_score += 85
                            msg = f"Visual Deception: Page looks like {visual_brand} but URL is {domain}."
                            narrative.append(msg)
                            reasons.append({"type": "VISUAL_SPOOF", "detail": msg, "severity": "CRITICAL"})
                    
                    if has_login and "login" not in urlparse(url).path and "signin" not in urlparse(url).path:
                         # Minor signal: Login form on non-standard path
                         pass
                         
            except Exception as e:
                print(f"VLM Error: {e}")
                # Fallback to favicon check if VLM fails
                vis_score = await favicon_check(url, session)
                if vis_score > 80:
                    risk_score += 60 
                    msg = "Visual Doppelganger: Site icon matches a major brand, but domain is different."
                    narrative.append(msg)
                    reasons.append({"type": "VISUAL_SPOOF", "detail": msg, "severity": "CRITICAL"})
        else:
             # Fallback if no screenshot
            vis_score = await favicon_check(url, session)
            if vis_score > 80:
                risk_score += 60 
                msg = "Visual Doppelganger: Site icon matches a major brand, but domain is different."
                narrative.append(msg)
                reasons.append({"type": "VISUAL_SPOOF", "detail": msg, "severity": "CRITICAL"})
            
        # Layer 3: Urgency
        full_context = f"{anchor_text} {context} {page_content[:500]}"
        urgency = await check_urgency(full_context)
        if urgency["is_urgent"]:
            risk_score += 45 
            msg = f"Social Engineering: Urgency triggers detected ({', '.join(urgency['triggers'])})."
            narrative.append(msg)
            reasons.append({"type": "URGENCY", "detail": msg, "severity": "MEDIUM"})
            
        # Domain Heuristics
        parsed = urlparse(url)
        if parsed.netloc.replace('.', '').isdigit():
            risk_score += 80
            msg = "Suspicious: URL is a raw IP address."
            narrative.append(msg)
            reasons.append({"type": "IP_ADDRESS", "detail": msg, "severity": "HIGH"})
        
        # Calculate Preliminary Verdict
        risk_score = min(risk_score, 100)
        
        # Layer 4: LLM Contextual Reasoning (The "Brain")
        # Run if we have context OR if it's borderline suspicious
        if client and (len(context) > 5 or len(page_content) > 5 or risk_score > 20):
            try:
                system_prompt = """You are LinkDetective Sentinel, an elite cybersecurity analyst AI.
                Analyze the provided Phishing Artifacts.
                
                Your Goal: Detect semantic mismatches, credential harvesting intent, and social engineering.
                
                Key Analysis Rules:
                1. Mismatch: Does the anchor text (e.g., "Login to PayPal") match the destination domain?
                2. Urgency: Is the language threatening or imposing a deadline?
                3. Brand Spoofing: Is a known brand name used in a suspicious way?
                4. Structure: Look at the DOM snippets (forms, hidden inputs).
                
                Output Format: JSON ONLY.
                {
                    "risk_score_adjustment": int (-10 to +50),
                    "analysis": "1 sentence punchy summary",
                    "explanation": "Start with 'Suspicious because: ...' then list 2-3 specific reasons.",
                    "intent": "Credential Harvesting" | "Malware" | "Social Engineering" | "Unknown",
                    "suspicious_elements": ["CSS selector or description of element to highlight"],
                    "verdict": "SAFE" | "SUSPICIOUS" | "MALICIOUS"
                }
                """
                
                user_prompt = f"""
                Analyze this potential phishing attempt:
                URL: {url}
                Anchor Text: "{anchor_text}"
                Surrounding Context: "{context[:200]}"
                Page Content Snippet: "{page_content[:300]}"
                DOM Snippet (Forms): "{dom[:1000]}"
                Current Heuristic Risk Score: {risk_score}/100
                """
                
                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.1,
                    max_tokens=350
                )
                
                llm_response = completion.choices[0].message.content
                ai_data = extract_json_from_llm(llm_response)
                
                if ai_data:
                    adjustment = ai_data.get("risk_score_adjustment", 0)
                    risk_score += adjustment
                    
                    if ai_data.get("analysis"):
                        narrative.append(f"AI Analyst: {ai_data['analysis']}")
                        
                    if ai_data.get("explanation"):
                         reasons.append({"type": "AI_REASONING", "detail": ai_data['explanation'], "severity": "HIGH"})
                    
                    if ai_data.get("intent"):
                        reasons.append({"type": "INTENT", "detail": f"Detected Intent: {ai_data['intent']}", "severity": "MEDIUM"})
                        
                    if ai_data.get("suspicious_elements"):
                        # Pass these back to frontend for "Red Pen"
                        reasons.append({"type": "RED_PEN_TARGETS", "detail": ai_data['suspicious_elements'], "severity": "INFO"})

            except Exception as e:
                print(f"LLM Error: {e}")
                pass
                
        # Final Score Cap
        risk_score = min(max(risk_score, 0), 100)
        
        # Final Verdict Logic
        if risk_score > 75:
            verdict = "MALICIOUS"
        elif risk_score > 45:
            verdict = "SUSPICIOUS"
        else:
            verdict = "SAFE"
            
        return {
            "overall_score": risk_score,
            "verdict": verdict,
            "risk_narrative": narrative,
            "reasons": reasons
        }
