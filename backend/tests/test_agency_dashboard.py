import unittest
from types import SimpleNamespace

import jwt

from helpers import ApiTestCase, TEST_JWT_SECRET
from app.core.security import hash_password
from app.dependencies.auth import get_current_agent_member
from app.models import Report, User


class AgencyDashboardTests(ApiTestCase):
    def test_dashboard_counts_and_distribution_are_agency_scoped(self):
        status_code, body = self.request(user_id=1)
        self.assertEqual(status_code, 200)
        self.assertEqual(body["agency_id"], 1)
        self.assertEqual(body["statistics"], {
            "pending": 2, "under_investigation": 1, "resolved": 1, "facilities": 3
        })
        self.assertEqual(body["total_reports"], 4)
        self.assertEqual(
            [(row["status"], row["count"], row["percentage"])
             for row in body["status_distribution"]],
            [("PENDING", 2, 50.0), ("UNDER_INVESTIGATION", 1, 25.0),
             ("RESOLVED", 1, 25.0)]
        )

    def test_other_agency_and_absent_status(self):
        status_code, body = self.request(user_id=2)
        self.assertEqual(status_code, 200)
        self.assertEqual(body["agency_id"], 2)
        self.assertEqual(body["statistics"], {
            "pending": 1, "under_investigation": 0, "resolved": 1, "facilities": 1
        })
        self.assertEqual(body["total_reports"], 2)
        self.assertEqual(body["status_distribution"][1]["percentage"], 0.0)

    def test_members_of_the_same_agency_share_dashboard(self):
        self.assertEqual(self.request(user_id=1), self.request(user_id=7))

    def test_query_parameter_cannot_change_agency(self):
        self.assertEqual(
            self.request(user_id=1),
            self.request(user_id=1, path="/agencies/dashboard?agency_id=2")
        )

    def test_empty_agency_returns_zero_counts_and_percentages(self):
        status_code, body = self.request(user_id=6)
        self.assertEqual(status_code, 200)
        self.assertEqual(body["statistics"], {
            "pending": 0, "under_investigation": 0, "resolved": 0, "facilities": 0
        })
        self.assertEqual(body["total_reports"], 0)
        self.assertEqual(len(body["status_distribution"]), 3)
        self.assertTrue(all(
            row["count"] == 0 and row["percentage"] == 0.0
            for row in body["status_distribution"]
        ))

    def test_percentages_are_rounded_to_two_decimal_places(self):
        self.db.delete(self.db.get(Report, 1))
        self.db.commit()
        status_code, body = self.request(user_id=1)
        self.assertEqual(status_code, 200)
        self.assertEqual(
            [row["percentage"] for row in body["status_distribution"]],
            [33.33, 33.33, 33.33]
        )

    def test_authentication_is_required(self):
        self.assertEqual(self.request()[0], 401)
        self.assertEqual(self.request(token="invalid-token")[0], 401)
        self.assertEqual(self.request(user_id=999)[0], 401)

    def test_non_agency_roles_are_forbidden(self):
        for user_id in (3, 4):
            with self.subTest(user_id=user_id):
                self.assertEqual(self.request(user_id=user_id)[0], 403)

    def test_missing_agency_membership(self):
        status_code, body = self.request(user_id=5)
        self.assertEqual(status_code, 404)
        self.assertEqual(
            body["detail"], "Agency member profile not found for this account"
        )

    def test_missing_agency(self):
        self.app.dependency_overrides[get_current_agent_member] = (
            lambda: SimpleNamespace(agency_id=999)
        )
        status_code, body = self.request(user_id=1)
        self.assertEqual(status_code, 404)
        self.assertEqual(body["detail"], "Agency not found")


    def test_login_token_can_access_dashboard(self):
        user = self.db.get(User, 1)
        user.password_hash = hash_password("dashboard-test-password")
        self.db.commit()
        status_code, login = self.request(
            path="/auth/login", method="POST",
            body={"email": user.email, "password": "dashboard-test-password"}
        )
        self.assertEqual(status_code, 200)
        self.assertEqual(login["user"]["agency_id"], 1)
        self.assertEqual(login["user"]["role"], "AGENT")
        status_code, dashboard = self.request(token=login["access_token"])
        self.assertEqual(status_code, 200)
        self.assertEqual(dashboard["agency_id"], 1)
        self.assertEqual(dashboard["total_reports"], 4)

    def test_login_with_invalid_stored_hash_returns_unauthorized(self):
        status_code, _ = self.request(
            path="/auth/login", method="POST",
            body={"email": "user1@example.com", "password": "wrong-password"}
        )
        self.assertEqual(status_code, 401)

    def test_expired_and_invalid_subject_tokens_are_rejected(self):
        for claims in (
            {"sub": "1", "exp": 1},
            {"sub": "not-an-id"},
            {"sub": None}
        ):
            with self.subTest(claims=claims):
                token = jwt.encode(claims, TEST_JWT_SECRET, algorithm="HS256")
                self.assertEqual(self.request(token=token)[0], 401)

    def test_database_role_controls_access_even_if_token_claims_agency(self):
        token = jwt.encode(
            {"sub": "3", "role": "AGENT"}, TEST_JWT_SECRET, algorithm="HS256"
        )
        self.assertEqual(self.request(token=token)[0], 403)

    def test_dashboard_reflects_report_status_changes(self):
        self.db.get(Report, 1).status = "RESOLVED"
        self.db.commit()
        status_code, body = self.request(user_id=1)
        self.assertEqual(status_code, 200)
        self.assertEqual(body["statistics"], {
            "pending": 1, "under_investigation": 1, "resolved": 2, "facilities": 3
        })
        self.assertEqual(body["total_reports"], 4)

    def test_openapi_documents_response_and_bearer_authentication(self):
        operation = self.app.openapi()["paths"]["/agencies/dashboard"]["get"]
        self.assertEqual(
            operation["responses"]["200"]["content"]["application/json"]["schema"],
            {"$ref": "#/components/schemas/AgencyDashboardResponse"}
        )
        self.assertEqual(operation["security"], [{"OAuth2PasswordBearer": []}])
        for error_code in ("401", "403", "404"):
            self.assertIn(error_code, operation["responses"])


if __name__ == "__main__":
    unittest.main()
