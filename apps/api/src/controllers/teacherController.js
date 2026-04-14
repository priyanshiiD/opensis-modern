import Teacher from '../models/teacher.model.js';
import { sendError, sendSuccess } from '../utils/http.js';

const ALLOWED_CREATE_FIELDS = [
  'teacherId',
  'firstName',
  'lastName',
  'department',
  'subject',
  'phone',
  'gender',
  'status',
];

const ALLOWED_UPDATE_FIELDS = [
  'firstName',
  'lastName',
  'department',
  'subject',
  'phone',
  'gender',
  'status',
];

function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

export const createTeacher = async (req, res) => {
  try {
    const data = pick(req.body, ALLOWED_CREATE_FIELDS);

    if (!data.teacherId || !data.firstName || !data.lastName) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'teacherId, firstName, and lastName are required.'
      );
    }

    const existing = await Teacher.findOne({ teacherId: data.teacherId });
    if (existing) {
      return sendError(
        res,
        409,
        'DUPLICATE_TEACHER_ID',
        'A teacher with this teacherId already exists.'
      );
    }

    const teacher = await Teacher.create(data);

    sendSuccess(res, { teacher }, 201);
  } catch (error) {
    sendError(res, 500, 'TEACHER_CREATE_FAILED', `Failed to create teacher: ${error.message}`);
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;

    const [teachers, total] = await Promise.all([
      Teacher.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Teacher.countDocuments(filter),
    ]);

    sendSuccess(res, {
      teachers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, 500, 'TEACHERS_FETCH_FAILED', `Failed to fetch teachers: ${error.message}`);
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ teacherId: parseInt(req.params.teacherId) }).lean();
    if (!teacher) {
      return sendError(res, 404, 'NOT_FOUND', 'Teacher not found.');
    }
    sendSuccess(res, { teacher });
  } catch (error) {
    sendError(res, 500, 'TEACHER_FETCH_FAILED', `Failed to fetch teacher: ${error.message}`);
  }
};

export const updateTeacher = async (req, res) => {
  try {
    if (req.body.teacherId !== undefined) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'teacherId cannot be updated.');
    }

    const data = pick(req.body, ALLOWED_UPDATE_FIELDS);

    const teacher = await Teacher.findOneAndUpdate(
      { teacherId: parseInt(req.params.teacherId) },
      data,
      { new: true, runValidators: true }
    ).lean();

    if (!teacher) {
      return sendError(res, 404, 'NOT_FOUND', 'Teacher not found.');
    }

    sendSuccess(res, { teacher });
  } catch (error) {
    sendError(res, 500, 'TEACHER_UPDATE_FAILED', `Failed to update teacher: ${error.message}`);
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({ teacherId: parseInt(req.params.teacherId) });

    if (!teacher) {
      return sendError(res, 404, 'NOT_FOUND', 'Teacher not found.');
    }

    sendSuccess(res, { message: 'Teacher deleted successfully.' });
  } catch (error) {
    sendError(res, 500, 'TEACHER_DELETE_FAILED', `Failed to delete teacher: ${error.message}`);
  }
};
