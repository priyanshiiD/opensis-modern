import Student from '../models/student.model.js';
import { sendError, sendSuccess } from '../utils/http.js';

export async function listStudents(_req, res) {
  try {
    const rows = await Student.find({})
      .select({ _id: 0, studentId: 1, firstName: 1, lastName: 1 })
      .sort({ studentId: -1 })
      .limit(100)
      .lean();

    sendSuccess(res, { students: rows });
  } catch (error) {
    sendError(res, 500, 'STUDENTS_FETCH_FAILED', `Failed to fetch students: ${error.message}`);
  }
}
