from sqlalchemy import Column, Integer, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class AgencyMember(Base):
    __tablename__ = "agency_members"

    agent_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id = Column(
        Integer,
        ForeignKey("agencies.agency_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    user_id = Column(
        Integer,
        ForeignKey("users.user_id", onupdate="CASCADE"),
        unique=True,
        nullable=False
    )
    latitude = Column(DECIMAL(10, 7), nullable=True)
    longitude = Column(DECIMAL(10, 7), nullable=True)

    # Relationships
    agency = relationship("Agency", back_populates="members")
    user = relationship("User", back_populates="agency_member")
    facilities_added = relationship("Facility", back_populates="added_by_agent")
    resolution_submissions = relationship("ReportResolutionSubmission", back_populates="agent")
