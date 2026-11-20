from datetime import datetime, timezone, timedelta
"""Public facility discovery and reviews, plus agency-only facility management."""

from typing import List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import text
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
from app.models.facility_category import FacilityCategory
from app.models.rating import Rating
from app.models.report import Report
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
    """Public facility details, including any active grievance summary."""

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
    additional_notes: Optional[str] = None
    has_active_report: bool = False
    active_report_id: Optional[int] = None
    active_report_title: Optional[str] = None
    active_report_status: Optional[str] = None
    distance_km: Optional[float] = None
    distance_label: Optional[str] = None


class LocationSuggestion(BaseModel):
    """Autocomplete suggestions for location search."""

    label: str
    address: str
    latitude: float
    longitude: float


CATEGORY_SLUG_MAP = {
    "dustbin": 1,
    "toilet": 2,
    "water": 3,
    "water_point": 3,
    "drinking_water": 3,
    "parking": 4,
}

KOLKATA_PRESET_LANDMARKS = [
    {"label": "Park Street", "address": "Park Street, Kolkata, West Bengal", "latitude": 22.5511, "longitude": 88.3524},
    {"label": "Esplanade", "address": "Esplanade, Kolkata, West Bengal", "latitude": 22.5642, "longitude": 88.3427},
    {"label": "Howrah Station", "address": "Howrah Station Area, Howrah, West Bengal", "latitude": 22.5855, "longitude": 88.3426},
    {"label": "Sealdah Station", "address": "Sealdah, Kolkata, West Bengal", "latitude": 22.5674, "longitude": 88.3712},
    {"label": "College Street", "address": "College Street, Kolkata, West Bengal", "latitude": 22.5744, "longitude": 88.3629},
    {"label": "Gariahat", "address": "Gariahat, Kolkata, West Bengal", "latitude": 22.5186, "longitude": 88.3653},
    {"label": "Shyambazar", "address": "Shyambazar, Kolkata, West Bengal", "latitude": 22.6044, "longitude": 88.3705},
    {"label": "Salt Lake Sector V", "address": "Sector V, Salt Lake, Kolkata, West Bengal", "latitude": 22.5726, "longitude": 88.4339},
    {"label": "Bidhannagar / Salt Lake", "address": "Bidhannagar, Kolkata, West Bengal", "latitude": 22.5867, "longitude": 88.4178},
    {"label": "New Market", "address": "New Market, Kolkata, West Bengal", "latitude": 22.5601, "longitude": 88.3527},
    {"label": "Victoria Memorial", "address": "Victoria Memorial, Kolkata, West Bengal", "latitude": 22.5448, "longitude": 88.3426},
    {"label": "Kalighat", "address": "Kalighat, Kolkata, West Bengal", "latitude": 22.5195, "longitude": 88.3444},
    {"label": "Jadavpur", "address": "Jadavpur, Kolkata, West Bengal", "latitude": 22.4988, "longitude": 88.3714},
    {"label": "Ballygunge", "address": "Ballygunge, Kolkata, West Bengal", "latitude": 22.5280, "longitude": 88.3650},
    {"label": "Behala Chowrasta", "address": "Behala Chowrasta, Kolkata, West Bengal", "latitude": 22.4947, "longitude": 88.3129},
    {"label": "New Town / Rajarhat", "address": "New Town, Kolkata, West Bengal", "latitude": 22.5867, "longitude": 88.4754},
    {"label": "Dum Dum", "address": "Dum Dum, Kolkata, West Bengal", "latitude": 22.6433, "longitude": 88.3967},
]


