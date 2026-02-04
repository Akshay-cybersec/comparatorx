from fastapi import APIRouter, Query
from app.services.scraper import scrape_amazon, scrape_flipkart
from app.services.normalizer import normalize_data
from app.services.ranker import rank_products
from app.services.nlp import parse_query

router = APIRouter()

@router.get("/search")
def search(q: str = Query(...), category: str = Query(...)):
    ai = parse_query(q)

    data = []
    try:
        data += scrape_amazon(q)
    except:
        pass

    try:
        data += scrape_flipkart(q)
    except:
        pass

    normalized = normalize_data(data)
    ranked = rank_products(normalized, ai["priority"])

    return {
        "query": q,
        "ai_understanding": ai,
        "results": ranked
    }
