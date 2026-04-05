import bcrypt from "bcryptjs";
import Teacher from "../models/teacher.model.js";
import { sendError, sendSuccess } from "../utils/http.js";

const ALLOWED_CREATE_FIELDS = [
  "fullName",
  "email",
  "password",
  "phone",
  "gender",
  "subjects",
  "classes",
  "profilePic",
];

const ALLOWED_UPDATE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "gender",
  "subjects",
  "classes",
  "profilePic",
  "isActive",
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

    if (!data.fullName || !data.email || !data.password) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "fullName, email, and password are required."
      );
    }

    if (data.password.length < 6) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Password must be at least 6 characters."
      );
    }

    const existing = await Teacher.findOne({ email: data.email });
    if (existing) {
      return sendError(
        res,
        409,
        "DUPLICATE_EMAIL",
        "A teacher with this email already exists."
      );
    }

    const teacher = await Teacher.create(data);

    const teacherObj = teacher.toObject();
    delete teacherObj.password;

    sendSuccess(res, { teacher: teacherObj }, 201);
  } catch (error) {
    sendError(
      res,
      500,
      "TEACHER_CREATE_FAILED",
      `Failed to create teacher: ${error.message}`
    );
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      Teacher.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Teacher.countDocuments(),
    ]);

    sendSuccess(res, {
      teachers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(
      res,
      500,
      "TEACHERS_FETCH_FAILED",
      `Failed to fetch teachers: ${error.message}`
    );
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password').lean();
    if (!teacher) {
      return sendError(res, 404, "NOT_FOUND", "Teacher not found.");
    }
    sendSuccess(res, { teacher });
  } catch (error) {
    sendError(
      res,
      500,
      "TEACHER_FETCH_FAILED",
      `Failed to fetch teacher: ${error.message}`
    );
  }
};


export const updateTeacher = async (req, res) => {
  try {
    const data = pick(req.body, ALLOWED_UPDATE_FIELDS);

    // If password update is needed, it should go through a separate endpoint
    if (req.body.password) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Password cannot be updated via this endpoint."
      );
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).select('-password').lean();

    if (!teacher) {
      return sendError(res, 404, "NOT_FOUND", "Teacher not found.");
    }

    sendSuccess(res, { teacher });
  } catch (error) {
    sendError(
      res,
      500,
      "TEACHER_UPDATE_FAILED",
      `Failed to update teacher: ${error.message}`
    );
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return sendError(res, 404, "NOT_FOUND", "Teacher not found.");
    }

    sendSuccess(res, { message: "Teacher deleted successfully." });
  } catch (error) {
    sendError(
      res,
      500,
      "TEACHER_DELETE_FAILED",
      `Failed to delete teacher: ${error.message}`
    );
  }
};