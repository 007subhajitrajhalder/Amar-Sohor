import os
import shutil

MODELS = {}

MODELS["agency.py"] = '''from sqlalchemy import Column, Integer, String
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
'''

MODELS["agency_member.py"] = '''from sqlalchemy import Column, Integer, DECIMAL, ForeignKey
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
'''

MODELS["facility_category.py"] = '''from sqlalchemy import Column, Integer, String, ForeignKey
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
'''

MODELS["facility.py"] = '''from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Enum, ForeignKey, Index
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
'''

MODELS["rating.py"] = '''from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Rating(Base):
    __tablename__ = "ratings"

    rating_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    facility_id = Column(
        Integer,
        ForeignKey("facilities.facility_id", ondelete="CASCADE", onupdate="CASCADE"),
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
    rating = Column(Integer, nullable=False)
    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )

    # Relationships
    facility = relationship("Facility", back_populates="ratings")
    user = relationship("User", back_populates="ratings")
'''

MODELS["recommendation.py"] = '''from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Enum, ForeignKey
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
'''

MODELS["recommendation_investigation.py"] = '''from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class RecommendationInvestigation(Base):
    __tablename__ = "recommendation_investigations"

    investigation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recommendation_id = Column(
        Integer,
        ForeignKey("recommendations.recommendation_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True
    )
    description = Column(String(1000), nullable=False)
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
    recommendation = relationship("Recommendation", back_populates="investigations")
'''

MODELS["report.py"] = '''from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Enum, ForeignKey
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
'''

MODELS["report_resolution_submission.py"] = '''from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum, ForeignKey
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
'''

MODELS["user.py"] = '''from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp()
    )
    role = Column(
        Enum("ADMIN", "USER", "AGENT"),
        nullable=False,
        default="USER"
    )

    # Relationships
    agency_member = relationship("AgencyMember", back_populates="user", uselist=False)
    ratings = relationship("Rating", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")
    reports = relationship("Report", back_populates="user")
'''

MODELS["__init__.py"] = '''from app.models.user import User
from app.models.agency import Agency
from app.models.agency_member import AgencyMember
from app.models.facility_category import FacilityCategory
from app.models.facility import Facility
from app.models.rating import Rating
from app.models.recommendation import Recommendation
from app.models.recommendation_investigation import RecommendationInvestigation
from app.models.report import Report
from app.models.report_resolution_submission import ReportResolutionSubmission

__all__ = [
    "User",
    "Agency",
    "AgencyMember",
    "FacilityCategory",
    "Facility",
    "Rating",
    "Recommendation",
    "RecommendationInvestigation",
    "Report",
    "ReportResolutionSubmission",
]
'''

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "app", "models")
    backup_dir = os.path.join(base_dir, "app", "models_backup")

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(backup_dir, exist_ok=True)

    for filename, content in MODELS.items():
        # Write to app/models
        target_path = os.path.join(models_dir, filename)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        
        # Write to app/models_backup
        backup_path = os.path.join(backup_dir, filename)
        with open(backup_path, "w", encoding="utf-8") as f:
            f.write(content)

    print("Populated all models in both app/models and app/models_backup!")

if __name__ == "__main__":
    main()
