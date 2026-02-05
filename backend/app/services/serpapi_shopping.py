import os
import re
import requests
from dotenv import load_dotenv


load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

SERPAPI_URL = "https://serpapi.com/search.json"


def _extract_price(value: str):
    if not value:
        return None, None
    currency = None
    if "₹" in value or "rs" in value.lower() or "inr" in value.lower():
        currency = "INR"
    if "$" in value:
        currency = "USD"
    match = re.search(r"([0-9,.]+)", value)
    if not match:
        return None, currency
    try:
        return float(match.group(1).replace(",", "")), currency
    except Exception:
        return None, currency


def _extract_budget_inr(query: str):
    q = query.lower()
    match = re.search(r"(under|below|less than)\\s*([0-9]+)\\s*k", q)
    if match:
        return int(match.group(2)) * 1000
    match = re.search(r"(?:₹|rs\\.?|inr)\\s*([0-9,]+)", q)
    if match:
        return int(match.group(1).replace(",", ""))
    return None


def search_shopping_products(query: str, num: int = 10):
    if not SERPAPI_KEY:
        return {"items": [], "error": "missing_serpapi_key"}

    budget_inr = _extract_budget_inr(query)
    params = {
        "engine": "google_shopping",
        "q": query,
        "api_key": SERPAPI_KEY,
        "num": num,
        "google_domain": "google.co.in",
        "gl": "in",
        "hl": "en",
        "location": "India"
    }
    if budget_inr:
        params["price_max"] = budget_inr

    res = requests.get(SERPAPI_URL, params=params, timeout=15)
    data = res.json()
    if res.status_code != 200 or "error" in data:
        return {"items": [], "error": "serpapi_request_failed", "details": data.get("error") or data}

    items = []
    for item in data.get("shopping_results", []):
        price_val, currency = _extract_price(item.get("price", ""))
        if budget_inr and currency == "INR" and price_val and price_val > budget_inr:
            continue
        url = item.get("link") or item.get("product_link")
        items.append({
            "name": item.get("title"),
            "url": url,
            "price": price_val,
            "currency": currency,
            "source": item.get("source"),
            "thumbnail": item.get("thumbnail"),
            "rating": item.get("rating"),
            "reviews": item.get("reviews")
        })

    return {"items": items}
