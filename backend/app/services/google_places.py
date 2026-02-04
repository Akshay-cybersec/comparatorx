import os
from typing import Optional
import requests
from dotenv import load_dotenv
from app.services.cache import get_cache, set_cache


load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

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


def search_places(lat: float, lng: float, radius=3000, place_type: Optional[str] = None, keyword: Optional[str] = None):
    cache_key = f"places:{lat}:{lng}:{radius}:{place_type or 'any'}:{keyword or 'any'}"

    cached = get_cache(cache_key)
    if cached:
        print("⚡ Returning places from cache")
        return cached

    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "key": API_KEY
    }

    if place_type:
        params["type"] = place_type
    if keyword:
        params["keyword"] = keyword

    res = requests.get(NEARBY_URL, params=params, timeout=10)
    data = res.json()
    results = data.get("results", [])

    set_cache(cache_key, results)
    print("🌍 Fetched places from Google API")

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


def get_place_details_full(place_id: str):
    params = {
        "place_id": place_id,
        "fields": "name,formatted_address,opening_hours,types,url,website,rating,user_ratings_total,reviews",
        "key": API_KEY
    }
    res = requests.get(DETAILS_URL, params=params, timeout=10)
    data = res.json()
    return data.get("result", {})


def geocode_location(query: str):
    if not API_KEY:
        return None
    params = {
        "address": query,
        "key": API_KEY
    }
    res = requests.get(GEOCODE_URL, params=params, timeout=10)
    data = res.json()
    results = data.get("results", [])
    if not results:
        return None
    location = results[0].get("geometry", {}).get("location")
    return location
