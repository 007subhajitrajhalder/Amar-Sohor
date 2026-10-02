from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class ReportResolutionSubmission(Base):
    __tablename__ = "report_resolution_submissions"

    resolution_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(
        Integer,
        ForeignKey("reports.report_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    agent_id = Column(
        Integer,
        ForeignKey("agency_members.agent_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    resolution_photo = Column(String(1000), nullable=False)
    submitted_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )
    verification_status = Column(
        Enum("PENDING", "APPROVED", "REJECTED"),
        nullable=False,
        default="PENDING"
    )

    # Relationships
    report = relationship("Report", back_populates="resolution_submissions")
    agent = relationship("AgencyMember", back_populates="resolution_submissions")
