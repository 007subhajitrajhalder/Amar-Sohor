from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


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
