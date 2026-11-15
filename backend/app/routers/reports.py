"""Authenticated citizen grievances and role-scoped agency/admin resolution workflows."""

import base64
import logging
from typing import List, Optional
from datetime import date, datetime, timezone, timedelta
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
    ReportImageValidationResponse, ResolutionValidationResponse, ReportRejectRequest
)
from app.services import report_service, file_service
from app.services.ai_service import (
    classify_image, classify_dustbin_image, classify_toilet_image,
    classify_drinking_water_image, classify_parking_image,
    verify_resolution_evidence
)

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
    Rejects irrelevant images; accepts facility images and provides AI confidence scores.
    Also validates facility status and active grievance cooldowns.
    """
    facility = db.get(Facility, facility_id)
    if facility is None:
        raise HTTPException(404, "Facility not found")

    cat_name = facility.category.category_name.lower() if facility.category else ""
    is_dustbin = any(k in cat_name for k in ["dustbin", "waste", "garbage", "trash"])
    is_toilet = any(k in cat_name for k in ["toilet", "washroom", "restroom", "urinal", "lavatory"])
    is_water = any(k in cat_name for k in ["water", "drinking", "tap", "dispenser", "fountain"])
    is_parking = any(k in cat_name for k in ["parking", "carpark", "garage", "vehicle"])

    facility_type = "toilet" if is_toilet else "water" if is_water else "parking" if is_parking else "dustbin" if is_dustbin else "other"

    # 1. Facility Operational Status Check
    if facility.status == "UNDER_REPAIR":
        return {
            "is_dustbin": is_dustbin,
            "is_toilet": is_toilet,
            "facility_type": facility_type,
            "status": "REJECTED",
            "predicted_class": None,
            "confidence": None,
            "message": "Reporting Locked: This facility is currently marked as Under Repair. Agency personnel are actively working on-site."
        }
    elif facility.status == "SUSPENDED":
        return {
            "is_dustbin": is_dustbin,
            "is_toilet": is_toilet,
            "facility_type": facility_type,
            "status": "REJECTED",
            "predicted_class": None,
            "confidence": None,
            "message": "Reporting Locked: This facility is currently Suspended from civic operations."
        }

    # 2. Active Unresolved Report Check (Duplicate Prevention)
    active_report = db.query(Report).filter(
        Report.facility_id == facility_id,
        Report.status.in_(["PENDING", "UNDER_INVESTIGATION"])
    ).order_by(Report.report_id.desc()).first()
    if active_report:
        status_disp = active_report.status.replace("_", " ").title()
        return {
            "is_dustbin": is_dustbin,
            "is_toilet": is_toilet,
            "facility_type": facility_type,
            "status": "REJECTED",
            "predicted_class": None,
            "confidence": None,
            "message": f"Active Grievance In Progress: Report #{active_report.report_id} ('{active_report.title}') is already {status_disp} for this facility. New submissions are temporarily paused until resolved."
        }

    # 3. 24-hour Rejection Cooldown (Anti-Spam)
    one_day_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=1)
    recent_rejected = db.query(Report).filter(
        Report.facility_id == facility_id,
        Report.status == "REJECTED",
        Report.resolved_at >= one_day_ago
    ).order_by(Report.report_id.desc()).first()
    if recent_rejected:
        return {
            "is_dustbin": is_dustbin,
            "is_toilet": is_toilet,
            "facility_type": facility_type,
            "status": "REJECTED",
            "predicted_class": None,
            "confidence": None,
            "message": "Submissions Paused: A recent grievance on this facility was reviewed and rejected within the last 24 hours. To prevent spam, reporting will reopen after a 24-hour cooldown."
        }

    if not is_dustbin and not is_toilet and not is_water and not is_parking:
        return {
            "is_dustbin": False,
            "is_toilet": False,
            "facility_type": "other",
            "status": "NOT_APPLICABLE",
            "predicted_class": None,
            "confidence": None,
            "message": "AI validation is only active for dustbin, toilet, drinking water, and parking facilities."
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
            name_label = "dustbin or waste"
        elif is_toilet:
            result = classify_toilet_image(photo_bytes)
            name_label = "public toilet or urinal"
        elif is_water:
            result = classify_drinking_water_image(photo_bytes)
            name_label = "drinking water"
        else:
            result = classify_parking_image(photo_bytes)
            name_label = "public parking"

        pred_class = result["predicted_class"]
        conf = result["confidence"]

        if pred_class == "irrelevant_image":
            return {
                "is_dustbin": is_dustbin,
                "is_toilet": is_toilet,
                "facility_type": facility_type,
                "status": "REJECTED",
                "predicted_class": pred_class,
                "confidence": conf,
                "message": f"Validation Rejected: The uploaded photograph does not appear to show a {name_label} facility ({conf * 100:.1f}% confidence). Please attach a clear photo of the facility."
            }

        good_classes = {"normal_bin", "clean_public_toilet", "clean_public_urinal", "functional_drinking_water", "valid_public_parking"}
        is_clean_or_valid = pred_class in good_classes
        formatted_label = pred_class.replace("_", " ").title()

        msg = (
            f"Valid civic issue detected: {formatted_label} ({conf * 100:.1f}% confidence)."
            if not is_clean_or_valid
            else f"AI Assessment: Facility appears operational/intact ({conf * 100:.1f}% confidence). Report accepted for agency on-site assessment."
        )

        return {
            "is_dustbin": is_dustbin,
            "is_toilet": is_toilet,
            "facility_type": facility_type,
            "status": "ACCEPTED",
            "predicted_class": pred_class,
            "confidence": conf,
            "message": msg
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
    Submit an authenticated citizen grievance/report for a specific facility.
    The report routes directly to the agency member who registered this facility.
    AI validation validates image relevance and attaches validation scores in investigation notes.
    """
    facility = db.get(Facility, facility_id)
    if facility is None:
        raise HTTPException(404, "Facility not found")

    # 1. Citizen Rate Limiting (Cooldown): Max 5 report submissions per citizen per hour
    one_hour_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=1)
    recent_reports_count = db.query(Report).filter(
        Report.user_id == current_user.user_id,
        Report.created_at >= one_hour_ago
    ).count()
    if recent_reports_count >= 5:
        raise HTTPException(
            status_code=429,
            detail="Submission Cooldown: You have reached the maximum limit of 5 grievance reports within the past hour. Please wait before submitting another report."
        )

    # 2. Facility Operational Status Check
    if facility.status == "UNDER_REPAIR":
        raise HTTPException(
            status_code=409,
            detail="Reporting Locked: This facility is currently Under Repair. Municipal personnel are already actively working on repairs on-site."
        )
    elif facility.status == "SUSPENDED":
        raise HTTPException(
            status_code=409,
            detail="Reporting Locked: This facility is currently Suspended from civic operations."
        )

    # 3. Active Unresolved Report Check (Duplicate / Ticket Flooding Prevention)
    active_report = db.query(Report).filter(
        Report.facility_id == facility_id,
        Report.status.in_(["PENDING", "UNDER_INVESTIGATION"])
    ).order_by(Report.report_id.desc()).first()
    if active_report:
        status_disp = active_report.status.replace("_", " ").title()
        raise HTTPException(
            status_code=409,
            detail=(
                f"Duplicate Report: An active grievance (Report #{active_report.report_id}: '{active_report.title}') "
                f"is already {status_disp} for this facility. "
                "To prevent ticket flooding, new reports cannot be lodged until the current issue is resolved."
            )
        )

    # 4. 24-hour Rejection Cooldown Check (Anti-Spam)
    one_day_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=1)
    recent_rejected = db.query(Report).filter(
        Report.facility_id == facility_id,
        Report.status == "REJECTED",
        Report.resolved_at >= one_day_ago
    ).order_by(Report.report_id.desc()).first()
    if recent_rejected:
        raise HTTPException(
            status_code=409,
            detail="Reporting Paused: A recent grievance on this facility was reviewed and rejected within the last 24 hours. To prevent spam, reporting for this facility will reopen after a 24-hour cooldown."
        )

    cat_name = facility.category.category_name.lower() if facility.category else ""
    is_dustbin = any(k in cat_name for k in ["dustbin", "waste", "garbage", "trash"])
    is_toilet = any(k in cat_name for k in ["toilet", "washroom", "restroom", "urinal", "lavatory"])
    is_water = any(k in cat_name for k in ["water", "drinking", "tap", "dispenser", "fountain"])
    is_parking = any(k in cat_name for k in ["parking", "carpark", "garage", "vehicle"])

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
    if is_dustbin or is_toilet or is_water or is_parking:
        if not photo_bytes:
            facility_label = "dustbin" if is_dustbin else "public toilet" if is_toilet else "drinking water" if is_water else "parking"
            raise HTTPException(
                status_code=400,
                detail=f"A valid photograph is required for {facility_label} grievance validation."
            )
        try:
            if is_dustbin:
                res = classify_dustbin_image(photo_bytes)
                facility_label = "dustbin or waste"
            elif is_toilet:
                res = classify_toilet_image(photo_bytes)
                facility_label = "public toilet or urinal"
            elif is_water:
                res = classify_drinking_water_image(photo_bytes)
                facility_label = "drinking water"
            else:
                res = classify_parking_image(photo_bytes)
                facility_label = "public parking"

            pred_class = res["predicted_class"]
            conf = res["confidence"]

            if pred_class == "irrelevant_image":
                raise HTTPException(
                    status_code=400,
                    detail=f"AI Validation Rejected: The uploaded photograph does not appear to show a {facility_label} facility ({conf * 100:.1f}% confidence). Please upload a genuine photo of the facility."
                )
            ai_result = {
                "ai_validated": True,
                "ai_status": "ACCEPTED",
                "ai_prediction": pred_class,
                "ai_confidence": conf
            }
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
    """List reports visible to the signed-in role.

    Called by AllComplaintsPage, MyReportsPage, UserDashboardPage, and
    AssignedReportsPage.
    """
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
    """Return a visible report and its investigation status.

    Called by ReportStatusPage, AdminComplaintDetailsPage,
    ReportInvestigationPage, and UploadResolutionPage.
    """
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
    """List resolved reports scoped to the agency; called by PreviouslyResolvedPage."""
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
    """Return resolved-report details and evidence; called by PreviouslyResolvedPage."""
    return report_service.get_resolved_report_details(db, report)


