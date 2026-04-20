import { apiBaseUrl } from '../../../shared/config/env';

/**
 * Fetch all classes with optional filters
 */
export async function fetchClasses(token, { page = 1, limit = 25, status, gradeLevel, teacherId, academicYear } = {}) {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);
  if (gradeLevel) params.append('gradeLevel', gradeLevel);
  if (teacherId) params.append('teacherId', teacherId);
  if (academicYear) params.append('academicYear', academicYear);

  const res = await fetch(`${apiBaseUrl}/api/classes?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to fetch classes.');
  }

  return json.data;
}

/**
 * Fetch a single class by classId
 */
export async function fetchClassById(token, classId) {
  const res = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to fetch class.');
  }

  return json.data.class;
}

/**
 * Create a new class
 */
export async function createClass(token, classData) {
  const res = await fetch(`${apiBaseUrl}/api/classes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(classData),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to create class.');
  }

  return json.data.class;
}

/**
 * Update an existing class
 */
export async function updateClass(token, classId, classData) {
  const res = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(classData),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to update class.');
  }

  return json.data.class;
}

/**
 * Delete/deactivate a class
 */
export async function deleteClass(token, classId) {
  const res = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to delete class.');
  }

  return json.data.class;
}
