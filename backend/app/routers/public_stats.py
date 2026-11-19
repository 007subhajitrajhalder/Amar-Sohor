"""Public statistics for the Amar Sohor homepage."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory
from app.models.user import User
from app.models.agency_member import AgencyMember

router = APIRouter(tags=["Public Statistics"])


@router.get("/public/stats")
def get_public_stats(db: Session = Depends(get_db)):
    """Return live statistics for the public homepage."""

    total_facilities = db.query(func.count(Facility.facility_id)).scalar() or 0

    total_categories = db.query(func.count(FacilityCategory.category_id)).scalar() or 0

    registered_users = (
        db.query(func.count(User.user_id))
        .filter(User.role == "USER")
        .scalar() or 0
    )

    total_agency_members = (
        db.query(func.count(AgencyMember.agent_id)).scalar() or 0
    )

    return {
        "total_facilities": total_facilities,
        "total_categories": total_categories,
        "registered_users": registered_users,
        "total_agency_members": total_agency_members
    }