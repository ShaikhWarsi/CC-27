import requests
import json

BASE_URL = "http://localhost:8000"

def test_url_analysis():
    print("\n--- Testing URL Analysis Endpoint ---")
    payload = {
        "url": "http://microsoft-login-update.com",
        "anchor_text": "Click here to update your password",
        "screenshot": "" # Optional, add base64 if needed for VLM test
    }
    try:
        response = requests.post(f"{BASE_URL}/analyze", json=payload)
        if response.status_code == 200:
            print("Success!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

def test_email_analysis():
    print("\n--- Testing Email Analysis Endpoint ---")
    raw_headers = """From: Security Team <security@paypal-verify.com>
Return-Path: <admin@hacker-server.net>
Received: from hacker-server.net (hacker-server.net [1.2.3.4])
Subject: Urgent Account Suspension"""
    
    body = """Dear User,
    Your account has been suspended due to suspicious activity.
    Please verify your identity immediately within 24 hours to avoid permanent deletion.
    Click here: http://paypal-verify.com/login
    """
    
    payload = {
        "raw_headers": raw_headers,
        "body": body
    }
    
    try:
        response = requests.post(f"{BASE_URL}/analyze/email", json=payload)
        if response.status_code == 200:
            print("Success!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_url_analysis()
    test_email_analysis()