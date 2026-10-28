from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.models.agency import Agency
from app.models.agency_member import AgencyMember

from app.models.user import User
from app.schemas.admin import CreateAgencyMemberRequest
from app.core.security import hash_password


def create_agency_member(
    db: Session,
    user_data: CreateAgencyMemberRequest
):
    if db.get(Agency, user_data.agency_id) is None:
        raise HTTPException(404, "Agency not found")

    clean_email = user_data.email.strip().lower()
    clean_phone = user_data.phone.strip()

    # Pre-check for duplicate email in database
    existing_email = db.query(User).filter(
        func.lower(User.email) == clean_email
    ).first()
    if existing_email:
        return "EMAIL_EXISTS"

    # Pre-check for duplicate phone number in database
    existing_phone = db.query(User).filter(
        User.phone == clean_phone
    ).first()
    if existing_phone:
        return "PHONE_EXISTS"

    user = User(
        full_name=user_data.full_name.strip(),
        email=clean_email,
        phone=clean_phone,
        password_hash=hash_password(user_data.password),
        role="AGENT"
    )

    try:
        db.add(user)
        db.flush()
        db.add(AgencyMember(
            user_id=user.user_id,
            agency_id=user_data.agency_id,
            latitude=user_data.latitude,
            longitude=user_data.longitude
        ))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Email or phone already registered") from exc
    db.refresh(user)

    return user


def get_all_users(db: Session, role: str | None = None):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.all()
    results = []
    for u in users:
        results.append({
            "user_id": u.user_id,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role,
            "created_at": u.created_at,
            "total_reports": len(u.reports) if u.reports else 0,
            "total_recommendations": len(u.recommendations) if u.recommendations else 0,
        })
    return results


def get_user_by_id(db: Session, user_id: int):
    u = db.query(User).filter(User.user_id == user_id).first()
    if not u:
        return None
    return {
        "user_id": u.user_id,
        "full_name": u.full_name,
        "email": u.email,
        "phone": u.phone,
        "role": u.role,
        "created_at": u.created_at,
        "total_reports": len(u.reports) if u.reports else 0,
        "total_recommendations": len(u.recommendations) if u.recommendations else 0,
    }


def get_admin_dashboard_stats(db: Session):
    from sqlalchemy import or_
    from app.models.facility import Facility
    from app.models.report import Report
    from app.models.recommendation import Recommendation

    total_users = db.query(func.count(User.user_id)).scalar() or 0
    total_citizens = db.query(func.count(User.user_id)).filter(User.role == "USER").scalar() or 0
    total_officers = db.query(func.count(User.user_id)).filter(User.role == "AGENT").scalar() or 0
    total_admins = db.query(func.count(User.user_id)).filter(User.role == "ADMIN").scalar() or 0

    total_agencies = db.query(func.count(Agency.agency_id)).scalar() or 0
    total_members = db.query(func.count(AgencyMember.agent_id)).scalar() or 0
    total_facilities = db.query(func.count(Facility.facility_id)).scalar() or 0

    total_reports = db.query(func.count(Report.report_id)).scalar() or 0
    pending_reports = db.query(func.count(Report.report_id)).filter(Report.status == "PENDING").scalar() or 0
    investigating_reports = db.query(func.count(Report.report_id)).filter(Report.status == "UNDER_INVESTIGATION").scalar() or 0
    resolved_reports = db.query(func.count(Report.report_id)).filter(Report.status == "RESOLVED").scalar() or 0

    total_recs = db.query(func.count(Recommendation.recommendation_id)).scalar() or 0
    pending_recs = db.query(func.count(Recommendation.recommendation_id)).filter(
        or_(Recommendation.assigned_agent.is_(None), Recommendation.status.in_(["PENDING", "SUBMITTED"]))
    ).scalar() or 0
    active_recs = db.query(func.count(Recommendation.recommendation_id)).filter(
        Recommendation.status.in_(["ALLOCATED", "UNDER_INVESTIGATION", "APPROVED"])
    ).scalar() or 0
    completed_recs = db.query(func.count(Recommendation.recommendation_id)).filter(
        Recommendation.status == "INSTALLED"
    ).scalar() or 0

    recent_recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).limit(5).all()
    recent_recs_data = []
    for r in recent_recs:
        agent_name = r.assigned_member.user.full_name if (r.assigned_member and r.assigned_member.user) else None
        recent_recs_data.append({
            "id": r.recommendation_id,
            "title": r.title,
            "address": r.address,
            "status": r.status,
            "category_name": r.category.category_name if r.category else (r.facility_type or "facility"),
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "assigned_member": agent_name,
            "assigned_agent_id": r.assigned_agent,
        })

    return {
        "users": {
            "total": total_users,
            "citizens": total_citizens,
            "officers": total_officers,
            "admins": total_admins,
        },
        "agencies": {
            "total": total_agencies,
            "members": total_members,
            "facilities": total_facilities,
        },
        "complaints": {
            "total": total_reports,
            "pending": pending_reports,
            "under_investigation": investigating_reports,
            "resolved": resolved_reports,
        },
        "recommendations": {
            "total": total_recs,
            "pending": pending_recs,
            "active": active_recs,
            "completed": completed_recs,
            "recent": recent_recs_data,
        }
    }
