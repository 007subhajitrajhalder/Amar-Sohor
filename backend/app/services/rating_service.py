"""Service layer managing facility ratings, citizen reviews, and permissions."""

from typing import List, Dict, Any
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.facility import Facility
from app.models.rating import Rating
from app.schemas.rating import RatingInput


def list_facility_ratings(db: Session, facility_id: int) -> List[Dict[str, Any]]:
    """List public reviews for a facility ordered by newest first."""
    if db.get(Facility, facility_id) is None:
        raise HTTPException(status_code=404, detail="Facility not found")

    ratings = (
        db.query(Rating)
        .filter_by(facility_id=facility_id)
        .order_by(Rating.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.rating_id,
            "user_id": r.user_id,
            "name": r.user.full_name,
            "rating": r.rating,
            "date": r.created_at,
            "text": r.title
        }
        for r in ratings
    ]


def add_facility_rating(
    db: Session,
    facility_id: int,
    user_id: int,
    data: RatingInput
) -> Rating:
    """Add an authenticated user's facility review, preventing duplicate reviews per user."""
    if db.get(Facility, facility_id) is None:
        raise HTTPException(status_code=404, detail="Facility not found")

    title = data.title.strip()
    if not 1 <= data.rating <= 5 or not 1 <= len(title) <= 200:
        raise HTTPException(
            status_code=422,
            detail="Review must have 1-200 characters and a rating from 1 to 5"
        )

    existing_rating = db.query(Rating).filter_by(
        facility_id=facility_id,
        user_id=user_id
    ).first()

    if existing_rating:
        raise HTTPException(
            status_code=409,
            detail="You have already reviewed this facility. Please edit your existing review."
        )

    rating = Rating(
        facility_id=facility_id,
        user_id=user_id,
        title=title,
        rating=data.rating
    )

    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating


def update_facility_rating(
    db: Session,
    facility_id: int,
    rating_id: int,
    user_id: int,
    data: RatingInput
) -> Rating:
    """Update only the authenticated user's own review."""
    rating = db.query(Rating).filter_by(
        rating_id=rating_id,
        facility_id=facility_id
    ).first()

    if not rating:
        raise HTTPException(status_code=404, detail="Review not found")

    if rating.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only edit your own review")

    title = data.title.strip()
    if not 1 <= data.rating <= 5 or not 1 <= len(title) <= 200:
        raise HTTPException(
            status_code=422,
            detail="Review must have 1-200 characters and a rating from 1 to 5"
        )

    rating.title = title
    rating.rating = data.rating

    db.commit()
    db.refresh(rating)
    return rating


def delete_facility_rating(
    db: Session,
    facility_id: int,
    rating_id: int,
    user_id: int
) -> None:
    """Delete only the authenticated user's own review."""
    rating = db.query(Rating).filter_by(
        rating_id=rating_id,
        facility_id=facility_id
    ).first()

    if not rating:
        raise HTTPException(status_code=404, detail="Review not found")

    if rating.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own review")

    db.delete(rating)
    db.commit()
