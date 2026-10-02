from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class FacilityCategory(Base):
    __tablename__ = "facility_categories"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), unique=True, nullable=False)
    handling_agency = Column(
        Integer,
        ForeignKey("agencies.agency_id", onupdate="CASCADE"),
        nullable=False,
        index=True
    )

    # Relationships
    agency = relationship("Agency", back_populates="facility_categories")
    facilities = relationship("Facility", back_populates="category")
    recommendations = relationship("Recommendation", back_populates="category")
