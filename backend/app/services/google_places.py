import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

def search_doctors(lat: float, lng: float, radius=3000):
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "doctor",
        "key": API_KEY
    }

    res = requests.get(BASE_URL, params=params, timeout=10)
    data = res.json()

    return data.get("results", [])
