"""Contracts describing report submission, staff review, and resolution API workflows."""

from datetime import datetime
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, ConfigDict, Field


class ReportCreate(BaseModel):
    """Describe fields for a citizen report submitted about a facility."""

    facility_id: int
    title: str
    description: str
    photo_url: Optional[str] = None
    user_id: Optional[int] = None


class ReportResponse(BaseModel):
    """Represent a report and related facility, assignment, and resolution data."""

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
    ai_prediction: str | None = None
    ai_confidence: float | None = None
    created_at: datetime
    resolved_at: datetime | None = None
    citizen_name: str | None = None
    citizen_email: str | None = None
    citizen_phone: str | None = None
    resolution: Dict[str, Any] | None = None


class ReportImageValidationResponse(BaseModel):
    """Return the result of validating an image submitted with a report."""

    is_dustbin: bool = False
    is_toilet: Optional[bool] = False
    facility_type: Optional[str] = None
    status: Literal["ACCEPTED", "REJECTED", "NOT_APPLICABLE"]
    predicted_class: Optional[str] = None
    confidence: Optional[float] = None
    message: str


class ResolutionValidationResponse(BaseModel):
    """Return automated and duplicate-check results for submitted resolution evidence."""

    status: Literal["ACCEPTED", "REJECTED", "NOT_APPLICABLE"]
    facility_type: Optional[str] = None
    predicted_class: Optional[str] = None
    cleanliness_confidence: Optional[float] = None
    scene_similarity: Optional[float] = None
    is_duplicate: bool = False
    scene_matched: bool = True
    message: str
    audit_note: Optional[str] = None


class ResolvedReportResponse(BaseModel):
    """Represent a resolved or rejected report in the reports router's listing response."""

    report_id: int
    facility_id: int
    facility_name: str
    title: str
    status: Literal["RESOLVED", "REJECTED"]
    created_at: datetime
    resolved_at: datetime | None = Field(
        description="Actual completion or rejection time; null for legacy records without one"
    )


class ResolvedReportDetail(ResolvedReportResponse):
    """Add report description and resolution evidence metadata to a resolved report."""

    description: str
    photo_url: str
    resolution_photo_url: str | None
    resolution_submitted_at: datetime | None = Field(
        description="Latest approved evidence submission time, not the completion time"
    )
    resolution_description: str | None = None
    verification_status: str | None = None


class ResolvedReportListResponse(BaseModel):
    """Wrap paginated resolved reports returned by the reports API."""

    items: list[ResolvedReportResponse]
    total: int
    limit: int
    offset: int


class ReportWorkflowUpdate(BaseModel):
    """Validate report status, staff notes, and assignment changes from agency routes."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    status: Literal["PENDING", "UNDER_INVESTIGATION", "RESOLVED", "REJECTED"] | None = None
    notes: str | None = Field(default=None, max_length=5000)
    assigned_agent: int | None = Field(default=None, gt=0)


class ReportRejectRequest(BaseModel):
    reason: str = Field(min_length=1, max_length=5000)
