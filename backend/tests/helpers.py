import asyncio
import json
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit

import jwt
from fastapi import FastAPI
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.connection import get_db
from app.models import Agency, AgencyMember, Facility, FacilityCategory, Report, User
from app.routers import auth, facilities, reports, users
from app.routers.agencies import router


TEST_JWT_SECRET = "agency-dashboard-test-secret-at-least-32-characters"


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool
        )
        @event.listens_for(self.engine, "connect")
        def enable_foreign_keys(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")

        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        self.addCleanup(self.engine.dispose)
        self.addCleanup(self.db.close)

        self.app = FastAPI()
        self.app.include_router(router)
        self.app.include_router(auth.router)
        self.app.include_router(facilities.router)
        self.app.include_router(reports.router)
        self.app.include_router(users.router)

        def override_db():
            yield self.db

        self.app.dependency_overrides[get_db] = override_db
        self.enterContext(patch("app.dependencies.auth.JWT_SECRET_KEY", TEST_JWT_SECRET))
        self.enterContext(patch("app.dependencies.auth.JWT_ALGORITHM", "HS256"))
        self.enterContext(patch("app.core.security.JWT_SECRET_KEY", TEST_JWT_SECRET))
        self.enterContext(patch("app.core.security.JWT_ALGORITHM", "HS256"))

        self.db.add_all([
            Agency(agency_id=i, agency_name=f"Agency {i}", department_type="Civic")
            for i in (1, 2, 3)
        ])
        self.db.add_all([
            User(
                user_id=i, full_name=f"User {i}", email=f"user{i}@example.com",
                phone=f"555000{i}", password_hash="unused", role=role
            )
            for i, role in (
                (1, "AGENT"), (2, "AGENT"), (3, "USER"), (4, "ADMIN"),
                (5, "AGENT"), (6, "AGENT"), (7, "AGENT")
            )
        ])
        self.db.flush()
        self.db.add_all([
            AgencyMember(agent_id=101, agency_id=1, user_id=1),
            AgencyMember(agent_id=102, agency_id=2, user_id=2),
            AgencyMember(agent_id=106, agency_id=3, user_id=6),
            AgencyMember(agent_id=107, agency_id=1, user_id=7),
            FacilityCategory(category_id=11, category_name="Dustbins", handling_agency=1),
            FacilityCategory(category_id=12, category_name="Water", handling_agency=2),
            FacilityCategory(category_id=13, category_name="Toilets", handling_agency=1)
        ])
        self.db.flush()
        self.db.add_all([
            Facility(
                facility_id=i, facility_name=f"Facility {i}", category_id=category,
                added_by=agent, latitude=23.8, longitude=90.4,
                address="Test street", status=facility_status
            )
            for i, category, agent, facility_status in (
                (201, 11, 101, "OPEN"),
                (202, 13, 107, "UNDER_REPAIR"),
                (203, 11, 102, "SUSPENDED"),
                (204, 12, 101, "OPEN")
            )
        ])
        self.db.flush()
        self.db.add_all([
            Report(
                report_id=i, facility_id=facility, user_id=3,
                title=f"Report {i}", description="Test report",
                photo_url="/uploads/reports/test.jpg",
                status=report_status, assigned_agency=agency
            )
            for i, facility, agency, report_status in (
                (1, 201, 1, "PENDING"), (2, 201, 1, "PENDING"),
                (3, 201, 1, "UNDER_INVESTIGATION"), (4, 201, 1, "RESOLVED"),
                (5, 204, 2, "RESOLVED"), (6, 201, 2, "PENDING")
            )
        ])
        self.db.commit()

    def request(
        self, user_id=None, path="/agencies/dashboard", token=None,
        method="GET", body=None, raw_body=None, content_type=None
    ):
        # Exercise the ASGI app without requiring an additional HTTP test library.
        if user_id is not None:
            token = jwt.encode(
                {"sub": str(user_id)}, TEST_JWT_SECRET, algorithm="HS256"
            )
        url = urlsplit(path)
        headers = [] if token is None else [
            (b"authorization", f"Bearer {token}".encode())
        ]
        request_body = b"" if body is None else json.dumps(body).encode()
        if raw_body is not None:
            request_body = raw_body
        if content_type is not None:
            headers.append((b"content-type", content_type.encode()))
        elif body is not None:
            headers.append((b"content-type", b"application/json"))
        scope = {
            "type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1",
            "method": method, "scheme": "http", "path": url.path,
            "raw_path": url.path.encode(), "query_string": url.query.encode(),
            "root_path": "", "headers": headers,
            "client": ("127.0.0.1", 12345), "server": ("testserver", 80)
        }
        messages = []

        async def receive():
            return {
                "type": "http.request",
                "body": request_body,
                "more_body": False
            }

        async def send(message):
            messages.append(message)

        asyncio.run(self.app(scope, receive, send))

        start = next(msg for msg in messages if msg["type"] == "http.response.start")
        body_parts = [
            msg.get("body", b"")
            for msg in messages if msg["type"] == "http.response.body"
        ]
        response_body = b"".join(body_parts).decode()
        parsed_body = json.loads(response_body) if response_body else None
        return start["status"], parsed_body
