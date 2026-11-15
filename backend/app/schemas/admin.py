"""Request contracts for administrative API operations, consumed by backend routers."""

from typing import Optional
from pydantic import Field, field_validator
from app.schemas.auth import RegisterRequest


class CreateAgencyMemberRequest(RegisterRequest):
    """Validate account and agency details submitted to the admin member-creation route."""

    agency_id: int = Field(gt=0)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)

    @field_validator("latitude", "longitude", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        """Treat empty coordinate form values as absent and coerce provided values to floats."""
        if v == "" or v is None:
            return None
        return float(v)
