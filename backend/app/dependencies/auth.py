from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.core.security import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM
)

from app.database.connection import get_db
from app.models.user import User

from sqlalchemy.orm import Session


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user_id(
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        return int(user_id)

    except (jwt.InvalidTokenError, ValueError):
        raise credentials_exception


def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user
def require_role(required_role: str):

    def role_checker(
        current_user: User = Depends(get_current_user)
    ):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )

        return current_user

    return role_checker
    
def require_admin(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user
def require_agency(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "AGENCY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agency access required"
        )

    return current_user
def require_user(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "USER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Citizen access required"
        )

    return current_user