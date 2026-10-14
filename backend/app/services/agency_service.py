"""
Agency Service for Amar Sohor.
Aligned with project workflow:
1. Report grievances route directly to the agency member who registered the facility (facility.added_by).
2. Facility recommendations are allotted to the Municipal Admin, who allocates them to designated agency members.
"""
from typing import Optional, Tuple, List, Dict, Any
from sqlalchemy.orm import Session

from app.models.agency import Agency
from app.models.agency_member import AgencyMember
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory
from app.models.user import User


def get_facility_in_charge(
    db: Session,
    facility_id: int
) -> Tuple[Optional[Agency], Optional[AgencyMember]]:
    """
    Finds the facility in the database and returns the responsible agency
    and the specific agency member who added/manages this facility.
    """
    facility = db.query(Facility).filter(Facility.facility_id == facility_id).first()
    if not facility:
        return None, None

    agent_member = facility.added_by_agent
    if not agent_member and facility.added_by:
        agent_member = db.query(AgencyMember).filter(AgencyMember.agent_id == facility.added_by).first()

    agency = None
    if agent_member and agent_member.agency:
        agency = agent_member.agency
    elif facility.category and facility.category.agency:
        agency = facility.category.agency
    elif facility.category and facility.category.handling_agency:
        agency = db.query(Agency).filter(Agency.agency_id == facility.category.handling_agency).first()
    else:
        agency = db.query(Agency).first()

    return agency, agent_member


def get_handling_agency_for_category(
    db: Session,
    category_id: int
) -> Optional[Agency]:
    """
    Retrieves the government agency responsible for a specific facility category
    (e.g., KMC SWM for dustbins, KMC Sanitation for toilets, KMC Water for water points,
    Kolkata Police for parking).
    """
    category = db.query(FacilityCategory).filter(
        FacilityCategory.category_id == category_id
    ).first()

    if category and category.agency:
        return category.agency
    elif category and category.handling_agency:
        return db.query(Agency).filter(Agency.agency_id == category.handling_agency).first()

    return db.query(Agency).first()


def get_agency_members_by_category(
    db: Session,
    category_id: int
) -> List[AgencyMember]:
    """
    Returns all agency members belonging to the department responsible for this category,
    enabling the Admin to review and allocate recommendations to suitable department personnel.
    """
    agency = get_handling_agency_for_category(db, category_id)
    if not agency:
        return []

    return db.query(AgencyMember).filter(
        AgencyMember.agency_id == agency.agency_id
    ).all()


def get_agency_members_by_agency(
    db: Session,
    agency_id: int
) -> List[AgencyMember]:
    """Returns all agency members for a given agency."""
    return db.query(AgencyMember).filter(
        AgencyMember.agency_id == agency_id
    ).all()


def get_agency_member_by_id(
    db: Session,
    agent_id: int
) -> Optional[AgencyMember]:
    """Retrieves an agency member by agent_id."""
    return db.query(AgencyMember).filter(AgencyMember.agent_id == agent_id).first()


def format_agent_details(
    member: Optional[AgencyMember],
    distance_km: Optional[float] = None
) -> Optional[Dict[str, Any]]:
    """
    Helper to format agency member info for API responses.
    Provides officer identity, contact info, and department jurisdiction.
    """
    if not member:
        return None

    user = member.user
    agency = member.agency
    return {
        "agent_id": member.agent_id,
        "user_id": member.user_id,
        "full_name": user.full_name if user else "Civic Department Officer",
        "email": user.email if user else None,
        "phone": user.phone if user else None,
        "role": user.role if user else "AGENCY_MEMBER",
        "agency_id": member.agency_id,
        "agency_name": agency.agency_name if agency else "Civic Agency"
    }
