from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    facility_id = Column(
        Integer,
        ForeignKey("facilities.facility_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    user_id = Column(
        Integer,
        ForeignKey("users.user_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    photo_url = Column(String(1000), nullable=False)
    status = Column(
        Enum("PENDING", "UNDER_INVESTIGATION", "RESOLVED"),
        nullable=False,
        default="PENDING",
        index=True
    )
    assigned_agency = Column(
        Integer,
        ForeignKey("agencies.agency_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )

    # Relationships
    facility = relationship("Facility", back_populates="reports")
    user = relationship("User", back_populates="reports")
    agency = relationship("Agency", back_populates="reports")
    resolution_submissions = relationship("ReportResolutionSubmission", back_populates="report", cascade="all, delete-orphan")
