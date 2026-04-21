import Class from '../models/class.model.js';
import Student from '../models/student.model.js';
import { sendError, sendSuccess } from '../utils/http.js';

const ALLOWED_CREATE_FIELDS = [
  'classId',
  'name',
  'gradeLevel',
  'section',
  'teacherId',
  'academicYear',
  'capacity',
  'status',
];

const ALLOWED_UPDATE_FIELDS = [
  'name',
  'gradeLevel',
  'section',
  'teacherId',
  'academicYear',
  'capacity',
  'status',
];

function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

export const createClass = async (req, res) => {
  try {
    const data = pick(req.body, ALLOWED_CREATE_FIELDS);

    if (!data.classId || !data.name || !data.gradeLevel || !data.section || !data.teacherId || !data.academicYear) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'classId, name, gradeLevel, section, teacherId, and academicYear are required.'
      );
    }

    const existingById = await Class.findOne({ classId: data.classId });
    if (existingById) {
      return sendError(res, 409, 'DUPLICATE_CLASS_ID', 'A class with this classId already exists.');
    }

    const cls = await Class.create(data);

    sendSuccess(res, { class: cls }, 201);
  } catch (error) {
    sendError(res, 500, 'CLASS_CREATE_FAILED', `Failed to create class: ${error.message}`);
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.gradeLevel) filter.gradeLevel = parseInt(req.query.gradeLevel);
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    if (req.query.teacherId) filter.teacherId = parseInt(req.query.teacherId);

    const [classes, total] = await Promise.all([
      Class.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Class.countDocuments(filter),
    ]);

    sendSuccess(res, {
      classes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, 500, 'CLASSES_FETCH_FAILED', `Failed to fetch classes: ${error.message}`);
  }
};

export const getClassById = async (req, res) => {
  try {
    const cls = await Class.findOne({ classId: parseInt(req.params.classId) }).lean();
    if (!cls) {
      return sendError(res, 404, 'NOT_FOUND', 'Class not found.');
    }
    sendSuccess(res, { class: cls });
  } catch (error) {
    sendError(res, 500, 'CLASS_FETCH_FAILED', `Failed to fetch class: ${error.message}`);
  }
};

export const updateClass = async (req, res) => {
  try {
    if (req.body.classId !== undefined) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'classId cannot be updated.');
    }

    const data = pick(req.body, ALLOWED_UPDATE_FIELDS);

    const cls = await Class.findOneAndUpdate(
      { classId: parseInt(req.params.classId) },
      data,
      { new: true, runValidators: true }
    ).lean();

    if (!cls) {
      return sendError(res, 404, 'NOT_FOUND', 'Class not found.');
    }

    sendSuccess(res, { class: cls });
  } catch (error) {
    sendError(res, 500, 'CLASS_UPDATE_FAILED', `Failed to update class: ${error.message}`);
  }
};

export const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findOneAndUpdate(
      { classId: parseInt(req.params.classId) },
      { status: 'Inactive' },
      { new: true, runValidators: true }
    ).lean();

    if (!cls) {
      return sendError(res, 404, 'NOT_FOUND', 'Class not found.');
    }

    sendSuccess(res, { message: 'Class deactivated successfully.', class: cls });
  } catch (error) {
    sendError(res, 500, 'CLASS_DELETE_FAILED', `Failed to deactivate class: ${error.message}`);
  }
};

export const enrollStudents = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'studentIds must be a non-empty array.');
    }

    const cls = await Class.findOne({ classId });
    if (!cls) {
      return sendError(res, 404, 'NOT_FOUND', 'Class not found.');
    }

    const activeStudents = await Student.find({
      studentId: { $in: studentIds },
      status: 'Active',
    }).lean();

    const foundIds = activeStudents.map((s) => s.studentId);
    const invalidIds = studentIds.filter((id) => !foundIds.includes(id));
    if (invalidIds.length > 0) {
      return sendError(
        res,
        400,
        'INVALID_STUDENT_IDS',
        `The following studentIds do not exist or are not Active: ${invalidIds.join(', ')}`
      );
    }

    const newIds = studentIds.filter((id) => !cls.students.includes(id));
    if (newIds.length > 0) {
      cls.students.push(...newIds);
      await cls.save();
    }

    sendSuccess(res, {
      enrolled: newIds.length,
      skipped: studentIds.length - newIds.length,
      classId,
    });
  } catch (error) {
    sendError(res, 500, 'ENROLL_FAILED', `Failed to enroll students: ${error.message}`);
  }
};

export const getEnrolledStudents = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);

    const cls = await Class.findOne({ classId }).lean();
    if (!cls) {
      return sendError(res, 404, 'NOT_FOUND', 'Class not found.');
    }

    const students = await Student.find({ studentId: { $in: cls.students } })
      .sort({ lastName: 1, firstName: 1 })
      .lean();

    sendSuccess(res, { students, total: students.length });
  } catch (error) {
    sendError(res, 500, 'ENROLLED_FETCH_FAILED', `Failed to fetch enrolled students: ${error.message}`);
  }
};

