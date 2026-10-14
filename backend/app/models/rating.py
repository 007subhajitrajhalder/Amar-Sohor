from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
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
