import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", workers: 1, fullyParallel: false, timeout: 60000,
  globalSetup: "./tests/setup.js", globalTeardown: "./tests/teardown.js",
  use: { baseURL: "http://127.0.0.1:5173", channel: "msedge", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: [
    { command: "..\\backend\\venv\\Scripts\\python.exe -B -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8000",
      url: "http://127.0.0.1:8000/health", reuseExistingServer: true, timeout: 20000 },
    { command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort", url: "http://127.0.0.1:5173", reuseExistingServer: true }
  ]
});
