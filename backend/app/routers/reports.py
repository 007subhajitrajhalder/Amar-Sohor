import base64
import logging
from typing import List, Optional
from datetime import date, datetime, timezone
from fastapi import HTTPException
from app.dependencies.auth import get_current_user, require_user, get_current_agent_member
from app.dependencies.access import scoped_query, visible_record
from app.models.user import User
from app.models.agency_member import AgencyMember
from app.models.facility import Facility
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
    ReportResponse, ResolvedReportDetail, ResolvedReportListResponse,
    ReportImageValidationResponse
)
from app.services import report_service, file_service
from app.services.ai_service import classify_image, classify_dustbin_image, classify_toilet_image

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Reports & Grievances"]
)


# ==========================================
# Citizen Grievance Endpoints (/reports)
# ==========================================

@router.post("/reports/validate-image", response_model=ReportImageValidationResponse)
async def validate_report_image(
    facility_id: int = Form(...),
    photo: Optional[UploadFile] = File(None),
    photo_url: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    """
    Validate an uploaded image for a facility report using AI.
    Applies to dustbin facilities (overflow / broken bin) and
    public toilet facilities (dirty / broken toilet or urinal).
    """
    facility = db.get(Facility, facility_id)
    if facility is None:
        raise HTTPException(404, "Facility not found")

    cat_name = facility.category.category_name.lower() if facility.category else ""
    is_dustbin = any(k in cat_name for k in ["dustbin", "waste", "garbage", "trash"])
    is_toilet = any(k in cat_name for k in ["toilet", "washroom", "restroom", "urinal", "lavatory"])

    if not is_dustbin and not is_toilet:
        return {
            "is_dustbin": False,
            "is_toilet": False,
            "facility_type": "other",
            "status": "NOT_APPLICABLE",
            "predicted_class": None,
            "confidence": None,
            "message": "AI validation is only active for dustbin and public toilet facilities."
        }

    photo_bytes = None
    if photo and photo.filename:
        photo_bytes = await photo.read()
    elif photo_url and photo_url.startswith("data:image/"):
        try:
            _, encoded = photo_url.split(",", 1)
            photo_bytes = base64.b64decode(encoded)
        except Exception:
            photo_bytes = None

    if not photo_bytes:
        raise HTTPException(400, "Please upload or select an image file to validate.")

    try:
        if is_dustbin:
            result = classify_dustbin_image(photo_bytes)
            pred_class = result["predicted_class"]
            conf = result["confidence"]

            if pred_class in ("overflowing_dustbin", "broken_bin"):
                label = "Overflowing Dustbin" if pred_class == "overflowing_dustbin" else "Broken / Damaged Bin"
                return {
                    "is_dustbin": True,
                    "is_toilet": False,
                    "facility_type": "dustbin",
                    "status": "ACCEPTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Valid dustbin issue detected: {label} ({conf * 100:.1f}% confidence)."
                }
            elif pred_class == "normal_bin":
                return {
                    "is_dustbin": True,
                    "is_toilet": False,
                    "facility_type": "dustbin",
                    "status": "REJECTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Validation Rejected: The dustbin appears clean and intact with no overflow or damage detected ({conf * 100:.1f}% confidence). Please attach a photo clearly showing the problem."
                }
            else:
                return {
                    "is_dustbin": True,
                    "is_toilet": False,
                    "facility_type": "dustbin",
                    "status": "REJECTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Validation Rejected: The photo does not appear to show a dustbin or waste management problem ({conf * 100:.1f}% confidence). Please attach a clear photo of the civic issue."
                }
        else:
            # is_toilet
            result = classify_toilet_image(photo_bytes)
            pred_class = result["predicted_class"]
            conf = result["confidence"]

            toilet_accepted_labels = {
                "dirty_public_toilet": "Dirty Public Toilet",
                "dirty_public_urinal": "Dirty Public Urinal",
                "broken_public_toilet": "Broken / Damaged Public Toilet",
                "broken_public_urinal": "Broken / Damaged Public Urinal",
            }

            if pred_class in toilet_accepted_labels:
                label = toilet_accepted_labels[pred_class]
                return {
                    "is_dustbin": False,
                    "is_toilet": True,
                    "facility_type": "toilet",
                    "status": "ACCEPTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Valid public sanitation issue detected: {label} ({conf * 100:.1f}% confidence)."
                }
            elif pred_class in ("clean_public_toilet", "clean_public_urinal"):
                return {
                    "is_dustbin": False,
                    "is_toilet": True,
                    "facility_type": "toilet",
                    "status": "REJECTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Validation Rejected: The public toilet/urinal appears clean and in good condition with no hygiene or defect issues detected ({conf * 100:.1f}% confidence). Please attach a photo clearly showing the problem."
                }
            else:
                return {
                    "is_dustbin": False,
                    "is_toilet": True,
                    "facility_type": "toilet",
                    "status": "REJECTED",
                    "predicted_class": pred_class,
                    "confidence": conf,
                    "message": f"Validation Rejected: The photo does not appear to show a public toilet or urinal issue ({conf * 100:.1f}% confidence). Please attach a clear photo of the civic issue."
                }
    except Exception as exc:
        raise HTTPException(400, f"Unable to validate image: {str(exc)}")


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
    For dustbin and public toilet facilities, the attached photograph is validated by AI.
    """
    facility = db.get(Facility, facility_id)
    if facility is None:
        raise HTTPException(404, "Facility not found")

    cat_name = facility.category.category_name.lower() if facility.category else ""
    is_dustbin = any(k in cat_name for k in ["dustbin", "waste", "garbage", "trash"])
    is_toilet = any(k in cat_name for k in ["toilet", "washroom", "restroom", "urinal", "lavatory"])

    photo_bytes = None
    if photo and photo.filename:
        photo_bytes = await photo.read()
        await photo.seek(0)
    elif photo_url and photo_url.startswith("data:image/"):
        try:
            _, encoded = photo_url.split(",", 1)
            photo_bytes = base64.b64decode(encoded)
        except Exception:
            photo_bytes = None

    ai_result = None
    if is_dustbin:
        if not photo_bytes:
            raise HTTPException(
                status_code=400,
                detail="A valid photograph is required for dustbin grievance validation."
            )
        try:
            res = classify_dustbin_image(photo_bytes)
            pred_class = res["predicted_class"]
            conf = res["confidence"]

            if pred_class in ("overflowing_dustbin", "broken_bin"):
                ai_result = {
                    "ai_validated": True,
                    "ai_status": "ACCEPTED",
                    "ai_prediction": pred_class,
                    "ai_confidence": conf
                }
            elif pred_class == "normal_bin":
                raise HTTPException(
                    status_code=400,
                    detail=f"AI Validation Rejected: The dustbin appears intact and normal with no overflow or damage detected ({conf * 100:.1f}% confidence). Please upload a photograph clearly showing the overflow or defect to submit this report."
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"AI Validation Rejected: The uploaded photograph does not appear to show a dustbin or waste problem (classified as irrelevant with {conf * 100:.1f}% confidence). Please upload a genuine photo of the dustbin issue."
                )
        except HTTPException:
            raise
        except ValueError as val_err:
            raise HTTPException(status_code=400, detail=str(val_err))
        except Exception as e:
            logger.warning(f"AI validation runtime error: {e}")

    elif is_toilet:
        if not photo_bytes:
            raise HTTPException(
                status_code=400,
                detail="A valid photograph is required for public toilet grievance validation."
            )
        try:
            res = classify_toilet_image(photo_bytes)
            pred_class = res["predicted_class"]
            conf = res["confidence"]

            if pred_class in ("dirty_public_toilet", "dirty_public_urinal", "broken_public_toilet", "broken_public_urinal"):
                ai_result = {
                    "ai_validated": True,
                    "ai_status": "ACCEPTED",
                    "ai_prediction": pred_class,
                    "ai_confidence": conf
                }
            elif pred_class in ("clean_public_toilet", "clean_public_urinal"):
                raise HTTPException(
                    status_code=400,
                    detail=f"AI Validation Rejected: The public toilet/urinal appears clean and in good condition with no hygiene or defect issues detected ({conf * 100:.1f}% confidence). Please upload a photograph clearly showing the issue to submit this report."
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"AI Validation Rejected: The uploaded photograph does not appear to show a public toilet or urinal issue (classified as irrelevant with {conf * 100:.1f}% confidence). Please upload a genuine photo of the civic issue."
                )
        except HTTPException:
            raise
        except ValueError as val_err:
            raise HTTPException(status_code=400, detail=str(val_err))
        except Exception as e:
            logger.warning(f"AI validation runtime error: {e}")

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
        photo_url=final_photo_url,
        ai_result=ai_result
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
