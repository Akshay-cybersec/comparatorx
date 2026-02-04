from fastapi import APIRouter, Query
from app.services.serp_products import search_products
from app.services.product_normalizer import normalize_products
from app.services.product_ranker import rank_products
from app.services.llm import summarize_reviews

router = APIRouter()

@router.get("/products")
def search_products_api(q: str = Query(...)):
    raw = search_products(q)
    normalized = normalize_products(raw)
    ranked = rank_products(normalized)

    reviews_text = """
    Camera is very good but battery drains fast.
    Performance is smooth.
    Display quality is excellent.
    Price is high compared to features.
    """

    summary = summarize_reviews(q, reviews_text)

    return {
        "query": q,
        "results": ranked,
        "review_summary": summary
    }
