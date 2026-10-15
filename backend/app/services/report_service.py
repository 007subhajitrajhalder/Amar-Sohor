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
