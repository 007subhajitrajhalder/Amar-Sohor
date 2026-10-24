# Amar Sohor React frontend

This is the existing Vite/React application, connected to the existing FastAPI
backend. Routes, page structure, themes, and styling are retained.
See [the integration report](../INTEGRATION_REPORT.md) for the endpoint map and results.

## Run in a second VS Code PowerShell terminal

Start the configured database and backend first.

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\frontend'
npm ci
$env:VITE_API_BASE_URL = 'http://localhost:8000'
npm run dev -- --host 127.0.0.1 --port 5173
```

Open http://localhost:5173. Alternatively set VITE_API_BASE_URL in frontend/.env
using .env.example; restart Vite after changing configuration. Frontend variables
must never contain database credentials or the JWT signing secret.

## Integration

- src/api/client.js centralizes fetch, bearer authentication, multipart uploads,
  validation errors, API/view mapping, and mutation notifications.
- src/api/useApi.js loads real records, cancels obsolete requests, and refreshes
  on mutations, focus, visibility, cross-tab storage signals, and 30-second polling.
- AuthGate checks /users/me and the role before displaying protected pages.
- Agency dashboard, facility forms/management, and resolved complaints share
  backend ownership and resolution rules.
- Citizen map/reviews, submissions/tracking/profile, agency investigations,
  and admin allocation/approval/management use real API requests.
- Data fixtures and localStorage application-record fallbacks are removed.
  Browser storage retains authentication, themes, and invalidation timestamps.
- Empty results stay empty; failed requests show errors and retry controls.
  Unsupported activity/verification metadata is marked unavailable.

## Checks

```powershell
npm run lint
npm run build
npm audit
```

Build passes with an existing large-bundle warning; no chunk-warning limit was
raised to conceal it. Lint passes and npm audit reports zero vulnerabilities.

## Live browser integration tests

Requirements: installed Microsoft Edge, Node/npm, backend/venv, reachable configured
MySQL/MariaDB database, applied migration, and two existing categories assigned
to different agencies. The current local database satisfies these requirements.

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\frontend'
$env:RUN_LIVE_INTEGRATION = '1'
npm run test:e2e
Remove-Item Env:RUN_LIVE_INTEGRATION
```

Playwright starts Vite and FastAPI on ports 5173 and 8000 if needed. Five serial
tests use real network calls and the configured MariaDB, with direct SQLAlchemy
reads verifying facility persistence. One test deliberately delays/aborts a real
request to exercise loading and retry; it never supplies fabricated records.

Each run creates explicitly named temporary admin/agency/citizen accounts and
records. Teardown removes only that run's fixtures and attached uploads; original
data is preserved. The ignored .integration-state.json manifest contains ephemeral
credentials for cleanup. If interrupted, recover with:

```powershell
Set-Location 'D:\Minor Project\Amar-Sohor\backend'
.\venv\Scripts\python.exe -B scripts\integration_fixture.py cleanup
```

Do not delete the manifest before cleanup. Failure screenshots/traces are ignored
under frontend/test-results. These tests are intended for local development.
