from typing import List, Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services import recommendation_service, file_service
from app.schemas.recommendation import RecommendationResponse, AllocateRecommendationPayload

router = APIRouter(
    prefix="/recommendations",
    tags=["Facility Recommendations"]
)


@router.post("", response_model=RecommendationResponse, status_code=201)
@router.post("/", response_model=RecommendationResponse, status_code=201)
async def submit_recommendation(
    title: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    facility_type: Optional[str] = Form("dustbin"),
    category_id: Optional[int] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    landmark: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    photo_url: Optional[str] = Form(None),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Submit a citizen recommendation for a new public facility.
    The recommendation is allotted to the Municipal Admin with status PENDING,
    where the Admin will allocate it to a designated agency member for feasibility study.
    Images are uploaded via python-multipart and marked approved.
    """
    final_photo_url = "/uploads/recommendations/default.jpg"

    if photo and photo.filename:
        final_photo_url = file_service.save_upload_file(photo, "recommendations")
    elif photo_url:
        final_photo_url = file_service.save_base64_or_url_photo(photo_url, "recommendations")

    effective_user_id = user_id or 10

    # Pass either category_id or facility_type
    cat_key = category_id if category_id is not None else facility_type

    created_rec = recommendation_service.create_recommendation(
        db=db,
        user_id=effective_user_id,
        title=title,
        description=description,
        address=address,
        category_id_or_type=cat_key,
        latitude=latitude,
        longitude=longitude,
        landmark=landmark,
        photo_url=final_photo_url
    )

    return created_rec


@router.post("/{recommendation_id}/allocate", response_model=RecommendationResponse)
def allocate_recommendation(
    recommendation_id: int,
    payload: AllocateRecommendationPayload,
    db: Session = Depends(get_db)
):
    """
    Admin allocation endpoint:
    Allocates a pending citizen recommendation to a designated agency member.
    """
    target_agent = payload.agent_id if payload.agent_id is not None else payload.agent_email
    if target_agent is None:
        target_agent = 1  # Default fallback

    return recommendation_service.allocate_recommendation(
        db=db,
        recommendation_id=recommendation_id,
        agent_id_or_identifier=target_agent,
        notes=payload.notes
    )


@router.get("", response_model=List[RecommendationResponse])
@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(
    user_id: Optional[int] = Query(None, description="Filter by citizen user_id"),
    db: Session = Depends(get_db)
):
    """Retrieve all recommendations or filter by citizen user_id."""
    return recommendation_service.get_all_recommendations(db=db, user_id=user_id)


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation_by_id(
    recommendation_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve details and progress of a specific facility recommendation."""
    return recommendation_service.get_recommendation_by_id(db=db, recommendation_id=recommendation_id)

