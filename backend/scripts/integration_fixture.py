"""Temporary, explicitly named fixtures for opt-in tests against the configured database.
No application records are seeded on startup. Cleanup only targets this run's accounts.
"""
import json
import secrets
import sys
from pathlib import Path
from uuid import uuid4
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from sqlalchemy import delete, or_, select
from app.database.connection import SessionLocal
from app.models import User, AgencyMember, Facility, FacilityCategory, Report, Recommendation, Rating
from app.models.report_resolution_submission import ReportResolutionSubmission
from app.models.recommendation_investigation import RecommendationInvestigation
from app.core.security import hash_password

state_path = Path(__file__).resolve().parents[2] / "frontend" / ".integration-state.json"
def prepare():
    if state_path.exists():
        raise RuntimeError("Previous test manifest exists; run cleanup before preparing another run")
    run = uuid4().hex[:10]
    state = {"run": run, "password": secrets.token_urlsafe(18),
        "emails": {role: f"{role}.{run}@example.com" for role in ("admin", "agent", "other", "citizen")},
        "phone": str(secrets.randbelow(900000000) + 100000000)}
    with SessionLocal() as db:
        categories = db.scalars(select(FacilityCategory).order_by(FacilityCategory.category_id)).all()
        first = categories[0]
        second = next(c for c in categories if c.handling_agency != first.handling_agency)
        state["categories"] = [{"id": c.category_id, "agency": c.handling_agency, "name": c.category_name} for c in (first, second)]
        state_path.write_text(json.dumps(state), encoding="utf-8")
        db.add(User(full_name="Integration Test Admin " + run, email=state["emails"]["admin"],
            phone=state["phone"]+"0", role="ADMIN", password_hash=hash_password(state["password"])))
        db.commit()
    print("Temporary integration fixture prepared; credentials kept in ignored manifest.")

def cleanup():
    if not state_path.exists():
        return
    state = json.loads(state_path.read_text())
    photos = set()
    with SessionLocal() as db:
        user_ids = list(db.scalars(select(User.user_id).where(User.email.in_(list(state["emails"].values())))))
        agent_ids = list(db.scalars(select(AgencyMember.agent_id).where(AgencyMember.user_id.in_(user_ids))))
        facilities = list(db.scalars(select(Facility).where(Facility.added_by.in_(agent_ids))))
        facility_ids = [f.facility_id for f in facilities]
        reports = list(db.scalars(select(Report).where(or_(Report.user_id.in_(user_ids), Report.facility_id.in_(facility_ids)))))
        report_ids = [r.report_id for r in reports]
        recs = list(db.scalars(select(Recommendation).where(Recommendation.user_id.in_(user_ids))))
        rec_ids = [r.recommendation_id for r in recs]
        photos.update(f.photo_url for f in facilities)
        photos.update(r.photo_url for r in reports + recs)
        photos.update(db.scalars(select(ReportResolutionSubmission.resolution_photo).where(ReportResolutionSubmission.report_id.in_(report_ids))))
        db.execute(delete(ReportResolutionSubmission).where(ReportResolutionSubmission.report_id.in_(report_ids)))
        db.execute(delete(Report).where(Report.report_id.in_(report_ids)))
        db.execute(delete(Rating).where(or_(Rating.user_id.in_(user_ids), Rating.facility_id.in_(facility_ids))))
        db.execute(delete(Facility).where(Facility.facility_id.in_(facility_ids)))
        db.execute(delete(RecommendationInvestigation).where(RecommendationInvestigation.recommendation_id.in_(rec_ids)))
        db.execute(delete(Recommendation).where(Recommendation.recommendation_id.in_(rec_ids)))
        db.execute(delete(AgencyMember).where(AgencyMember.agent_id.in_(agent_ids)))
        db.execute(delete(User).where(User.user_id.in_(user_ids)))
        db.commit()
        remaining = db.scalar(select(User.user_id).where(User.email.in_(list(state["emails"].values()))).limit(1))
        assert remaining is None
    upload_root = (Path(__file__).resolve().parents[1] / "uploads").resolve()
    for photo in photos:
        if photo and photo.startswith("/uploads/"):
            target = (upload_root / photo.removeprefix("/uploads/")).resolve()
            if target.is_relative_to(upload_root):
                target.unlink(missing_ok=True)
    state_path.unlink()
    print("Removed this run's temporary accounts, records, and attached uploaded photos.")

if __name__ == "__main__":
    if sys.argv[1] == "prepare":
        prepare()
    elif sys.argv[1] == "cleanup":
        cleanup()
    elif sys.argv[1] == "facility":
        with SessionLocal() as db:
            f = db.get(Facility, int(sys.argv[2]))
            print(json.dumps(None if f is None else {"id": f.facility_id, "name": f.facility_name, "latitude": float(f.latitude), "status": f.status}))
