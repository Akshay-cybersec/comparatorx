from fastapi import FastAPI
from app.routes.search import router as search_router
from app.routes.doctors import router as doctor_router
from app.routes.ai_doctors import router as ai_doctor_router
from app.routes.products import router as product_router
from app.routes.testing import router as testing_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.youtube import router as youtube_router



app = FastAPI(title="RANGER Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(search_router, prefix="/api")
app.include_router(doctor_router, prefix="/api")
app.include_router(ai_doctor_router, prefix="/api")
app.include_router(product_router, prefix="/api")
app.include_router(testing_router, prefix="/api")
app.include_router(youtube_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "RANGER API running....."}
