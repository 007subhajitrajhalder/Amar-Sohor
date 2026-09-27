from pydantic import BaseModel, EmailStr, field_validator


class RegisterRequest(BaseModel):
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


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
class TokenResponse(BaseModel):
    access_token: str
    token_type: str