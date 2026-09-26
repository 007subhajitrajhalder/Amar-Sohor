from sqlalchemy import select
from sqlalchemy.orm import Session

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
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=user_data.password
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