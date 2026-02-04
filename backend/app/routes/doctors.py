from fastapi import APIRouter, Query
from app.services.google_places import search_doctors
from app.services.normalizer import normalize_doctors
from app.services.ranker import rank_doctors

router = APIRouter()

@router.get("/doctors")
def find_doctors(
    lat: float = Query(...),
    lng: float = Query(...)
):
    raw = search_doctors(lat, lng)
    normalized = normalize_doctors(raw)
    ranked = rank_doctors(normalized, lat, lng)

    return {
        "category": "doctors",
        "results": ranked
    }
