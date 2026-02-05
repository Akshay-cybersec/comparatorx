from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.places import router as places_router
from app.routes.reviews import router as reviews_router
from app.routes.aibot import router as aibot_router



app = FastAPI(title="ComparatorX Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(places_router, prefix="/api")
app.include_router(reviews_router, prefix="/api")
app.include_router(aibot_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "RANGER API running....."}
