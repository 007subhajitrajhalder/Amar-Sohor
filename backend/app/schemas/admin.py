from pydantic import Field
from app.schemas.auth import RegisterRequest
class CreateAgencyMemberRequest(RegisterRequest):
    agency_id: int = Field(gt=0)
