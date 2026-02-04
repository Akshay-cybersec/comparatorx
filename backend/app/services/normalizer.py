from app.services.google_places import get_place_details
import datetime

SPECIALITY_KEYWORDS = {
    "dermatologist": ["dermatologist", "skin", "derma"],
    "cardiologist": ["cardiologist", "heart"],
    "dentist": ["dentist", "dental"],
    "physician": ["doctor", "clinic", "medical"],
    "orthopedic": ["orthopedic", "bone"],
    "gynecologist": ["gynecologist", "gynaecologist"],
    "pediatrician": ["pediatrician", "child"]
}

def detect_specialisation(types: list, name: str):
    text = " ".join(types).lower() + " " + name.lower()

    for spec, keywords in SPECIALITY_KEYWORDS.items():
        for k in keywords:
            if k in text:
                return spec

    return "general"

def get_today_timing(opening_hours):
    if not opening_hours:
        return "Not available"

    weekday = datetime.datetime.today().strftime("%A")

    for day in opening_hours.get("weekday_text", []):
        if day.startswith(weekday):
            return day

    return "Not available"

def normalize_doctors(raw_data):
    normalized = []

    for d in raw_data:
        place_id = d.get("place_id")
        details = get_place_details(place_id)

        opening_hours = details.get("opening_hours", {})
        types = details.get("types", [])

        normalized.append({
            "name": d.get("name"),
            "rating": d.get("rating", 0),
            "user_ratings_total": d.get("user_ratings_total", 0),
            "address": d.get("vicinity"),
            "location": d["geometry"]["location"],
            "open_now": opening_hours.get("open_now", False),
            "today_timing": get_today_timing(opening_hours),
            "specialisation": detect_specialisation(types, d.get("name", ""))
        })

    return normalized



def normalize_data(raw_data):
    normalized = []

    for item in raw_data:
        try:
            price = float(item["price"].replace("₹", "").replace(",", ""))
            rating = float(item["rating"])

            normalized.append({
                "name": item["name"],
                "price": price,
                "rating": rating,
                "seller": item["seller"],
                "url": item["url"]
            })
        except:
            continue

    return normalized