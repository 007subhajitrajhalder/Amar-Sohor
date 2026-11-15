"""Request and response contracts for account-management API workflows."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class UserCreate(BaseModel):
    """Validate account details submitted to the users creation route."""

    full_name: str
    email: EmailStr
    phone: str
    password: str

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, password: str) -> str:
        """Reject passwords exceeding bcrypt's 72-byte input limit."""
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password

class UserUpdate(BaseModel):
    """Validate editable account details for user profile and admin update routes."""

    full_name: str
    email: EmailStr
    phone: str
    
class UserResponse(BaseModel):
    """Represent account details returned by user and admin endpoints."""

    user_id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str
    created_at: datetime
    total_reports: int = 0
    total_recommendations: int = 0

    model_config = ConfigDict(from_attributes=True)