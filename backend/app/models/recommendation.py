from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.user_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    category_id = Column(
        Integer,
        ForeignKey("facility_categories.category_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    latitude = Column(DECIMAL(10, 7), nullable=True)
    longitude = Column(DECIMAL(10, 7), nullable=True)
    address = Column(Text, nullable=False)
    photo_url = Column(String(1000), nullable=False)
    status = Column(
        Enum("PENDING", "ALLOCATED", "UNDER_INVESTIGATION", "APPROVED", "REJECTED", "INSTALLED"),
        nullable=False,
        default="PENDING",
        index=True
    )
    assigned_agency = Column(
        Integer,
        ForeignKey("agencies.agency_id", onupdate="CASCADE"),
        nullable=True,
        index=True
    )
    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )

    # Relationships
    user = relationship("User", back_populates="recommendations")
    category = relationship("FacilityCategory", back_populates="recommendations")
    agency = relationship("Agency", back_populates="recommendations")
    investigations = relationship("RecommendationInvestigation", back_populates="recommendation", cascade="all, delete-orphan")
