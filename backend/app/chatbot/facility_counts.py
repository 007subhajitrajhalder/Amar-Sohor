"""Answer narrowly scoped questions about public facility totals."""

import re

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from app.database.connection import SessionLocal
from app.models.facility import Facility
from app.models.facility_category import FacilityCategory


class FacilityCountError(RuntimeError):
    """Indicate that the public aggregate facility-count query failed."""


COUNT_PATTERN = re.compile(
    r"\bhow\s+many\b|\bhow\s+much\b|\b(?:number|count|total|quantity)\b|"
    r"কত(?:গুলো|টি)?|সংখ্যা",
    re.IGNORECASE,
)
FACILITY_PATTERN = re.compile(
    r"\bfacilit(?:y|ies)\b|\bamenities\b|\bcivic\s+assets\b|"
    r"સુવિધા|পরিষেবা|সুবিধা",
    re.IGNORECASE,
)
NON_TOTAL_PATTERN = re.compile(
    r"\b(?:open|available|operational|active|under[\s_-]+repair|suspended)\b|"
    r"ચાલુ|উপলব্ধ",
    re.IGNORECASE,
)
CATEGORY_PATTERNS = {
    "DUSTBIN": re.compile(
        r"\b(?:dust\s*bins?|waste\s*bins?|garbage\s*bins?|trash\s*cans?)\b|"
        r"ડસ્ટબિન|ডাস্টবিন",
        re.IGNORECASE,
    ),
    "TOILET": re.compile(
        r"\b(?:public\s+)?toilets?\b|\brestrooms?\b|\bwashrooms?\b|"
        r"શૌચાલય|টয়লেট|শৌচাগার",
        re.IGNORECASE,
    ),
    "WATER_POINT": re.compile(
        r"\b(?:drinking\s+water(?:\s+points?)?|water\s+points?|"
        r"water\s+taps?|water\s+coolers?|taps?)\b|"
        r"પીવાનું પાણી|পানীয় জল|পানীয় জল",
        re.IGNORECASE,
    ),
    "PARKING": re.compile(r"\bparking\b|\bcar\s*parks?\b|પાર્કિંગ|পার্কিং", re.IGNORECASE),
}
CATEGORY_LABELS = {
    "DUSTBIN": "Dustbin / Waste Bin",
    "TOILET": "Public Toilet",
    "WATER_POINT": "Drinking Water Point",
    "PARKING": "Parking",
}
CATEGORY_LABELS_BN = {
    "DUSTBIN": "ডাস্টবিন",
    "TOILET": "পাবলিক টয়লেট",
    "WATER_POINT": "পানীয় জলের পয়েন্ট",
    "PARKING": "পার্কিং",
}
ALL_STATUSES = "OPEN, UNDER_REPAIR, and SUSPENDED"


def parse_facility_count_scope(message: str) -> tuple[str, ...] | None:
    """Return requested categories, an empty tuple for all, or None if not a count query."""
    if not COUNT_PATTERN.search(message) or NON_TOTAL_PATTERN.search(message):
        return None

    categories = tuple(
        category
        for category, pattern in CATEGORY_PATTERNS.items()
        if pattern.search(message)
    )
    if categories:
        return categories
    if FACILITY_PATTERN.search(message):
        if re.search(r"\b(?:categories|types|kinds)\b", message, re.IGNORECASE):
            return None
        return ()
    return None


def _read_facility_counts() -> dict[str, int]:
    """Read counts grouped by public facility category; this query reads no report data."""
    statement = (
        select(FacilityCategory.category_name, func.count(Facility.facility_id))
        .select_from(FacilityCategory)
        .outerjoin(Facility, Facility.category_id == FacilityCategory.category_id)
        .group_by(FacilityCategory.category_id, FacilityCategory.category_name)
        .order_by(FacilityCategory.category_id)
    )
    try:
        with SessionLocal() as db:
            rows = db.execute(statement).all()
    except SQLAlchemyError as exc:
        raise FacilityCountError(
            "Live facility counts are temporarily unavailable. Please try again later."
        ) from exc

    counts = {category: 0 for category in CATEGORY_LABELS}
    for category_name, count in rows:
        counts[str(category_name)] = int(count)
    return counts


def _is_bengali(message: str) -> bool:
    return any("\u0980" <= character <= "\u09ff" for character in message)


def _category_label(category: str, bengali: bool) -> str:
    labels = CATEGORY_LABELS_BN if bengali else CATEGORY_LABELS
    return labels.get(category, category.replace("_", " ").title())


def _format_facility_count_answer(
    message: str, requested_categories: tuple[str, ...], counts: dict[str, int]
) -> str:
    """Format database totals deterministically so the model cannot invent counts."""
    bengali = _is_bengali(message)
    total = sum(counts.values())
    categories = requested_categories or tuple(counts)
    details = [
        f"{_category_label(category, bengali)}: {counts.get(category, 0)}"
        for category in categories
    ]

    if bengali:
        if not requested_categories:
            return (
                f"ডাটাবেসে মোট **{total}টি** public facility নথিভুক্ত আছে। "
                f"বিভাগ অনুযায়ী: {'; '.join(details)}। "
                "এই গণনায় সব status অন্তর্ভুক্ত।"
            )
        if len(categories) == 1:
            category = categories[0]
            return (
                f"**{_category_label(category, True)}** বিভাগে "
                f"**{counts.get(category, 0)}টি** facility নথিভুক্ত আছে। "
                "এই গণনায় সব status অন্তর্ভুক্ত।"
            )
        selected_total = sum(counts.get(category, 0) for category in categories)
        return (
            f"চাওয়া বিভাগগুলোতে মোট **{selected_total}টি** facility আছে: "
            f"{'; '.join(details)}। এই গণনায় সব status অন্তর্ভুক্ত।"
        )

    if not requested_categories:
        return (
            f"There are **{total} facilities** in the database: "
            f"{'; '.join(details)}. This includes all statuses "
            f"({ALL_STATUSES})."
        )
    if len(categories) == 1:
        category = categories[0]
        return (
            f"There are **{counts.get(category, 0)} facilities** in the "
            f"**{_category_label(category, False)}** category. This includes "
            f"all statuses ({ALL_STATUSES})."
        )
    selected_total = sum(counts.get(category, 0) for category in categories)
    return (
        f"There are **{selected_total} facilities** across the requested "
        f"categories: {'; '.join(details)}. This includes all statuses "
        f"({ALL_STATUSES})."
    )


def get_facility_count_answer(message: str) -> str | None:
    """Return a live aggregate answer only for recognized public facility-count questions."""
    scope = parse_facility_count_scope(message)
    if scope is None:
        return None
    counts = _read_facility_counts()
    return _format_facility_count_answer(message, scope, counts)
