"""Resolve the agency associated with an authenticated agency-member account.

Agency, facility, and report routes use this dependency so agency scope comes
from the member profile rather than from an untrusted request parameter.
"""

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import get_current_agent_member
from app.models.agency import Agency
from app.models.agency_member import AgencyMember


def get_current_agency(
    current_agent: AgencyMember = Depends(get_current_agent_member),
    db: Session = Depends(get_db)
) -> Agency:
    """Resolve the authenticated member's agency without a client-supplied ID.

    Used by agency-scoped routes to provide the owning agency and reject stale
    member-to-agency references before route data is accessed.
    """
    agency = db.get(Agency, current_agent.agency_id)

    if agency is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    return agency
