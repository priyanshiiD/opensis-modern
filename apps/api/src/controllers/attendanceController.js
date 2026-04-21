
import AttendanceService from '../services/attendance.service.js';
import { sendSuccess, sendError } from '../utils/http.js';

class AttendanceController {
  
  static async markAttendance(req, res) {
    try {
      const { studentId, courseId, date, status, remarks, periodId } = req.body;

      const markedBy = req.user?._id || req.body.markedBy;
      const school = req.user?.school || req.body.school;

      if (!markedBy) {
        return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      }

      if (!school) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'School information not available');
      }

      const attendanceData = {
        studentId,
        courseId,
        date: new Date(date),
        status,
        remarks,
        markedBy,
        school,
        periodId,
        source: 'WEB',
        ipAddress: req.ip,
      };

      const attendance = await AttendanceService.markAttendance(attendanceData);

      return sendSuccess(res, { attendance }, 201);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

 
  static async markAttendanceBulk(req, res) {
    try {
      const { records } = req.body;

      if (!records || !Array.isArray(records) || records.length === 0) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'Attendance records must be a non-empty array');
      }

      const markedBy = req.user?._id || req.body.markedBy;
      const school = req.user?.school || req.body.school;

      if (!markedBy) {
        return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      }

      if (!school) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'School information not available');
      }

      const result = await AttendanceService.markAttendanceBulk(
        records,
        markedBy,
        school
      );

      const statusCode = result.errors && result.errors.length > 0 ? 207 : 201;
      return sendSuccess(res, result, statusCode);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  static async getAttendance(req, res) {
    try {
      const { studentId, courseId, status, startDate, endDate, page = 1, limit = 50 } = req.query;

      // Get user's school (from auth middleware)
      const userSchool = req.user?.school;

      const filters = {
        school: userSchool,
        ...(studentId && { studentId }),
        ...(courseId && { courseId }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      const attendance = await AttendanceService.getAttendance(filters);

      // Simple pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedAttendance = attendance.slice(skip, skip + parseInt(limit));

      return sendSuccess(
        res,
        {
          data: paginatedAttendance,
          pagination: {
            total: attendance.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(attendance.length / parseInt(limit)),
          },
        },
        200
      );
    } catch (error) {
      return sendError(res, 400, 'VALIDATION_ERROR', error.message);
    }
  }

 
  static async getStudentAttendanceSummary(req, res) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate, courseId } = req.query;

      if (!startDate || !endDate) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'startDate and endDate are required');
      }

      const summary = await AttendanceService.getStudentAttendanceSummary(
        studentId,
        startDate,
        endDate,
        courseId
      );

      return sendSuccess(res, summary, 200);
    } catch (error) {
      return sendError(res, 400, 'VALIDATION_ERROR', error.message);
    }
  }

  
  static async updateAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const { status, remarks } = req.body;

      const editedBy = req.user?._id;

      if (!editedBy) {
        return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const updateData = {
        ...(status && { status }),
        ...(remarks !== undefined && { remarks }),
      };

      const attendance = await AttendanceService.updateAttendance(
        attendanceId,
        updateData,
        editedBy
      );

      return sendSuccess(res, { attendance }, 200);
    } catch (error) {
      return sendError(res, 400, 'VALIDATION_ERROR', error.message);
    }
  }

  
  static async deleteAttendance(req, res) {
    try {
      const { attendanceId } = req.params;

      const attendance = await AttendanceService.deleteAttendance(attendanceId);

      return sendSuccess(res, { attendance }, 200);
    } catch (error) {
      return sendError(res, 400, 'VALIDATION_ERROR', error.message);
    }
  }

  
  static async getAttendanceCodes(req, res) {
    try {
      const codes = await AttendanceService.getAttendanceCodes();
      return sendSuccess(res, { codes }, 200);
    } catch (error) {
      return sendError(res, 400, 'VALIDATION_ERROR', error.message);
    }
  }
}

export default AttendanceController;
