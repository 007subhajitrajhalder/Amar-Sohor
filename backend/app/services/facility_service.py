from pathlib import Path

from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.agency import Agency
from app.models.agency_member import AgencyMember
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory
from app.models.recommendation import Recommendation
from app.schemas.facility import (
    FacilityCreate, FacilityUpdate, FacilityResponse,
    FacilityListResponse, FacilityStatistics
)
from app.services.file_service import FACILITY_UPLOAD_DIR


class FacilityNotFound(ValueError):
    pass


class InvalidFacility(ValueError):
    pass


class FacilityConflict(ValueError):
    pass


def facility_response(facility: Facility) -> FacilityResponse:
    return FacilityResponse(
        facility_id=facility.facility_id,
        facility_name=facility.facility_name,
        category_id=facility.category_id,
        category_name=facility.category.category_name,
        address=facility.address,
        latitude=facility.latitude,
        longitude=facility.longitude,
        status=facility.status,
        photo_url=facility.photo_url,
        additional_notes=facility.additional_notes,
        source_recommendation_id=facility.source_recommendation_id,
        added_by=facility.added_by,
        created_at=facility.created_at
    )


def get_categories(db: Session, agency_id: int):
    return db.scalars(
        select(FacilityCategory)
        .where(FacilityCategory.handling_agency == agency_id)
        .order_by(FacilityCategory.category_name, FacilityCategory.category_id)
    ).all()


def get_statistics(db: Session, agency_id: int) -> FacilityStatistics:
    counts = dict(db.execute(
        select(Facility.status, func.count(Facility.facility_id))
        .join(FacilityCategory, Facility.category_id == FacilityCategory.category_id)
        .where(FacilityCategory.handling_agency == agency_id)
        .group_by(Facility.status)
    ).all())
    return FacilityStatistics(
        total=sum(counts.values()),
        open=counts.get("OPEN", 0),
        under_repair=counts.get("UNDER_REPAIR", 0),
        suspended=counts.get("SUSPENDED", 0),
        needs_attention=counts.get("UNDER_REPAIR", 0) + counts.get("SUSPENDED", 0)
    )


def list_facilities(
    db: Session, agency_id: int, search: str | None = None,
    category_id: int | None = None, status: str | None = None,
    limit: int = 50, offset: int = 0
) -> FacilityListResponse:
    filters = [FacilityCategory.handling_agency == agency_id]
    if category_id is not None:
        filters.append(Facility.category_id == category_id)
    if status is not None:
        filters.append(Facility.status == status)
    if search and search.strip():
        search = search.strip()
        filters.append(or_(
            Facility.facility_name.icontains(search, autoescape=True),
            Facility.address.icontains(search, autoescape=True),
            cast(Facility.facility_id, String).contains(search, autoescape=True)
        ))
    total = db.scalar(
        select(func.count(Facility.facility_id))
        .join(FacilityCategory, Facility.category_id == FacilityCategory.category_id)
        .where(*filters)
    )
    facilities = db.scalars(
        select(Facility)
        .join(FacilityCategory, Facility.category_id == FacilityCategory.category_id)
        .options(joinedload(Facility.category))
        .where(*filters)
        .order_by(Facility.created_at.desc(), Facility.facility_id.desc())
        .limit(limit).offset(offset)
    ).all()
    return FacilityListResponse(
        items=[facility_response(item) for item in facilities],
        total=total, limit=limit, offset=offset,
        statistics=get_statistics(db, agency_id)
    )


def _get_owned_category(db: Session, agency_id: int, category_id: int):
    category = db.scalar(select(FacilityCategory).where(
        FacilityCategory.category_id == category_id,
        FacilityCategory.handling_agency == agency_id
    ))
    if category is None:
        raise FacilityNotFound("Facility category not found for this agency")
    return category


def _validate_local_photo(photo_url: str | None, agency_id: int):
    if photo_url and photo_url.startswith("/uploads/"):
        prefix = f"/uploads/facilities/{agency_id}/"
        if not photo_url.startswith(prefix):
            raise InvalidFacility("Choose a photo uploaded by your agency")
        photo_path = FACILITY_UPLOAD_DIR / str(agency_id) / Path(photo_url).name
        if not photo_path.is_file():
            raise InvalidFacility("Uploaded facility photo not found")


def create_facility(
    db: Session, agency: Agency, agent: AgencyMember, data: FacilityCreate
) -> FacilityResponse:
    try:
        category = _get_owned_category(db, agency.agency_id, data.category_id)
        _validate_local_photo(data.photo_url, agency.agency_id)
        if data.source_recommendation_id is not None:
            # Lock before checking status so concurrent installations cannot
            # both consume the same approved recommendation.
            recommendation = db.scalar(
                select(Recommendation).where(
                    Recommendation.recommendation_id == data.source_recommendation_id,
                    Recommendation.assigned_agency == agency.agency_id
                ).with_for_update()
            )
            if recommendation is None:
                raise FacilityNotFound("Recommendation not found for this agency")
            if recommendation.status != "APPROVED":
                raise FacilityConflict("Only approved recommendations can be installed")
            if recommendation.category_id != category.category_id:
                raise InvalidFacility("Facility category must match its recommendation")
            if data.status != "OPEN":
                raise InvalidFacility("A recommendation must be installed as an open facility")
            recommendation.status = "INSTALLED"

        facility = Facility(**data.model_dump(), added_by=agent.agent_id)
        facility.category = category
        db.add(facility)
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise FacilityConflict("Facility references changed or recommendation is already linked") from exc
    except Exception:
        db.rollback()
        raise
    db.refresh(facility)
    return facility_response(facility)


def update_facility(
    db: Session, agency: Agency, facility: Facility, data: FacilityUpdate
) -> FacilityResponse:
    try:
        category = _get_owned_category(db, agency.agency_id, data.category_id)
        if facility.source_recommendation_id is not None and category.category_id != facility.category_id:
            raise InvalidFacility("Cannot change the category of a recommendation-linked facility")
        if "photo_url" in data.model_fields_set:
            _validate_local_photo(data.photo_url, agency.agency_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(facility, field, value)
        facility.category = category
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise FacilityConflict("Facility references changed; reload and try again") from exc
    except Exception:
        db.rollback()
        raise
    db.refresh(facility)
    return facility_response(facility)
