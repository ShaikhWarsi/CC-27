import requests
import time
import sys

def wait_for_server(url, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            requests.get(url)
            print("Server is up!")
            return True
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    print("Server timed out.")
    return False

if __name__ == "__main__":
    if wait_for_server("http://localhost:8000"):
        sys.exit(0)
    else:
        sys.exit(1)