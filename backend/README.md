# Amar Sohor backend

The agency dashboard is implemented at `GET /agencies/dashboard`. It requires a
bearer token for an existing `AGENT` user with an `agency_members` record. The
dashboard always uses that membership's agency; it accepts no agency selector.

## Dashboard implementation

| Layer | File | Responsibility |
| --- | --- | --- |
| Router | [app/routers/agencies.py](app/routers/agencies.py) | HTTP endpoint, response schema, documented errors |
| Dependency | [app/dependencies/agency.py](app/dependencies/agency.py) | Resolve the signed-in member's agency; return 404 if it is missing |
| Authentication | [app/dependencies/auth.py](app/dependencies/auth.py) | Verify JWT, load the user, enforce agency role and membership |
| Schemas | [app/schemas/agency.py](app/schemas/agency.py) | Validate the dashboard identity, counts, and percentages |
| Service | [app/services/agency_service.py](app/services/agency_service.py) | Aggregate report and facility counts and build the response |
| Models | [app/models/agency.py](app/models/agency.py), [agency_member.py](app/models/agency_member.py), [report.py](app/models/report.py), [facility.py](app/models/facility.py), [facility_category.py](app/models/facility_category.py) | Existing database tables and relationships |
| Application | [app/main.py](app/main.py) | Register the router, CORS, and static uploads |

Dashboard statistics are calculated from source records on each request. The facility
and resolved-report workflows extend the existing models; apply the additive schema
migration described below before running this version against an existing database.

Reports are counted using `Report.assigned_agency`. Facilities are counted through
`FacilityCategory.handling_agency`, including all facility statuses and all members'
facilities. The member who originally added a facility does not determine its
managing agency.

## API contract

After `POST /auth/login` with a JSON email/password body, send the returned
`access_token` in this header:

```http
GET /agencies/dashboard
Authorization: Bearer <access_token>
```

Example response:

```json
{
  "agency_id": 1,
  "agency_name": "Example Agency",
  "department_type": "Solid Waste Management",
  "statistics": {
    "pending": 2,
    "under_investigation": 1,
    "resolved": 1,
    "facilities": 3
  },
  "total_reports": 4,
  "status_distribution": [
    {"status": "PENDING", "title": "Pending", "count": 2, "percentage": 50.0},
    {"status": "UNDER_INVESTIGATION", "title": "Under Investigation", "count": 1, "percentage": 25.0},
    {"status": "RESOLVED", "title": "Resolved", "count": 1, "percentage": 25.0}
  ]
}
```

The four overview cards use `statistics`. The report analysis cards, bar widths,
and legend use `status_distribution`; the total uses `total_reports`.
All three report statuses are always present, including zero-count statuses.
Empty agencies receive zero counts and percentages. Percentages are independently
rounded to two decimal places, so a nonempty distribution may total 99.99 or
100.01 after rounding.

| Status | Meaning |
| --- | --- |
| 200 | Dashboard returned |
| 401 | Missing, invalid, or expired token, or a token for a deleted user |
| 403 | The account does not have an agency role |
| 404 | The agency membership or agency record is missing |

The React page remains unchanged for this backend-only task.

## Run and validate

Configure `backend/.env` using `.env.example`, including the correct database
port and a private `JWT_SECRET_KEY`. The example uses port 3307; the connection
module defaults to 3306 when the variable is absent. An existing database can be
bootstrapped from the repository's `amar_sohor.sql` on a fresh development instance.
The supplied dump has no agency-member accounts. A real agency account needs an
`AGENT` user, a bcrypt password hash, and a matching agency-membership record.

From the backend directory in PowerShell:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

API documentation is available at `http://localhost:8000/docs`.

```powershell
.\venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

The tests use an isolated in-memory SQLite database and test signing keys.
They exercise authorization, isolation between agencies, all statuses, empty
results, live count changes, login-to-dashboard access, and bcrypt compatibility.
They do not connect to or modify the configured MySQL database.

## Facility and previously resolved report APIs

These routes use the same JWT, agency membership, category ownership, and database
as the dashboard. Changes are visible in the next dashboard request. They implement
the backend for AddFacilityPage, EditFacilityPage, FacilityManagementPage, and
PreviouslyResolvedPage. The JSX pages remain unchanged and still need API integration.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/agencies/facilities/categories` | Categories belonging to the current agency |
| GET | `/agencies/facilities` | Facility list, filters, pagination, and agency statistics |
| POST | `/agencies/facilities` | Create a facility; optionally install an approved recommendation |
| GET | `/agencies/facilities/{facility_id}` | Load the edit form |
| PUT | `/agencies/facilities/{facility_id}` | Save the edit form |
| POST | `/agencies/facilities/photos` | Upload a facility photo |
| GET | `/agencies/reports/resolved` | Previously resolved reports assigned to the agency |
| GET | `/agencies/reports/resolved/{report_id}` | Resolved report and latest approved resolution evidence |

