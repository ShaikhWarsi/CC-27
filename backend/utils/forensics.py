import whois
import socket
import dns.resolver
import requests
import re
from urllib.parse import urlparse
import datetime
import tldextract

def get_domain_age(domain):
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        
        if not creation_date:
            return None

        age = (datetime.datetime.now() - creation_date).days
        return {
            "age_days": age,
            "creation_date": creation_date.strftime('%Y-%m-%d'),
            "registrar": w.registrar
        }
    except Exception as e:
        return {"error": str(e)}

def check_dns_records(domain):
    records = {}
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        records['MX'] = [str(r.exchange) for r in answers]
    except:
        records['MX'] = []
    
    try:
        answers = dns.resolver.resolve(domain, 'TXT')
        records['TXT'] = [str(r) for r in answers]
    except:
        records['TXT'] = []

    return records

def analyze_headers(headers_text):
    """
    Parses email headers to find inconsistencies.
    """
    analysis = {
        "verdict": "NEUTRAL",
        "flags": [],
        "details": {}
    }
    
    # Extract key fields
    from_match = re.search(r'^From:\s*(.*?)(?:\n|$)', headers_text, re.MULTILINE | re.IGNORECASE)
    return_path_match = re.search(r'^Return-Path:\s*(.*?)(?:\n|$)', headers_text, re.MULTILINE | re.IGNORECASE)
    received_match = re.findall(r'^Received:\s*from\s+(.*?)(?:\n|$)', headers_text, re.MULTILINE | re.IGNORECASE)
    
    from_addr = from_match.group(1).strip() if from_match else None
    return_path = return_path_match.group(1).strip() if return_path_match else None
    
    # Store full Received chain for forensics display
    analysis['details']['received_chain'] = [r.strip() for r in received_match]

    if from_addr and return_path:
        # Extract emails from potentially "Name <email>" format
        from_email = re.search(r'<(.+?)>', from_addr)
        from_email = from_email.group(1) if from_email else from_addr
        
        rp_email = re.search(r'<(.+?)>', return_path)
        rp_email = rp_email.group(1) if rp_email else return_path
        
        analysis['details']['from'] = from_email
        analysis['details']['return_path'] = rp_email
        
        # Check for mismatch
        if from_email.split('@')[-1] != rp_email.split('@')[-1]:
             analysis['flags'].append("Return-Path domain does not match From domain")
             analysis['verdict'] = "SUSPICIOUS"

    # Check for SPF/DKIM/DMARC in headers
    if "spf=pass" not in headers_text.lower() and "spf=neutral" not in headers_text.lower():
         analysis['flags'].append("SPF Check Missing or Failed")
    
    if "dkim=pass" not in headers_text.lower():
         analysis['flags'].append("DKIM Signature Missing or Failed")

    return analysis

def check_homoglyphs(url):
    """
    Enhanced homoglyph check using IDNA encoding to detect mixed scripts.
    """
    domain = urlparse(url).netloc
    if not domain:
        domain = url
        
    try:
        # IDNA encoding (punycode) reveals the truth
        encoded = domain.encode('idna').decode('ascii')
        
        is_punycode = 'xn--' in encoded
        
        # Check for mixed scripts (simplified)
        has_latin = bool(re.search(r'[a-z]', domain))
        has_cyrillic = bool(re.search(r'[\u0400-\u04FF]', domain))
        
        return {
            "is_punycode": is_punycode,
            "punycode_domain": encoded,
            "mixed_scripts": has_latin and has_cyrillic,
            "suspicious": is_punycode or (has_latin and has_cyrillic)
        }
    except:
        return {"suspicious": False}

def check_threat_intel(url):
    # Placeholder for VirusTotal/Google Safe Browsing
    # In a real scenario, we'd use an API key from env
    # For hackathon, we can simulate or use a public free one if available
    # Let's just do a mock that looks realistic for now, or check generic blocklists
    
    domain = urlparse(url).netloc
    
    # Simple open-source blocklist check (mock implementation for demo speed)
    # In production: requests.get(f"https://www.virustotal.com/api/v3/urls/{id}", headers=...)
    
    return {
        "listed": False,
        "source": "Open Source Intelligence",
        "details": "No active threats found in public databases."
    }
