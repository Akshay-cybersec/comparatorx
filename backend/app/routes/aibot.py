from fastapi import APIRouter
from pydantic import BaseModel

from app.services.aibot import (
    extract_intent_entities,
    normalize_extraction,
    required_follow_up,
    build_query,
    build_query_variants,
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

    if confidence < 0.6 and not entities.get("product"):
        return {
            "ai_used": True,
            "ai_model": "zero-shot-transformer",
            "ai_enhanced": True,
            "intent": "general_query",
            "confidence": confidence,
            "entities": entities,
            "query_used": None,
            "results": [],
            "message": "Could you clarify what product or category you are looking for?",
        }

    follow_up = required_follow_up(intent, entities)
    if follow_up:
        return {
            "ai_used": True,
            "ai_model": "zero-shot-transformer",
            "ai_enhanced": True,
            "intent": intent,
            "confidence": confidence,
            "entities": entities,
            "query_used": None,
            "results": [],
            "message": follow_up,
        }

    query = build_query(intent, entities, fallback=payload.message)
    queries = build_query_variants(intent, entities, fallback=payload.message)
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
        merged = []
        seen = set()
        for q in queries[:2]:
            web = search_web(q, num=10)
            for item in web.get("items", []):
                link = item.get("link")
                if not link or link in seen:
                    continue
                seen.add(link)
                merged.append(item)
        items = filter_and_rank_results(merged, entities)
    else:
        items = filter_and_rank_results(items, entities)

    return {
        "ai_used": True,
        "ai_model": "zero-shot-transformer",
        "ai_enhanced": True,
        "intent": intent,
        "confidence": confidence,
        "entities": entities,
        "query_used": query,
        "reasoning": "Ranked by ecommerce domain preference and matches for product, color, size, and brand.",
        "results": items,
    }
