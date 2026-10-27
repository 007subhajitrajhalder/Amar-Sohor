from datetime import datetime
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, ConfigDict, Field


class RecommendationCreate(BaseModel):
    category_id: Optional[int] = None
    facility_type: Optional[str] = None
    title: str
    description: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    landmark: Optional[str] = None
    photo_url: Optional[str] = None
    user_id: Optional[int] = None


class RecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    recommendation_id: int
    user_id: int
    category_id: int
    category_name: Optional[str] = None
    facility_type: Optional[str] = None
    facility_label: Optional[str] = None
    title: str
    description: str
    address: str
    landmark: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: str
    status: str
    assigned_agency: Optional[int] = None
    agency_name: Optional[str] = None
    assigned_agent: Optional[int] = None
    assigned_member: Optional[Dict[str, Any]] = None
    review_department: Optional[str] = None
    review_notes: Optional[str] = None
    stage: int = 1
    ai_validated: bool | None = None
    ai_status: str | None = None
    created_at: datetime
    installed_at: datetime | None = None
    citizen_name: str | None = None
    citizen_email: str | None = None
    citizen_phone: str | None = None
    history: list[Dict[str, Any]] = Field(default_factory=list)


class AllocateRecommendationPayload(BaseModel):
    agent_id: Optional[int] = None
    agent_email: Optional[str] = None
    notes: Optional[str] = None


class RecommendationWorkflowUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    status: Literal["UNDER_INVESTIGATION", "APPROVED", "REJECTED"]
    notes: str = Field(min_length=1, max_length=1000)
