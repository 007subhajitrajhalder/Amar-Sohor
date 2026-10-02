from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum
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
