import os
import requests
from dotenv import load_dotenv
from app.services.cache import get_cache, set_cache


load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

def search_doctors(lat: float, lng: float, radius=3000):
    cache_key = f"doctors:{lat}:{lng}:{radius}"

    cached = get_cache(cache_key)
    if cached:
        print("⚡ Returning doctors from cache")
        return cached

    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "doctor",
        "key": API_KEY
    }

    res = requests.get(NEARBY_URL, params=params, timeout=10)
    data = res.json()
    results = data.get("results", [])

    set_cache(cache_key, results)
    print("🌍 Fetched doctors from Google API")

    return results


def get_place_details(place_id: str):
    params = {
        "place_id": place_id,
        "fields": "opening_hours,types",
        "key": API_KEY
    }
    res = requests.get(DETAILS_URL, params=params, timeout=10)
    data = res.json()
    return data.get("result", {})
