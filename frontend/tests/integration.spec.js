import { Buffer } from "node:buffer";
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const api = "http://127.0.0.1:8000";
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j/pkAAAAASUVORK5CYII=", "base64");
let state, admin, agent, other, citizen, agentId, reportFacility, reportId;
const headers = token => ({ Authorization: "Bearer " + token });
const photo = { name: "evidence.png", mimeType: "image/png", buffer: png };
async function login(page, role) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(state.emails[role]);
  await page.getByLabel("Password", { exact: true }).fill(state.password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(role === "admin" ? "/admin/dashboard" : role === "citizen" ? "/citizen/dashboard" : "/agency/dashboard"));
}
async function token(request, role) {
  const response = await request.post(api + "/auth/login", { data: { email: state.emails[role], password: state.password } });
  expect(response.status(), await response.text()).toBe(200);
  return (await response.json()).access_token;
}
function persisted(id) {
  const backend = path.resolve("../backend");
  return JSON.parse(execFileSync(path.join(backend, "venv/Scripts/python.exe"), ["-B", "scripts/integration_fixture.py", "facility", String(id)], { cwd: backend, encoding: "utf8" }));
}
const payload = name => ({ facility_name: name, category_id: state.categories[0].id, address: "Integration test address", latitude: 0, longitude: 0, status: "OPEN" });
test.describe.configure({ mode: "serial" });
test.beforeAll(async ({ request }) => {
  state = JSON.parse(fs.readFileSync(".integration-state.json", "utf8"));
  admin = await token(request, "admin");
  for (const [role, index] of [["agent", 0], ["other", 1]]) {
    const response = await request.post(api + "/admin/agency-members", { headers: headers(admin), data: {
      full_name: "Integration " + role, email: state.emails[role], phone: state.phone + (index + 1),
      password: state.password, agency_id: state.categories[index].agency
    } });
    expect(response.status(), await response.text()).toBe(201);
  }
  agent = await token(request, "agent"); other = await token(request, "other");
  const members = await (await request.get(api + "/admin/agency-members", { headers: headers(admin) })).json();
  agentId = members.find(m => m.email === state.emails.agent).agent_id;
});
test("agency CRUD: browser forms, real MySQL persistence, views, counts, deletion and isolation", async ({ page, request }) => {
  await login(page, "agent");
  const baseline = await (await request.get(api + "/agencies/dashboard", { headers: headers(agent) })).json();
  await expect(page.getByText(String(baseline.total_reports) + " total reports", { exact: true })).toBeVisible();
  const name = "Integration facility " + state.run;
  await page.goto("/agency/facilities");
  await page.getByRole("link", { name: "Add Facility", exact: true }).click();
  await page.getByLabel("Facility Name").fill(name);
  await page.getByLabel("Facility Category").selectOption(String(state.categories[0].id));
  await page.getByLabel("Physical Address").fill("Integration address");
  await page.getByLabel("Latitude", { exact: true }).fill("0");
  await page.getByLabel("Longitude", { exact: true }).fill("0");
  const createdPromise = page.waitForResponse(r => r.url().endsWith("/agencies/facilities") && r.request().method() === "POST");
  await page.getByRole("button", { name: "Add Facility", exact: true }).click();
  const createdResponse = await createdPromise;
  expect(createdResponse.status()).toBe(201);
  const created = await createdResponse.json();
  await expect(page).toHaveURL(/\/agency\/facilities$/);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  expect(persisted(created.facility_id)).toMatchObject({ name, latitude: 0, status: "OPEN" });
  await page.reload();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  const article = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
  await article.getByTitle("View Facility").click();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await page.goto("/agency/facilities/" + created.facility_id + "/edit");
  await expect(page.getByLabel("Facility Name")).toHaveValue(name);
  await page.getByLabel("Facility Name").fill(name + " edited");
  await page.getByLabel("Operational Status").selectOption("UNDER_REPAIR");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page).toHaveURL(/\/agency\/facilities$/);
  await expect(page.getByRole("heading", { name: name + " edited", exact: true })).toBeVisible();
  expect(persisted(created.facility_id)).toMatchObject({ name: name + " edited", status: "UNDER_REPAIR" });
  for (const method of ["get", "put", "delete"]) {
    const response = await request[method](api + "/agencies/facilities/" + created.facility_id,
      { headers: headers(other), ...(method === "put" ? { data: payload("unauthorized") } : {}) });
    expect(response.status()).toBe(404);
  }
  const dashboard = await (await request.get(api + "/agencies/dashboard", { headers: headers(agent) })).json();
  expect(dashboard.statistics.facilities).toBe(baseline.statistics.facilities + 1);
  const listing = await (await request.get(api + "/agencies/facilities", { headers: headers(agent) })).json();
  expect(listing.statistics.total).toBe(dashboard.statistics.facilities);
  await page.getByPlaceholder("Search facility name or location...").fill("No matching facility " + state.run);
  await expect(page.getByRole("heading", { name: "No Facilities Found" })).toBeVisible();
  await page.getByPlaceholder("Search facility name or location...").fill(name);
  await expect(page.getByRole("heading", { name: name + " edited", exact: true })).toBeVisible();
  await page.getByRole("button", { name: state.categories[0].name, exact: true }).click();
  await expect(page.getByRole("heading", { name: name + " edited", exact: true })).toBeVisible();
  page.once("dialog", d => d.dismiss());
  await page.getByRole("button", { name: "Delete " + name + " edited", exact: true }).click();
  expect(persisted(created.facility_id)).not.toBeNull();
  page.once("dialog", d => d.accept());
  await page.getByRole("button", { name: "Delete " + name + " edited", exact: true }).click();
  await expect(page.getByRole("heading", { name: name + " edited", exact: true })).toHaveCount(0);
  expect(persisted(created.facility_id)).toBeNull();
  await page.reload();
  await expect(page.getByRole("heading", { name: name + " edited", exact: true })).toHaveCount(0);
  const after = await (await request.get(api + "/agencies/dashboard", { headers: headers(agent) })).json();
  expect(after.statistics.facilities).toBe(baseline.statistics.facilities);
  await page.goto("/agency/resolved");
  await expect(page.getByText("No resolved complaints found.")).toBeVisible();
});
test("citizen registration and report submission through agency investigation and admin resolution", async ({ page, request }) => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Integration Citizen");
  await page.getByLabel("Email address").fill(state.emails.citizen);
  await page.getByLabel("Phone").fill(state.phone + "3");
  await page.getByLabel("Password", { exact: true }).fill(state.password);
  await page.getByLabel("Confirm password", { exact: true }).fill(state.password);
  await page.getByRole("button", { name: "Register", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page, "citizen");
  citizen = await token(request, "citizen");
  const created = await request.post(api + "/agencies/facilities", { headers: headers(agent), data: payload("Report fixture " + state.run) });
  expect(created.status()).toBe(201);
  reportFacility = (await created.json()).facility_id;
  await page.goto("/citizen/report-issue/" + reportFacility);
  await page.locator("input[type=text]").first().fill("Integration complaint " + state.run);
  await page.locator("textarea").first().fill("A real test submission; remove after verification.");
  await page.locator("input[type=file]").setInputFiles(photo);
  const submitted = page.waitForResponse(r => r.url().endsWith("/reports") && r.request().method() === "POST");
  await page.locator("button[type=submit]").click();
  const response = await submitted;
  expect(response.status(), await response.text()).toBe(201);
  reportId = (await response.json()).report_id;
  await expect(page.getByText("Report Submitted Successfully!")).toBeVisible();
  await page.goto("/citizen/my-reports");
  await expect(page.getByText("Integration complaint " + state.run).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Integration complaint " + state.run).first()).toBeVisible();
  expect((await request.get(api + "/reports/" + reportId, { headers: headers(other) })).status()).toBe(404);
  expect((await request.delete(api + "/agencies/facilities/" + reportFacility, { headers: headers(agent) })).status()).toBe(409);
  await login(page, "agent");
  await page.goto("/agency/reports/" + reportId + "/investigate");
  await page.getByRole("button", { name: "Start Investigation", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/agency/reports/${reportId}/resolution$`));
  await page.getByLabel("Resolution Description").fill("Completed test repair.");
  await page.locator("input[type=file]").setInputFiles(photo);
  await page.getByLabel("Completion Date").fill("2026-10-24");
  await page.getByRole("button", { name: "Submit Resolution for Approval" }).click();
  await expect(page).toHaveURL(/\/agency\/reports$/);
  const before = await (await request.get(api + "/agencies/reports/resolved", { headers: headers(agent) })).json();
  expect(before.items.some(r => r.report_id === reportId)).toBe(false);
  await login(page, "admin");
  await page.goto("/admin/complaints/" + reportId);
  await page.getByRole("button", { name: "Approve resolution", exact: true }).click();
  await page.getByRole("button", { name: /Confirm/ }).click();
  await expect.poll(async () => (await (await request.get(api + "/reports/" + reportId, { headers: headers(admin) })).json()).status).toBe("RESOLVED");
  await login(page, "agent");
  await page.goto("/agency/resolved");
  await page.getByRole("button", { name: "#" + reportId + ": Integration complaint " + state.run }).click();
  await expect(page.getByRole("heading", { name: "#" + reportId + ": Integration complaint " + state.run })).toBeVisible();
  await expect(page.getByAltText("Approved resolution evidence")).toBeVisible();
  const resolved = await (await request.get(api + "/agencies/reports/resolved", { headers: headers(agent) })).json();
  const stats = await (await request.get(api + "/agencies/dashboard", { headers: headers(agent) })).json();
  expect(resolved.total).toBe(stats.statistics.resolved);
  expect(resolved.items.find(r => r.report_id === reportId).resolved_at).toBeTruthy();
});
test("recommendation allocation, investigation, facility installation, profile and rating persistence", async ({ page, request }) => {
  const response = await request.post(api + "/recommendations", { headers: headers(citizen), multipart: {
    title: "Recommendation " + state.run, description: "Integration site inspection", address: "Integration proposal location",
    category_id: String(state.categories[0].id), latitude: "0", longitude: "0",
    photo: { name: "proposal.png", mimeType: "image/png", buffer: png }
  } });
  expect(response.status(), await response.text()).toBe(201);
  const rec = await response.json();
  expect(rec.latitude).toBe(0);
  expect((await request.post(api + "/recommendations/" + rec.recommendation_id + "/allocate",
    { headers: headers(citizen), data: { agent_id: agentId } })).status()).toBe(403);
  await login(page, "admin");
  await page.goto("/admin/recommendations/" + rec.recommendation_id + "/allocate");
  await page.getByText("Integration agent", { exact: true }).first().click();
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL(/\/progress$/);
  await expect(page.getByText("Current stage: Step 2 of 5 (Allocated)", { exact: true })).toBeVisible();
  await login(page, "agent");
  await page.goto("/agency/recommendations/" + rec.recommendation_id + "/investigate");
  await page.getByRole("button", { name: "Start Investigation Now" }).click();
  await page.getByLabel("Investigation notes").fill("Suitable site confirmed.");
  await page.getByRole("button", { name: /Approve.*Add Facility/ }).click();
  await expect(page).toHaveURL(/\/agency\/facilities\/add$/);
  await expect(page.getByLabel("Latitude", { exact: true })).toHaveValue("0");
  await page.locator("input[type=file]").setInputFiles(photo);
  await page.getByRole("button", { name: "Commission Facility & Install" }).click();
  await expect(page).toHaveURL(/\/agency\/facilities$/);
  await expect(page.getByRole("heading", { name: rec.title, exact: true })).toBeVisible();
  const saved = await (await request.get(api + "/recommendations/" + rec.recommendation_id, { headers: headers(citizen) })).json();
  expect(saved.status).toBe("INSTALLED");
  const second = await request.post(api + "/agencies/facilities", { headers: headers(agent),
    data: { ...payload("Duplicate installation"), source_recommendation_id: rec.recommendation_id } });
  expect(second.status()).toBe(409);
  await login(page, "admin");
  await page.goto("/admin/recommendations/" + rec.recommendation_id + "/progress");
  await expect(page.getByText("Current stage: Step 5 of 5 (Commissioned)", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Progress", exact: true })).toBeDisabled();
  await login(page, "citizen");
  await page.getByLabel("Full name", { exact: true }).fill("Integration Citizen Updated");
  await page.getByRole("button", { name: "Update Profile" }).click();
  await expect(page.getByText("Profile updated.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Integration Citizen Updated");
  await page.goto("/facilities/" + reportFacility);
  await page.locator("form button[type=button]").nth(3).click();
  await page.getByPlaceholder("Share your experience...").fill("Integration persisted review");
  await page.getByRole("button", { name: "Submit Review" }).click();
  await expect(page.getByText("Integration persisted review", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Integration persisted review", { exact: true })).toBeVisible();
  await page.goto("/citizen/recommendations/" + rec.recommendation_id);
  await expect(page.getByText("Installed & Active", { exact: true })).toBeVisible();
});
test("authorization, invalid input, logout and route smoke checks", async ({ page, request }) => {
  const invalid = await request.post(api + "/agencies/facilities", { headers: headers(agent),
    data: { ...payload("invalid"), latitude: 91, added_by: 999 } });
  expect(invalid.status()).toBe(422);
  expect((await request.get(api + "/agencies/dashboard")).status()).toBe(401);
  expect((await request.get(api + "/admin/users", { headers: headers(citizen) })).status()).toBe(403);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const [role, paths] of [
    ["admin", ["/admin/dashboard", "/admin/users", "/admin/agencies", "/admin/agency-members/add", "/admin/agencies/" + state.categories[0].agency + "/members", "/admin/recommendations", "/admin/complaints"]],
    ["agent", ["/agency/dashboard", "/agency/facilities", "/agency/reports", "/agency/recommendations", "/agency/resolved"]],
    ["citizen", ["/citizen/dashboard", "/map", "/citizen/my-reports", "/citizen/my-recommendations", "/citizen/recommendation", "/citizen/reports/" + reportId]]
  ]) {
    await login(page, role);
    for (const route of paths) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByText("Loading...", { exact: true })).toHaveCount(0);
      await expect(page.getByRole("alert")).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.goto("/agency/facilities");
  await expect(page).toHaveURL(/\/login$/);
});

test("loading, network errors and retry preserve genuine server data", async ({ page }) => {
  await login(page, "agent");
  const listUrl = url => url.pathname === "/agencies/facilities";
  await page.route(listUrl, async route => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue();
  });
  await page.goto("/agency/facilities");
  await expect(page.getByRole("heading", { name: "Facility Management", exact: true })).toBeVisible();
  await expect(page.getByText("Loading...", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Report fixture " + state.run, exact: true })).toBeVisible();
  await page.unroute(listUrl);
  await page.route(listUrl, route => route.abort("failed"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Unable to reach the server");
  await expect(page.locator("article")).toHaveCount(0);
  await expect(page.getByText("No Facilities Found", { exact: true })).toHaveCount(0);
  await page.unroute(listUrl);
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Report fixture " + state.run, exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
