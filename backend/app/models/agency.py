from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Agency(Base):
    __tablename__ = "agencies"

    agency_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_name = Column(String(150), unique=True, nullable=False)
    department_type = Column(String(100), nullable=False)

    # Relationships
    members = relationship("AgencyMember", back_populates="agency", cascade="all, delete-orphan")
    facility_categories = relationship("FacilityCategory", back_populates="agency")
    recommendations = relationship("Recommendation", back_populates="agency")
    reports = relationship("Report", back_populates="agency")
