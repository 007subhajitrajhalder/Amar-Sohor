from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password

class UserUpdate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    
class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)