from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import require_role
from app.models.user import User
from app.schemas.admin import CreateAgencyMemberRequest
from app.schemas.user import UserResponse
from app.services import admin_service


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def get_dashboard(
    current_admin: User = Depends(require_role("ADMIN")),
    db: Session = Depends(get_db)
):
    """Unified analytical dashboard metrics computed directly in the database."""
    return admin_service.get_admin_dashboard_stats(db)


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_admin: User = Depends(require_role("ADMIN")),
    db: Session = Depends(get_db)
):
    user = admin_service.get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(
    role: str | None = None,
    current_admin: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):
    return admin_service.get_all_users(db, role=role)


@router.post(
    "/agency-members",
    response_model=UserResponse,
    status_code=201
)
def create_agency_member(
    user_data: CreateAgencyMemberRequest,
    current_admin: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):
    result = admin_service.create_agency_member(
        db,
        user_data
    )

    if result == "EMAIL_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    if result == "PHONE_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Phone number already registered"
        )

    return result


@router.get("/agencies")
def list_agencies(current_admin: User = Depends(require_role("ADMIN")), db: Session = Depends(get_db)):
    from app.models.agency import Agency
    from app.models.report import Report
    from app.models.recommendation import Recommendation
    from app.models.facility import Facility
    agencies = db.query(Agency).all()
    result = []
    for a in agencies:
        cat_ids = [c.category_id for c in a.facility_categories]
        total_facilities = db.query(Facility).filter(Facility.category_id.in_(cat_ids)).count() if cat_ids else 0
        total_reports = db.query(Report).filter(Report.assigned_agency == a.agency_id).count()
        total_recommendations = db.query(Recommendation).filter(Recommendation.assigned_agency == a.agency_id).count()
        result.append({
            "agency_id": a.agency_id,
            "agency_name": a.agency_name,
            "department_type": a.department_type,
            "member_count": len(a.members),
            "total_facilities": total_facilities,
            "total_reports": total_reports,
            "total_recommendations": total_recommendations,
        })
    return result


@router.get("/agency-members")
def list_members(agency_id: int | None = None, current_admin: User = Depends(require_role("ADMIN")), db: Session = Depends(get_db)):
    from app.models.agency_member import AgencyMember
    from app.services.agency_service import format_agent_details
    query = db.query(AgencyMember)
    if agency_id is not None:
        query = query.filter(AgencyMember.agency_id == agency_id)
    from app.models.report import Report
    from app.models.recommendation import Recommendation
    from app.models.facility import Facility
    members = query.all()
    result = []
    for m in members:
        d = format_agent_details(m)
        if d:
            d["allotted_reports"] = db.query(Report).filter(Report.assigned_agent == m.agent_id).count()
            d["allotted_recommendations"] = db.query(Recommendation).filter(Recommendation.assigned_agent == m.agent_id).count()
            d["facilities_count"] = db.query(Facility).filter(Facility.added_by == m.agent_id).count()
            d["allotted_facilities"] = d["facilities_count"]
            result.append(d)
    return result


@router.delete("/agency-members/{agent_id}", status_code=204)
def remove_member(agent_id: int, current_admin: User = Depends(require_role("ADMIN")), db: Session = Depends(get_db)):
    from sqlalchemy import delete
    from sqlalchemy.exc import IntegrityError
    from app.models.agency_member import AgencyMember
    from app.models.report import Report
    from app.models.recommendation import Recommendation
    member = db.get(AgencyMember, agent_id)
    if member is None:
        raise HTTPException(404, "Agency member not found")
    if db.query(Report).filter_by(assigned_agent=agent_id).first() or db.query(Recommendation).filter_by(assigned_agent=agent_id).first():
        raise HTTPException(409, "Member has assigned records; preserve their account")
    user_id = member.user_id
    try:
        db.execute(delete(AgencyMember).where(AgencyMember.agent_id == agent_id))
        db.execute(delete(User).where(User.user_id == user_id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Member has linked records and cannot be deleted") from exc
