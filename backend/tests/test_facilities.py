import base64
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from sqlalchemy.exc import IntegrityError

from helpers import ApiTestCase
from app.models import Facility, Recommendation
from app.services import file_service


class FacilityTests(ApiTestCase):
    def payload(self, **overrides):
        return {
            "facility_name": "New civic facility", "category_id": 11,
            "address": "Main Street", "latitude": 0, "longitude": 0,
            "status": "Open", **overrides
        }

    def add_recommendation(self, recommendation_id=301, **overrides):
        fields = {
            "recommendation_id": recommendation_id, "user_id": 3,
            "category_id": 11, "title": "New facility proposal",
            "description": "Approved proposal", "address": "Main Street",
            "photo_url": "https://example.com/proposal.png",
            "assigned_agency": 1, "status": "APPROVED", **overrides
        }
        recommendation = Recommendation(**fields)
        self.db.add(recommendation)
        self.db.commit()
        return recommendation

    def test_create_round_trip_and_dashboard_sync(self):
        code, item = self.request(
            user_id=1, path="/agencies/facilities", method="POST",
            body=self.payload(additional_notes="  Near the bus stop  ")
        )
        self.assertEqual(code, 201)
        self.assertEqual(item["added_by"], 101)
        self.assertEqual(item["additional_notes"], "Near the bus stop")
        self.assertEqual((item["latitude"], item["longitude"]), (0, 0))
        self.assertEqual(item["status"], "OPEN")
        self.assertEqual(
            self.request(user_id=1, path=f'/agencies/facilities/{item["facility_id"]}')[1],
            item
        )
        dashboard = self.request(user_id=1)[1]
        listing = self.request(user_id=1, path="/agencies/facilities")[1]
        self.assertEqual(dashboard["statistics"]["facilities"], 4)
        self.assertEqual(listing["statistics"]["total"], 4)

    def test_categories_filters_pagination_and_unfiltered_statistics(self):
        code, categories = self.request(user_id=1, path="/agencies/facilities/categories")
        self.assertEqual(code, 200)
        self.assertEqual({item["category_id"] for item in categories}, {11, 13})
        code, body = self.request(user_id=1, path="/agencies/facilities?limit=1&offset=1")
        self.assertEqual(code, 200)
        self.assertEqual(body["total"], 3)
        self.assertEqual(len(body["items"]), 1)
        self.assertEqual(body["statistics"], {
            "total": 3, "open": 1, "under_repair": 1, "suspended": 1,
            "needs_attention": 2
        })
        code, body = self.request(
            user_id=1, path="/agencies/facilities?category_id=11&status=SUSPENDED&search=203"
        )
        self.assertEqual(code, 200)
        self.assertEqual([item["facility_id"] for item in body["items"]], [203])
        self.assertEqual(body["statistics"]["total"], 3)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities?search=%25"
        )[1]["total"], 0)

    def test_empty_agency(self):
        code, body = self.request(user_id=6, path="/agencies/facilities")
        self.assertEqual(code, 200)
        self.assertEqual(body["items"], [])
        self.assertEqual(body["total"], 0)
        self.assertEqual(body["statistics"]["total"], 0)

    def test_edit_uses_category_ownership_and_preserves_optional_fields(self):
        facility = self.db.get(Facility, 203)
        facility.additional_notes = "Existing notes"
        facility.photo_url = "https://example.com/original.png"
        self.db.commit()
        code, item = self.request(
            user_id=1, path="/agencies/facilities/203", method="PUT",
            body=self.payload(category_id=13, status="Under Repair")
        )
        self.assertEqual(code, 200)
        self.assertEqual(item["added_by"], 102)
        self.assertEqual(item["category_id"], 13)
        self.assertEqual(item["additional_notes"], "Existing notes")
        self.assertEqual(item["photo_url"], "https://example.com/original.png")
        self.assertEqual(item["status"], "UNDER_REPAIR")
        code, item = self.request(
            user_id=7, path="/agencies/facilities/203", method="PUT",
            body=self.payload(category_id=13, photo_url="", additional_notes=None)
        )
        self.assertEqual(code, 200)
        self.assertIsNone(item["photo_url"])
        self.assertIsNone(item["additional_notes"])

    def test_other_agency_resources_are_hidden(self):
        for facility_id in (204, 999):
            with self.subTest(facility_id=facility_id):
                path = f"/agencies/facilities/{facility_id}"
                self.assertEqual(self.request(user_id=1, path=path)[0], 404)
                self.assertEqual(self.request(
                    user_id=1, path=path, method="PUT", body=self.payload()
                )[0], 404)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities", method="POST",
            body=self.payload(category_id=12)
        )[0], 404)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities/201", method="PUT",
            body=self.payload(category_id=12)
        )[0], 404)
        self.assertEqual(self.db.get(Facility, 201).category_id, 11)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities?agency_id=2"
        )[1]["total"], 3)

    def test_authentication_and_roles(self):
        operations = [
            ("GET", "/agencies/facilities", None),
            ("GET", "/agencies/facilities/categories", None),
            ("GET", "/agencies/facilities/201", None),
            ("POST", "/agencies/facilities", self.payload()),
            ("PUT", "/agencies/facilities/201", self.payload())
        ]
        for method, path, body in operations:
            for user_id, expected in ((None, 401), (3, 403), (4, 403), (5, 404)):
                with self.subTest(method=method, path=path, user=user_id):
                    self.assertEqual(self.request(
                        user_id=user_id, path=path, method=method, body=body
                    )[0], expected)

    def test_validation_rejects_invalid_or_client_owned_fields(self):
        for override in (
            {"facility_name": "   "}, {"address": ""},
            {"latitude": 91}, {"longitude": -181}, {"latitude": "NaN"},
            {"latitude": "22.12345678"}, {"category_id": 0},
            {"status": "UNKNOWN"}, {"photo_url": "javascript:alert(1)"},
            {"photo_url": "data:image/png;base64,AAAA"},
            {"photo_url": "file:///etc/passwd"},
            {"additional_notes": "x" * 5001}, {"agency_id": 2}, {"added_by": 102}
        ):
            with self.subTest(override=override):
                self.assertEqual(self.request(
                    user_id=1, path="/agencies/facilities", method="POST",
                    body=self.payload(**override)
                )[0], 422)
        for query in ("limit=0", "limit=101", "offset=-1", "category_id=-1", "status=bad"):
            self.assertEqual(self.request(
                user_id=1, path="/agencies/facilities?" + query
            )[0], 422)

    def test_recommendation_install_is_atomic_and_cannot_be_repeated(self):
        self.add_recommendation()
        code, item = self.request(
            user_id=1, path="/agencies/facilities", method="POST",
            body=self.payload(source_recommendation_id=301)
        )
        self.assertEqual(code, 201)
        self.assertEqual(item["source_recommendation_id"], 301)
        self.assertEqual(self.db.get(Recommendation, 301).status, "INSTALLED")
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities", method="POST",
            body=self.payload(source_recommendation_id=301)
        )[0], 409)
        self.assertEqual(self.db.query(Facility).filter_by(source_recommendation_id=301).count(), 1)
        self.assertEqual(self.request(
            user_id=1, path=f'/agencies/facilities/{item["facility_id"]}', method="PUT",
            body=self.payload(category_id=13)
        )[0], 422)

    def test_invalid_recommendation_install_does_not_mutate_records(self):
        cases = [
            (301, {"assigned_agency": 2}, {}, 404),
            (302, {"status": "PENDING"}, {}, 409),
            (303, {"category_id": 13}, {}, 422),
            (304, {}, {"status": "Under Repair"}, 422)
        ]
        for rec_id, fields, form, expected in cases:
            with self.subTest(rec_id=rec_id):
                self.add_recommendation(rec_id, **fields)
                self.assertEqual(self.request(
                    user_id=1, path="/agencies/facilities", method="POST",
                    body=self.payload(source_recommendation_id=rec_id, **form)
                )[0], expected)
                self.assertEqual(
                    self.db.get(Recommendation, rec_id).status, fields.get("status", "APPROVED")
                )
        self.assertEqual(self.db.query(Facility).count(), 4)

    def test_failed_commit_rolls_back_facility_and_recommendation(self):
        self.add_recommendation()
        with patch.object(self.db, "commit", side_effect=IntegrityError("insert", {}, Exception())):
            code, _ = self.request(
                user_id=1, path="/agencies/facilities", method="POST",
                body=self.payload(source_recommendation_id=301)
            )
        self.assertEqual(code, 409)
        self.assertEqual(self.db.get(Recommendation, 301).status, "APPROVED")
        self.assertEqual(self.db.query(Facility).count(), 4)


