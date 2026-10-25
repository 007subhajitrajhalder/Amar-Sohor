from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User


def update_user(db: Session, user_id: int, user_data):
    statement = select(User).where(User.user_id == user_id)
    result = db.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        return None

    clean_email = user_data.email.strip().lower()
    clean_phone = user_data.phone.strip()
    clean_name = user_data.full_name.strip()

    # Check if new email is already taken by another account
    email_conflict = db.scalar(
        select(User).where(User.email == clean_email, User.user_id != user_id)
    )
    if email_conflict:
        raise HTTPException(
            status_code=409,
            detail="Email address is already in use by another account"
        )

    # Check if new phone is already taken by another account
    phone_conflict = db.scalar(
        select(User).where(User.phone == clean_phone, User.user_id != user_id)
    )
    if phone_conflict:
        raise HTTPException(
            status_code=409,
            detail="Phone number is already registered to another account"
        )

    user.full_name = clean_name
    user.email = clean_email
    user.phone = clean_phone

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):
    statement = select(User).where(User.user_id == user_id)
    result = db.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        return None

    db.delete(user)
    db.commit()

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
