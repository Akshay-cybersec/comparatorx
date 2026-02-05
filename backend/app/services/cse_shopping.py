import os
import re
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
CX = os.getenv("GOOGLE_CSE_CX")

SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


def _extract_price(text: str):
    if not text:
        return None
    match = re.search(r"(₹|Rs\\.?|INR)\\s?([0-9,]+)", text)
    if match:
        value = match.group(2).replace(",", "")
        try:
            return float(value)
        except Exception:
            return None
    return None


def search_shopping_products(query: str, num: int = 8):
    if not API_KEY or not CX:
        return {"items": [], "error": "missing_cse_key_or_cx"}

    # Use CSE to search Google Shopping domain.
    q = f"{query} site:shopping.google.com"
    params = {
        "key": API_KEY,
        "cx": CX,
        "q": q,
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

    items = []
    for item in data.get("items", []):
        title = item.get("title")
        link = item.get("link")
        snippet = item.get("snippet", "")
        price = _extract_price(snippet)
        items.append({
            "name": title,
            "url": link,
            "price": price,
            "source": "Google Shopping",
            "snippet": snippet
        })

    return {"items": items}
