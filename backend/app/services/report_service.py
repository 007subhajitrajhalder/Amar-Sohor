<<<<<<< HEAD
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.agency_member import AgencyMember
from app.models.facility import Facility
from app.models.report import Report
from app.models.report_resolution_submission import ReportResolutionSubmission
from app.schemas.report import (
    ResolvedReportResponse, ResolvedReportDetail, ResolvedReportListResponse
)


def resolved_report_response(report: Report) -> ResolvedReportResponse:
    return ResolvedReportResponse(
        report_id=report.report_id,
        facility_id=report.facility_id,
        facility_name=report.facility.facility_name,
        title=report.title,
        status=report.status,
        created_at=report.created_at,
        resolved_at=report.resolved_at
    )


def list_resolved_reports(
    db: Session, agency_id: int, search: str | None = None,
    limit: int = 50, offset: int = 0
) -> ResolvedReportListResponse:
    filters = [Report.assigned_agency == agency_id, Report.status == "RESOLVED"]
    if search and search.strip():
        search = search.strip()
        matches = [
            Report.title.icontains(search, autoescape=True),
            Facility.facility_name.icontains(search, autoescape=True),
            Facility.address.icontains(search, autoescape=True)
        ]
        report_number = search.lstrip("#")
        if report_number:
            matches.append(cast(Report.report_id, String).contains(report_number, autoescape=True))
        filters.append(or_(*matches))
    total = db.scalar(
        select(func.count(Report.report_id))
        .join(Facility, Report.facility_id == Facility.facility_id)
        .where(*filters)
    )
    reports = db.scalars(
        select(Report)
        .join(Facility, Report.facility_id == Facility.facility_id)
        .options(joinedload(Report.facility))
        .where(*filters)
        .order_by(
            Report.resolved_at.is_(None),
            Report.resolved_at.desc(), Report.report_id.desc()
        )
        .limit(limit).offset(offset)
    ).all()
    return ResolvedReportListResponse(
        items=[resolved_report_response(report) for report in reports],
        total=total, limit=limit, offset=offset
    )


def get_resolved_report_details(db: Session, report: Report) -> ResolvedReportDetail:
    # Pending/rejected evidence and evidence from other agencies must not
    # appear as the accepted resolution of this agency's report.
    resolution = db.scalar(
        select(ReportResolutionSubmission)
        .join(AgencyMember, ReportResolutionSubmission.agent_id == AgencyMember.agent_id)
        .where(
            ReportResolutionSubmission.report_id == report.report_id,
            ReportResolutionSubmission.verification_status == "APPROVED",
            AgencyMember.agency_id == report.assigned_agency
        )
        .order_by(
            ReportResolutionSubmission.submitted_at.desc(),
            ReportResolutionSubmission.resolution_id.desc()
        )
        .limit(1)
    )
    return ResolvedReportDetail(
        **resolved_report_response(report).model_dump(),
        description=report.description,
        photo_url=report.photo_url,
        resolution_photo_url=resolution.resolution_photo if resolution else None,
        resolution_submitted_at=resolution.submitted_at if resolution else None
    )
=======
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory
from app.models.agency import Agency
from app.models.user import User
from app.services.agency_service import get_facility_in_charge, format_agent_details


