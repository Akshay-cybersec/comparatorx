from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
import os

YOUTUBE_API_KEY = os.getenv("GOOGLE_API_KEY")

youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

def search_videos(query: str, max_results=5):
    request = youtube.search().list(
        q=query + " review",
        part="snippet",
        type="video",
        maxResults=max_results
    )
    response = request.execute()

    videos = []
    for item in response["items"]:
        videos.append({
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
        })
    return videos


def get_transcript(video_id: str):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = " ".join([t["text"] for t in transcript])
    return full_text
