"""Pydantic schemas and API contracts for facility ratings and citizen reviews."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class RatingInput(BaseModel):
    """Review text and a 1-to-5 star score for a public facility."""

    title: str = Field(..., min_length=1, max_length=200, description="Review title or summary")
    rating: int = Field(..., ge=1, le=5, description="Numerical rating between 1 and 5")


class RatingResponse(BaseModel):
    """Public representation of a facility review."""

    id: int
    user_id: int
    name: str
    rating: int
    date: datetime
    text: str

    class Config:
        from_attributes = True
