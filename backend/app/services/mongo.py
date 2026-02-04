import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from pymongo import MongoClient


_ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(_ENV_PATH)
MONGO_URI = os.getenv("MONGO_DB")


def _client() -> Optional[MongoClient]:
    if not MONGO_URI:
        return None
    return MongoClient(MONGO_URI)


def get_collection():
    client = _client()
    if not client:
        return None, "missing_mongo_db"
    try:
        db = client.get_default_database()
    except Exception:
        return None, "missing_default_database"
    return db["reviews"], None


def add_review(doc: Dict[str, Any]) -> Dict[str, Any]:
    collection, err = get_collection()
    if err:
        return {"error": err}
    result = collection.insert_one(doc)
    return {"inserted_id": str(result.inserted_id)}


def get_reviews(entity_id: str, limit: int = 20) -> Dict[str, Any]:
    collection, err = get_collection()
    if err:
        return {"items": [], "error": err}
    cursor = collection.find({"entity_id": entity_id}).sort("created_at", -1).limit(limit)
    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return {"items": items}
