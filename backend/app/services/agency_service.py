from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.agency import Agency
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory
from app.models.report import Report
from app.schemas.agency import (
    AgencyDashboardResponse,
    AgencyDashboardStatistics,
    AgencyReportStatusDistribution
)


def get_agency_dashboard(db: Session, agency: Agency) -> AgencyDashboardResponse:
    """Build the dashboard for an agency resolved by the authorization dependency."""
    report_counts = dict(
        db.execute(
            select(Report.status, func.count(Report.report_id))
            .where(Report.assigned_agency == agency.agency_id)
            .group_by(Report.status)
        ).all()
    )

    # Category ownership determines responsibility, not the member who added
    # the facility. Include OPEN, UNDER_REPAIR, and SUSPENDED facilities.
    facility_count = db.scalar(
        select(func.count(Facility.facility_id))
        .join(FacilityCategory, Facility.category_id == FacilityCategory.category_id)
        .where(FacilityCategory.handling_agency == agency.agency_id)
    )

    total_reports = sum(report_counts.values())
    status_distribution = [
        AgencyReportStatusDistribution(
            status=report_status,
            title=title,
            count=report_counts.get(report_status, 0),
            percentage=(
                round(report_counts.get(report_status, 0) * 100 / total_reports, 2)
                if total_reports else 0.0
            )
        )
        for report_status, title in (
            ("PENDING", "Pending"),
            ("UNDER_INVESTIGATION", "Under Investigation"),
            ("RESOLVED", "Resolved")
        )
    ]

    return AgencyDashboardResponse(
        agency_id=agency.agency_id,
        agency_name=agency.agency_name,
        department_type=agency.department_type,
        statistics=AgencyDashboardStatistics(
            pending=report_counts.get("PENDING", 0),
            under_investigation=report_counts.get("UNDER_INVESTIGATION", 0),
            resolved=report_counts.get("RESOLVED", 0),
            facilities=facility_count
        ),
        total_reports=total_reports,
        status_distribution=status_distribution
    )
