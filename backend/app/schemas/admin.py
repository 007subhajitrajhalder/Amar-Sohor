from pydantic import BaseModel, EmailStr


class CreateAgencyMemberRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str