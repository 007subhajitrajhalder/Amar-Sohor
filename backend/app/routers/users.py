from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user_id
from app.database.connection import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.dependencies.auth import (
    get_current_user,
    require_admin
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role
    }
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = user_service.delete_user(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "User deleted successfully"
    }
@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(require_admin)
):
    return {
        "message": "Welcome Admin",
        "user_id": current_user.user_id,
        "name": current_user.full_name,
        "role": current_user.role
    } 
@router.get("/agency-test")
def agency_test(
    current_user: User = Depends(require_role("AGENCY"))
):
    return {
        "message": "Welcome Agency",
        "user_id": current_user.user_id,
        "role": current_user.role
    }   
@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    user = user_service.update_user(
        db,
        user_id,
        user_data
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = user_service.get_all_users(db)

    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = user_service.get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return user_service.create_user(db, user_data)