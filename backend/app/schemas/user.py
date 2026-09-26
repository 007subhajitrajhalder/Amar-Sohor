from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str

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