from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Enum, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Facility(Base):
    __tablename__ = "facilities"

    facility_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    facility_name = Column(String(150), nullable=False)
    category_id = Column(
        Integer,
        ForeignKey("facility_categories.category_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    latitude = Column(DECIMAL(10, 7), nullable=False)
    longitude = Column(DECIMAL(10, 7), nullable=False)
    address = Column(Text, nullable=False)
    added_by = Column(
        Integer,
        ForeignKey("agency_members.agent_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    status = Column(
        Enum("SUSPENDED", "OPEN", "UNDER_REPAIR"),
        nullable=False,
        default="OPEN",
        index=True
    )
    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )
    photo_url = Column(String(1000), nullable=True)

    __table_args__ = (
        Index("idx_facilities_coordinates", "latitude", "longitude"),
    )

    # Relationships
    category = relationship("FacilityCategory", back_populates="facilities")
    added_by_agent = relationship("AgencyMember", back_populates="facilities_added")
    ratings = relationship("Rating", back_populates="facility", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="facility", cascade="all, delete-orphan")
