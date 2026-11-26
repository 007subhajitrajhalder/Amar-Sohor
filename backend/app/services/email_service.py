"""Send transactional email through the EmailJS REST API."""

import json
import os
import urllib.error
import urllib.request

EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send"


class EmailSendError(Exception):
    """Raised when EmailJS is not configured or rejects a send."""


def send_otp_email(to_email: str, to_name: str, otp: str, expires_minutes: int) -> None:
    """Send a registration OTP using the configured EmailJS template."""
    service_id = os.getenv("EMAILJS_SERVICE_ID")
    template_id = os.getenv("EMAILJS_TEMPLATE_ID")
    public_key = os.getenv("EMAILJS_PUBLIC_KEY")
    private_key = os.getenv("EMAILJS_PRIVATE_KEY")
    if not (service_id and template_id and public_key and private_key):
        raise EmailSendError("EmailJS is not configured")

    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": public_key,
        "accessToken": private_key,
        "template_params": {
            "to_email": to_email,
            "to_name": to_name,
            "otp": otp,
            "expires_minutes": expires_minutes,
        },
    }
    request = urllib.request.Request(
        EMAILJS_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            if response.status != 200:
                raise EmailSendError(f"EmailJS returned {response.status}")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")[:200]
        raise EmailSendError(f"EmailJS returned {exc.code}: {body}") from exc
    except urllib.error.URLError as exc:
        raise EmailSendError(f"EmailJS unreachable: {exc.reason}") from exc
