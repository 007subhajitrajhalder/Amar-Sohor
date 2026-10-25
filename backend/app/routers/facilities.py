from typing import List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.dependencies.auth import get_current_agent_member
from app.dependencies.auth import require_user
from app.dependencies.facility import get_agency_facility
from app.models.agency import Agency
from app.models.agency_member import AgencyMember
from app.models.facility import Facility
from app.schemas.facility import (
    FacilityCategoryResponse, FacilityCreate, FacilityUpdate, FacilityResponse,
    FacilityListResponse, FacilityPhotoResponse, FacilityStatus
)
from app.services import facility_service, file_service

router = APIRouter(
    tags=["Facilities"]
)


# ==========================================
# Public Citizen Facility Endpoints (/facilities)
# ==========================================

class FacilityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    facility_id: int
    facility_name: str
    category_id: int
    category_name: Optional[str] = None
    latitude: float
    longitude: float
    address: str
    status: str
    agency_name: Optional[str] = None
    photo_url: Optional[str] = None


@router.get("/facilities", response_model=List[FacilityOut])
@router.get("/facilities/", response_model=List[FacilityOut])
def list_facilities(
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Public listing of civic facilities for citizen map discovery and reporting."""
    query = db.query(Facility)
    if category_id:
        query = query.filter(Facility.category_id == category_id)
    facilities = query.all()

    result = []
    for f in facilities:
        cat = f.category
        agency = cat.agency if cat else None
        result.append({
            "facility_id": f.facility_id,
            "facility_name": f.facility_name,
            "category_id": f.category_id,
            "category_name": cat.category_name.lower() if cat else "facility",
            "latitude": float(f.latitude) if f.latitude else 0.0,
            "longitude": float(f.longitude) if f.longitude else 0.0,
            "address": f.address,
            "status": f.status,
            "agency_name": agency.agency_name if agency else "KMC Department",
            "photo_url": f.photo_url
        })
    return result


@router.get("/facilities/{facility_id}", response_model=FacilityOut)
def get_public_facility(facility_id: int, db: Session = Depends(get_db)):
    """Public detail for a specific facility."""
    f = db.query(Facility).filter(Facility.facility_id == facility_id).first()
    if not f:
        raise HTTPException(status_code=404, detail=f"Facility #{facility_id} not found")
    cat = f.category
    agency = cat.agency if cat else None
    return {
        "facility_id": f.facility_id,
        "facility_name": f.facility_name,
        "category_id": f.category_id,
        "category_name": cat.category_name.lower() if cat else "facility",
        "latitude": float(f.latitude) if f.latitude else 0.0,
        "longitude": float(f.longitude) if f.longitude else 0.0,
        "address": f.address,
        "status": f.status,
        "agency_name": agency.agency_name if agency else "KMC Department",
        "photo_url": f.photo_url
    }


# ==========================================
# Agency Portal Facility Endpoints (/agencies/facilities)
# ==========================================

def _facility_error(exc: ValueError) -> HTTPException:
    if isinstance(exc, facility_service.FacilityNotFound):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, facility_service.FacilityConflict):
        return HTTPException(status_code=409, detail=str(exc))
    return HTTPException(status_code=422, detail=str(exc))


WRITE_ERRORS = (
    facility_service.FacilityNotFound,
    facility_service.FacilityConflict,
    facility_service.InvalidFacility
)


@router.get("/agencies/facilities/categories", response_model=list[FacilityCategoryResponse])
def get_facility_categories(
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Only categories managed by the signed-in agency may be selected."""
    return facility_service.get_categories(db, agency.agency_id)


@router.post("/agencies/facilities/photos", response_model=FacilityPhotoResponse, status_code=201)
async def upload_facility_photo(
    photo: UploadFile = File(...),
    agency: Agency = Depends(get_current_agency)
):
    """Upload a PNG, JPEG, or WEBP photo (maximum 10 MB) before saving the form."""
    try:
        url = await file_service.save_facility_photo(photo, agency.agency_id)
    except file_service.ImageTooLarge as exc:
        raise HTTPException(status_code=413, detail=str(exc)) from exc
    except file_service.InvalidImage as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return FacilityPhotoResponse(photo_url=url)


@router.get("/agencies/facilities", response_model=FacilityListResponse)
def get_facilities(
    search: str | None = Query(default=None, max_length=150),
    category_id: int | None = Query(default=None, gt=0),
    status: FacilityStatus | None = None,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    return facility_service.list_facilities(
        db, agency.agency_id, search, category_id, status, limit, offset
    )


@router.post("/agencies/facilities", response_model=FacilityResponse, status_code=201)
def add_facility(
    data: FacilityCreate,
    agency: Agency = Depends(get_current_agency),
    agent: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    try:
        return facility_service.create_facility(db, agency, agent, data)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc


@router.get("/agencies/facilities/{facility_id}", response_model=FacilityResponse)
def get_agency_facility_by_id(facility: Facility = Depends(get_agency_facility)):
    return facility_service.facility_response(facility)


@router.put("/agencies/facilities/{facility_id}", response_model=FacilityResponse)
def edit_facility(
    data: FacilityUpdate,
    facility: Facility = Depends(get_agency_facility),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    try:
        return facility_service.update_facility(db, agency, facility, data)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc


@router.delete("/agencies/facilities/{facility_id}", status_code=204)
def delete_facility(
    facility: Facility = Depends(get_agency_facility),
    db: Session = Depends(get_db)
):
    try:
        facility_service.delete_facility(db, facility)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc


class RatingInput(BaseModel):
    title: str
    rating: int

@router.get("/facilities/{facility_id}/ratings")
def list_ratings(facility_id: int, db: Session = Depends(get_db)):
    from app.models.rating import Rating
    if db.get(Facility, facility_id) is None:
        raise HTTPException(404, "Facility not found")
    return [{"id": r.rating_id, "name": r.user.full_name, "rating": r.rating,
        "date": r.created_at, "text": r.title}
        for r in db.query(Rating).filter_by(facility_id=facility_id).order_by(Rating.created_at.desc()).all()]

@router.post("/facilities/{facility_id}/ratings", status_code=201)
def add_rating(facility_id: int, data: RatingInput,
    user = Depends(require_user),
    db: Session = Depends(get_db)
):
    from app.models.rating import Rating
    if db.get(Facility, facility_id) is None:
        raise HTTPException(404, "Facility not found")
    if not 1 <= data.rating <= 5 or not 1 <= len(data.title.strip()) <= 200:
        raise HTTPException(422, "Review must have 1?200 characters and a rating from 1 to 5")
    rating = Rating(facility_id=facility_id, user_id=user.user_id, title=data.title.strip(), rating=data.rating)
    db.add(rating)
    db.commit()
    return {"rating_id": rating.rating_id}
