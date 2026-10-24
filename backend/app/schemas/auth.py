from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthUser(BaseModel):
    user_id: int
    full_name: str
    email: str
    phone: str
    role: str
    agency_id: Optional[int] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser