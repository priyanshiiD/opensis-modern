import { apiBaseUrl } from '../../../shared/config/env.js';

export async function loginRequest(username, password) {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Login failed.');
  }

  return data;
}

export async function logoutRequest(accessToken, refreshToken) {
  if (!accessToken) {
    return;
  }

  await fetch(`${apiBaseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ refreshToken })
  });
}
