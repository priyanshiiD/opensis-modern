import { collections } from '../config/constants.js';
import { getDatabase } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/http.js';

export async function listStudents(_req, res) {
  try {
    const database = await getDatabase();
    const rows = await database
      .collection(collections.students)
      .find({}, { projection: { _id: 0, studentId: 1, firstName: 1, lastName: 1 } })
      .sort({ studentId: -1 })
      .limit(100)
      .toArray();

    sendSuccess(res, { students: rows });
  } catch (error) {
    sendError(res, 500, 'STUDENTS_FETCH_FAILED', `Failed to fetch students: ${error.message}`);
  }
}
