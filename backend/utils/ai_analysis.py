import os
import re
import json
from urllib.parse import urlparse
from sentence_transformers import SentenceTransformer, util
from groq import Groq
from typing import Dict, Optional
import aiohttp
from PIL import Image
import imagehash
import io
import tldextract

# Initialize models
st_model = SentenceTransformer('all-MiniLM-L6-v2')

# Load golden list
GOLDEN_LIST_PATH = os.path.join(os.path.dirname(__file__), '..', 'golden_list.json')
with open(GOLDEN_LIST_PATH, 'r') as f:
    GOLDEN_LIST = json.load(f)

# Configure Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

async def semantic_search_check(url: str, anchor_text: str) -> int:
    """Compare anchor text and domain against golden list."""
    domain = urlparse(url).netloc.lower()
    
    # Check if domain itself is in golden list (true positive)
    is_legit_domain = any(item['d'] in domain for item in GOLDEN_LIST)
    
    # Encode anchor text and golden brands
    brand_names = [item['b'] for item in GOLDEN_LIST]
    anchor_embedding = st_model.encode(anchor_text, convert_to_tensor=True)
    brand_embeddings = st_model.encode(brand_names, convert_to_tensor=True)
    
    # Compute cosine similarity
    similarities = util.cos_sim(anchor_embedding, brand_embeddings)[0]
    max_sim_idx = similarities.argmax()
    max_sim_score = similarities[max_sim_idx].item()
    
    matched_brand = GOLDEN_LIST[max_sim_idx]
    
    # If anchor text is very similar to a brand but the domain is NOT that brand's domain
    if max_sim_score > 0.8 and matched_brand['d'] not in domain:
        return int(max_sim_score * 100)
    
    return 0

async def get_favicon_hash(url: str) -> Optional[str]:
    """Fetch and hash the favicon of a URL."""
    parsed = urlparse(url)
    favicon_url = f"{parsed.scheme}://{parsed.netloc}/favicon.ico"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(favicon_url, timeout=3) as response:
                if response.status == 200:
                    img_data = await response.read()
                    img = Image.open(io.BytesIO(img_data))
                    return str(imagehash.average_hash(img))
    except Exception as e:
        # Fallback to checking <link rel="icon"> would be better but complex for now
        pass
    return None

import asyncio

async def favicon_check(url: str, session: aiohttp.ClientSession) -> int:
    """Check if favicon matches a high-value brand but domain doesn't."""
    current_hash = None
    parsed = urlparse(url)
    favicon_url = f"{parsed.scheme}://{parsed.netloc}/favicon.ico"
    
    try:
        async with session.get(favicon_url, timeout=3) as response:
            if response.status == 200:
                img_data = await response.read()
                img = Image.open(io.BytesIO(img_data))
                current_hash = str(imagehash.average_hash(img))
    except:
        return 0
        
    if not current_hash:
        return 0
        
    ext = tldextract.extract(url)
    current_domain = f"{ext.domain}.{ext.suffix}"
    
    # Known brand hashes (expanded based on golden list logic)
    known_hashes = {
        "1f1f1f1f1f1f1f1f": "google.com",
        "0000ffffffff0000": "facebook.com",
        "a5a5a5a5a5a5a5a5": "paypal.com",
        "3f3f3f3f3f3f3f3f": "microsoft.com",
        "0101010101010101": "apple.com"
    }
    
    for khash, kdomain in known_hashes.items():
        dist = imagehash.hex_to_hash(current_hash) - imagehash.hex_to_hash(khash)
        if dist < 5 and kdomain not in current_domain:
            return 90
            
    return 0

async def nlp_logic_engine(url: str, anchor_text: str) -> int:
    """Enhanced rule-based checks for phishing indicators."""
    score = 0
    text_lower = anchor_text.lower()
    
    # 1. Linguistic Urgency & Threat
    urgency_patterns = [
        "account suspended", "act now", "urgent", "security alert", 
        "verify your account", "immediately", "last chance", "unauthorized login",
        "click here to unlock", "action required", "billing issue"
    ]
    if any(p in text_lower for p in urgency_patterns):
        score += 35
        
    # 2. Deceptive URL in Anchor Text
    # e.g. <a href="evil.com">paypal.com/security</a>
    url_pattern = r'([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}'
    matches = re.findall(url_pattern, text_lower)
    if matches:
        display_domain = matches[0][0] + matches[0][1] if isinstance(matches[0], tuple) else matches[0]
        actual_domain = urlparse(url).netloc.lower()
        if display_domain and display_domain not in actual_domain:
            score += 55
            
    # 3. Subdomain Deception
    # e.g. paypal.com.security-update.io
    parsed_url = urlparse(url).netloc.lower()
    for item in GOLDEN_LIST:
        brand_domain = item['d']
        if brand_domain in parsed_url and not parsed_url.endswith(brand_domain):
            score += 45
            break

    # 4. TLD Reputation
    high_risk_tlds = [".zip", ".click", ".top", ".work", ".link", ".xyz", ".bid", ".casa", ".monster", ".icu"]
    if any(url.lower().endswith(tld) for tld in high_risk_tlds):
        score += 25
        
    return min(score, 100)

async def run_ai_analysis(url: str, anchor_text: str) -> Dict:
    """Execute all AI/NLP layers in parallel."""
    async with aiohttp.ClientSession() as session:
        # Define tasks for parallel execution
        tasks = [
            semantic_search_check(url, anchor_text),
            llm_intent_check(url, anchor_text),
            nlp_logic_engine(url, anchor_text),
            favicon_check(url, session)
        ]
        
        # Run all simultaneously
        results = await asyncio.gather(*tasks)
        
        semantic_score = results[0]
        llm_result = results[1]
        nlp_score = results[2]
        favicon_score = results[3]
        
        llm_score = llm_result.get("score", 0)
        
        # Weighted score: LLM intent is weighted most, followed by NLP rules and Semantic mismatch
        overall_score = int(
            (semantic_score * 0.25) + 
            (llm_score * 0.35) + 
            (nlp_score * 0.25) + 
            (favicon_score * 0.15)
        )
        
        return {
            "semantic_score": semantic_score,
            "llm_score": llm_score,
            "llm_intent": llm_result.get("intent", "Unknown"),
            "llm_explanation": llm_result.get("explanation", "N/A"),
            "nlp_score": nlp_score,
            "favicon_score": favicon_score,
            "overall_score": min(overall_score, 100)
        }

