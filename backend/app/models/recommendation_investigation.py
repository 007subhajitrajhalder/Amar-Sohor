from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum, ForeignKey
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