class FacilityPhotoTests(ApiTestCase):
    PNG = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2l8AAAAASUVORK5CYII="
    )

    def setUp(self):
        super().setUp()
        self.upload_dir = self.enterContext(TemporaryDirectory())
        self.enterContext(patch("app.services.file_service.FACILITY_UPLOAD_DIR", Path(self.upload_dir)))
        self.enterContext(patch("app.services.facility_service.FACILITY_UPLOAD_DIR", Path(self.upload_dir)))

    def upload(self, data=None, content_type="image/png", user_id=1):
        boundary = "facility-test-boundary"
        body = (
            f'--{boundary}\r\nContent-Disposition: form-data; name="photo"; filename="../../test.png"\r\n'
            f"Content-Type: {content_type}\r\n\r\n"
        ).encode() + (self.PNG if data is None else data) + f"\r\n--{boundary}--\r\n".encode()
        return self.request(
            user_id=user_id, path="/agencies/facilities/photos", method="POST",
            raw_body=body, content_type=f"multipart/form-data; boundary={boundary}"
        )

    def test_upload_uses_generated_filename_and_can_be_attached(self):
        code, body = self.upload()
        self.assertEqual(code, 201)
        url = body["photo_url"]
        self.assertRegex(url, r"^/uploads/facilities/1/[a-f0-9]{32}\.png$")
        saved = Path(self.upload_dir) / "1" / Path(url).name
        self.assertEqual(saved.read_bytes(), self.PNG)
        payload = {
            "facility_name": "With photo", "category_id": 11, "address": "Street",
            "latitude": 0, "longitude": 0, "photo_url": url
        }
        self.assertEqual(self.request(
            user_id=1, path="/agencies/facilities", method="POST", body=payload
        )[0], 201)
        payload["category_id"] = 12
        self.assertEqual(self.request(
            user_id=2, path="/agencies/facilities", method="POST", body=payload
        )[0], 422)

    def test_invalid_photos_leave_no_files(self):
        for data, content_type in (
            (b"", "image/png"), (b"<script>alert(1)</script>", "image/png"),
            (b"<svg></svg>", "image/svg+xml"), (self.PNG, "image/jpeg")
        ):
            with self.subTest(content_type=content_type, data=data[:10]):
                self.assertEqual(self.upload(data, content_type)[0], 422)
        self.assertEqual(list(Path(self.upload_dir).rglob("*")), [])

    def test_oversized_upload_is_rejected(self):
        with patch.object(file_service, "MAX_FACILITY_PHOTO_SIZE", 16):
            self.assertEqual(self.upload()[0], 413)
        self.assertEqual(list(Path(self.upload_dir).rglob("*")), [])

    def test_photo_upload_requires_agency_access(self):
        for user_id, status in ((None, 401), (3, 403), (4, 403), (5, 404)):
            self.assertEqual(self.upload(user_id=user_id)[0], status)
        self.assertEqual(list(Path(self.upload_dir).rglob("*")), [])
