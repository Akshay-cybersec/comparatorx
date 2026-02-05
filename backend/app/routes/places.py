from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import datetime
import re
import os
from app.services.google_places import search_places, get_place_details_full, geocode_location, search_places_text
from app.services.normalizer import normalize_places
from app.services.ranker import rank_doctors
from app.services.web_search import search_web
from app.services.youtube_search import search_youtube
from app.services.youtube_transcripts import fetch_transcripts_for_videos
from app.services.mongo import get_reviews
from app.services.serpapi_shopping import search_shopping_products


router = APIRouter()


class CrawlerAgenRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    query: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    place_id: Optional[str] = None
    include_transcripts: Optional[bool] = True
    max_transcripts: Optional[int] = 2
    price: Optional[float] = None
    extra: Optional[Dict[str, Any]] = None
    entity_id: Optional[str] = None


def infer_place_type(query: str):
    q = query.lower()
    if "gym" in q:
        return "gym"
    if "doctor" in q or "clinic" in q:
        return "doctor"
    if "hospital" in q:
        return "hospital"
    return None


PRODUCT_KEYWORDS = {
    # phones & wearables
    "mobile", "smartphone", "phone", "iphone", "android", "samsung", "pixel",
    "watch", "smartwatch", "fitness band", "fitbit",
    # computers
    "laptop", "notebook", "macbook", "tablet", "ipad", "chromebook",
    "desktop", "pc", "gaming pc",
    # audio
    "headphones", "earbuds", "earphones", "speaker", "soundbar", "mic", "microphone",
    # tv & display
    "tv", "television", "monitor", "projector",
    # peripherals
    "keyboard", "mouse", "webcam", "printer", "scanner",
    # accessories
    "charger", "powerbank", "power bank", "cable", "adapter", "dock", "hub",
    # appliances & gadgets
    "router", "modem", "camera", "dslr", "mirrorless", "drone",
    "trimmer", "shaver", "hair dryer", "straightener",
    "refrigerator", "fridge", "washing machine", "microwave", "air fryer",
    # consoles
    "playstation", "ps5", "xbox", "nintendo", "switch"
}


def classify_query(query: str):
    q = query.lower()
    if "near me" in q:
        return "service"
    if "under " in q or "below " in q or "less than " in q:
        return "product"
    if "rs" in q or "₹" in q or "usd" in q or "$" in q:
        return "product"
    for kw in PRODUCT_KEYWORDS:
        if kw in q:
            return "product"
    return "service"


def extract_location_hint(query: str) -> Optional[str]:
    q = query.lower()
    match = re.search(r"\b(?:near|in|around)\s+([a-zA-Z\s]+)", q)
    if not match:
        return None
    location = match.group(1).strip()
    # Trim common trailing qualifiers
    stop_words = ["near me", "me", "open now", "best", "top", "cheap", "under", "below"]
    for stop in stop_words:
        if stop in location:
            location = location.split(stop)[0].strip()
    # Collapse extra spaces
    location = re.sub(r"\s+", " ", location).strip()
    return location or None


@router.get("/nearby")
def nearby_search(
    q: str = Query(...),
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(3000)
):
    place_type = infer_place_type(q)
    keyword = None if place_type else q

    raw = search_places(lat, lng, radius=radius, place_type=place_type, keyword=keyword)
    normalized = normalize_places(raw)
    ranked = rank_doctors(normalized, lat, lng)

    return {
        "query": q,
        "place_type": place_type,
        "keyword": keyword,
        "results": ranked
    }


