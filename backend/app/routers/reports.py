from typing import List, Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.dependencies.report import get_agency_resolved_report
from app.models.agency import Agency
from app.models.report import Report
from app.schemas.report import (
    ReportResponse, ResolvedReportDetail, ResolvedReportListResponse
)
from app.services import report_service, file_service

router = APIRouter(
    tags=["Reports & Grievances"]
)


# ==========================================
# Citizen Grievance Endpoints (/reports)
# ==========================================

@router.post("/reports", response_model=ReportResponse, status_code=201)
@router.post("/reports/", response_model=ReportResponse, status_code=201)
async def submit_report(
    facility_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    photo_url: Optional[str] = Form(None),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Submit a citizen grievance/report for a specific facility.
    The report routes directly to the agency member who registered this facility.
    """
    final_photo_url = "/uploads/reports/default.jpg"

    if photo and photo.filename:
        final_photo_url = file_service.save_upload_file(photo, "reports")
    elif photo_url:
        final_photo_url = file_service.save_base64_or_url_photo(photo_url, "reports")

    effective_user_id = user_id or 10

    created_report = report_service.create_report(
        db=db,
        facility_id=facility_id,
        user_id=effective_user_id,
        title=title,
        description=description,
        photo_url=final_photo_url
    )

    return created_report


@router.get("/reports", response_model=List[ReportResponse])
@router.get("/reports/", response_model=List[ReportResponse])
def get_reports(
    user_id: Optional[int] = Query(None, description="Filter by citizen user_id"),
    db: Session = Depends(get_db)
):
    """Retrieve all reports or filter by citizen user_id."""
    return report_service.get_all_reports(db=db, user_id=user_id)


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve details and investigation status of a specific report."""
    return report_service.get_report_by_id(db=db, report_id=report_id)


# ==========================================
# Agency Portal Resolved Reports (/agencies/reports)
# ==========================================

@router.get(
    "/agencies/reports/resolved",
    response_model=ResolvedReportListResponse,
    responses={
        401: {"description": "Missing or invalid access token"},
        403: {"description": "Agency access required"},
        404: {"description": "Agency membership or resolved report not found"}
    }
)
def get_resolved_reports(
    search: str | None = Query(default=None, max_length=150),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Retrieve resolved reports scoped to the signed-in agency."""
    return report_service.list_resolved_reports(db, agency.agency_id, search, limit, offset)


@router.get(
    "/agencies/reports/resolved/{report_id}",
    response_model=ResolvedReportDetail,
    responses={
        401: {"description": "Missing or invalid access token"},
        403: {"description": "Agency access required"},
        404: {"description": "Agency membership or resolved report not found"}
    }
)
def get_resolved_report(
    report: Report = Depends(get_agency_resolved_report),
    db: Session = Depends(get_db)
):
    """Retrieve resolution details and after-repair evidence for a resolved report."""
    return report_service.get_resolved_report_details(db, report)
