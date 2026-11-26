"""Register users, authenticate credentials, and reset passwords for the /auth API router."""

import hashlib
import hmac
import logging
import os
import secrets
from datetime import datetime, timedelta

from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.services.email_service import EmailSendError, send_otp_email

logger = logging.getLogger(__name__)

OTP_EXPIRE_MINUTES = int(os.getenv("OTP_EXPIRE_MINUTES", "10"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
OTP_RESEND_COOLDOWN_SECONDS = int(os.getenv("OTP_RESEND_COOLDOWN_SECONDS", "60"))


def _hash_otp(otp: str) -> str:
    """Key the OTP hash with the server secret so a database leak does not reveal codes."""
    key = os.getenv("JWT_SECRET_KEY", "").encode("utf-8")
    return hmac.new(key, otp.encode("utf-8"), hashlib.sha256).hexdigest()


def _now() -> datetime:
    return datetime.utcnow()


def issue_email_otp(db: Session, user: User) -> bool:
    """Generate, store, and email a fresh OTP; return whether the email was sent."""
    otp = f"{secrets.randbelow(1_000_000):06d}"
    user.email_otp_hash = _hash_otp(otp)
    user.email_otp_expires_at = _now() + timedelta(minutes=OTP_EXPIRE_MINUTES)
    user.email_otp_attempts = 0
    user.email_otp_sent_at = _now()
    db.commit()
    try:
        send_otp_email(user.email, user.full_name, otp, OTP_EXPIRE_MINUTES)
        return True
    except EmailSendError:
        logger.exception("Failed to send verification OTP to user %s", user.user_id)
        return False


def resend_email_otp(db: Session, email: str) -> str:
    """Resend an OTP for an unverified account: SENT, COOLDOWN, SEND_FAILED, or NOOP."""
    user = db.execute(select(User).where(User.email == email.strip().lower())).scalar_one_or_none()
    if user is None or user.email_verified:
        return "NOOP"
    if user.email_otp_sent_at and _now() - user.email_otp_sent_at < timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS):
        return "COOLDOWN"
    return "SENT" if issue_email_otp(db, user) else "SEND_FAILED"


def verify_email_otp(db: Session, email: str, otp: str) -> str:
    """Check an OTP: VERIFIED, INVALID, EXPIRED, or TOO_MANY_ATTEMPTS."""
    user = db.execute(select(User).where(User.email == email.strip().lower())).scalar_one_or_none()
    if user is None:
        return "INVALID"
    if user.email_verified:
        return "VERIFIED"
    if not user.email_otp_hash or not user.email_otp_expires_at:
        return "INVALID"
    if user.email_otp_attempts >= OTP_MAX_ATTEMPTS:
        return "TOO_MANY_ATTEMPTS"
    if _now() > user.email_otp_expires_at:
        return "EXPIRED"
    if not hmac.compare_digest(user.email_otp_hash, _hash_otp(otp)):
        user.email_otp_attempts += 1
        db.commit()
        return "TOO_MANY_ATTEMPTS" if user.email_otp_attempts >= OTP_MAX_ATTEMPTS else "INVALID"
    user.email_verified = True
    user.email_otp_hash = None
    user.email_otp_expires_at = None
    user.email_otp_attempts = 0
    db.commit()
    return "VERIFIED"


def register_user(db: Session, user_data):
    """Register a citizen account for POST /auth/register, returning duplicate-field markers when needed."""
    clean_email = user_data.email.strip().lower()
    clean_phone = user_data.phone.strip()
    clean_name = user_data.full_name.strip()

    # Check whether email already exists
    statement = select(User).where(
        User.email == clean_email
    )

    result = db.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        return "EMAIL_EXISTS"

    # Check whether phone already exists
    statement = select(User).where(
        User.phone == clean_phone
    )

    result = db.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        return "PHONE_EXISTS"

    # Hash password
    hashed_password = hash_password(
        user_data.password
    )

    # Create user
    new_user = User(
        full_name=clean_name,
        email=clean_email,
        phone=clean_phone,
        password_hash=hashed_password,
        role="USER",
        email_verified=False,
    )

    db.add(new_user)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email or phone already registered") from exc

    db.refresh(new_user)

    issue_email_otp(db, new_user)

    return new_user


def login_user(db: Session, user_data):
    """Verify login credentials for POST /auth/login and return the matching user or None."""
    clean_email = user_data.email.strip().lower()

    # Find user by email
    statement = select(User).where(
        User.email == clean_email
    )

    result = db.execute(statement)
    user = result.scalar_one_or_none()

    # User does not exist
    if user is None:
        return None

    # Check password
    password_correct = verify_password(
        user_data.password,
        user.password_hash
    )

    if not password_correct:
        return None

    return user


def check_email_exists(db: Session, email: str) -> bool:
    """Check the account email used by POST /auth/forgot-password/check-email."""
    clean_email = email.strip().lower()
    statement = select(User).where(User.email == clean_email)
    result = db.execute(statement)
    return result.scalar_one_or_none() is not None


def reset_user_password(db: Session, email: str, new_password: str) -> bool:
    """Update an account password for POST /auth/reset-password and report whether the account exists."""
    clean_email = email.strip().lower()
    statement = select(User).where(User.email == clean_email)
    result = db.execute(statement)
    user = result.scalar_one_or_none()
    if user is None:
        return False
    user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return True