@router.post("/crawleragen")
def crawleragen(payload: CrawlerAgenRequest):
    base_query = payload.query
    if not base_query:
        parts = [payload.name, payload.category]
        base_query = " ".join([p for p in parts if p])

    places_details = {}
    if payload.place_id:
        places_details = get_place_details_full(payload.place_id)

    google_reviews = places_details.get("reviews", []) if places_details else []

    web = search_web(base_query, num=5) if base_query else {"items": []}
    youtube = search_youtube(base_query, max_results=5) if base_query else {"items": []}
    notes = [n for n in [web.get("error"), youtube.get("error")] if n]
    details = [d for d in [web.get("details"), youtube.get("details")] if d]
    youtube_items = youtube.get("items", [])
    video_ids = [item.get("video_id") for item in youtube_items if item.get("video_id")]
    transcripts = []
    if payload.include_transcripts and video_ids:
        transcripts = fetch_transcripts_for_videos(video_ids, max_items=payload.max_transcripts or 2)

    entity_id = payload.entity_id
    if not entity_id:
        if payload.place_id:
            entity_id = payload.place_id
        elif payload.extra:
            entity_id = payload.extra.get("product_url") or payload.extra.get("url")
    review_results = get_reviews(entity_id, limit=20) if entity_id else {"items": []}

    current_price = None
    if payload.category == "product":
        if payload.price is not None:
            current_price = payload.price
        elif payload.extra:
            current_price = payload.extra.get("price") or payload.extra.get("current_price") or payload.extra.get("latest_price")

    price_history: Optional[List[Dict[str, Any]]] = None
    if payload.category == "product" and current_price is not None:
        today = datetime.date.today()
        multipliers = [1.0, 0.98, 1.03, 0.99]
        days_ago = [0, 7, 14, 21]
        price_history = []
        for i in range(len(multipliers)):
            date_str = (today - datetime.timedelta(days=days_ago[i])).isoformat()
            price_history.append({
                "date": date_str,
                "price": round(float(current_price) * multipliers[i], 2)
            })

    return {
        "status": "ok",
        "input": payload,
        "results": {
            "google_place": {
                "url": places_details.get("url") if places_details else None,
                "website": places_details.get("website") if places_details else None,
                "rating": places_details.get("rating") if places_details else None,
                "user_ratings_total": places_details.get("user_ratings_total") if places_details else None
            },
            "google_reviews": google_reviews,
            "web_links": web.get("items", []),
            "youtube_videos": youtube_items,
            "youtube_transcripts": transcripts,
            "current_price": current_price,
            "price_history": price_history,
            "user_reviews": review_results.get("items", [])
        },
        "meta": {
            "query": base_query,
            "notes": notes,
            "details": details,
            "review_source": entity_id
        }
    }


@router.get("/query")
def unified_query(
    q: str = Query(...),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius: int = Query(3000)
):
    mode = classify_query(q)

    if mode == "service":
        query_location = extract_location_hint(q)
        search_lat = lat
        search_lng = lng
        cleaned_query = q
        if query_location:
            cleaned_query = re.sub(r"\b(?:near|in|around)\s+" + re.escape(query_location), "", cleaned_query, flags=re.IGNORECASE).strip()
            geo = geocode_location(query_location)
            if geo:
                search_lat = geo.get("lat")
                search_lng = geo.get("lng")
        if search_lat is None or search_lng is None:
            default_lat = os.getenv("DEFAULT_LAT")
            default_lng = os.getenv("DEFAULT_LNG")
            if default_lat and default_lng:
                search_lat = float(default_lat)
                search_lng = float(default_lng)
            else:
                return {
                    "status": "error",
                    "mode": mode,
                    "message": "lat/lng missing and no location in query. Provide lat/lng or set DEFAULT_LAT/DEFAULT_LNG in .env"
                }
        if query_location:
            text_query = f"{cleaned_query or q} in {query_location}".strip()
            raw = search_places_text(text_query, radius=radius, lat=search_lat, lng=search_lng)
            normalized = normalize_places(raw)
            ranked = rank_doctors(normalized, search_lat, search_lng)
            data = {
                "query": text_query,
                "place_type": None,
                "keyword": cleaned_query or q,
                "results": ranked
            }
        else:
            data = nearby_search(q=cleaned_query or q, lat=search_lat, lng=search_lng, radius=radius)
        data["mode"] = mode
        data["location_hint"] = query_location
        return data

    products = search_shopping_products(q, num=10)
    return {
        "mode": mode,
        "query": q,
        "results": products.get("items", []),
        "meta": {
            "notes": [products.get("error")] if products.get("error") else [],
            "details": [products.get("details")] if products.get("details") else []
        }
    }
