"""Public registration and credential-recovery endpoints plus authenticated identity."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    CheckEmailRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    TokenResponse,
    AuthUser
)
from app.schemas.user import UserResponse
from app.services import auth_service
from app.core.security import create_access_token
from app.models.user import User
from app.models.agency_member import AgencyMember
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register a public citizen account; called by frontend RegisterPage."""
    result = auth_service.register_user(
        db,
        user_data
    )

    if result == "EMAIL_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    if result == "PHONE_EXISTS":
        raise HTTPException(
            status_code=409,
            detail="Phone number already registered"
        )

    return result


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Authenticate an account and issue a token; called by frontend LoginPage."""
    user = auth_service.login_user(
        db,
        user_data
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="EMAIL_NOT_VERIFIED"
        )

    access_token = create_access_token(
        user_id=user.user_id,
        role=user.role
    )

    agency_id = None
    agent_id = None
    if user.role in ["AGENT", "AGENCY"]:
        agent = db.query(AgencyMember).filter(
            AgencyMember.user_id == user.user_id
        ).first()
        if agent:
            agency_id = agent.agency_id
            agent_id = agent.agent_id

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "agency_id": agency_id,
            "agent_id": agent_id
        }
    }


@router.post("/verify-email", status_code=200)
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Confirm the registration OTP entered on the sign-in page."""
    result = auth_service.verify_email_otp(db, payload.email, payload.otp)
    if result == "VERIFIED":
        return {"verified": True, "message": "Email verified."}
    messages = {
        "INVALID": (400, "Incorrect verification code."),
        "EXPIRED": (400, "This code has expired. Request a new one."),
        "TOO_MANY_ATTEMPTS": (429, "Too many incorrect attempts. Request a new code."),
    }
    status, detail = messages[result]
    raise HTTPException(status_code=status, detail=detail)


@router.post("/resend-otp", status_code=200)
def resend_otp(payload: CheckEmailRequest, db: Session = Depends(get_db)):
    """Send a new registration OTP; the response does not reveal whether the account exists."""
    result = auth_service.resend_email_otp(db, payload.email)
    if result == "COOLDOWN":
        raise HTTPException(status_code=429, detail="Please wait a minute before requesting another code.")
    if result == "SEND_FAILED":
        raise HTTPException(status_code=502, detail="Could not send the verification email. Try again later.")
    return {"message": "If this account needs verification, a new code has been sent."}


@router.post(
    "/forgot-password/check-email",
    status_code=200
)
def check_forgot_password_email(
    payload: CheckEmailRequest,
    db: Session = Depends(get_db)
):
    """Check that a recovery email belongs to an account; called by ForgotPasswordPage."""
    exists = auth_service.check_email_exists(db, payload.email)
    if not exists:
        raise HTTPException(
            status_code=404,
            detail="No account found with this email address."
        )
    return {
        "exists": True,
        "message": "Email verified. Please enter the OTP to proceed."
    }


@router.post(
    "/reset-password",
    status_code=200
)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Set a password through the recovery flow; called by ResetPasswordPage."""
    if not payload.otp or len(payload.otp.strip()) != 6:
        raise HTTPException(
            status_code=400,
            detail="Invalid security code. Please enter a 6-digit OTP."
        )

    success = auth_service.reset_user_password(
        db,
        email=payload.email,
        new_password=payload.new_password
    )
    if not success:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "success": True,
        "message": "Password updated successfully. You can now log in with your new password."
    }


@router.get(
    "/me",
    response_model=AuthUser
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return the authenticated account identity and agency membership identifiers."""
    agency_id = None
    agent_id = None
    if current_user.role in ["AGENT", "AGENCY"]:
        agent = db.query(AgencyMember).filter(
            AgencyMember.user_id == current_user.user_id
        ).first()
        if agent:
            agency_id = agent.agency_id
            agent_id = agent.agent_id

    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "agency_id": agency_id,
        "agent_id": agent_id
    }
