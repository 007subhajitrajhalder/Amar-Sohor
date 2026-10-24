from typing import List, Optional, Union
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.recommendation import Recommendation
from app.models.facility_category import FacilityCategory
from app.models.agency import Agency
from app.models.agency_member import AgencyMember
from app.models.user import User
from app.services.agency_service import get_handling_agency_for_category, format_agent_details

CATEGORY_TYPE_MAP = {
    "dustbin": 1,
    "toilet": 2,
    "water": 3,
    "parking": 4,
    "waste": 1,
    "drinking water": 3,
}

TYPE_LABEL_MAP = {
    "dustbin": "Dustbin",
    "toilet": "Public Toilet",
    "water": "Drinking Water Point",
    "parking": "Parking Spot",
}


def resolve_category_id(db: Session, category_id_or_type: Union[int, str, None]) -> int:
    if isinstance(category_id_or_type, int) and category_id_or_type > 0:
        return category_id_or_type

    if isinstance(category_id_or_type, str):
        key = category_id_or_type.strip().lower()
        if key in CATEGORY_TYPE_MAP:
            return CATEGORY_TYPE_MAP[key]

        # Try matching category_name in DB
        db_cat = db.query(FacilityCategory).filter(
            FacilityCategory.category_name.ilike(f"%{key}%")
        ).first()
        if db_cat:
            return db_cat.category_id

    # Fallback to category 1 (DUSTBIN)
    return 1


def create_recommendation(
    db: Session,
    user_id: int,
    title: str,
    description: str,
    address: str,
    category_id_or_type: Union[int, str, None] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    landmark: Optional[str] = None,
    photo_url: str = ""
) -> dict:
    # 1. Resolve category
    category_id = resolve_category_id(db, category_id_or_type)
    category = db.query(FacilityCategory).filter(FacilityCategory.category_id == category_id).first()
    category_name = category.category_name.lower() if category else "dustbin"
    facility_type = "water" if "water" in category_name else category_name.lower()
    facility_label = TYPE_LABEL_MAP.get(facility_type, category.category_name if category else "Civic Facility")

    # 2. Check coordinates
    req_lat = float(latitude) if latitude is not None and latitude != 0 else 22.5726
    req_lon = float(longitude) if longitude is not None and longitude != 0 else 88.3639

    # 3. Handling Agency for the category
    agency = get_handling_agency_for_category(db, category_id)
    agency_id = agency.agency_id if agency else 1
    agency_name = agency.agency_name if agency else "KMC Department"

    # 4. Verify user exists or fallback
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        default_user = db.query(User).filter(User.role == "USER").first() or db.query(User).first()
        user_id = default_user.user_id if default_user else 1

    # 5. Recommendation is allotted to the Admin queue with status PENDING (assigned_agent = None)
    # AI validation is marked approved/bypassed for now.
    full_address = address.strip()
    if landmark and landmark.strip():
        full_address = f"{full_address} (Landmark: {landmark.strip()})"

    review_notes = (
        f"Recommendation submitted by citizen and allotted to Municipal Admin. "
        f"Awaiting administrative review and assignment to designated agency member."
    )

    new_rec = Recommendation(
        user_id=user_id,
        category_id=category_id,
        title=title.strip(),
        description=description.strip(),
        latitude=req_lat,
        longitude=req_lon,
        address=full_address,
        photo_url=photo_url,
        status="PENDING",  # Allotted to Admin for allocation
        assigned_agency=agency_id,
        assigned_agent=None
    )

    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)

    return {
        "recommendation_id": new_rec.recommendation_id,
        "user_id": new_rec.user_id,
        "category_id": new_rec.category_id,
        "category_name": category_name,
        "facility_type": facility_type,
        "facility_label": facility_label,
        "title": new_rec.title,
        "description": new_rec.description,
        "address": new_rec.address,
        "landmark": landmark,
        "latitude": float(new_rec.latitude) if new_rec.latitude else req_lat,
        "longitude": float(new_rec.longitude) if new_rec.longitude else req_lon,
        "photo_url": new_rec.photo_url,
        "status": new_rec.status,
        "assigned_agency": new_rec.assigned_agency,
        "agency_name": agency_name,
        "assigned_agent": None,
        "assigned_member": None,
        "review_department": agency_name,
        "review_notes": review_notes,
        "stage": 1,
        "ai_validated": True,
        "ai_status": "APPROVED",
        "created_at": new_rec.created_at
    }


