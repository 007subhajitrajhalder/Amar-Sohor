from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.dependencies.report import get_agency_resolved_report
from app.models.agency import Agency
from app.models.report import Report
from app.schemas.report import ResolvedReportDetail, ResolvedReportListResponse
from app.services import report_service


router = APIRouter(
    prefix="/agencies/reports",
    tags=["Agency Reports"],
    responses={
        401: {"description": "Missing or invalid access token"},
        403: {"description": "Agency access required"},
        404: {"description": "Agency membership or resolved report not found"}
    }
)


@router.get("/resolved", response_model=ResolvedReportListResponse)
def get_resolved_reports(
    search: str | None = Query(default=None, max_length=150),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    return report_service.list_resolved_reports(db, agency.agency_id, search, limit, offset)


@router.get("/resolved/{report_id}", response_model=ResolvedReportDetail)
def get_resolved_report(
    report: Report = Depends(get_agency_resolved_report),
    db: Session = Depends(get_db)
):
    return report_service.get_resolved_report_details(db, report)
