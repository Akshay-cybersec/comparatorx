from fastapi import APIRouter, Query
from app.services.google_places import search_doctors
from app.services.normalizer import normalize_doctors
from app.services.ranker import rank_doctors
from app.services.ai_query import parse_doctor_query

router = APIRouter()

@router.get("/doctors/ai")
def ai_doctor_search(
    q: str = Query(...),
    lat: float = Query(...),
    lng: float = Query(...)
):
    ai = parse_doctor_query(q)

    raw = search_doctors(lat, lng)
    normalized = normalize_doctors(raw)
    ranked = rank_doctors(normalized, lat, lng)

    filtered = []
    for d in ranked:
        if ai["speciality"] and d["specialisation"] != ai["speciality"]:
            continue
        if ai["min_rating"] and d["rating"] < ai["min_rating"]:
            continue
        if ai["max_distance"] and d["distance"] > ai["max_distance"]:
            continue
        if ai["open_now"] and not d["open_now"]:
            continue
        filtered.append(d)

    sort_by = ai["sort_by"]
    if sort_by == "rating":
        filtered.sort(key=lambda x: x["rating"], reverse=True)
    elif sort_by == "distance":
        filtered.sort(key=lambda x: x["distance"])
    elif sort_by == "reviews":
        filtered.sort(key=lambda x: x["user_ratings_total"], reverse=True)
    else:
        filtered.sort(key=lambda x: x["score"], reverse=True)

    return {
        "query": q,
        "ai_understanding": ai,
        "results": filtered
    }
