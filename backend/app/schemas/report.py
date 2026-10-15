from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


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
