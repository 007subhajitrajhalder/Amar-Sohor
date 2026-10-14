from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


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
    ai_validated: bool = True
    ai_status: str = "APPROVED"
    created_at: datetime

