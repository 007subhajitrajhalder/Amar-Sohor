from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User
def update_user(db: Session, user_id: int, user_data):
    statement = select(User).where(User.user_id == user_id)

    result = db.execute(statement)

    user = result.scalar_one_or_none()

    if user is None:
        return None

    user.full_name = user_data.full_name
    user.email = user_data.email
    user.phone = user_data.phone

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Email or phone already registered") from exc
    db.refresh(user)

    return user

def delete_user(db: Session, user_id: int):
    statement = select(User).where(User.user_id == user_id)

    result = db.execute(statement)

    user = result.scalar_one_or_none()

    if user is None:
        return None

    if user.role != "USER" or user.reports or user.recommendations or user.ratings:
        raise HTTPException(409, "This account has a role or linked records that must be preserved")
    try:
        db.execute(delete(User).where(User.user_id == user_id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Account has linked records") from exc

    return user
    
def create_user(db: Session, user_data):
    hashed_password = hash_password(user_data.password)

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
    
def get_all_users(db: Session):
    statement = select(User)

    result = db.execute(statement)

    return result.scalars().all()


def get_user_by_id(db: Session, user_id: int):
    statement = select(User).where(User.user_id == user_id)

    result = db.execute(statement)

    return result.scalar_one_or_none()