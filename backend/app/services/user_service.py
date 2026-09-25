from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User

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