from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
import datetime
from app.services.mongo import add_review, get_reviews


router = APIRouter()


class ReviewRequest(BaseModel):
    entity_id: str
    entity_type: Optional[str] = None
    name: Optional[str] = None
    rating: Optional[float] = None
    review: Optional[str] = None
    user_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@router.post("/reviews")
def create_review(payload: ReviewRequest):
    doc = payload.dict()
    doc["created_at"] = datetime.datetime.utcnow().isoformat()
    return add_review(doc)


@router.get("/reviews")
def list_reviews(entity_id: str = Query(...), limit: int = Query(20)):
    return get_reviews(entity_id, limit=limit)
