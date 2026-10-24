/**
 * API Client for Amar Sohor Frontend to connect with FastAPI backend.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Helper to get authorization headers if token is present
 */
export function getAuthHeaders() {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Submit a grievance report to the FastAPI backend.
 * Routes directly to the agency member who registered/added the facility.
 */
export async function submitReportApi({
  facilityId,
  title,
  description,
  photoFile,
  photoUrl,
  userId,
}) {
  const formData = new FormData();
  formData.append("facility_id", facilityId);
  formData.append("title", title);
  formData.append("description", description);

  if (photoFile instanceof File) {
    formData.append("photo", photoFile);
  } else if (photoUrl) {
    formData.append("photo_url", photoUrl);
  }

  if (userId) {
    formData.append("user_id", userId);
  }

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit grievance report.");
  }

  return response.json();
}

/**
 * Submit a citizen facility recommendation to the FastAPI backend.
 * Allotted to the Municipal Admin for review and subsequent agency member allocation.
 */

export async function submitRecommendationApi({
  title,
  description,
  address,
  facilityType,
  categoryId,
  latitude,
  longitude,
  landmark,
  photoFile,
  photoUrl,
  userId,
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("address", address);

  if (facilityType) {
    formData.append("facility_type", facilityType);
  }
  if (categoryId) {
    formData.append("category_id", categoryId);
  }
  if (latitude !== undefined && latitude !== null) {
    formData.append("latitude", latitude);
  }
  if (longitude !== undefined && longitude !== null) {
    formData.append("longitude", longitude);
  }
  if (landmark) {
    formData.append("landmark", landmark);
  }

  if (photoFile instanceof File) {
    formData.append("photo", photoFile);
  } else if (photoUrl) {
    formData.append("photo_url", photoUrl);
  }

  if (userId) {
    formData.append("user_id", userId);
  }

  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit facility recommendation.");
  }

  return response.json();
}

/**
 * Fetch all registered facilities from backend
 */
export async function fetchFacilitiesApi(categoryId = null) {
  const url = categoryId
    ? `${API_BASE_URL}/facilities?category_id=${categoryId}`
    : `${API_BASE_URL}/facilities`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load facilities");
  }
  return response.json();
}

/**
 * Fetch citizen reports
 */
export async function fetchReportsApi(userId = null) {
  const url = userId
    ? `${API_BASE_URL}/reports?user_id=${userId}`
    : `${API_BASE_URL}/reports`;

  const response = await fetch(url, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to load reports");
  }
  return response.json();
}

/**
 * Fetch citizen recommendations
 */
export async function fetchRecommendationsApi(userId = null) {
  const url = userId
    ? `${API_BASE_URL}/recommendations?user_id=${userId}`
    : `${API_BASE_URL}/recommendations`;

  const response = await fetch(url, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to load recommendations");
  }
  return response.json();
}

/**
 * Allocate a recommendation to an agency member (Admin action)
 */
export async function allocateRecommendationApi(recommendationId, { agentId, agentEmail, notes }) {
  const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}/allocate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      agent_id: agentId,
      agent_email: agentEmail,
      notes: notes,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to allocate recommendation.");
  }

  return response.json();
}


