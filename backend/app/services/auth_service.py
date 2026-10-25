from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password
from app.models.user import User


def register_user(db: Session, user_data):
    clean_email = user_data.email.strip().lower()
    clean_phone = user_data.phone.strip()
    clean_name = user_data.full_name.strip()

    # Check whether email already exists
    statement = select(User).where(
        User.email == clean_email
    )

    result = db.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        return "EMAIL_EXISTS"

    # Check whether phone already exists
    statement = select(User).where(
        User.phone == clean_phone
    )

    result = db.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        return "PHONE_EXISTS"

    # Hash password
    hashed_password = hash_password(
        user_data.password
    )

    # Create user
    new_user = User(
        full_name=clean_name,
        email=clean_email,
        phone=clean_phone,
        password_hash=hashed_password,
        role="USER"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user_data):
    clean_email = user_data.email.strip().lower()

    # Find user by email
    statement = select(User).where(
        User.email == clean_email
    )

    result = db.execute(statement)
    user = result.scalar_one_or_none()

    # User does not exist
    if user is None:
        return None

    # Check password
    password_correct = verify_password(
        user_data.password,
        user.password_hash
    )

    if not password_correct:
        return None

    return user
