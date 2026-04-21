import { apiBaseUrl } from "../../../shared/config/env";
import { getAccessToken } from "../../auth/storage/tokenStorage";

/**
 * Central axios-free attendance API layer.
 * Uses fetch + auto-injects the JWT token from storage,
 * so callers never need to pass a token manually.
 */

const BASE = `${apiBaseUrl}/api/attendance`;

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const msg = json?.error?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json.data;
}

/**
 * GET /api/attendance?date=...&className=...
 */
export async function fetchAttendance(date, className) {
  const params = new URLSearchParams({ date });
  if (className) params.append("className", className);

  return request(`${BASE}?${params}`);
}

/**
 * POST /api/attendance  { date, records }
 */
export async function saveAttendance(date, records) {
  return request(BASE, {
    method: "POST",
    body: JSON.stringify({ date, records }),
  });
}

/**
 * GET /api/attendance/summary?date=...&className=...
 */
export async function fetchAttendanceSummary(date, className) {
  const params = new URLSearchParams({ date, className });
  return request(`${BASE}/summary?${params}`);
}