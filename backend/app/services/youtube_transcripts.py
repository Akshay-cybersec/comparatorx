import os
import json
from typing import Dict, Any, List
from dotenv import load_dotenv

try:
    from supadata import Supadata
except Exception:  # pragma: no cover
    Supadata = None


load_dotenv()
API_KEY = os.getenv("TRANSCRIPT_API")
TRANSCRIPT_CACHE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "transcripts_cache.json")


def _client():
    if Supadata is None:
        return None, "supadata_not_installed"
    if not API_KEY:
        return None, "missing_transcript_api_key"
    return Supadata(api_key=API_KEY), None


def _load_cache() -> Dict[str, Any]:
    try:
        with open(TRANSCRIPT_CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except Exception:
        return {}


def _save_cache(cache: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(TRANSCRIPT_CACHE_PATH), exist_ok=True)
    with open(TRANSCRIPT_CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=True, indent=2)


def fetch_transcript(video_id: str, lang: str = "en", text: bool = True) -> Dict[str, Any]:
    cache = _load_cache()
    if video_id in cache:
        cached = cache[video_id]
        return {
            "video_id": video_id,
            "language": cached.get("language", lang),
            "text": cached.get("text", ""),
            "segments": cached.get("segments", []),
            "error": None,
            "cached": True
        }

    # Hardcode-only mode: do not call Supadata if cache is missing.
    return {
        "video_id": video_id,
        "text": "",
        "segments": [],
        "error": "transcript_not_cached",
        "cached": False
    }

    client, err = _client()
    if err:
        return {"video_id": video_id, "text": "", "segments": [], "error": err}

    try:
        url = f"https://youtu.be/{video_id}"
        transcript = client.youtube.transcript(url, lang=lang, text=text)
        content = getattr(transcript, "content", "") or ""
        result = {
            "video_id": video_id,
            "language": lang,
            "text": content if text else "",
            "segments": [] if text else content,
            "error": None,
            "cached": False
        }
        cache[video_id] = {
            "language": lang,
            "text": result["text"],
            "segments": result["segments"]
        }
        _save_cache(cache)
        return result
    except Exception as exc:
        return {
            "video_id": video_id,
            "text": "",
            "segments": [],
            "error": "supadata_error",
            "details": str(exc)
        }


def fetch_transcripts_for_videos(video_ids: List[str], max_items: int = 2) -> List[Dict[str, Any]]:
    transcripts = []
    for vid in video_ids[:max_items]:
        transcripts.append(fetch_transcript(vid))
    return transcripts
