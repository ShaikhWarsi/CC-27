import os
import json
import logging
import aiohttp
import tldextract
from typing import Tuple, List, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for OpenPhish and Whitelist
_OPENPHISH_CACHE = set()
_TOP_DOMAINS_CACHE = set()

# Load Whitelist from top_domains.json
TOP_DOMAINS_PATH = os.path.join(os.path.dirname(__file__), '..', 'top_domains.json')
try:
    with open(TOP_DOMAINS_PATH, 'r') as f:
        domains_data = json.load(f)
        _TOP_DOMAINS_CACHE = {item['domain'] for item in domains_data}
except Exception as e:
    logger.error(f"Error loading top domains: {e}")

async def check_whitelist(url: str) -> bool:
    """Check if the domain is in the top 1k/trusted domains list."""
    try:
        # Use no_fetch=True to prevent file locking issues during extraction
        # We manually construct a TLDExtract object that doesn't try to fetch
        no_fetch_extract = tldextract.TLDExtract(suffix_list_urls=())
        ext = no_fetch_extract(url)
        domain = f"{ext.domain}.{ext.suffix}"
        return domain in _TOP_DOMAINS_CACHE
    except Exception as e:
        logger.error(f"TLD Extract error: {e}")
        # Fallback for localhost or simple extraction if tldextract fails
        try:
            from urllib.parse import urlparse
            netloc = urlparse(url).netloc
            parts = netloc.split('.')
            if len(parts) >= 2:
                domain = f"{parts[-2]}.{parts[-1]}"
                return domain in _TOP_DOMAINS_CACHE
        except:
            pass
        return False

import asyncio

async def check_google_safe_browsing(url: str, session: aiohttp.ClientSession) -> bool:
    api_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
    if not api_key or api_key == "your_google_safe_browsing_api_key":
        return False
    
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
    payload = {
        "client": {"clientId": "fish-pish", "clientVersion": "1.0.0"},
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }
    
    try:
        async with session.post(endpoint, json=payload, timeout=3) as response:
            if response.status == 200:
                data = await response.json()
                return "matches" in data
    except Exception as e:
        logger.error(f"Google Safe Browsing error: {e}")
    return False

async def check_phishtank(url: str, session: aiohttp.ClientSession) -> bool:
    api_key = os.getenv("PHISHTANK_API_KEY")
    endpoint = "https://checkurl.phishtank.com/checkurl/"
    payload = {"url": url, "format": "json"}
    if api_key:
        payload["apikey"] = api_key
        
    try:
        async with session.post(endpoint, data=payload, timeout=3) as response:
            if response.status == 200:
                data = await response.json()
                if "results" in data and data["results"].get("in_database"):
                    return data["results"].get("valid")
    except Exception as e:
        logger.error(f"PhishTank error: {e}")
    return False

async def check_urlhaus(url: str, session: aiohttp.ClientSession) -> bool:
    """Check against URLhaus API."""
    endpoint = "https://urlhaus-api.abuse.ch/v1/url/"
    payload = {"url": url}
    try:
        async with session.post(endpoint, data=payload, timeout=3, ssl=False) as response:
            if response.status == 200:
                data = await response.json()
                return data.get("query_status") == "ok" and data.get("url_status") == "online"
    except Exception as e:
        logger.error(f"URLhaus error: {e}")
    return False

async def check_openphish(url: str, session: aiohttp.ClientSession) -> bool:
    """Check against OpenPhish community feed."""
    global _OPENPHISH_CACHE
    if not _OPENPHISH_CACHE:
        try:
            async with session.get("https://openphish.com/feed.txt", timeout=5, ssl=False) as response:
                if response.status == 200:
                    content = await response.text()
                    _OPENPHISH_CACHE = set(content.splitlines())
        except Exception as e:
            logger.error(f"OpenPhish feed error: {e}")
            return False
    
    return url in _OPENPHISH_CACHE

async def get_blacklist_status(url: str) -> Dict:
    """Aggregate results from all blacklist services in parallel."""
    if await check_whitelist(url):
        return {
            "is_malicious": False,
            "status": "WHITELISTED",
            "score": 0,
            "services": {"whitelist": True}
        }

    async with aiohttp.ClientSession() as session:
        # Run all checks in parallel
        tasks = [
            check_google_safe_browsing(url, session),
            check_phishtank(url, session),
            check_urlhaus(url, session),
            check_openphish(url, session)
        ]
        
        results_list = await asyncio.gather(*tasks)
        
        results = {
            "google_safe_browsing": results_list[0],
            "phishtank": results_list[1],
            "urlhaus": results_list[2],
            "openphish": results_list[3]
        }

    is_malicious = any(results.values())
    status = "VERIFIED_PHISH" if is_malicious else "CLEAN"
    score = 100 if is_malicious else 0

    return {
        "is_malicious": is_malicious,
        "status": status,
        "score": score,
        "services": results
    }

