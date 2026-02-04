from fastapi import APIRouter, HTTPException
from app.services.youtube_service import search_videos, get_transcript

router = APIRouter(prefix="/youtube", tags=["YouTube"])

@router.get("/search")
def search(query: str):
    return search_videos(query)


@router.get("/transcript/{video_id}")
def transcript(video_id: str):
    try:
        text = get_transcript(video_id)
        return {
            "video_id": video_id,
            "transcript": text
        }
    except Exception:
        raise HTTPException(status_code=404, detail="Transcript not available")
