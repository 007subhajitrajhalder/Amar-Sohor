from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal
import re

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, TypeAdapter, field_validator


FacilityStatus = Literal["OPEN", "UNDER_REPAIR", "SUSPENDED"]
Latitude = Annotated[Decimal, Field(ge=-90, le=90, max_digits=10, decimal_places=7)]
Longitude = Annotated[Decimal, Field(ge=-180, le=180, max_digits=10, decimal_places=7)]
LOCAL_PHOTO_PATTERN = re.compile(
    r"^/uploads/facilities/[1-9][0-9]*/[a-f0-9]{32}\.(?:jpg|png|webp)$"
)


class FacilityFields(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    facility_name: str = Field(min_length=1, max_length=150)
    category_id: int = Field(gt=0)
    address: str = Field(min_length=1, max_length=5000)
    latitude: Latitude
    longitude: Longitude
    status: FacilityStatus = "OPEN"
    photo_url: str | None = Field(default=None, max_length=1000)
    additional_notes: str | None = Field(default=None, max_length=5000)

    @field_validator("status", mode="before")
    @classmethod
    def normalize_status(cls, value):
        return value.strip().upper().replace(" ", "_") if isinstance(value, str) else value

    @field_validator("photo_url")
    @classmethod
    def validate_photo_url(cls, value):
        if not value:
            return None
        if LOCAL_PHOTO_PATTERN.fullmatch(value):
            return value
        url = TypeAdapter(HttpUrl).validate_python(value)
        if url.username or url.password:
            raise ValueError("Photo URLs must not contain credentials")
        normalized = str(url)
        if len(normalized) > 1000:
            raise ValueError("Photo URL must be at most 1000 characters")
        return normalized


class FacilityCreate(FacilityFields):
    source_recommendation_id: int | None = Field(default=None, gt=0)


class FacilityUpdate(FacilityFields):
    """Required form fields replace their values; omitted photo/notes are preserved."""


class FacilityCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    category_id: int
    category_name: str


class FacilityResponse(BaseModel):
    facility_id: int
    facility_name: str
    category_id: int
    category_name: str
    address: str
    latitude: float
    longitude: float
    status: FacilityStatus
    photo_url: str | None
    additional_notes: str | None
    source_recommendation_id: int | None
    added_by: int
    created_at: datetime


class FacilityStatistics(BaseModel):
    total: int
    open: int
    under_repair: int
    suspended: int
    needs_attention: int


class FacilityListResponse(BaseModel):
    items: list[FacilityResponse]
    total: int = Field(description="Number matching the current filters")
    limit: int
    offset: int
    statistics: FacilityStatistics = Field(description="Unfiltered agency counts")


class FacilityPhotoResponse(BaseModel):
    photo_url: str
