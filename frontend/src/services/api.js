const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token) {
  return apiRequest("/auth/me", { token });
}

export function getTestCases(token) {
  return apiRequest("/test-cases", { token });
}

export function getExecutions(token) {
  return apiRequest("/executions", { token });
}

export function generateTestCases(requirementData, token) {
  return apiRequest("/requirements/generate", {
    token,
    method: "POST",
    body: JSON.stringify(requirementData),
  });
}

export function updateTestCase(id, testCaseData, token) {
  return apiRequest(`/test-cases/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(testCaseData),
  });
}

export function recordTestExecution(id, executionData, token) {
  return apiRequest(`/test-cases/${id}/executions`, {
    token,
    method: "POST",
    body: JSON.stringify(executionData),
  });
}
