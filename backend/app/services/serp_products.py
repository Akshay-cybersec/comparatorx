import os
import requests
from dotenv import load_dotenv
from app.services.cache import get_cache, set_cache

load_dotenv()
API_KEY = os.getenv("SERPAPI_KEY")

BASE_URL = "https://serpapi.com/search.json"

MOCK_MODE = False

def search_products(query: str):
    cache_key = f"products:{query.lower()}"

    cached = get_cache(cache_key)
    if cached:
        print("⚡ Product cache hit")
        return cached

    if MOCK_MODE:
        results = [
            {"name": "iPhone 16", "price": "₹79999", "seller": "Amazon", "rating": 4.6, "url": "#"},
            {"name": "iPhone 16", "price": "₹80499", "seller": "Flipkart", "rating": 4.5, "url": "#"},
            {"name": "iPhone 16", "price": "₹80999", "seller": "Croma", "rating": 4.7, "url": "#"}
        ]
        set_cache(cache_key, results)
        return results

    params = {
        "engine": "google_shopping",
        "q": query,
        "gl": "in",
        "api_key": API_KEY
    }

    res = requests.get(BASE_URL, params=params, timeout=10)
    data = res.json()

    results = []
    for item in data.get("shopping_results", []):
        results.append({
            "name": item.get("title"),
            "price": item.get("price"),
            "seller": item.get("source"),
            "rating": item.get("rating", 0),
            "url": item.get("link")
        })

    set_cache(cache_key, results)

    return results
