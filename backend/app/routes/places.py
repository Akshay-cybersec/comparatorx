from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.google_places import search_places, get_place_details_full
from app.services.normalizer import normalize_places
from app.services.ranker import rank_doctors
from app.services.web_search import search_web
from app.services.youtube_search import search_youtube
from app.services.youtube_transcripts import fetch_transcripts_for_videos


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
    extra: Optional[Dict[str, Any]] = None


def infer_place_type(query: str):
    q = query.lower()
    if "gym" in q:
        return "gym"
    if "doctor" in q or "clinic" in q:
        return "doctor"
    if "hospital" in q:
        return "hospital"
    return None


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
            "youtube_transcripts": transcripts
        },
        "meta": {
            "query": base_query,
            "notes": notes,
            "details": details
        }
    }