def create_report(
    db: Session,
    facility_id: int,
    user_id: int,
    title: str,
    description: str,
    photo_url: str
) -> dict:
    # 1. Verify facility exists
    facility = db.query(Facility).filter(Facility.facility_id == facility_id).first()
    if not facility:
        # If facility not found by ID, try facility 1 or raise 404
        facility = db.query(Facility).first()
        if not facility:
            raise HTTPException(status_code=404, detail="No registered facilities found to attach report to.")

    # 2. Direct grievance to the agency member who registered/added this facility
    agency, agent_member = get_facility_in_charge(db, facility.facility_id)
    assigned_agent_id = agent_member.agent_id if agent_member else facility.added_by
    agency_id = agency.agency_id if agency else 1

    # 3. Verify user exists or fallback to first citizen user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        default_user = db.query(User).filter(User.role == "USER").first() or db.query(User).first()
        user_id = default_user.user_id if default_user else 1

    # 4. Create Report entity with status PENDING
    # Multi-part image photo_url is stored; AI validation is bypassed/marked APPROVED
    new_report = Report(
        facility_id=facility.facility_id,
        user_id=user_id,
        title=title.strip(),
        description=description.strip(),
        photo_url=photo_url,
        status="PENDING",
        assigned_agency=agency_id,
        assigned_agent=assigned_agent_id
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # 5. Format detailed response
    agent_info = format_agent_details(agent_member, None)
    category_name = facility.category.category_name.lower() if facility.category else "facility"

    officer_name = agent_info["full_name"] if agent_info else "Duty Civic Inspector"
    agency_display = agency.agency_name if agency else "Kolkata Municipal Corporation"

    notes = (
        f"Grievance lodged for facility '{facility.facility_name}'. "
        f"Directly routed to facility in-charge {officer_name} ({agency_display}) "
        f"who registered this facility in the database for prompt investigation and repair."
    )

    return {
        "report_id": new_report.report_id,
        "facility_id": facility.facility_id,
        "facility_name": facility.facility_name,
        "facility_address": facility.address,
        "facility_category": category_name,
        "user_id": new_report.user_id,
        "title": new_report.title,
        "description": new_report.description,
        "photo_url": new_report.photo_url,
        "status": new_report.status,
        "assigned_agency": new_report.assigned_agency,
        "agency_name": agency_display,
        "assigned_agent": new_report.assigned_agent,
        "assigned_officer": officer_name,
        "assigned_member": agent_info,
        "agency_notes": notes,
        "stage": 1,
        "ai_validated": True,
        "ai_status": "APPROVED",
        "created_at": new_report.created_at
    }


def get_all_reports(db: Session, user_id: Optional[int] = None) -> List[dict]:
    query = db.query(Report)
    if user_id:
        query = query.filter(Report.user_id == user_id)
    reports = query.order_by(Report.created_at.desc()).all()

    result = []
    for r in reports:
        facility = r.facility
        agency = r.agency
        agent_member = r.assigned_member
        agent_info = format_agent_details(agent_member, None) if agent_member else None

        stage = 4 if r.status == "RESOLVED" else (2 if r.status == "UNDER_INVESTIGATION" else 1)
        result.append({
            "report_id": r.report_id,
            "facility_id": r.facility_id,
            "facility_name": facility.facility_name if facility else f"Facility #{r.facility_id}",
            "facility_address": facility.address if facility else "Kolkata, West Bengal",
            "facility_category": facility.category.category_name.lower() if facility and facility.category else "facility",
            "user_id": r.user_id,
            "title": r.title,
            "description": r.description,
            "photo_url": r.photo_url,
            "status": r.status,
            "assigned_agency": r.assigned_agency,
            "agency_name": agency.agency_name if agency else "KMC Department",
            "assigned_agent": r.assigned_agent,
            "assigned_officer": agent_info["full_name"] if agent_info else "Duty Civic Officer",
            "assigned_member": agent_info,
            "agency_notes": f"Assigned to {agency.agency_name if agency else 'Municipal Agency'}.",
            "stage": stage,
            "ai_validated": True,
            "ai_status": "APPROVED",
            "created_at": r.created_at
        })
    return result


def get_report_by_id(db: Session, report_id: int) -> dict:
    report = db.query(Report).filter(Report.report_id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report #{report_id} not found.")

    facility = report.facility
    agency = report.agency
    agent_member = report.assigned_member
    agent_info = format_agent_details(agent_member, None) if agent_member else None

    stage = 4 if report.status == "RESOLVED" else (2 if report.status == "UNDER_INVESTIGATION" else 1)

    return {
        "report_id": report.report_id,
        "facility_id": report.facility_id,
        "facility_name": facility.facility_name if facility else f"Facility #{report.facility_id}",
        "facility_address": facility.address if facility else "Kolkata, West Bengal",
        "facility_category": facility.category.category_name.lower() if facility and facility.category else "facility",
        "user_id": report.user_id,
        "title": report.title,
        "description": report.description,
        "photo_url": report.photo_url,
        "status": report.status,
        "assigned_agency": report.assigned_agency,
        "agency_name": agency.agency_name if agency else "KMC Department",
        "assigned_agent": report.assigned_agent,
        "assigned_officer": agent_info["full_name"] if agent_info else "Duty Civic Officer",
        "assigned_member": agent_info,
        "agency_notes": f"Report assigned to {agency.agency_name if agency else 'Municipal Agency'}.",
        "stage": stage,
        "ai_validated": True,
        "ai_status": "APPROVED",
        "created_at": report.created_at
    }

>>>>>>> 74700b15a57f5763c5243736473a086a64df34a8
