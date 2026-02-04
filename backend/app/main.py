from fastapi import FastAPI
from app.routes.search import router as search_router
from app.routes.doctors import router as doctor_router


app = FastAPI(title="RANGER Backend")

app.include_router(search_router, prefix="/api")
app.include_router(doctor_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "RANGER API running....."}
