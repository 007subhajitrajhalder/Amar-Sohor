from fastapi import HTTPException
from app.models.recommendation import Recommendation
from app.models.facility_category import FacilityCategory
from app.models.agency_member import AgencyMember
from app.models.recommendation_investigation import RecommendationInvestigation
from app.models.user import User
from app.services.agency_service import format_agent_details

def recommendation_response(rec):
    category, agency, member = rec.category, rec.agency, rec.assigned_member
    history = sorted(rec.investigations, key=lambda item: item.investigation_id)
    category_name = category.category_name
    kind = "water" if "water" in category_name.lower() else "toilet" if "toilet" in category_name.lower() else category_name.lower()
    return {
        "recommendation_id": rec.recommendation_id, "user_id": rec.user_id,
        "citizen_name": rec.user.full_name, "category_id": rec.category_id,
        "category_name": category_name, "facility_type": kind, "facility_label": category_name,
        "title": rec.title, "description": rec.description, "address": rec.address,
        "latitude": float(rec.latitude) if rec.latitude is not None else None,
        "longitude": float(rec.longitude) if rec.longitude is not None else None,
        "photo_url": rec.photo_url, "status": rec.status, "assigned_agency": rec.assigned_agency,
        "agency_name": agency.agency_name if agency else None,
        "assigned_agent": rec.assigned_agent, "assigned_member": format_agent_details(member),
        "review_department": agency.agency_name if agency else None,
        "review_notes": history[-1].description if history else None,
        "history": [{"date": item.submitted_at, "action": item.description,
            "status": item.verification_status} for item in history],
        "stage": {"PENDING": 1, "ALLOCATED": 2, "UNDER_INVESTIGATION": 2, "REJECTED": 2, "APPROVED": 3, "INSTALLED": 5}[rec.status],
        "created_at": rec.created_at
    }

def resolve_category_id(db, value):
    if isinstance(value, int):
        category = db.get(FacilityCategory, value)
    else:
        aliases = {"water": "WATER_POINT", "toilet": "TOILET", "dustbin": "DUSTBIN", "parking": "PARKING"}
        name = aliases.get(str(value).lower(), str(value))
        category = db.query(FacilityCategory).filter(FacilityCategory.category_name.ilike(name)).first()
    if category is None:
        raise HTTPException(422, "Facility category not found")
    return category.category_id

def create_recommendation(db, user_id, title, description, address, category_id_or_type=None,
    latitude=None, longitude=None, landmark=None, photo_url=""):
    category_id = resolve_category_id(db, category_id_or_type)
    category = db.get(FacilityCategory, category_id)
    if not title.strip() or len(title.strip()) > 200 or not description.strip() or not address.strip():
        raise HTTPException(422, "Title (1?200 characters), address and description are required")
    for value, bound in [(latitude, 90), (longitude, 180)]:
        if value is not None and not -bound <= value <= bound:
            raise HTTPException(422, "Coordinates are outside the valid range")
    rec = Recommendation(user_id=user_id, category_id=category_id, title=title.strip(),
        description=description.strip(), address=address.strip() + (f" (Landmark: {landmark.strip()})" if landmark and landmark.strip() else ""),
        latitude=latitude, longitude=longitude, photo_url=photo_url, status="PENDING",
        assigned_agency=category.handling_agency)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return recommendation_response(rec)

def allocate_recommendation(db, recommendation_id, agent_id_or_identifier, notes=None):
    rec = db.get(Recommendation, recommendation_id)
    if rec is None:
        raise HTTPException(404, "Recommendation not found")
    if rec.status not in ("PENDING", "ALLOCATED"):
        raise HTTPException(409, "Only pending or allocated recommendations can be assigned")
    if isinstance(agent_id_or_identifier, int):
        member = db.get(AgencyMember, agent_id_or_identifier)
    else:
        member = db.query(AgencyMember).join(User).filter(User.email == agent_id_or_identifier).first()
    if member is None or member.agency_id != rec.category.handling_agency:
        raise HTTPException(422, "Select a member of the category's managing agency")
    rec.assigned_agent, rec.assigned_agency, rec.status = member.agent_id, member.agency_id, "ALLOCATED"
    db.add(RecommendationInvestigation(recommendation_id=rec.recommendation_id,
        description=notes.strip() if notes and notes.strip() else "Assigned to " + member.user.full_name,
        verification_status="PENDING"))
    db.commit()
    db.refresh(rec)
    return recommendation_response(rec)

def get_all_recommendations(db, user_id=None, query=None):
    query = query if query is not None else db.query(Recommendation)
    if user_id is not None:
        query = query.filter(Recommendation.user_id == user_id)
    return [recommendation_response(r) for r in query.order_by(Recommendation.created_at.desc()).all()]

def get_recommendation_by_id(db, recommendation_id):
    rec = db.get(Recommendation, recommendation_id)
    if rec is None:
        raise HTTPException(404, "Recommendation not found")
    return recommendation_response(rec)
