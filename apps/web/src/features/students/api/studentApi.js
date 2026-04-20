import { apiBaseUrl } from "../../../shared/config/env";

/**
 * Centralized API service for Student-related operations
 * Handles all HTTP requests for student CRUD operations
 */

/**
 * Fetch all students
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Object>} Response with students array
 * @throws {Error} If request fails
 */
export async function fetchStudents(token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to fetch students"
      );
    }

    return json.data.students;
  } catch (error) {
    throw new Error(
      error.message || "Network error while fetching students"
    );
  }
}

/**
 * Create a new student
 * @param {Object} studentData - Student data object
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Object>} Created student object
 * @throws {Error} If request fails
 */
export async function createStudent(studentData, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const body = {
    studentId: Number(studentData.studentId),
    firstName: studentData.firstName,
    middleName: studentData.middleName,
    lastName: studentData.lastName,
    commonName: studentData.commonName,
    email: studentData.email || undefined,
    phone: studentData.phone || undefined,
    gender: studentData.gender || undefined,
    className: studentData.className,
    status: studentData.status,
    dob: studentData.dob || undefined,
    estimatedGradDate: studentData.estimatedGradDate || undefined,
  };

  // Remove undefined fields
  Object.keys(body).forEach(
    (key) => body[key] === undefined && delete body[key]
  );

  try {
    const res = await fetch(`${apiBaseUrl}/api/students`, {
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
        json.error?.message || "Failed to create student"
      );
    }

    return json.data.student;
  } catch (error) {
    throw new Error(
      error.message || "Network error while creating student"
    );
  }
}

/**
 * Update an existing student
 * @param {string} studentId - MongoDB ObjectId of the student
 * @param {Object} studentData - Updated student data
 * @param {string} token - Authorization bearer token
 * @returns {Promise<Object>} Updated student object
 * @throws {Error} If request fails
 */
export async function updateStudent(studentId, studentData, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const body = {
    firstName: studentData.firstName,
    middleName: studentData.middleName,
    lastName: studentData.lastName,
    commonName: studentData.commonName,
    email: studentData.email || undefined,
    phone: studentData.phone || undefined,
    gender: studentData.gender || undefined,
    className: studentData.className,
    status: studentData.status,
    dob: studentData.dob || undefined,
    estimatedGradDate: studentData.estimatedGradDate || undefined,
  };

  // Remove undefined fields
  Object.keys(body).forEach(
    (key) => body[key] === undefined && delete body[key]
  );

  try {
    const res = await fetch(`${apiBaseUrl}/api/students/${studentId}`, {
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
        json.error?.message || "Failed to update student"
      );
    }

    return json.data.student;
  } catch (error) {
    throw new Error(
      error.message || "Network error while updating student"
    );
  }
}

/**
 * Delete a student
 * @param {string} studentId - MongoDB ObjectId of the student
 * @param {string} token - Authorization bearer token
 * @returns {Promise<void>}
 * @throws {Error} If request fails
 */
export async function deleteStudent(studentId, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.error?.message || "Failed to delete student"
      );
    }
  } catch (error) {
    throw new Error(
      error.message || "Network error while deleting student"
    );
  }
}
