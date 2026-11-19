from datetime import datetime

from helpers import ApiTestCase
from app.models import Report, ReportResolutionSubmission


class ResolvedReportTests(ApiTestCase):
    def setUp(self):
        super().setUp()
        self.db.get(Report, 4).resolved_at = datetime(2026, 10, 10, 12, 0)
        self.db.add(Report(
            report_id=7, facility_id=204, user_id=3, title="Historical report",
            description="Assigned to agency one for a facility managed elsewhere",
            photo_url="/uploads/reports/test.jpg", status="RESOLVED",
            assigned_agency=1
        ))
        self.db.add_all([
            ReportResolutionSubmission(
                resolution_id=resolution_id, report_id=4, agent_id=agent,
                resolution_photo=f"/uploads/resolutions/{resolution_id}.png",
                verification_status=status, submitted_at=datetime(2026, 10, day, 12, 0)
            )
            for resolution_id, agent, status, day in (
                (401, 101, "APPROVED", 8),
                (402, 107, "APPROVED", 9),
                (403, 101, "PENDING", 11),
                (404, 101, "REJECTED", 12),
                (405, 102, "APPROVED", 13)
            )
        ])
        self.db.commit()

    def test_resolved_list_is_assigned_agency_scoped_and_matches_dashboard(self):
        code, body = self.request(user_id=1, path="/agencies/reports/resolved")
        self.assertEqual(code, 200)
        self.assertEqual([item["report_id"] for item in body["items"]], [4, 7])
        self.assertEqual(body["total"], 2)
        self.assertEqual(body["items"][1]["facility_name"], "Facility 204")
        self.assertEqual(body["total"], self.request(user_id=1)[1]["statistics"]["resolved"])

    def test_completion_time_is_not_fabricated_from_creation_or_evidence(self):
        code, report = self.request(user_id=1, path="/agencies/reports/resolved/4")
        self.assertEqual(code, 200)
        self.assertEqual(report["resolved_at"], "2026-10-10T12:00:00")
        self.assertEqual(report["resolution_submitted_at"], "2026-10-09T12:00:00")
        self.assertEqual(report["resolution_photo_url"], "/uploads/resolutions/402.png")
        code, legacy = self.request(user_id=1, path="/agencies/reports/resolved/7")
        self.assertEqual(code, 200)
        self.assertIsNone(legacy["resolved_at"])
        self.assertIsNone(legacy["resolution_photo_url"])
        self.assertIsNone(legacy["resolution_submitted_at"])

    def test_non_resolved_other_agency_and_missing_reports_are_hidden(self):
        for report_id in (1, 3, 5, 999):
            self.assertEqual(self.request(
                user_id=1, path=f"/agencies/reports/resolved/{report_id}"
            )[0], 404)

    def test_search_pagination_and_empty_results(self):
        code, page = self.request(
            user_id=1, path="/agencies/reports/resolved?limit=1&offset=1"
        )
        self.assertEqual(code, 200)
        self.assertEqual(page["total"], 2)
        self.assertEqual([item["report_id"] for item in page["items"]], [7])
        self.assertEqual(self.request(
            user_id=1, path="/agencies/reports/resolved?search=Historical"
        )[1]["total"], 1)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/reports/resolved?search=%234"
        )[1]["items"][0]["report_id"], 4)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/reports/resolved?search=%25"
        )[1]["total"], 0)
        empty = self.request(user_id=6, path="/agencies/reports/resolved")[1]
        self.assertEqual(empty["items"], [])
        self.assertEqual(empty["total"], 0)

    def test_authorization_and_query_validation(self):
        for path in ("/agencies/reports/resolved", "/agencies/reports/resolved/4"):
            for user_id, expected in ((None, 401), (3, 403), (4, 403), (5, 404)):
                self.assertEqual(self.request(user_id=user_id, path=path)[0], expected)
        for query in ("limit=0", "limit=101", "offset=-1"):
            self.assertEqual(self.request(
                user_id=1, path="/agencies/reports/resolved?" + query
            )[0], 422)
        self.assertEqual(self.request(
            user_id=1, path="/agencies/reports/resolved?agency_id=2"
        )[1]["total"], 2)
