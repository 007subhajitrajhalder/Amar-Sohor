from fastapi import FastAPI

from app.routers import users


app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Amar Sohor Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }


app.include_router(users.router)