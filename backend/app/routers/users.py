from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

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