@router.get("/facilities/locations/suggest", response_model=List[LocationSuggestion])
def suggest_locations(
    q: Optional[str] = Query(None, description="Search term for location suggestions"),
    db: Session = Depends(get_db)
):
    """Return autocomplete suggestions for locations based on registered facilities and Kolkata landmarks."""
    search = (q or "").strip().lower()
    seen_labels = set()
    suggestions: List[LocationSuggestion] = []

    # 1. First check matching preset prominent landmarks
    for landmark in KOLKATA_PRESET_LANDMARKS:
        if not search or search in landmark["label"].lower() or search in landmark["address"].lower():
            if landmark["label"] not in seen_labels:
                seen_labels.add(landmark["label"])
                suggestions.append(LocationSuggestion(**landmark))

    # 2. Query distinct facility addresses from database
    fac_query = db.query(Facility.address, Facility.latitude, Facility.longitude).filter(
        Facility.latitude.isnot(None),
        Facility.longitude.isnot(None)
    )
    if search:
        fac_query = fac_query.filter(
            (Facility.address.ilike(f"%{search}%")) | (Facility.facility_name.ilike(f"%{search}%"))
        )
    facility_records = fac_query.all()

    for addr, lat, lng in facility_records:
        if not addr:
            continue
        label = addr.split(",")[0].strip()
        if label not in seen_labels and lat is not None and lng is not None:
            seen_labels.add(label)
            suggestions.append(LocationSuggestion(
                label=label,
                address=addr,
                latitude=float(lat),
                longitude=float(lng)
            ))
        if len(suggestions) >= 12:
            break

    return suggestions[:10]


@router.get("/facilities", response_model=List[FacilityOut])
@router.get("/facilities/", response_model=List[FacilityOut])
def list_facilities(
    category_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(1.0),
    db: Session = Depends(get_db)
):
    """List public facilities, optionally filtered by category and 1 km radius via Haversine SQL formula."""
    target_cat_id = category_id
    if not target_cat_id and category and category.lower() != "all":
        target_cat_id = CATEGORY_SLUG_MAP.get(category.lower())

    # When user location coordinates are provided, compute distance in SQL using Haversine formula
    if latitude is not None and longitude is not None:
        effective_radius = radius_km if radius_km is not None and radius_km > 0 else 1.0
        haversine_sql = text("""
            SELECT f.facility_id,
                   (6371 * acos(
                       LEAST(1.0, GREATEST(-1.0,
                           cos(radians(:user_lat)) * cos(radians(f.latitude)) *
                           cos(radians(f.longitude) - radians(:user_lng)) +
                           sin(radians(:user_lat)) * sin(radians(f.latitude))
                       ))
                   )) AS distance_km
            FROM facilities f
            WHERE f.latitude IS NOT NULL AND f.longitude IS NOT NULL
              AND (:cat_id IS NULL OR f.category_id = :cat_id)
            HAVING distance_km <= :radius_km
            ORDER BY distance_km ASC
        """)
        rows = db.execute(
            haversine_sql,
            {
                "user_lat": latitude,
                "user_lng": longitude,
                "cat_id": target_cat_id,
                "radius_km": effective_radius
            }
        ).fetchall()

        if not rows:
            return []

        facility_ids = [r[0] for r in rows]
        dist_map = {r[0]: float(r[1]) for r in rows}

        facilities = db.query(Facility).filter(Facility.facility_id.in_(facility_ids)).all()
        fac_by_id = {f.facility_id: f for f in facilities}

        result = []
        for fid in facility_ids:
            f = fac_by_id.get(fid)
            if not f:
                continue
            cat = f.category
            agency = cat.agency if cat else None
            dist_km = dist_map.get(fid, 0.0)
            if dist_km < 1.0:
                dist_label = f"{int(round(dist_km * 1000))} m"
            else:
                dist_label = f"{dist_km:.2f} km"

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
                "photo_url": f.photo_url,
                "additional_notes": f.additional_notes,
                "distance_km": round(dist_km, 3),
                "distance_label": dist_label,
            })
        return result

    # When user location is not specified, return all available facilities in the project
    query = db.query(Facility)
    if target_cat_id:
        query = query.filter(Facility.category_id == target_cat_id)
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
            "photo_url": f.photo_url,
            "additional_notes": f.additional_notes,
            "distance_km": None,
            "distance_label": None,
        })
    return result


class PublicCategoryResponse(BaseModel):
    """Category labels and handling-agency data exposed to public clients."""

    category_id: int
    category_name: str
    display_name: str
    agency_name: Optional[str] = None
    handling_agency: Optional[int] = None


