from fastapi import FastAPI
from app.routes.places import router as places_router



app = FastAPI(title="RANGER Backend")

app.include_router(places_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "RANGER API running....."}
