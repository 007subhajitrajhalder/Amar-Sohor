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
    existing_email = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_email:
        return "EMAIL_EXISTS"

    existing_phone = db.query(User).filter(
        User.phone == user_data.phone
    ).first()

    if existing_phone:
        return "PHONE_EXISTS"

    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password),
        role="AGENT"
    )

    try:
        db.add(user)
        db.flush()
        db.add(AgencyMember(user_id=user.user_id, agency_id=user_data.agency_id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Email or phone already registered") from exc
    db.refresh(user)

    return user

def get_all_users(db: Session):
    return db.query(User).all()
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()