# Amar Sohor FastAPI backend

The existing MySQL/MariaDB database is the source of truth. React is now connected
to authentication, agency facilities/dashboard, complaints/resolutions,
recommendations, profiles, ratings, and admin management.
See [the integration report](../INTEGRATION_REPORT.md) for verification and file inventory.

## Run in PowerShell

Keep the existing `backend/.env`. It contains database settings and the private
JWT signing key; never copy these values into frontend configuration.
The verified local instance is the XAMPP MariaDB server at localhost:3306,
database `amar_sohor`. The example port is only a template; use your existing port.

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\backend'
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -B scripts\migrate_agency_facilities.py
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The current database migration is already applied. If preview lists pending
statements on another checkout, apply them with
`.\venv\Scripts\python.exe scripts\migrate_agency_facilities.py --apply`.
Startup does not alter the schema or seed application records.

API docs: http://localhost:8000/docs. Database health: http://localhost:8000/health.
CORS permits localhost/127.0.0.1:5173 and the configured `FRONTEND_URL`.

## Authentication and access

POST JSON email/password to `/auth/login`; send `Authorization: Bearer <access_token>`.
Public registration creates citizens. Protected routes load the current user from
the database. An agency user requires role AGENT and an agency_members record.
An administrator can create that linked account at `POST /admin/agency-members`
or the React Add Agency Member page.

The original local administrator has a malformed stored password hash.
To repair that account without exposing a password in command arguments:

```powershell
.\venv\Scripts\python.exe scripts\reset_password.py --admin
```

The prompt hides the new password and requires confirmation. Use `--email` instead
if multiple administrators exist. This command has not changed the original
administrator's password during integration. Email-based password recovery is
not configured; the React recovery page states this explicitly.

## Primary endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /agencies/dashboard | Current agency counts and report distribution |
| GET | /agencies/facilities/categories | Permitted facility categories |
| GET, POST | /agencies/facilities | Agency list/create |
| GET, PUT, DELETE | /agencies/facilities/{id} | Read/edit/delete owned facilities |
| POST | /agencies/facilities/photos | Upload facility photo |
| GET | /agencies/reports/resolved | Resolved complaints, search and pagination |
| GET | /agencies/reports/resolved/{id} | Details and approved resolution evidence |
| GET | /facilities, /facilities/{id} | Public map and facility details |
| GET, POST | /facilities/{id}/ratings | Genuine reviews; citizen-only writes |
| GET, POST | /reports | Scoped list and citizen submission |
| GET, PATCH | /reports/{id} | Scoped details and authorized workflow updates |
| POST | /reports/{id}/resolutions | Agency resolution evidence for admin approval |
| GET, POST | /recommendations | Scoped list and citizen proposal |
| GET, PATCH | /recommendations/{id} | Scoped details and workflow updates |
| POST | /recommendations/{id}/allocate | Admin assignment to an eligible member |
| GET, PUT | /users/me | Current identity/profile |
| GET | /admin/users, /admin/agencies, /admin/agency-members | Admin lists |
| POST | /admin/agency-members | Atomic AGENT user and membership creation |
| DELETE | /admin/agency-members/{id}, /users/{id} | Authorized deletion with history protection |

Existing /users CRUD also requires admin access. Swagger's existing OAuth2
password-form declaration does not match the JSON login endpoint; obtain a token
using the JSON login API when testing with an HTTP client.

## Shared rules and response shapes

Facilities belong to the category's `handling_agency`. All statuses count toward
the agency dashboard total. The authenticated member supplies `added_by`;
clients cannot supply an ownership override. Agency detail/update/delete requests
for foreign facilities return 404.

Facility JSON fields: `facility_name`, `category_id`, `address`, `latitude`,
`longitude`, `status`, optional `photo_url` and `additional_notes`. Coordinates accept
zero, valid geographical ranges, and up to seven decimal places. Status is OPEN,
UNDER_REPAIR, or SUSPENDED. POST may include `source_recommendation_id`; only an
approved, same-agency/category recommendation can be installed, once, atomically
with facility creation. PUT cannot replace the source recommendation or creator.

Agency facility and resolved lists return `items, total, limit, offset`; facility
lists also return unfiltered agency `statistics`. Both accept search, limit 1-100
(default 50), and offset. Facilities also accept category_id and status.
The dashboard's facility total equals the unfiltered list statistics total,
including records beyond the current page.

Reports belong to `assigned_agency`. Both dashboard resolved count and resolved
list use exactly status RESOLVED. Agency evidence submission remains pending;
an administrator approves actual same-agency evidence before setting RESOLVED
and recording resolved_at. Missing legacy dates remain null. Resolved detail
exposes only approved evidence. Citizens only see their own protected records.

Recommendation transitions: PENDING -> ALLOCATED -> UNDER_INVESTIGATION ->
APPROVED -> INSTALLED; rejection is supported during allocation/investigation.
Installation is recorded through facility creation. The UI maps actual status
to its progress display; there is no separate fictional civil-works state.

Deleting facilities with complaints, ratings, or a source recommendation returns
409 to preserve history. Anonymous access returns 401, wrong roles 403,
invalid input 422, conflicts 409, and oversized photos 413.
Upload PNG/JPEG/WEBP files up to 10 MB. Files live in backend/uploads and are
served at /uploads. Photo upload and form save are separate requests; abandoned
uploads and replaced/deleted photo references can leave unused files.

## Additive schema migration

The idempotent migration preserves rows and matches existing signed/unsigned
foreign-key types. It adds only missing fields/constraints:

- facilities.additional_notes (nullable TEXT)
- facilities.source_recommendation_id (nullable ID, unique, recommendation FK)
- reports.resolved_at (nullable DATETIME)
- reports.investigation_notes (nullable TEXT)
- report_resolution_submissions.description (nullable TEXT)
- report_resolution_submissions.completion_date (nullable DATE)
- reports.assigned_agent and recommendations.assigned_agent (nullable IDs,
  agency_members foreign keys with ON DELETE SET NULL)

The last two fields already existed in the ORM but were absent from the database.
MySQL/MariaDB DDL commits each statement; preview before applying and retain your
normal backup. The migration can resume after a partial application.

## Tests

```powershell
.\venv\Scripts\python.exe -B -m unittest discover -s tests -v
.\venv\Scripts\python.exe -m pip check
```

49 backend tests pass against isolated SQLite with foreign keys. They cover role
and agency isolation, CRUD, validation, filters/pagination, uploads, history
protection, actual approval criteria, and atomic recommendation installation.
For real Edge -> HTTP -> MariaDB tests, use the frontend instructions.
