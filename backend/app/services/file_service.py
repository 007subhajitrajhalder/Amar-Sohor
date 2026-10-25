import os
import uuid
import base64
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile, HTTPException
from starlette.concurrency import run_in_threadpool

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_ROOT = str(Path(__file__).resolve().parents[2] / "uploads")
FACILITY_UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads" / "facilities"
MAX_FACILITY_PHOTO_SIZE = 10 * 1024 * 1024


class InvalidImage(ValueError):
    pass


class ImageTooLarge(ValueError):
    pass


def _image_extension(data: bytes, content_type: str | None) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n") and data[12:16] == b"IHDR":
        extension, expected_type = "png", "image/png"
    elif data.startswith(b"\xff\xd8\xff"):
        extension, expected_type = "jpg", "image/jpeg"
    elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        extension, expected_type = "webp", "image/webp"
    else:
        raise InvalidImage("Upload a PNG, JPEG, or WEBP image")
    if content_type != expected_type:
        raise InvalidImage("Image content does not match its content type")
    return extension


def _write_photo(path: Path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with path.open("xb") as output:
            output.write(data)
    except FileExistsError:
        raise
    except OSError:
        path.unlink(missing_ok=True)
        raise


async def save_facility_photo(photo: UploadFile, agency_id: int) -> str:
    data = bytearray()
    try:
        while chunk := await photo.read(1024 * 1024):
            data.extend(chunk)
            if len(data) > MAX_FACILITY_PHOTO_SIZE:
                raise ImageTooLarge("Facility photos must be at most 10 MB")
        extension = _image_extension(data, photo.content_type)
        filename = f"{uuid4().hex}.{extension}"
        path = FACILITY_UPLOAD_DIR / str(agency_id) / filename
        await run_in_threadpool(_write_photo, path, bytes(data))
        return f"/uploads/facilities/{agency_id}/{filename}"
    finally:
        await photo.close()


def save_upload_file(file: UploadFile, subfolder: str) -> str:
    """Save an UploadFile to disk and return its relative URL path."""
    dest_folder = os.path.join(UPLOAD_ROOT, subfolder)
    os.makedirs(dest_folder, exist_ok=True)

    content = file.file.read(MAX_FACILITY_PHOTO_SIZE + 1)
    if len(content) > MAX_FACILITY_PHOTO_SIZE:
        raise HTTPException(413, "Photo must be at most 10 MB")
    try:
        extension = _image_extension(content, file.content_type)
    except InvalidImage as exc:
        raise HTTPException(422, str(exc)) from exc
    filename = "photo." + extension
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        ext = ".jpg"

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(dest_folder, unique_filename)

    with open(dest_path, "wb") as buffer:
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
        except Exception as exc:
            raise HTTPException(422, "Invalid photo data") from exc

    return photo_str