def allocate_recommendation(
    db: Session,
    recommendation_id: int,
    agent_id_or_identifier: Union[int, str],
    notes: Optional[str] = None
) -> dict:
    """
    Allotted by Admin to a designated agency member.
    Transitions recommendation status from PENDING to ALLOCATED (Stage 2).
    """
    rec = db.query(Recommendation).filter(Recommendation.recommendation_id == recommendation_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail=f"Recommendation #{recommendation_id} not found.")

    # Resolve agent member
    agent_member = None
    try:
        cand_id = int(agent_id_or_identifier)
        agent_member = db.query(AgencyMember).filter(AgencyMember.agent_id == cand_id).first()
        if not agent_member:
            # Check if cand_id matches user_id
            agent_member = db.query(AgencyMember).filter(AgencyMember.user_id == cand_id).first()
    except (ValueError, TypeError):
        pass

    if not agent_member and isinstance(agent_id_or_identifier, str):
        # Match by email or full name
        ident = agent_id_or_identifier.strip().lower()
        agent_member = db.query(AgencyMember).join(User).filter(
            (User.email.ilike(f"%{ident}%")) | (User.full_name.ilike(f"%{ident}%"))
        ).first()

    # Fallback to category agency member if not found
    if not agent_member:
        agent_member = db.query(AgencyMember).filter(
            AgencyMember.agency_id == rec.assigned_agency
        ).first() or db.query(AgencyMember).first()

    if not agent_member:
        raise HTTPException(status_code=400, detail="No suitable agency member found for allocation.")

    # Update recommendation
    rec.assigned_agent = agent_member.agent_id
    rec.assigned_agency = agent_member.agency_id
    rec.status = "ALLOCATED"

    db.commit()
    db.refresh(rec)

    officer_name = agent_member.user.full_name if agent_member.user else "Assigned Agency Officer"
    agency_name = agent_member.agency.agency_name if agent_member.agency else "Responsible Agency"
    agent_info = format_agent_details(agent_member, None)

    alloc_notes = (
        notes.strip() if notes and notes.strip()
        else f"Allocated by System Admin to {officer_name} ({agency_name}) for on-site feasibility survey."
    )

    cat_name = rec.category.category_name.lower() if rec.category else "dustbin"
    fac_type = "water" if "water" in cat_name else cat_name

    return {
        "recommendation_id": rec.recommendation_id,
        "user_id": rec.user_id,
        "category_id": rec.category_id,
        "category_name": cat_name,
        "facility_type": fac_type,
        "facility_label": TYPE_LABEL_MAP.get(fac_type, cat_name.title()),
        "title": rec.title,
        "description": rec.description,
        "address": rec.address,
        "latitude": float(rec.latitude) if rec.latitude else None,
        "longitude": float(rec.longitude) if rec.longitude else None,
        "photo_url": rec.photo_url,
        "status": rec.status,
        "assigned_agency": rec.assigned_agency,
        "agency_name": agency_name,
        "assigned_agent": rec.assigned_agent,
        "assigned_member": agent_info,
        "review_department": agency_name,
        "review_notes": alloc_notes,
        "stage": 2,
        "ai_validated": True,
        "ai_status": "APPROVED",
        "created_at": rec.created_at
    }


def get_all_recommendations(db: Session, user_id: Optional[int] = None) -> List[dict]:
    query = db.query(Recommendation)
    if user_id:
        query = query.filter(Recommendation.user_id == user_id)
    records = query.order_by(Recommendation.created_at.desc()).all()

    result = []
    for r in records:
        cat_name = r.category.category_name.lower() if r.category else "dustbin"
        fac_type = "water" if "water" in cat_name else cat_name
        agency = r.agency
        agent_member = r.assigned_member
        agent_info = format_agent_details(agent_member, None) if agent_member else None

        stage = 4 if r.status == "INSTALLED" else (3 if r.status == "APPROVED" else (2 if r.status in ["ALLOCATED", "UNDER_INVESTIGATION"] else 1))

        alloc_note = (
            f"Assigned to {agent_info['full_name']}."
            if agent_info
            else "Allotted to Municipal Admin. Awaiting agency member allocation."
        )

        result.append({
            "recommendation_id": r.recommendation_id,
            "user_id": r.user_id,
            "category_id": r.category_id,
            "category_name": cat_name,
            "facility_type": fac_type,
            "facility_label": TYPE_LABEL_MAP.get(fac_type, cat_name.title()),
            "title": r.title,
            "description": r.description,
            "address": r.address,
            "latitude": float(r.latitude) if r.latitude else None,
            "longitude": float(r.longitude) if r.longitude else None,
            "photo_url": r.photo_url,
            "status": r.status,
            "assigned_agency": r.assigned_agency,
            "agency_name": agency.agency_name if agency else "KMC Department",
            "assigned_agent": r.assigned_agent,
            "assigned_member": agent_info,
            "review_department": agency.agency_name if agency else "KMC Municipal Board",
            "review_notes": alloc_note,
            "stage": stage,
            "ai_validated": True,
            "ai_status": "APPROVED",
            "created_at": r.created_at
        })
    return result


def get_recommendation_by_id(db: Session, recommendation_id: int) -> dict:
    r = db.query(Recommendation).filter(Recommendation.recommendation_id == recommendation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Recommendation #{recommendation_id} not found.")

    cat_name = r.category.category_name.lower() if r.category else "dustbin"
    fac_type = "water" if "water" in cat_name else cat_name
    agency = r.agency
    agent_member = r.assigned_member
    agent_info = format_agent_details(agent_member, None) if agent_member else None

    stage = 4 if r.status == "INSTALLED" else (3 if r.status == "APPROVED" else (2 if r.status in ["ALLOCATED", "UNDER_INVESTIGATION"] else 1))

    alloc_note = (
        f"Assigned to {agent_info['full_name']}."
        if agent_info
        else "Allotted to Municipal Admin. Awaiting agency member allocation."
    )

    return {
        "recommendation_id": r.recommendation_id,
        "user_id": r.user_id,
        "category_id": r.category_id,
        "category_name": cat_name,
        "facility_type": fac_type,
        "facility_label": TYPE_LABEL_MAP.get(fac_type, cat_name.title()),
        "title": r.title,
        "description": r.description,
        "address": r.address,
        "latitude": float(r.latitude) if r.latitude else None,
        "longitude": float(r.longitude) if r.longitude else None,
        "photo_url": r.photo_url,
        "status": r.status,
        "assigned_agency": r.assigned_agency,
        "agency_name": agency.agency_name if agency else "KMC Department",
        "assigned_agent": r.assigned_agent,
        "assigned_member": agent_info,
        "review_department": agency.agency_name if agency else "KMC Municipal Board",
        "review_notes": alloc_note,
        "stage": stage,
        "ai_validated": True,
        "ai_status": "APPROVED",
        "created_at": r.created_at
    }


