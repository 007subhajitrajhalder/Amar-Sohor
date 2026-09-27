from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.core.security import hash_password


def register_user(db: Session, user_data):

    # Check whether email already exists
    statement = select(User).where(
        User.email == user_data.email
    )

    result = db.execute(statement)

    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        return "EMAIL_EXISTS"

    # Check whether phone already exists
    statement = select(User).where(
        User.phone == user_data.phone
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
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        role="USER"
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user

def login_user(db: Session, user_data):

    # Find user by email
    statement = select(User).where(
        User.email == user_data.email
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