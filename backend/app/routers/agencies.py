from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.agency import get_current_agency
from app.dependencies.auth import get_current_agent_member
from app.models.agency import Agency
from app.models.agency_member import AgencyMember
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
    mine: bool = Query(default=False, description="Filter statistics to the logged-in member"),
    db: Session = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
    current_agent: AgencyMember = Depends(get_current_agent_member)
) -> AgencyDashboardResponse:
    """Return agency overview counts and the report workflow distribution."""
    agent = current_agent if mine else None
    return agency_service.get_agency_dashboard(db, current_agency, agent=agent)
