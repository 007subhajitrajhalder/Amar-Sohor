from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)

from app.schemas.user import UserResponse

from app.services import auth_service

from app.core.security import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    result = auth_service.register_user(
        db,
        user_data
    )

    if result == "EMAIL_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    if result == "PHONE_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Phone number already registered"
        )

    return result


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = auth_service.login_user(
        db,
        user_data
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        user_id=user.user_id,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }