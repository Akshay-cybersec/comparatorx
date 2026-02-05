from fastapi import APIRouter
from pydantic import BaseModel

from app.services.aibot import (
    extract_intent_entities,
    normalize_extraction,
    required_follow_up,
    build_query,
    filter_and_rank_results,
)
from app.services.web_search import search_web
from app.services.serpapi_shopping import search_shopping_products


router = APIRouter()


class AIBotRequest(BaseModel):
    message: str


@router.post("/aibot")
def aibot(payload: AIBotRequest):
    extraction = extract_intent_entities(payload.message)
    intent, confidence, entities = normalize_extraction(extraction)

    follow_up = required_follow_up(intent, entities)
    if follow_up:
        return {
            "ai_used": True,
            "ai_model": "zero-shot-transformer",
            "intent": intent,
            "confidence": confidence,
            "entities": entities,
            "query_used": None,
            "results": [],
            "message": follow_up,
        }

    query = build_query(intent, entities, fallback=payload.message)
    items = []
    if intent in {"product_search", "price_compare", "product_recommendation"}:
        shopping = search_shopping_products(query, num=10)
        for item in shopping.get("items", []):
            items.append({
                "title": item.get("name"),
                "link": item.get("url"),
                "snippet": item.get("source"),
                "image": item.get("thumbnail"),
            })
    if not items:
        web = search_web(query, num=10)
        items = filter_and_rank_results(web.get("items", []), entities)

    return {
        "ai_used": True,
        "ai_model": "zero-shot-transformer",
        "intent": intent,
        "confidence": confidence,
        "entities": entities,
        "query_used": query,
        "results": items,
    }
