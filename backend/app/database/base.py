"""Shared SQLAlchemy declarative base for the application's ORM models."""

from sqlalchemy.orm import declarative_base

# Model classes inherit this base so metadata and table mappings are registered
# together for schema creation and database operations.
Base = declarative_base()