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
    current_admin: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):
    return admin_service.get_all_users(db)


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
    return [{"agency_id": a.agency_id, "agency_name": a.agency_name,
        "department_type": a.department_type, "member_count": len(a.members)} for a in db.query(Agency).all()]

@router.get("/agency-members")
def list_members(agency_id: int | None = None, current_admin: User = Depends(require_role("ADMIN")), db: Session = Depends(get_db)):
    from app.models.agency_member import AgencyMember
    from app.services.agency_service import format_agent_details
    query = db.query(AgencyMember)
    if agency_id is not None:
        query = query.filter(AgencyMember.agency_id == agency_id)
    return [format_agent_details(m) for m in query.all()]


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
