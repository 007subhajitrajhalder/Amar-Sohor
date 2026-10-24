import { execFileSync } from "node:child_process";
import path from "node:path";
export default function teardown() {
  const backend = path.resolve("../backend");
  execFileSync(path.join(backend, "venv/Scripts/python.exe"), ["-B", "scripts/integration_fixture.py", "cleanup"], { cwd: backend, stdio: "inherit" });
}
