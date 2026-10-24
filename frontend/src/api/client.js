export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
export const DATA_CHANGED = "apiDataChanged";
export function getAuthHeaders() {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  return token ? { Authorization: "Bearer " + token } : {};
}
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChanged"));
}
export function mediaUrl(url) {
  return url?.startsWith("/") ? API_BASE_URL + url : url || "";
}
export async function apiRequest(path, { body, auth = true, ...options } = {}) {
  const headers = { ...(auth ? getAuthHeaders() : {}), ...options.headers };
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  let response;
  try {
    response = await fetch(API_BASE_URL + path, { ...options, headers, body });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Unable to reach the server. Check your connection and try again.", { cause: error });
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && auth) logout();
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map(item => (item.loc?.slice(1).join(".") || "Input") + ": " + item.msg).join("; ")
      : typeof detail === "string" ? detail : "Request failed (" + response.status + ").";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (options.method && options.method !== "GET") {
    window.dispatchEvent(new Event(DATA_CHANGED));
    localStorage.setItem("apiDataChangedAt", String(Date.now()));
  }
  return data;
}
export async function loginApi(email, password) {
  const result = await apiRequest("/auth/login", { method: "POST", body: { email, password }, auth: false });
  localStorage.removeItem("token");
  localStorage.setItem("access_token", result.access_token);
  window.dispatchEvent(new Event("authChanged"));
  return result.user;
}
export const roleHome = role => role === "ADMIN" ? "/admin/dashboard"
  : ["AGENT", "AGENCY"].includes(role) ? "/agency/dashboard" : "/citizen/dashboard";
export async function submitReportApi({ facilityId, title, description, photoFile, photoUrl }) {
  const body = new FormData();
  body.append("facility_id", facilityId);
  body.append("title", title);
  body.append("description", description);
  if (photoFile instanceof File) body.append("photo", photoFile);
  else if (photoUrl) body.append("photo_url", photoUrl);
  return apiRequest("/reports", { method: "POST", body });
}
export async function submitRecommendationApi(values) {
  const body = new FormData();
  const names = { facilityType: "facility_type", categoryId: "category_id" };
  for (const key of ["title", "description", "address", "facilityType", "categoryId", "latitude", "longitude", "landmark"]) {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") body.append(names[key] || key, values[key]);
  }
  if (values.photoFile instanceof File) body.append("photo", values.photoFile);
  else if (values.photoUrl) body.append("photo_url", values.photoUrl);
  return apiRequest("/recommendations", { method: "POST", body });
}
export const fetchFacilitiesApi = categoryId => apiRequest("/facilities" + (categoryId ? "?category_id=" + encodeURIComponent(categoryId) : ""), { auth: false });
export const fetchReportsApi = () => apiRequest("/reports");
export const fetchRecommendationsApi = () => apiRequest("/recommendations");
export const allocateRecommendationApi = (id, { agentId, agentEmail, notes }) =>
  apiRequest("/recommendations/" + id + "/allocate", { method: "POST", body: { agent_id: agentId, agent_email: agentEmail, notes } });
export async function uploadFacilityPhoto(file) {
  const body = new FormData();
  body.append("photo", file);
  return (await apiRequest("/agencies/facilities/photos", { method: "POST", body })).photo_url;
}
export function categoryKey(name = "") {
  const value = name.toLowerCase();
  if (value.includes("water")) return "water";
  if (value.includes("toilet")) return "toilet";
  if (value.includes("dustbin") || value.includes("waste")) return "dustbin";
  if (value.includes("parking")) return "parking";
  return value;
}
export const statusLabel = value => ({ OPEN: "Open", UNDER_REPAIR: "Under Repair", SUSPENDED: "Suspended",
  PENDING: "Pending", UNDER_INVESTIGATION: "Under Investigation", RESOLVED: "Resolved" }[value] || value);
export const displayDate = value => value ? new Date(value).toLocaleDateString("en-GB") : "Not recorded";
export const facilityView = f => ({ ...f, id: f.facility_id, name: f.facility_name,
  category: categoryKey(f.category_name), categoryLabel: f.category_name, agency: f.agency_name,
  status: statusLabel(f.status), imageUrl: mediaUrl(f.photo_url), sourceRecommendationId: f.source_recommendation_id });
export const reportView = r => ({ ...r, id: r.report_id, facility: r.facility_name,
  facilityAddress: r.facility_address, facilityCategory: categoryKey(r.facility_category),
  status: statusLabel(r.status), date: displayDate(r.created_at), resolvedDate: displayDate(r.resolved_at),
  photoUrl: mediaUrl(r.photo_url), assignedAgency: r.agency_name, assignedOfficer: r.assigned_officer,
  assignedMember: r.assigned_member, agencyNotes: r.agency_notes });
export function facilityPayload({ name, category, address, latitude, longitude, status, photo, notes }) {
  if (!name.trim() || !address.trim() || !category) throw new Error("Name, address and category are required.");
  for (const [label, value, bound] of [["Latitude", latitude, 90], ["Longitude", longitude, 180]]) {
    if (String(value).trim() === "" || !Number.isFinite(Number(value)) || Math.abs(Number(value)) > bound)
      throw new Error(label + " must be between -" + bound + " and " + bound + ".");
    if (Math.abs(Number(value) - Number(Number(value).toFixed(7))) > 1e-10)
      throw new Error(label + " accepts at most seven decimal places.");
  }
  const normalizedStatus = status.toUpperCase().replaceAll(" ", "_");
  if (!["OPEN", "UNDER_REPAIR", "SUSPENDED"].includes(normalizedStatus)) throw new Error("Choose a supported status.");
  return { facility_name: name.trim(), category_id: Number(category), address: address.trim(),
    latitude: Number(latitude), longitude: Number(longitude), status: normalizedStatus,
    photo_url: photo || null, ...(notes !== undefined ? { additional_notes: notes.trim() || null } : {}) };
}

export function recommendationView(r, citizen = false) {
  const status = { PENDING: "Pending Review", ALLOCATED: "Allotted", UNDER_INVESTIGATION: "Under Investigation",
    APPROVED: "Approved", REJECTED: "Rejected", INSTALLED: "Installed" }[r.status];
  const member = r.assigned_member;
  return { ...r, id: String(r.recommendation_id), facilityType: categoryKey(r.category_name), facilityLabel: r.category_name,
    location: r.address, coordinates: r.latitude === null ? null : { lat: r.latitude, lng: r.longitude },
    photoUrl: mediaUrl(r.photo_url), date: r.created_at, status: citizen ? status : r.status === "ALLOCATED" ? "ALLOTTED" : r.status,
    stage: (citizen
      ? { PENDING: 1, ALLOCATED: 1, UNDER_INVESTIGATION: 2, APPROVED: 3, INSTALLED: 4, REJECTED: 2 }
      : { PENDING: 1, ALLOCATED: 2, UNDER_INVESTIGATION: 3, APPROVED: 4, INSTALLED: 5, REJECTED: 3 })[r.status],
    statusLabel: status, citizen: { name: r.citizen_name || "Not recorded" },
    assignedAgency: r.agency_name ? { id: r.assigned_agency, name: r.agency_name } : null,
    assignedMember: member ? { ...member, id: member.agent_id, fullName: member.full_name, agencyId: member.agency_id } : null,
    reviewDepartment: r.review_department, reviewNotes: r.review_notes, inspectionNotes: r.review_notes || "",
    rejectionReason: r.status === "REJECTED" ? r.review_notes : "", history: r.history || [] };
}