@router.patch("/reports/{report_id}", response_model=ReportResponse)
def update_report_workflow(
    report_id: int, data: ReportWorkflowUpdate,
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Update an authorized report's assignment, status, or notes.

    Called by AdminComplaintDetailsPage and ReportInvestigationPage.
    """
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


@router.post("/reports/{report_id}/validate-resolution", response_model=ResolutionValidationResponse)
async def validate_report_resolution(
    report_id: int,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate an uploaded resolution photo against the original complaint photo and
    facility cleanliness criteria using AI (deep feature similarity + classification).
    Called by frontend UploadResolutionPage before evidence submission.
    """
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(404, "Report not found")

    category_name = report.facility.category.category_name if report.facility and report.facility.category else ""
    category_lower = category_name.lower()
    is_toilet = any(k in category_lower for k in ["toilet", "washroom", "restroom", "urinal"])
    is_water = any(k in category_lower for k in ["water", "drinking", "tap", "dispenser", "fountain"])
    is_parking = any(k in category_lower for k in ["parking", "carpark", "garage"])
    is_dustbin = any(k in category_lower for k in ["bin", "dustbin", "waste", "garbage"])

    if not (is_dustbin or is_toilet or is_water or is_parking):
        return {
            "status": "NOT_APPLICABLE",
            "facility_type": category_name or "general",
            "predicted_class": None,
            "cleanliness_confidence": None,
            "scene_similarity": None,
            "is_duplicate": False,
            "scene_matched": True,
            "message": "AI validation is not mandatory for this facility category.",
            "audit_note": None
        }

    try:
        after_bytes = await photo.read()
        await photo.seek(0)
    except Exception as exc:
        raise HTTPException(400, f"Unable to read resolution image: {str(exc)}")

    before_bytes = None
    if report.photo_url:
        before_bytes = file_service.read_photo_bytes(report.photo_url)

    facility_type = "toilet" if is_toilet else "water" if is_water else "parking" if is_parking else "dustbin"
    try:
        result = verify_resolution_evidence(
            after_bytes=after_bytes,
            before_bytes=before_bytes,
            facility_type=facility_type
        )
        return result
    except Exception as exc:
        logger.error("AI resolution verification error: %s", exc)
        raise HTTPException(400, f"Unable to validate resolution image: {str(exc)}")


@router.post("/reports/{report_id}/resolutions", response_model=ReportResponse, status_code=201)
async def submit_resolution(
    report_id: int, description: str = Form(..., min_length=1, max_length=5000),
    completion_date: date = Form(...), photo: UploadFile = File(...),
    member: AgencyMember = Depends(get_current_agent_member), db: Session = Depends(get_db)
):
    """Submit agency resolution details and evidence for a report; called by UploadResolutionPage."""
    report = db.query(Report).filter_by(report_id=report_id, assigned_agency=member.agency_id).first()
    if report is None:
        raise HTTPException(404, "Report not found")
    if report.status != "UNDER_INVESTIGATION":
        raise HTTPException(409, "Start an investigation before submitting resolution evidence")
    if completion_date > datetime.now(timezone.utc).date() or not description.strip():
        raise HTTPException(422, "Provide a description and a completion date that is not in the future")

    # AI Resolution Validation
    category_name = report.facility.category.category_name if report.facility and report.facility.category else ""
    category_lower = category_name.lower()
    is_toilet = any(k in category_lower for k in ["toilet", "washroom", "restroom", "urinal"])
    is_water = any(k in category_lower for k in ["water", "drinking", "tap", "dispenser", "fountain"])
    is_parking = any(k in category_lower for k in ["parking", "carpark", "garage"])
    is_dustbin = any(k in category_lower for k in ["bin", "dustbin", "waste", "garbage"])

    ai_audit_note = None
    if is_dustbin or is_toilet or is_water or is_parking:
        try:
            after_bytes = await photo.read()
            await photo.seek(0)
            before_bytes = file_service.read_photo_bytes(report.photo_url) if report.photo_url else None
            facility_type = "toilet" if is_toilet else "water" if is_water else "parking" if is_parking else "dustbin"
            ai_res = verify_resolution_evidence(
                after_bytes=after_bytes,
                before_bytes=before_bytes,
                facility_type=facility_type
            )
            if ai_res.get("status") == "REJECTED":
                raise HTTPException(400, ai_res.get("message", "AI resolution validation failed."))
            ai_audit_note = ai_res.get("audit_note")
        except HTTPException:
            raise
        except Exception as exc:
            logger.warning("AI resolution validation warning: %s", exc)

    url = file_service.save_upload_file(photo, "resolutions")
    res_desc = description.strip()
    if ai_audit_note:
        res_desc = f"{res_desc}\n\n[{ai_audit_note}]"

    db.add(ReportResolutionSubmission(
        report_id=report_id,
        agent_id=member.agent_id,
        resolution_photo=url,
        description=res_desc,
        completion_date=completion_date,
        verification_status="APPROVED"
    ))
    report.status = "RESOLVED"
    report.resolved_at = datetime.now(timezone.utc).replace(tzinfo=None)
    if ai_audit_note:
        existing_notes = report.investigation_notes or ""
        report.investigation_notes = (existing_notes + f"\n[Resolution AI Verification: {ai_audit_note}]").strip()
    db.commit()
    db.refresh(report)
    return report_service.report_response(report)


@router.post("/reports/{report_id}/reject", response_model=ReportResponse)
async def reject_report(
    report_id: int,
    reason: str = Form(..., min_length=1, max_length=5000),
    photo: Optional[UploadFile] = File(None),
    member: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    """
    Agency member outright rejects a report.
    - If AI validation score is < 50% or if the facility was identified as a good/clean facility:
      The agent can reject with an explanation, retaining the original report photo (or an uploaded photo).
    - If AI validation score is >= 50% for a bad/damaged facility:
      The agent MUST provide an inspection proof photograph. That photograph is validated and scored by the
      AI module (including background scene consistency matching against the original complaint).
    Sets status to REJECTED, documents the case in previously resolved reports,
    and records an entry in report_resolution_submissions with verification_status = "REJECTED".
    """
    report = db.query(Report).filter_by(report_id=report_id, assigned_agency=member.agency_id).first()
    if report is None:
        raise HTTPException(404, "Report not found")
    if report.status in ("RESOLVED", "REJECTED"):
        raise HTTPException(409, f"Report is already {report.status.lower()} and cannot be changed.")

    rep_resp = report_service.report_response(report)
    ai_conf = rep_resp.get("ai_confidence")
    ai_pred = (rep_resp.get("ai_prediction") or "").lower()

    good_classes = {
        "normal_bin", "clean_public_toilet", "clean_public_urinal",
        "functional_drinking_water", "valid_public_parking"
    }
    is_good_facility = any(k in ai_pred for k in ["clean", "normal", "functional", "valid"]) or ai_pred in good_classes
    is_high_conf_bad_facility = (ai_conf is not None and ai_conf >= 0.50 and not is_good_facility)

    # For bad facility with AI score >= 50%, an inspection proof photo is mandatory
    if is_high_conf_bad_facility and (photo is None or not photo.filename):
        formatted_pred = ai_pred.replace("_", " ").title() if ai_pred else "Facility Defect"
        raise HTTPException(
            status_code=400,
            detail=(
                f"An inspection proof photograph is required to reject this report because the defect "
                f"({formatted_pred}) was validated by AI with {ai_conf * 100:.1f}% confidence (>= 50%). "
                "Please upload genuine photographic proof taken on-site to document this rejection."
            )
        )

    ai_audit_note = None
    saved_photo_url = None

    if photo and photo.filename:
        try:
            photo_bytes = await photo.read()
            await photo.seek(0)
        except Exception as exc:
            raise HTTPException(400, f"Unable to read rejection proof image: {str(exc)}")

        category_name = report.facility.category.category_name if report.facility and report.facility.category else ""
        category_lower = category_name.lower()
        is_toilet = any(k in category_lower for k in ["toilet", "washroom", "restroom", "urinal"])
        is_water = any(k in category_lower for k in ["water", "drinking", "tap", "dispenser", "fountain"])
        is_parking = any(k in category_lower for k in ["parking", "carpark", "garage"])
        is_dustbin = any(k in category_lower for k in ["bin", "dustbin", "waste", "garbage"])

        if is_dustbin or is_toilet or is_water or is_parking:
            before_bytes = file_service.read_photo_bytes(report.photo_url) if report.photo_url else None
            facility_type = "toilet" if is_toilet else "water" if is_water else "parking" if is_parking else "dustbin"
            try:
                ai_res = verify_resolution_evidence(
                    after_bytes=photo_bytes,
                    before_bytes=before_bytes,
                    facility_type=facility_type
                )
                if ai_res.get("status") == "REJECTED":
                    raise HTTPException(400, ai_res.get("message", "Rejection proof photograph failed AI validation."))
                ai_audit_note = ai_res.get("audit_note")
            except HTTPException:
                raise
            except Exception as exc:
                logger.warning("AI rejection photo validation warning: %s", exc)

        saved_photo_url = file_service.save_upload_file(photo, "resolutions")

    final_resolution_photo = saved_photo_url or report.photo_url or ""

    now_dt = datetime.now(timezone.utc).replace(tzinfo=None)
    report.status = "REJECTED"
    report.resolved_at = now_dt

    rejection_text = reason.strip()
    res_desc = f"Rejection Reason: {rejection_text}"
    if ai_audit_note:
        res_desc = f"{res_desc}\n\n[{ai_audit_note}]"

    existing_notes = report.investigation_notes or ""
    note_line = f"[Report Rejected by {member.full_name}: {rejection_text}]"
    if ai_audit_note:
        note_line += f" [{ai_audit_note}]"
    report.investigation_notes = (existing_notes + f"\n{note_line}").strip()

    db.add(ReportResolutionSubmission(
        report_id=report_id,
        agent_id=member.agent_id,
        resolution_photo=final_resolution_photo,
        description=res_desc,
        completion_date=now_dt.date(),
        verification_status="REJECTED"
    ))
    db.commit()
    db.refresh(report)
    return report_service.report_response(report)


@router.post("/reports/{report_id}/reopen", response_model=ReportResponse)
async def reopen_report(
    report_id: int,
    member: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
):
    """
    Agency member reopens a previously rejected report for renewed investigation.
    """
    report = db.query(Report).filter_by(report_id=report_id, assigned_agency=member.agency_id).first()
    if report is None:
        raise HTTPException(404, "Report not found")
    if report.status != "REJECTED":
        raise HTTPException(400, "Only rejected reports can be reopened.")

    report.status = "UNDER_INVESTIGATION"
    report.resolved_at = None
    existing_notes = report.investigation_notes or ""
    report.investigation_notes = (existing_notes + f"\n[Report Reopened by {member.full_name} for Investigation]").strip()

    db.commit()
    db.refresh(report)
    return report_service.report_response(report)