@router.get("/facilities/categories", response_model=List[PublicCategoryResponse])
def get_public_categories(db: Session = Depends(get_db)):
    """List public facility categories; called by frontend UserRecommendationPage."""
    categories = db.query(FacilityCategory).order_by(FacilityCategory.category_id).all()
    result = []
    display_labels = {
        "DUSTBIN": "Dustbin / Waste Bin",
        "WATER_POINT": "Drinking Water Point",
        "TOILET": "Public Toilet / Restroom",
        "PARKING": "Parking Spot / Zone",
    }
    for c in categories:
        c_name = c.category_name.upper()
        display = display_labels.get(c_name, c.category_name.replace("_", " ").title())
        agency = c.agency
        result.append({
            "category_id": c.category_id,
            "category_name": c.category_name,
            "display_name": display,
            "agency_name": agency.agency_name if agency else None,
            "handling_agency": c.handling_agency,
        })
    return result


@router.get("/facilities/{facility_id}", response_model=FacilityOut)
def get_public_facility(facility_id: int, db: Session = Depends(get_db)):
    """Return public facility details; called by FacilityDetailsPage and ReportIssuePage."""
    f = db.query(Facility).filter(Facility.facility_id == facility_id).first()
    if not f:
        raise HTTPException(status_code=404, detail=f"Facility #{facility_id} not found")
    cat = f.category
    agency = cat.agency if cat else None
    active_report = db.query(Report).filter(
        Report.facility_id == f.facility_id,
        Report.status.in_(["PENDING", "UNDER_INVESTIGATION"])
    ).order_by(Report.report_id.desc()).first()

    one_day_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=1)
    recent_rejected = None
    if not active_report:
        recent_rejected = db.query(Report).filter(
            Report.facility_id == f.facility_id,
            Report.status == "REJECTED",
            Report.resolved_at >= one_day_ago
        ).order_by(Report.report_id.desc()).first()

    target_report = active_report or recent_rejected

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
        "photo_url": f.photo_url,
        "additional_notes": f.additional_notes,
        "has_active_report": target_report is not None,
        "active_report_id": target_report.report_id if target_report else None,
        "active_report_title": target_report.title if target_report else None,
        "active_report_status": target_report.status if target_report else None,
    }


# ==========================================
# Agency Portal Facility Endpoints (/agencies/facilities)
# ==========================================

def _facility_error(exc: ValueError) -> HTTPException:
    """Translate facility-service write errors into corresponding HTTP errors."""
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
    """List agency-managed categories for AddFacilityPage, EditFacilityPage, and FacilityManagementPage."""
    return facility_service.get_categories(db, agency.agency_id)


@router.post("/agencies/facilities/photos", response_model=FacilityPhotoResponse, status_code=201)
async def upload_facility_photo(
    photo: UploadFile = File(...),
    agency: Agency = Depends(get_current_agency)
):
    """Upload an agency facility photo; called by AddFacilityPage and EditFacilityPage."""
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
    mine: bool = Query(default=False, description="Filter to only facilities added by the logged-in agency member"),
    agency: Agency = Depends(get_current_agency),
    agent: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    """List agency-managed facilities with filters; called by frontend FacilityManagementPage."""
    agent_id = agent.agent_id if mine else None
    return facility_service.list_facilities(
        db, agency.agency_id, search, category_id, status, limit, offset, agent_id=agent_id
    )


@router.post("/agencies/facilities", response_model=FacilityResponse, status_code=201)
def add_facility(
    data: FacilityCreate,
    agency: Agency = Depends(get_current_agency),
    agent: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    """Create a facility for the signed-in agency and member; called by AddFacilityPage."""
    try:
        return facility_service.create_facility(db, agency, agent, data)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc


@router.get("/agencies/facilities/{facility_id}", response_model=FacilityResponse)
def get_agency_facility_by_id(facility: Facility = Depends(get_agency_facility)):
    """Return a facility visible to the signed-in agency; called by EditFacilityPage."""
    return facility_service.facility_response(facility)


@router.put("/agencies/facilities/{facility_id}", response_model=FacilityResponse)
def edit_facility(
    data: FacilityUpdate,
    facility: Facility = Depends(get_agency_facility),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Update an agency-managed facility; called by EditFacilityPage."""
    try:
        return facility_service.update_facility(db, agency, facility, data)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc


@router.delete("/agencies/facilities/{facility_id}", status_code=204)
def delete_facility(
    facility: Facility = Depends(get_agency_facility),
    db: Session = Depends(get_db)
):
    """Delete an agency-managed facility; called by FacilityManagementPage."""
    try:
        facility_service.delete_facility(db, facility)
    except WRITE_ERRORS as exc:
        raise _facility_error(exc) from exc
