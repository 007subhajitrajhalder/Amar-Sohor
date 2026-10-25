# React/FastAPI integration report

The existing applications are integrated with the existing amar_sohor database.
No frontend/backend project or database was replaced. The five requested agency
pages retain their layout and navigation and use authenticated API data.

## Endpoint map for the five pages

| Page | Connected endpoints |
| --- | --- |
| AgencyDashboardPage.jsx | GET /agencies/dashboard |
| AddFacilityPage.jsx | GET /agencies/facilities/categories; POST /agencies/facilities/photos; POST /agencies/facilities |
| EditFacilityPage.jsx | GET /agencies/facilities/{id}; GET categories; POST photos; PUT /agencies/facilities/{id} |
| FacilityManagementPage.jsx | GET /agencies/facilities with search/category/paging; DELETE /agencies/facilities/{id}; public GET /facilities/{id} for View |
| PreviouslyResolvedPage.jsx | GET /agencies/reports/resolved with search/paging; GET /agencies/reports/resolved/{id} for evidence |

Additional connected routes cover citizen registration/login/profile, facility
map/details/ratings, complaint submission/investigation/resolution approval,
recommendation submission/allocation/investigation/installation, admin user/agency
lists, and agency-member provisioning/removal. [Backend README](backend/README.md)
documents the full endpoint map and access rules.

## Replaced static data and corrected integration bugs

- Removed facility, complaint, recommendation, member/user/agency fixture records,
  simulated success responses, and localStorage persistence of application records.
- Replaced agency/admin statistics, chart widths/legends, and workflow progress
  with actual records. No resolved complaint or completion date is fabricated.
- Centralized API URL/token/error handling and real photo URLs. Matched actual
  endpoint methods, JSON/multipart fields, enum values, and responses.
- Replaced fallback citizen/facility/category/agency identities with authenticated
  identity and validated records. Category IDs come from the database.
- Enforced server-side ownership on lists/details/updates/deletes and role checks
  on admin operations. Frontend route guards are additional navigation controls.
- Fixed agency-member provisioning to create AGENT plus agency_members atomically.
- Added missing history-safe facility DELETE, resolution submission/approval,
  profile update, review creation, and authorized management operations by extending
  existing routers/services.
- Preserved zero-valued coordinates; validate names/addresses/category/status/ranges.
  Prevent edit state from carrying to a different facility ID.
- Lists refresh after mutations, browser focus, cross-tab changes, and polling.
  Actual server failures remain visible, with no fake success fallback.
- Fixed upload directory mismatch, missing ORM/database columns, database URL
  handling of special characters, and uniqueness-conflict error handling.
- Repaired the existing virtual environment and applied compatible npm dependency
  fixes. The existing private environment now has its required JWT signing key.

## Database and migrations

