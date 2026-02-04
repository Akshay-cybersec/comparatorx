import os
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def search_youtube(query: str, max_results: int = 5):
    if not API_KEY:
        return {"items": [], "error": "missing_youtube_key"}

    params = {
        "part": "snippet",
        "type": "video",
        "maxResults": max_results,
        "q": query,
        "key": API_KEY
    }

    res = requests.get(SEARCH_URL, params=params, timeout=10)
    data = res.json()
    if res.status_code != 200 or "error" in data:
        return {
            "items": [],
            "error": "youtube_request_failed",
            "details": data.get("error") or data
        }
    items = data.get("items", [])

    results = []
    for item in items:
        video_id = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})
        if not video_id:
            continue
        results.append({
            "title": snippet.get("title"),
            "channel": snippet.get("channelTitle"),
            "published_at": snippet.get("publishedAt"),
            "video_id": video_id,
            "link": f"https://www.youtube.com/watch?v={video_id}"
        })

    return {"items": results}
