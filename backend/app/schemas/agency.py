from typing import Literal

from pydantic import BaseModel, Field


class AgencyDashboardStatistics(BaseModel):
    """Counts for the four overview cards on AgencyDashboardPage."""

    pending: int = Field(ge=0)
    under_investigation: int = Field(ge=0)
    resolved: int = Field(ge=0)
    facilities: int = Field(
        ge=0, description="Facilities in categories handled by this agency"
    )


class AgencyReportStatusDistribution(BaseModel):
    """One report workflow status, including its share of all agency reports."""

    status: Literal["PENDING", "UNDER_INVESTIGATION", "RESOLVED"]
    title: str
    count: int = Field(ge=0)
    percentage: float = Field(
        ge=0, le=100, description="Rounded to two decimal places; zero when empty"
    )


class AgencyDashboardResponse(BaseModel):
    """Agency identity, overview statistics, and report status analysis."""

    agency_id: int = Field(gt=0)
    agency_name: str
    department_type: str
    statistics: AgencyDashboardStatistics
    total_reports: int = Field(ge=0)
    status_distribution: list[AgencyReportStatusDistribution]
