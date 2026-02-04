from fastapi import FastAPI
from app.routes.search import router as search_router
from app.routes.doctors import router as doctor_router
from app.routes.ai_doctors import router as ai_doctor_router
from app.routes.products import router as product_router
from app.routes.testing import router as testing_router



app = FastAPI(title="RANGER Backend")

app.include_router(search_router, prefix="/api")
app.include_router(doctor_router, prefix="/api")
app.include_router(ai_doctor_router, prefix="/api")
app.include_router(product_router, prefix="/api")
app.include_router(testing_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "RANGER API running....."}
