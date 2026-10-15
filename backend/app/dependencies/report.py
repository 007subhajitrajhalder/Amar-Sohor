from fastapi import Depends, HTTPException, Path
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.models.agency import Agency
from app.models.report import Report


def get_agency_resolved_report(
    report_id: int = Path(gt=0),
    agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
) -> Report:
    report = db.scalar(
        select(Report)
        .options(joinedload(Report.facility))
        .where(
            Report.report_id == report_id,
            Report.assigned_agency == agency.agency_id,
            Report.status == "RESOLVED"
        )
    )
    if report is None:
        raise HTTPException(status_code=404, detail="Resolved report not found")
    return report
