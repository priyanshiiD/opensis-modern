import Student from '../models/student.model.js';
import { sendError, sendSuccess } from '../utils/http.js';

const ALLOWED_CREATE_FIELDS = [
  'studentId',
  'firstName',
  'middleName',
  'lastName',
  'altId',
  'commonName',
  'email',
  'phone',
  'gender',
  'dob',
  'ethnicity',
  'language',
  'estimatedGradDate',
  'className',
  'status',
];

const ALLOWED_UPDATE_FIELDS = [
  'firstName',
  'middleName',
  'lastName',
  'altId',
  'commonName',
  'email',
  'phone',
  'gender',
  'dob',
  'ethnicity',
  'language',
  'estimatedGradDate',
  'className',
  'status',
];

function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

export const createStudent = async (req, res) => {
  try {
    const data = pick(req.body, ALLOWED_CREATE_FIELDS);

    // Validate required fields
    if (!data.studentId || !data.firstName || !data.lastName || !data.className) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'studentId, firstName, lastName, and className are required.'
      );
    }

    // Check if studentId already exists
    const existingByStudentId = await Student.findOne({ studentId: data.studentId });
    if (existingByStudentId) {
      return sendError(
        res,
        409,
        'DUPLICATE_STUDENT_ID',
        'A student with this studentId already exists.'
      );
    }

    // Check if email exists (if provided)
    if (data.email) {
      const existingByEmail = await Student.findOne({ email: data.email });
      if (existingByEmail) {
        return sendError(
          res,
          409,
          'DUPLICATE_EMAIL',
          'A student with this email already exists.'
        );
      }
    }

    // Check if altId exists (if provided)
    if (data.altId) {
      const existingByAltId = await Student.findOne({ altId: data.altId });
      if (existingByAltId) {
        return sendError(
          res,
          409,
          'DUPLICATE_ALT_ID',
          'A student with this altId already exists.'
        );
      }
    }

    const student = await Student.create(data);

    sendSuccess(res, { student }, 201);
  } catch (error) {
    sendError(
      res,
      500,
      'STUDENT_CREATE_FAILED',
      `Failed to create student: ${error.message}`
    );
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const skip = (page - 1) * limit;

    // Optional filters
    const filter = {};
    if (req.query.className) filter.className = req.query.className;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.gender) filter.gender = req.query.gender;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
    ]);

    sendSuccess(res, {
      students,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(
      res,
      500,
      'STUDENTS_FETCH_FAILED',
      `Failed to fetch students: ${error.message}`
    );
  }
};

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

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      return sendError(res, 404, 'NOT_FOUND', 'Student not found.');
    }
    sendSuccess(res, { student });
  } catch (error) {
    sendError(
      res,
      500,
      'STUDENT_FETCH_FAILED',
      `Failed to fetch student: ${error.message}`
    );
  }
};

export const updateStudent = async (req, res) => {
  try {
    const data = pick(req.body, ALLOWED_UPDATE_FIELDS);

    // Prevent studentId from being updated
    if (req.body.studentId) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'studentId cannot be updated.'
      );
    }

    // Check email uniqueness if being updated
    if (data.email) {
      const existingByEmail = await Student.findOne({
        email: data.email,
        _id: { $ne: req.params.id },
      });
      if (existingByEmail) {
        return sendError(
          res,
          409,
          'DUPLICATE_EMAIL',
          'A student with this email already exists.'
        );
      }
    }

    // Check altId uniqueness if being updated
    if (data.altId) {
      const existingByAltId = await Student.findOne({
        altId: data.altId,
        _id: { $ne: req.params.id },
      });
      if (existingByAltId) {
        return sendError(
          res,
          409,
          'DUPLICATE_ALT_ID',
          'A student with this altId already exists.'
        );
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!student) {
      return sendError(res, 404, 'NOT_FOUND', 'Student not found.');
    }

    sendSuccess(res, { student });
  } catch (error) {
    sendError(
      res,
      500,
      'STUDENT_UPDATE_FAILED',
      `Failed to update student: ${error.message}`
    );
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return sendError(res, 404, 'NOT_FOUND', 'Student not found.');
    }

    sendSuccess(res, { message: 'Student deleted successfully.' });
  } catch (error) {
    sendError(
      res,
      500,
      'STUDENT_DELETE_FAILED',
      `Failed to delete student: ${error.message}`
    );
  }
};
