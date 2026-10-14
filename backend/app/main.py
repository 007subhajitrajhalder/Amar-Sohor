from fastapi import FastAPI
from app.routers import admin
from app.routers import users
from app.routers import auth
app.include_router(admin.router)

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
app.include_router(auth.router)