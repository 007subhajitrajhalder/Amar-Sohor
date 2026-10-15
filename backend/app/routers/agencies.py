from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.models.agency import Agency
from app.schemas.agency import AgencyDashboardResponse
from app.services import agency_service


router = APIRouter(
    prefix="/agencies",
    tags=["Agencies"]
)


@router.get(
    "/dashboard",
    response_model=AgencyDashboardResponse,
    summary="Get the signed-in agency's dashboard",
    responses={
        401: {"description": "Missing or invalid access token"},
        403: {"description": "Agency access required"},
        404: {"description": "Agency membership or agency not found"}
    }
)
def get_agency_dashboard(
    db: Session = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency)
) -> AgencyDashboardResponse:
    """Return agency overview counts and the report workflow distribution."""
    return agency_service.get_agency_dashboard(db, current_agency)
