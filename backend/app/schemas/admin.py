from typing import Optional
from pydantic import Field, field_validator
from app.schemas.auth import RegisterRequest


class CreateAgencyMemberRequest(RegisterRequest):
    agency_id: int = Field(gt=0)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)

    @field_validator("latitude", "longitude", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "" or v is None:
            return None
        return float(v)
