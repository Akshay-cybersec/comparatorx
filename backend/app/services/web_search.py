import os
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
CX = os.getenv("GOOGLE_CSE_CX")

SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


def search_web(query: str, num: int = 5):
    if not API_KEY or not CX:
        return {"items": [], "error": "missing_cse_key_or_cx"}

    params = {
        "key": API_KEY,
        "cx": CX,
        "q": query,
        "num": num
    }

    res = requests.get(SEARCH_URL, params=params, timeout=10)
    data = res.json()
    if res.status_code != 200 or "error" in data:
        return {
            "items": [],
            "error": "cse_request_failed",
            "details": data.get("error") or data
        }
    items = data.get("items", [])

    results = []
    for item in items:
        results.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet"),
            "display_link": item.get("displayLink")
        })

    return {"items": results}
