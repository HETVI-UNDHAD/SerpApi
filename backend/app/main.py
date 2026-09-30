from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import SUPABASE_URL
from app.routes import health, trip, travel, omni_serp

app = FastAPI(title="OmniSERP AI & TravelOS API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(trip.router, prefix="/api")
app.include_router(travel.router, prefix="/api")
app.include_router(omni_serp.router, prefix="/api")


@app.on_event("startup")
def startup():
    if SUPABASE_URL:
        print(f"[OK] Supabase connected: {SUPABASE_URL}")
    else:
        print("[WARN] SUPABASE_URL not set")


@app.get("/")
def root():
    return {"message": "TripWise AI API is running"}
