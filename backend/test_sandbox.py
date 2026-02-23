import requests

def test_sandbox():
    url = "http://localhost:8000/sandbox"
    payload = {"url": "https://www.example.com"}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("Sandbox Endpoint: Success")
            data = response.json()
            print(f"Status: {data.get('status')}")
            if data.get('status') == 'error':
                print(f"Error Message: {data.get('message')}")
            print(f"Content Length: {len(data.get('content', ''))}")
            print(f"Preview URL: {data.get('preview_url')}")
        else:
            print(f"Sandbox Endpoint: Failed with {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Sandbox Endpoint: Error - {e}")

if __name__ == "__main__":
    test_sandbox()