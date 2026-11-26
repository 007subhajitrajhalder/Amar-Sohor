"""Validation and response contracts for authentication API workflows."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class RegisterRequest(BaseModel):
    """Validate registration details accepted by the auth router."""

    model_config = ConfigDict(extra="forbid")
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, password: str) -> str:
        """Reject passwords exceeding bcrypt's 72-byte input limit."""
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password


class LoginRequest(BaseModel):
    """Validate credentials submitted to the login route."""

    email: EmailStr
    password: str


class VerifyEmailRequest(BaseModel):
    """Validate the registration OTP submitted from the sign-in page."""

    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")


class CheckEmailRequest(BaseModel):
    """Validate the email lookup payload used by account-check routes."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Validate the email, replacement password, and code for password reset."""

    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    new_password: str = Field(min_length=8)
    otp: str = Field(min_length=1, max_length=10)

    @field_validator("new_password")
    @classmethod
    def password_must_fit_bcrypt(cls, password: str) -> str:
        """Reject replacement passwords exceeding bcrypt's 72-byte input limit."""
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password


class AuthUser(BaseModel):
    """Describe the authenticated user data returned by auth endpoints."""

    user_id: int
    full_name: str
    email: str
    phone: str
    role: str
    agency_id: Optional[int] = None


class TokenResponse(BaseModel):
    """Represent the access token and user details returned after login."""

    access_token: str
    token_type: str = "bearer"
    user: AuthUser
