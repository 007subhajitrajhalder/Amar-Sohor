from typing import List, Optional
from datetime import date, datetime, timezone
from fastapi import HTTPException
from app.dependencies.auth import get_current_user, require_user, get_current_agent_member
from app.dependencies.access import scoped_query, visible_record
from app.models.user import User
from app.models.agency_member import AgencyMember
from app.models.report_resolution_submission import ReportResolutionSubmission
from app.schemas.report import ReportWorkflowUpdate
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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    """
    Submit a citizen grievance/report for a specific facility.
    The report routes directly to the agency member who registered this facility.
    """
    final_photo_url = ""

    if photo and photo.filename:
        final_photo_url = file_service.save_upload_file(photo, "reports")
    elif photo_url:
        final_photo_url = file_service.save_base64_or_url_photo(photo_url, "reports")

    effective_user_id = current_user.user_id

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
    mine: bool = Query(default=False, description="Filter to reports assigned to the current agent"),
    submitted_by_me: bool = Query(default=False, description="Filter to reports submitted by the current user"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all reports or filter by citizen user_id / assigned agent."""
    if submitted_by_me:
        query = db.query(Report).filter(Report.user_id == current_user.user_id)
    else:
        query = scoped_query(db, Report, current_user)
    if mine and current_user.role in ("AGENT", "AGENCY"):
        member = db.query(AgencyMember).filter_by(user_id=current_user.user_id).first()
        if member:
            query = query.filter(Report.assigned_agent == member.agent_id)
    return report_service.get_all_reports(db=db, user_id=user_id, query=query)


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve details and investigation status of a specific report."""
    report = visible_record(db, Report, Report.report_id, report_id, current_user)
    return report_service.report_response(report)


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
    mine: bool = Query(default=False, description="Filter to only reports allotted to or resolved by the logged-in agency member"),
    agency: Agency = Depends(get_current_agency),
    agent: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    """Retrieve resolved reports scoped to the signed-in agency."""
    agent_id = agent.agent_id if mine else None
    return report_service.list_resolved_reports(db, agency.agency_id, search, limit, offset, agent_id=agent_id)


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


@router.patch("/reports/{report_id}", response_model=ReportResponse)
def update_report_workflow(
    report_id: int, data: ReportWorkflowUpdate,
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    if current_user.role not in ("ADMIN", "AGENT", "AGENCY"):
        raise HTTPException(403, "Agency or admin access required")
    report = visible_record(db, Report, Report.report_id, report_id, current_user)
    if report.status == "RESOLVED":
        raise HTTPException(409, "Resolved reports cannot be changed")
    if "assigned_agent" in data.model_fields_set:
        if current_user.role != "ADMIN":
            raise HTTPException(403, "Only administrators can assign reports")
        member = db.get(AgencyMember, data.assigned_agent)
        if not member or member.agency_id != report.assigned_agency:
            raise HTTPException(422, "Select a member of the assigned agency")
        report.assigned_agent = member.agent_id
    if data.status == "RESOLVED":
        if current_user.role != "ADMIN":
            raise HTTPException(403, "Resolution requires administrative approval")
        evidence = db.query(ReportResolutionSubmission).join(AgencyMember).filter(
            ReportResolutionSubmission.report_id == report_id,
            AgencyMember.agency_id == report.assigned_agency,
            ReportResolutionSubmission.verification_status == "PENDING"
        ).order_by(ReportResolutionSubmission.resolution_id.desc()).first()
        if evidence is None:
            raise HTTPException(409, "No pending resolution evidence to approve")
        evidence.verification_status = "APPROVED"
        report.resolved_at = datetime.now(timezone.utc).replace(tzinfo=None)
    elif data.status == "PENDING" and current_user.role != "ADMIN":
        raise HTTPException(403, "Only administrators can reset a report")
    if data.status is not None:
        report.status = data.status
    if data.notes is not None:
        report.investigation_notes = data.notes
    db.commit()
    db.refresh(report)
    return report_service.report_response(report)


@router.post("/reports/{report_id}/resolutions", response_model=ReportResponse, status_code=201)
async def submit_resolution(
    report_id: int, description: str = Form(..., min_length=1, max_length=5000),
    completion_date: date = Form(...), photo: UploadFile = File(...),
    member: AgencyMember = Depends(get_current_agent_member), db: Session = Depends(get_db)
):
    report = db.query(Report).filter_by(report_id=report_id, assigned_agency=member.agency_id).first()
    if report is None:
        raise HTTPException(404, "Report not found")
    if report.status != "UNDER_INVESTIGATION":
        raise HTTPException(409, "Start an investigation before submitting resolution evidence")
    if completion_date > datetime.now(timezone.utc).date() or not description.strip():
        raise HTTPException(422, "Provide a description and a completion date that is not in the future")
    url = file_service.save_upload_file(photo, "resolutions")
    db.add(ReportResolutionSubmission(report_id=report_id, agent_id=member.agent_id,
        resolution_photo=url, description=description.strip(), completion_date=completion_date,
        verification_status="APPROVED"))
    report.status = "RESOLVED"
    report.resolved_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    db.refresh(report)
    return report_service.report_response(report)
