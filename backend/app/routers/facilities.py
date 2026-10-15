from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.dependencies.auth import get_current_agent_member
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
    prefix="/agencies/facilities",
    tags=["Agency Facilities"],
    responses={
        401: {"description": "Missing or invalid access token"},
        403: {"description": "Agency access required"},
        404: {"description": "Agency membership or requested resource not found"}
    }
)


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


@router.get("/categories", response_model=list[FacilityCategoryResponse])
def get_facility_categories(
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Only categories managed by the signed-in agency may be selected."""
    return facility_service.get_categories(db, agency.agency_id)


@router.post("/photos", response_model=FacilityPhotoResponse, status_code=201)
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


@router.get("", response_model=FacilityListResponse)
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


@router.post("", response_model=FacilityResponse, status_code=201)
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


@router.get("/{facility_id}", response_model=FacilityResponse)
def get_facility(facility: Facility = Depends(get_agency_facility)):
    return facility_service.facility_response(facility)


@router.put("/{facility_id}", response_model=FacilityResponse)
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
