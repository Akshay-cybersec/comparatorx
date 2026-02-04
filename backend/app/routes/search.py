from fastapi import APIRouter, Query
from app.services.fetcher import fetch_from_sources
from app.services.normalizer import normalize_data
from app.services.ranker import rank_products

router = APIRouter()

@router.get("/search")
def search(
    q: str = Query(...),
    category: str = Query(...)
):
    raw_data = fetch_from_sources(q, category)
    normalized = normalize_data(raw_data)
    ranked = rank_products(normalized)

    return {
        "query": q,
        "category": category,
        "results": ranked
    }
