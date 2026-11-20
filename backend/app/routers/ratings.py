"""API endpoints for citizen facility ratings and reviews."""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import require_user
from app.schemas.rating import RatingInput
from app.services import rating_service

router = APIRouter(tags=["Ratings & Reviews"])


@router.get("/facilities/{facility_id}/ratings", response_model=List[Dict[str, Any]])
def list_ratings(facility_id: int, db: Session = Depends(get_db)):
    """List public reviews for a facility; called by frontend FacilityDetailsPage."""
    return rating_service.list_facility_ratings(db, facility_id)


@router.post("/facilities/{facility_id}/ratings", status_code=status.HTTP_201_CREATED)
def add_rating(
    facility_id: int,
    data: RatingInput,
    user=Depends(require_user),
    db: Session = Depends(get_db)
):
    """Add an authenticated user's facility review."""
    rating = rating_service.add_facility_rating(
        db=db,
        facility_id=facility_id,
        user_id=user.user_id,
        data=data
    )
    return {"rating_id": rating.rating_id}


@router.put("/facilities/{facility_id}/ratings/{rating_id}")
def update_rating(
    facility_id: int,
    rating_id: int,
    data: RatingInput,
    user=Depends(require_user),
    db: Session = Depends(get_db)
):
    """Update only the authenticated user's own review."""
    rating_service.update_facility_rating(
        db=db,
        facility_id=facility_id,
        rating_id=rating_id,
        user_id=user.user_id,
        data=data
    )
    return {"message": "Review updated successfully"}


@router.delete("/facilities/{facility_id}/ratings/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(
    facility_id: int,
    rating_id: int,
    user=Depends(require_user),
    db: Session = Depends(get_db)
):
    """Delete only the authenticated user's own review."""
    rating_service.delete_facility_rating(
        db=db,
        facility_id=facility_id,
        rating_id=rating_id,
        user_id=user.user_id
    )
    return
