import process from "node:process";
import { execFileSync } from "node:child_process";
import path from "node:path";
export default function setup() {
  if (process.env.RUN_LIVE_INTEGRATION !== "1") throw new Error("Set RUN_LIVE_INTEGRATION=1 to authorize temporary test records in the configured MySQL database.");
  const backend = path.resolve("../backend");
  execFileSync(path.join(backend, "venv/Scripts/python.exe"), ["-B", "scripts/integration_fixture.py", "prepare"], { cwd: backend, stdio: "inherit" });
}
