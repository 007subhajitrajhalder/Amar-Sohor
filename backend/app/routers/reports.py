from typing import List, Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services import report_service, file_service
from app.schemas.report import ReportResponse

router = APIRouter(
    prefix="/reports",
    tags=["Reports & Grievances"]
)


@router.post("", response_model=ReportResponse, status_code=201)
@router.post("/", response_model=ReportResponse, status_code=201)
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
    The system automatically routes the report to the nearest agency member
    responsible for that facility's category based on GIS location.
    """
    final_photo_url = "/uploads/reports/default.jpg"

    if photo and photo.filename:
        final_photo_url = file_service.save_upload_file(photo, "reports")
    elif photo_url:
        final_photo_url = file_service.save_base64_or_url_photo(photo_url, "reports")

    # If user_id is not supplied, use default citizen user (user_id: 10 or 1)
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


@router.get("", response_model=List[ReportResponse])
@router.get("/", response_model=List[ReportResponse])
def get_reports(
    user_id: Optional[int] = Query(None, description="Filter by citizen user_id"),
    db: Session = Depends(get_db)
):
    """Retrieve all reports or filter by citizen user_id."""
    return report_service.get_all_reports(db=db, user_id=user_id)


@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve details and investigation status of a specific report."""
    return report_service.get_report_by_id(db=db, report_id=report_id)