Verified the same localhost:3306 amar_sohor instance, running XAMPP MariaDB 10.4.32.
The additive migration is applied and a fresh preview reports no pending changes.
Eight nullable columns plus required unique/foreign-key constraints are documented
in [backend/README.md](backend/README.md#additive-schema-migration). Existing rows
were preserved. There is no startup schema recreation or automatic seeding.

A stalled MariaDB DDL operation required restarting the same XAMPP server with
its existing configuration/data. The migration then completed and live persistence
tests passed. The separate MySQL80 service is not the database process used here.

Cleanup verification after the completed test run:
4 original users, 4 agencies, 4 categories; 0 agency members, facilities, reports,
recommendations, ratings, resolution submissions, or investigation records.
No temporary fixture manifest remains. Empty dashboards therefore correctly show
zero after authenticating an agency member; create real members through admin UI.

## Verification results

**Final live run: 5 tests passed in 52.2 seconds using Microsoft Edge, real HTTP requests, and the configured MariaDB database.**

| Check | Result and evidence |
| --- | --- |
| React/FastAPI startup and CORS | PASS: Playwright starts both; browser calls localhost API successfully |
| Database connectivity | PASS: /health executes SELECT1; live calls use configured MariaDB |
| Facility add/edit/view/delete | PASS: browser form submissions, API responses, independent SQLAlchemy reads, confirmation cancel/accept |
| Refresh persistence | PASS: browser reload retains created/updated values; deleted record remains absent |
| Cross-page facility counts | PASS: agency dashboard matches unfiltered facility statistics before/after mutation |
| Agency isolation | PASS: another agency gets404 for facility read/update/delete and report detail |
| Resolved complaints | PASS: genuinely empty list before evidence approval; pending evidence excluded; approved evidence/details/date match dashboard |
| Complaint workflow | PASS: citizen browser registration/login/submission/photo -> agency investigation/evidence -> admin approval |
| Recommendation workflow | PASS: real multipart proposal API -> admin browser allocation -> agency investigation/approval/installation; duplicate installation409 |
| Recommendation progress | PASS: saved allocation/installation states display consistently on admin/citizen pages |
| Profile and reviews | PASS: browser submissions persist after reload |
| Search/filter/pagination | PASS: real facility browser search/category/empty search; backend facility/resolved pagination/filter tests |
| Loading/error/retry | PASS: delayed real request, network failure, visible error without fake records, successful retry |
| Authentication/logout | PASS: login roles, anonymous401, citizen admin403, logout/protected redirect |
| Admin management | PASS: real provisioning API and list/add-page browser smoke checks; account/history protection in backend tests |
| Route smoke tests | PASS: 18 additional admin/agency/citizen routes render without page errors or API alerts |
| Backend regression tests | PASS: 49 tests, including rollback, validation, upload limits, ownership, lifecycle and security |
| Frontend lint/build | PASS; build emits a >500KB JavaScript bundle warning |
| Dependency consistency | PASS: pip check; npm audit reports 0 vulnerabilities |

The live tests use temporary records in the configured database. Backend unit
tests use isolated SQLite. Route smoke coverage is distinct from a full manual
check of every decorative control, responsive breakpoint, and external map tile.
Email recovery remains unavailable; it has no passing end-to-end test.

## Run both applications in VS Code PowerShell

The configured XAMPP database must be running on its existing port 3306.
Dependencies are already installed; commands below also support restoring them.

Terminal 1:

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\backend'
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -B scripts\migrate_agency_facilities.py
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2:

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\frontend'
npm ci
$env:VITE_API_BASE_URL = 'http://localhost:8000'
npm run dev -- --host 127.0.0.1 --port 5173
```

Open http://localhost:5173. API docs: http://localhost:8000/docs.

The original administrator's password hash is malformed. Repair it locally before
using that account, without placing a password in chat or command arguments:

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\backend'
.\venv\Scripts\python.exe scripts\reset_password.py --admin
```

Then log in with the existing admin email and create actual agency members at
/admin/agency-members/add. No permanent sample agency accounts were created.

## Remaining limitations

- The original admin password still needs the local reset above; integration did
  not overwrite existing account credentials.
- No email delivery/reset-token workflow exists. Forgot Password explains this
  rather than claiming an email was sent.
- Verification/online activity, opening hours, and distance estimates are not
  stored in the current schema. The UI does not invent these values.
- An abandoned photo upload can leave an unused file; file retention/garbage
  collection is not implemented. Deleting records with history returns 409 intentionally.
- The current frontend bundle is about 746 KB before gzip; route code splitting
  remains a performance improvement, not a startup failure.
- Swagger's legacy OAuth2 password-form declaration differs from JSON login;
  the frontend JSON authentication workflow is verified.

## Modified and added files

- `.gitignore`
- `INTEGRATION_REPORT.md`
- `backend/README.md`
- `backend/app/database/connection.py`
- `backend/app/dependencies/access.py`
- `backend/app/main.py`
- `backend/app/models/report.py`
- `backend/app/models/report_resolution_submission.py`
- `backend/app/routers/admin.py`
- `backend/app/routers/facilities.py`
- `backend/app/routers/recommendations.py`
- `backend/app/routers/reports.py`
- `backend/app/routers/users.py`
- `backend/app/schemas/admin.py`
- `backend/app/schemas/auth.py`
- `backend/app/schemas/recommendation.py`
- `backend/app/schemas/report.py`
- `backend/app/services/admin_service.py`
- `backend/app/services/agency_service.py`
- `backend/app/services/auth_service.py`
- `backend/app/services/facility_service.py`
- `backend/app/services/file_service.py`
- `backend/app/services/recommendation_service.py`
- `backend/app/services/report_service.py`
- `backend/app/services/user_service.py`
- `backend/scripts/integration_fixture.py`
- `backend/scripts/migrate_agency_facilities.py`
- `backend/scripts/reset_password.py`
- `backend/tests/helpers.py`
- `backend/tests/test_integration_workflows.py`
- `frontend/.env.example`
- `frontend/README.md`
- `frontend/package-lock.json`
- `frontend/package.json`
- `frontend/playwright.config.js`
- `frontend/src/App.jsx`
- `frontend/src/api/client.js`
- `frontend/src/api/useApi.js`
- `frontend/src/components/ApiState.jsx`
- `frontend/src/components/AuthGate.jsx`
- `frontend/src/components/Pagination.jsx`
- `frontend/src/components/ResolvedReportDetails.jsx`
- `frontend/src/pages/admin/AddAgencyMemberPage.jsx`
- `frontend/src/pages/admin/AdminComplaintDetailsPage.jsx`
- `frontend/src/pages/admin/AdminDashboardPage.jsx`
- `frontend/src/pages/admin/AdminRecommendationProgressPage.jsx`
- `frontend/src/pages/admin/AgencyManagementPage.jsx`
- `frontend/src/pages/admin/AgencyMembersPage.jsx`
- `frontend/src/pages/admin/AllComplaintsPage.jsx`
- `frontend/src/pages/admin/AllRecommendationsPage.jsx`
- `frontend/src/pages/admin/AllocateRecommendationPage.jsx`
- `frontend/src/pages/admin/UserManagementPage.jsx`
- `frontend/src/pages/admin/adminRecommendationsData.js`
- `frontend/src/pages/agency/AddFacilityPage.jsx`
- `frontend/src/pages/agency/AgencyDashboardPage.jsx`
- `frontend/src/pages/agency/AssignedRecommendationsPage.jsx`
- `frontend/src/pages/agency/AssignedReportsPage.jsx`
- `frontend/src/pages/agency/EditFacilityPage.jsx`
- `frontend/src/pages/agency/FacilityManagementPage.jsx`
- `frontend/src/pages/agency/PreviouslyResolvedPage.jsx`
- `frontend/src/pages/agency/RecommendationInvestigationPage.jsx`
- `frontend/src/pages/agency/ReportInvestigationPage.jsx`
- `frontend/src/pages/agency/UploadResolutionPage.jsx`
- `frontend/src/pages/agency/facilitiesData.js`
- `frontend/src/pages/auth/ForgotPasswordPage.jsx`
- `frontend/src/pages/auth/LoginPage.jsx`
- `frontend/src/pages/auth/RegisterPage.jsx`
- `frontend/src/pages/citizen/FacilityDetailsPage.jsx`
- `frontend/src/pages/citizen/MapViewPage.jsx`
- `frontend/src/pages/citizen/MyRecommendationsPage.jsx`
- `frontend/src/pages/citizen/MyReportsPage.jsx`
- `frontend/src/pages/citizen/RecommendationStatusPage.jsx`
- `frontend/src/pages/citizen/ReportIssuePage.jsx`
- `frontend/src/pages/citizen/ReportStatusPage.jsx`
- `frontend/src/pages/citizen/UserDashboardPage.jsx`
- `frontend/src/pages/citizen/UserRecommendationPage.jsx`
- `frontend/src/pages/citizen/recommendationsData.js`
- `frontend/src/pages/citizen/reportsData.js`
- `frontend/tests/integration.spec.js`
- `frontend/tests/setup.js`
- `frontend/tests/teardown.js`

The private backend/.env and repaired backend/venv are local/ignored environment
changes. Generated frontend/dist, screenshots/traces, caches, and uploaded test
files are not implementation source.
