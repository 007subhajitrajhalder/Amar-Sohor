from datetime import datetime
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, ConfigDict, Field


class ReportCreate(BaseModel):
    facility_id: int
    title: str
    description: str
    photo_url: Optional[str] = None
    user_id: Optional[int] = None


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    report_id: int
    facility_id: int
    facility_name: Optional[str] = None
    facility_address: Optional[str] = None
    facility_category: Optional[str] = None
    user_id: int
    title: str
    description: str
    photo_url: str
    status: str
    assigned_agency: int
    agency_name: Optional[str] = None
    assigned_agent: Optional[int] = None
    assigned_officer: Optional[str] = None
    assigned_member: Optional[Dict[str, Any]] = None
    agency_notes: Optional[str] = None
    stage: int = 1
    ai_validated: bool | None = None
    ai_status: str | None = None
    created_at: datetime
    resolved_at: datetime | None = None
    citizen_name: str | None = None
    resolution: Dict[str, Any] | None = None


class ResolvedReportResponse(BaseModel):
    report_id: int
    facility_id: int
    facility_name: str
    title: str
    status: Literal["RESOLVED"]
    created_at: datetime
    resolved_at: datetime | None = Field(
        description="Actual completion time; null for legacy records without one"
    )


class ResolvedReportDetail(ResolvedReportResponse):
    description: str
    photo_url: str
    resolution_photo_url: str | None
    resolution_submitted_at: datetime | None = Field(
        description="Latest approved evidence submission time, not the completion time"
    )


class ResolvedReportListResponse(BaseModel):
    items: list[ResolvedReportResponse]
    total: int
    limit: int
    offset: int


class ReportWorkflowUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    status: Literal["PENDING", "UNDER_INVESTIGATION", "RESOLVED"] | None = None
    notes: str | None = Field(default=None, max_length=5000)
    assigned_agent: int | None = Field(default=None, gt=0)
