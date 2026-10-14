from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import require_role
from app.models.user import User
from app.schemas.admin import CreateAgencyMemberRequest
from app.schemas.user import UserResponse
from app.services import admin_service


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_admin: User = Depends(require_role("ADMIN")),
    db: Session = Depends(get_db)
):
    user = admin_service.get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@router.post(
    "/agency-members",
    response_model=UserResponse,
    status_code=201
)
@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(
    current_admin: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):
    return admin_service.get_all_users(db)
def create_agency_member(
    user_data: CreateAgencyMemberRequest,
    current_admin: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):
    result = admin_service.create_agency_member(
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