import os
import re
import requests
from dotenv import load_dotenv


load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

SERPAPI_URL = "https://serpapi.com/search.json"


def _extract_price(value: str):
    if not value:
        return None
    match = re.search(r"([0-9,.]+)", value)
    if not match:
        return None
    try:
        return float(match.group(1).replace(",", ""))
    except Exception:
        return None


def search_shopping_products(query: str, num: int = 10):
    if not SERPAPI_KEY:
        return {"items": [], "error": "missing_serpapi_key"}

    params = {
        "engine": "google_shopping",
        "q": query,
        "api_key": SERPAPI_KEY,
        "num": num
    }

    res = requests.get(SERPAPI_URL, params=params, timeout=15)
    data = res.json()
    if res.status_code != 200 or "error" in data:
        return {"items": [], "error": "serpapi_request_failed", "details": data.get("error") or data}

    items = []
    for item in data.get("shopping_results", []):
        price_val = _extract_price(item.get("price", ""))
        url = item.get("link") or item.get("product_link")
        items.append({
            "name": item.get("title"),
            "url": url,
            "price": price_val,
            "source": item.get("source"),
            "thumbnail": item.get("thumbnail"),
            "rating": item.get("rating"),
            "reviews": item.get("reviews")
        })

    return {"items": items}
