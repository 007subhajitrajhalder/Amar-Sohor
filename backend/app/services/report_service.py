from typing import Optional
from fastapi import HTTPException
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, joinedload
from app.models.report import Report
from app.models.facility import Facility
from app.models.agency_member import AgencyMember
from app.models.report_resolution_submission import ReportResolutionSubmission
from app.services.agency_service import get_facility_in_charge, format_agent_details
from app.schemas.report import ResolvedReportResponse, ResolvedReportDetail, ResolvedReportListResponse

def report_response(report):
    facility, agency, member = report.facility, report.agency, report.assigned_member
    evidence = sorted(report.resolution_submissions, key=lambda r: r.resolution_id, reverse=True)
    return {
        "report_id": report.report_id, "facility_id": report.facility_id,
        "facility_name": facility.facility_name, "facility_address": facility.address,
        "facility_category": facility.category.category_name,
        "user_id": report.user_id,
        "citizen_name": report.user.full_name if report.user else "Not recorded",
        "citizen_email": report.user.email if report.user else None,
        "citizen_phone": report.user.phone if report.user else None,
        "title": report.title, "description": report.description, "photo_url": report.photo_url,
        "status": report.status, "assigned_agency": report.assigned_agency,
        "agency_name": agency.agency_name, "assigned_agent": report.assigned_agent,
        "assigned_officer": member.user.full_name if member else None,
        "assigned_member": format_agent_details(member),
        "agency_notes": report.investigation_notes,
        "stage": 4 if report.status == "RESOLVED" else 3 if evidence and evidence[0].verification_status == "PENDING" else 2 if report.status == "UNDER_INVESTIGATION" else 1,
        "created_at": report.created_at, "resolved_at": report.resolved_at,
        "resolution": None if not evidence else {
            "resolution_id": evidence[0].resolution_id, "photo_url": evidence[0].resolution_photo,
            "description": evidence[0].description, "completion_date": evidence[0].completion_date,
            "verification_status": evidence[0].verification_status, "submitted_at": evidence[0].submitted_at
        }
    }

def create_report(db, facility_id, user_id, title, description, photo_url):
    facility = db.get(Facility, facility_id)
    if facility is None:
        raise HTTPException(404, "Facility not found")
    if not title.strip() or not description.strip() or len(title.strip()) > 200:
        raise HTTPException(422, "A title (1?200 characters) and description are required")
    agency, member = get_facility_in_charge(db, facility_id)
    if agency is None:
        raise HTTPException(409, "Facility has no managing agency")
    report = Report(facility_id=facility_id, user_id=user_id, title=title.strip(),
        description=description.strip(), photo_url=photo_url, status="PENDING",
        assigned_agency=agency.agency_id, assigned_agent=member.agent_id if member else None)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report_response(report)

def get_all_reports(db: Session, user_id: Optional[int] = None, query=None):
    query = query if query is not None else db.query(Report)
    if user_id is not None:
        query = query.filter(Report.user_id == user_id)
    return [report_response(r) for r in query.order_by(Report.created_at.desc()).all()]

def get_report_by_id(db, report_id):
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(404, "Report not found")
    return report_response(report)

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
    limit: int = 50, offset: int = 0, agent_id: int | None = None
) -> ResolvedReportListResponse:
    filters = [Report.assigned_agency == agency_id, Report.status == "RESOLVED"]
    if agent_id is not None:
        filters.append(
            or_(
                Report.assigned_agent == agent_id,
                Report.resolution_submissions.any(ReportResolutionSubmission.agent_id == agent_id)
            )
        )
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
