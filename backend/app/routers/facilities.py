from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from app.database.connection import get_db
from app.models.facility import Facility

router = APIRouter(
    prefix="/facilities",
    tags=["Facilities"]
)


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


@router.get("", response_model=List[FacilityOut])
@router.get("/", response_model=List[FacilityOut])
def list_facilities(
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
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


@router.get("/{facility_id}", response_model=FacilityOut)
def get_facility(facility_id: int, db: Session = Depends(get_db)):
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

