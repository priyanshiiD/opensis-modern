import { apiBaseUrl } from "../../../shared/config/env";

/**
 * Centralized API service for Teacher-related operations
 * Handles all HTTP requests for teacher CRUD operations
 */

/**
 * Fetch all teachers
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Array>} Array of teacher objects
 * @throws {Error} If request fails
 */
export async function fetchTeachers(token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/teachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to fetch teachers"
      );
    }

    return json.data.teachers;
  } catch (error) {
    throw new Error(
      error.message || "Network error while fetching teachers"
    );
  }
}

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher data object
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Object>} Created teacher object
 * @throws {Error} If request fails
 */
export async function createTeacher(teacherData, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const body = {
    teacherId: Number(teacherData.teacherId),
    firstName: teacherData.firstName,
    lastName: teacherData.lastName,
    department: teacherData.department,
    subject: teacherData.subject,
    phone: teacherData.phone,
    gender: teacherData.gender,
    status: teacherData.status,
  };

  try {
    const res = await fetch(`${apiBaseUrl}/api/teachers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to create teacher"
      );
    }

    return json.data.teacher;
  } catch (error) {
    throw new Error(
      error.message || "Network error while creating teacher"
    );
  }
}

/**
 * Update an existing teacher
 * @param {string} teacherId - Teacher ID (numeric)
 * @param {Object} teacherData - Updated teacher data
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Object>} Updated teacher object
 * @throws {Error} If request fails
 */
export async function updateTeacher(teacherId, teacherData, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const body = {
    firstName: teacherData.firstName,
    lastName: teacherData.lastName,
    department: teacherData.department,
    subject: teacherData.subject,
    phone: teacherData.phone,
    gender: teacherData.gender,
    status: teacherData.status,
  };

  try {
    const res = await fetch(`${apiBaseUrl}/api/teachers/${teacherId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to update teacher"
      );
    }

    return json.data.teacher;
  } catch (error) {
    throw new Error(
      error.message || "Network error while updating teacher"
    );
  }
}

/**
 * Delete a teacher
 * @param {string} teacherId - Teacher ID (numeric)
 * @param {string} token - Authorization bearer token
 * @returns {Promise<void>}
 * @throws {Error} If request fails
 */
export async function deleteTeacher(teacherId, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/teachers/${teacherId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to delete teacher"
      );
    }
  } catch (error) {
    throw new Error(
      error.message || "Network error while deleting teacher"
    );
  }
}