Implementation is split into `dependencies/facility.py`, `dependencies/report.py`,
the existing facility/report models, `schemas/facility.py`, `schemas/report.py`,
`services/facility_service.py`, `services/report_service.py`,
`services/file_service.py`, and the corresponding routers. `main.py` registers
the routes. No separate database, agency selector, or duplicated agency model is used.

### Apply the schema migration

The existing SQL dump lacks `facilities.additional_notes`,
`facilities.source_recommendation_id`, and `reports.resolved_at`. The migration
adds nullable columns, a unique source-recommendation constraint, and a foreign key.
It preserves existing rows and matches the actual recommendation ID type, including
unsigned IDs in the supplied dump.

From `backend/`, preview pending statements first:

```powershell
.\venv\Scripts\python.exe scripts/migrate_agency_facilities.py
.\venv\Scripts\python.exe scripts/migrate_agency_facilities.py --apply
```

The first command only inspects the schema. The second applies the changes.
The script supports MySQL/MariaDB and checks for existing columns and constraints,
so it can be rerun after a partial application. MySQL DDL commits each statement;
the migration is not a single rollbackable transaction. Application startup never
alters the database automatically. This migration has not been run against the
configured database during implementation.

### Facility forms

Create requests use JSON:

```json
{
  "facility_name": "Gariahat Community Dustbin",
  "category_id": 1,
  "address": "Gariahat Road, Kolkata",
  "latitude": 22.5197,
  "longitude": 88.3655,
  "status": "OPEN",
  "photo_url": "https://example.com/facility.jpg",
  "additional_notes": "Near the market entrance",
  "source_recommendation_id": null
}
```

Use the current agency's category IDs returned by the categories endpoint.
For example, the existing UI's `water` option corresponds to the database's
`WATER_POINT` category; the API uses its ID rather than assuming fixed IDs.

| JSX field | API field |
| --- | --- |
| `name` / `facilityName` | `facility_name` |
| `category` | `category_id` selected from the category endpoint |
| `address`, `latitude`, `longitude` | Same names |
| `status` | `OPEN`, `UNDER_REPAIR`, or `SUSPENDED` |
| `imageUrl` / `image` | `photo_url` |
| `additionalNotes` | `additional_notes` |
| `sourceRecommendationId` | `source_recommendation_id` on creation only |
| Response `facility_id` | UI `id` |

Form status labels such as `Open` and `Under Repair` are also accepted and
normalized. Coordinates are required, accept zero, have a maximum of seven
decimal places, and must fall in the latitude/longitude ranges.
The server sets `added_by` from the authenticated agency member; client-supplied
ownership fields are rejected.

PUT accepts the same required facility fields, excluding
`source_recommendation_id`. Omitted photo and notes fields retain their values;
send null (or an empty photo URL) to clear them. A linked recommendation and the
facility's original creator cannot be reassigned through the edit endpoint.
Facilities linked to recommendations cannot change category.

When `source_recommendation_id` is supplied, the recommendation must belong to the
current agency, be `APPROVED`, and have the selected category. The new facility
must be `OPEN`. Creation and the transition to `INSTALLED` commit together.
A row lock and unique constraint prevent two facilities from consuming the same
recommendation. Failed writes roll back both changes.

For uploads, send multipart form data with the file field named `photo` to the
photo endpoint, then put the returned `photo_url` in the create/update JSON.
It accepts PNG, JPEG, and WEBP signatures matching the declared content type,
up to 10 MB. Names are generated by the server and stored under
`/uploads/facilities/{agency_id}/`. Data-URL previews, SVG, and arbitrary local
paths are not accepted as photo URLs. HTTP(S) image URLs are stored without fetching
them. Local uploaded photos must exist and belong to the current agency.
Uploads and form saves are separate requests; abandoning a form can leave an
unused photo, and removing/replacing a reference does not delete the stored file.

