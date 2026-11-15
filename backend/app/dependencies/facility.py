"""Resolve facilities that an authenticated agency is permitted to manage.

Facility routes depend on the current-agency chain and this lookup to constrain
facility operations to categories handled by that agency.
"""

from fastapi import Depends, HTTPException, Path
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.models.agency import Agency
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory


def get_agency_facility(
    facility_id: int = Path(gt=0),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
) -> Facility:
    """Load a facility only when its category is handled by the current agency."""
    facility = db.scalar(
        select(Facility)
        .join(FacilityCategory, Facility.category_id == FacilityCategory.category_id)
        .options(joinedload(Facility.category))
        .where(
            Facility.facility_id == facility_id,
            FacilityCategory.handling_agency == agency.agency_id
        )
    )
    if facility is None:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility
