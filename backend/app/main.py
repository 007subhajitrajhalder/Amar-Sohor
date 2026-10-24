import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from app.routers import (
    admin,
    agencies,
    auth,
    facilities,
    recommendations,
    reports,
    users
)

load_dotenv()

app = FastAPI(
    title="Amar Sohor API",
    description="Backend API for Amar Sohor GIS-integrated Smart City Civic Platform",
    version="1.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
for folder in ["reports", "resolutions", "recommendations", "facilities"]:
    os.makedirs(os.path.join(UPLOAD_DIR, folder), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
def home():
    return {
        "message": "Amar Sohor Backend is running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }


# Include Routers
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(agencies.router)
app.include_router(facilities.router)
app.include_router(reports.router)
app.include_router(recommendations.router)