### Lists and management cards

Both list endpoints accept `search`, `limit` (1-100, default 50), and `offset`
(nonnegative, default 0). Facilities additionally accept `category_id` and
`status` (the uppercase enum). Searches match names/titles, addresses, and IDs
and treat wildcard characters literally.

Lists return `items`, `total` (matching filters), `limit`, and `offset`.
The facility list also returns unfiltered agency `statistics` containing
`total`, `open`, `under_repair`, `suspended`, and `needs_attention`.
The management page's repair/suspended card uses `needs_attention`.
The dashboard's facility count matches `statistics.total`, even when the list
has a category filter or only one page is requested.

### Previously resolved reports

A report is included only when its status is `RESOLVED` and its
`assigned_agency` matches the current agency. Facility category ownership does
not replace report assignment for historical reports.

Map `report_id` to the table's report number, `facility_name` to Facility,
`resolved_at` to Completion Date, and `status` to the status label.
Timestamps use ISO 8601. `resolved_at` is null when no actual completion timestamp
has been recorded; display an unknown date for those records. The resolution
approval workflow must set this field when it marks a report resolved. This task
does not implement that approval workflow or invent dates for legacy rows.

The detail response includes only the latest `APPROVED` evidence submitted by
a member of the report's agency. Its `resolution_submitted_at` field is separate
from the actual completion date. Pending and rejected submissions are excluded.

All operations require agency access. Missing and other-agency resources return
404, invalid fields return 422, installation conflicts return 409, and oversized
photos return 413.

## Backend review

Reviewed the application modules in `core`, `database`, `dependencies`,
`models`, `routers`, `schemas`, and `services`, plus tests, application setup,
requirements, sample configuration, and the SQL schema. Installed virtual-environment
packages and generated caches are not application source. Private environment values
were not included in the review output.

Resolved during this task:

- Moved dashboard queries out of the router into the agency service and extracted
  agency resolution into its own dependency while retaining the API response shape.
- Replaced the failing Passlib/bcrypt combination with the already-installed bcrypt
  library. A short-password hash attempt previously raised `ValueError` with the
  pinned versions. Existing bcrypt hashes remain supported; malformed stored hashes
  and overlong login passwords now fail authentication without a server error.
- Added the missing `User` model import in `routers/users.py`. Its annotations
  previously raised `NameError` when resolved, and would prevent import on Python
  versions that eagerly evaluate annotations.

Remaining findings outside the dashboard implementation:

| Priority | Location | Finding and follow-up |
| --- | --- | --- |
| High | [routers/users.py](app/routers/users.py) | List, read, create, update, and delete user endpoints have no authorization dependencies. Anonymous clients can read user contact data or change/delete accounts. Add admin and owner checks appropriate to each operation. |
| Medium | [routers/auth.py](app/routers/auth.py), [dependencies/auth.py](app/dependencies/auth.py) | The OAuth2 security declaration points to a JSON-only login endpoint. Swagger's OAuth2 password form sends form data and cannot complete that login flow. Align the security scheme and login input, or use a token obtained from the JSON endpoint in an HTTP client. |
| Medium | [services/user_service.py](app/services/user_service.py), [services/auth_service.py](app/services/auth_service.py) | User create/update commits do not translate unique email/phone violations into API errors; registration prechecks also race with concurrent requests. Add transaction rollback and 409 responses for database uniqueness conflicts. |
| Medium | [database/connection.py](app/database/connection.py) | The database URL interpolates credentials directly. Reserved characters in credentials can change URL parsing. Build it with SQLAlchemy `URL.create`. |
| Incomplete | Report lifecycle, recommendation, and analytics modules | Facility create/edit/list/photos and resolved-report reads are implemented. Report investigation/approval, broader recommendation workflows, and analytics remain incomplete. |
| Incomplete | [routers/auth.py](app/routers/auth.py), [models/agency_member.py](app/models/agency_member.py) | Public registration creates only citizen accounts, and there is no admin agency-member provisioning API. Add an authorized provisioning workflow for agency accounts. |

All model relationships configure successfully. The three new columns require the
migration above for existing databases. Validation covers SQLite with foreign keys,
application imports, and OpenAPI; a live MySQL integration check has not been performed.
