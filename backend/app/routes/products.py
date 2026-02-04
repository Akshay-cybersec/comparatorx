from fastapi import APIRouter, Query
from app.services.serp_products import search_products
from app.services.product_normalizer import normalize_products
from app.services.product_ranker import rank_products

router = APIRouter()

@router.get("/products")
def search_products_api(q: str = Query(...)):
    raw = search_products(q)
    normalized = normalize_products(raw)
    ranked = rank_products(normalized)

    return {
        "query": q,
        "results": ranked
    }
