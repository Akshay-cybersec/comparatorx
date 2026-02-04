from fastapi import APIRouter, Query
from app.services.google_places import search_doctors
from app.services.normalizer import normalize_doctors
from app.services.ranker import rank_doctors

router = APIRouter()

@router.get("/doctors")
def find_doctors(
    lat: float = Query(...),
    lng: float = Query(...),

    min_rating: float = Query(0),
    max_distance: float = Query(None),
    min_reviews: int = Query(0),
    open_now: bool = Query(False),
    speciality: str = Query(None),
    sort_by: str = Query("score")
):
    raw = search_doctors(lat, lng)
    normalized = normalize_doctors(raw)
    ranked = rank_doctors(normalized, lat, lng)

    filtered = []
    for d in ranked:
        if d["rating"] < min_rating:
            continue

        if max_distance and d["distance"] > max_distance:
            continue

        if d["user_ratings_total"] < min_reviews:
            continue

        if open_now and not d["open_now"]:
            continue

        if speciality and d["specialisation"] != speciality.lower():
            continue

        filtered.append(d)

    if sort_by == "rating":
        filtered.sort(key=lambda x: x["rating"], reverse=True)
    elif sort_by == "distance":
        filtered.sort(key=lambda x: x["distance"])
    elif sort_by == "reviews":
        filtered.sort(key=lambda x: x["user_ratings_total"], reverse=True)
    else:
        filtered.sort(key=lambda x: x["score"], reverse=True)

    return {
        "meta": {
            "total_found": len(ranked),
            "after_filter": len(filtered),
            "speciality": speciality
        },
        "results": filtered
    }
