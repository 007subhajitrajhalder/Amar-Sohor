from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.agency_member import AgencyMember

def scoped_query(db: Session, model, user):
    query = db.query(model)
    if user.role == "ADMIN":
        return query
    if user.role == "USER":
        return query.filter(model.user_id == user.user_id)
    if user.role in ("AGENT", "AGENCY"):
        member = db.query(AgencyMember).filter_by(user_id=user.user_id).first()
        if member is None:
            raise HTTPException(404, "Agency membership not found")
        return query.filter(model.assigned_agency == member.agency_id)
    raise HTTPException(403, "Access denied")

def visible_record(db, model, id_column, record_id, user):
    record = scoped_query(db, model, user).filter(id_column == record_id).first()
    if record is None:
        raise HTTPException(404, "Record not found")
    return record
