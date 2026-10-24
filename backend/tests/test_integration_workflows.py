import base64
from tempfile import TemporaryDirectory
from unittest.mock import patch
from urllib.parse import urlencode

from helpers import ApiTestCase
from app.models import Facility, User, AgencyMember, Report, Recommendation
from app.models.report_resolution_submission import ReportResolutionSubmission
from app.routers import admin, users, recommendations
from app.services import file_service

class IntegrationWorkflowTests(ApiTestCase):
    def setUp(self):
        super().setUp()
        for module in (admin, users, recommendations):
            self.app.include_router(module.router)

    def facility_payload(self, **overrides):
        return dict(facility_name="Persisted facility", category_id=11, address="Test address",
            latitude=0, longitude=0, status="OPEN", **overrides)

    def test_delete_round_trip_counts_and_cross_agency_authorization(self):
        code, f = self.request(1, "/agencies/facilities", method="POST", body=self.facility_payload())
        self.assertEqual(code, 201)
        path = "/agencies/facilities/" + str(f["facility_id"])
        self.assertEqual(self.request(2, path, method="DELETE")[0], 404)
        self.assertEqual(self.request(3, path, method="DELETE")[0], 403)
        self.assertEqual(self.request(1, path, method="DELETE")[0], 204)
        self.db.expire_all()
        self.assertIsNone(self.db.get(Facility, f["facility_id"]))
        self.assertEqual(self.request(1, path)[0], 404)
        self.assertEqual(self.request(1)[1]["statistics"]["facilities"], 3)

    def test_delete_preserves_complaint_history(self):
        self.assertEqual(self.request(1, "/agencies/facilities/201", method="DELETE")[0], 409)
        self.assertIsNotNone(self.db.get(Report, 4))

    def test_reports_require_authentication_and_scope_list_and_details(self):
        self.assertEqual(self.request(path="/reports")[0], 401)
        self.assertEqual(self.request(2, "/reports/1")[0], 404)
        own = self.request(1, "/reports?user_id=3")[1]
        self.assertEqual({r["assigned_agency"] for r in own}, {1})
        self.assertEqual(self.request(3, "/reports/1")[0], 200)
        self.assertEqual(self.request(1, "/users/")[0], 403)

    def test_invalid_facility_does_not_fallback_and_user_identity_cannot_be_spoofed(self):
        data = {"facility_id": 99999, "title": "Issue", "description": "A report", "user_id": 4}
        args = dict(method="POST", content_type="application/x-www-form-urlencoded")
        self.assertEqual(self.request(3, "/reports", raw_body=urlencode(data).encode(), **args)[0], 404)
        data["facility_id"] = 201
        code, report = self.request(3, "/reports", raw_body=urlencode(data).encode(), **args)
        self.assertEqual(code, 201)
        self.assertEqual(report["user_id"], 3)

    def test_report_investigation_and_verified_resolution_are_persisted(self):
        self.assertEqual(self.request(2, "/reports/1", method="PATCH", body={"status":"UNDER_INVESTIGATION"})[0], 404)
        self.assertEqual(self.request(3, "/reports/1", method="PATCH", body={"status":"UNDER_INVESTIGATION"})[0], 403)
        code, result = self.request(1, "/reports/1", method="PATCH", body={"status":"UNDER_INVESTIGATION", "notes":"Site checked"})
        self.assertEqual(code, 200)
        self.db.expire_all()
        self.assertEqual(self.db.get(Report, 1).investigation_notes, "Site checked")
        self.assertEqual(self.request(1, "/reports/1", method="PATCH", body={"status":"RESOLVED"})[0], 403)
        self.assertEqual(self.request(4, "/reports/1", method="PATCH", body={"status":"RESOLVED"})[0], 409)
        self.db.add(ReportResolutionSubmission(report_id=1, agent_id=101, resolution_photo="https://example.com/done.png", verification_status="PENDING"))
        self.db.commit()
        code, result = self.request(4, "/reports/1", method="PATCH", body={"status":"RESOLVED"})
        self.assertEqual(code, 200)
        self.assertIsNotNone(result["resolved_at"])
        self.assertEqual(self.request(1)[1]["statistics"]["resolved"], self.request(1, "/agencies/reports/resolved")[1]["total"])
        self.assertEqual(self.request(1, "/agencies/reports/resolved/1")[1]["resolution_photo_url"], "https://example.com/done.png")

    def test_membership_provisioning_creates_valid_agent_identity(self):
        body = dict(full_name="New member", email="new.member@example.com", phone="99900", password="secure-test-password", agency_id=1)
        self.assertEqual(self.request(3, "/admin/agency-members", method="POST", body=body)[0], 403)
        code, result = self.request(4, "/admin/agency-members", method="POST", body=body)
        self.assertEqual(code, 201)
        self.assertEqual(result["role"], "AGENT")
        member = self.db.query(AgencyMember).filter_by(user_id=result["user_id"]).one()
        self.assertEqual(member.agency_id, 1)
        self.assertEqual(self.request(result["user_id"])[0], 200)

    def test_recommendation_allocation_investigation_and_install(self):
        body = dict(title="New recommendation", description="Suitable site", address="Test address",
            category_id=11, latitude=0, longitude=0, user_id=4)
        code, rec = self.request(3, "/recommendations", method="POST", raw_body=urlencode(body).encode(),
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(code, 201)
        self.assertEqual((rec["user_id"], rec["latitude"]), (3, 0))
        path = "/recommendations/" + str(rec["recommendation_id"])
        self.assertEqual(self.request(2, path)[0], 404)
        self.assertEqual(self.request(1, path+"/allocate", method="POST", body={"agent_id":101})[0], 403)
        self.assertEqual(self.request(4, path+"/allocate", method="POST", body={"agent_id":102})[0], 422)
        self.assertEqual(self.request(4, path+"/allocate", method="POST", body={"agent_id":101})[0], 200)
        self.assertEqual(self.request(1, path, method="PATCH", body={"status":"UNDER_INVESTIGATION","notes":"Checking site"})[0], 200)
        self.assertEqual(self.request(1, path, method="PATCH", body={"status":"APPROVED","notes":"Suitable site"})[0], 200)
        payload = self.facility_payload(source_recommendation_id=rec["recommendation_id"])
        self.assertEqual(self.request(1, "/agencies/facilities", method="POST", body=payload)[0], 201)
        self.db.expire_all()
        self.assertEqual(self.db.get(Recommendation, rec["recommendation_id"]).status, "INSTALLED")
        self.assertEqual(self.request(1, "/agencies/facilities", method="POST", body=payload)[0], 409)

    def test_rating_profile_and_account_access(self):
        self.assertEqual(self.request(path="/facilities/201/ratings", method="POST", body={"rating":4,"title":"Review"})[0], 401)
        self.assertEqual(self.request(3, "/facilities/201/ratings", method="POST", body={"rating":4,"title":"Review"})[0], 201)
        self.assertEqual(self.request(path="/facilities/201/ratings")[1][0]["text"], "Review")
        code, profile = self.request(3, "/users/me", method="PUT", body={"full_name":"Updated citizen", "email":"updated@example.com", "phone":"updated-phone"})
        self.assertEqual(code, 200)
        self.db.expire_all()
        self.assertEqual(self.db.get(User, 3).full_name, "Updated citizen")
        self.assertEqual(self.request(1, "/users/3", method="DELETE")[0], 403)
        self.assertEqual(self.request(4, "/users/3", method="DELETE")[0], 409)
