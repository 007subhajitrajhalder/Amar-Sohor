import os
import uuid
import base64
from fastapi import UploadFile, HTTPException

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_ROOT = os.path.join(BASE_DIR, "uploads")


def save_upload_file(file: UploadFile, subfolder: str) -> str:
    """Save an UploadFile to disk and return its relative URL path."""
    dest_folder = os.path.join(UPLOAD_ROOT, subfolder)
    os.makedirs(dest_folder, exist_ok=True)

    filename = file.filename or "upload.jpg"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        ext = ".jpg"

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(dest_folder, unique_filename)

    with open(dest_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)

    return f"/uploads/{subfolder}/{unique_filename}"


def save_base64_or_url_photo(photo_str: str, subfolder: str) -> str:
    """
    If photo_str is a base64 data URI (data:image/jpeg;base64,...), decode and save it.
    If it's already a URL, return it as-is.
    """
    if not photo_str:
        return ""

    if photo_str.startswith("data:image/"):
        dest_folder = os.path.join(UPLOAD_ROOT, subfolder)
        os.makedirs(dest_folder, exist_ok=True)

        try:
            header, encoded = photo_str.split(",", 1)
            ext = ".png"
            if "jpeg" in header or "jpg" in header:
                ext = ".jpg"
            elif "webp" in header:
                ext = ".webp"

            file_bytes = base64.b64decode(encoded)
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            dest_path = os.path.join(dest_folder, unique_filename)

            with open(dest_path, "wb") as buffer:
                buffer.write(file_bytes)

            return f"/uploads/{subfolder}/{unique_filename}"
        except Exception:
            return photo_str

    return photo_str

