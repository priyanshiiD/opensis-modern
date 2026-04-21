/**
 * Attendance Service
 * Contains business logic for attendance operations
 */

import { Attendance, AttendanceCode } from '../models/attendance.model.js';
import Student from '../models/student.model.js';
import Class from '../models/class.model.js';
import { isValidObjectId } from 'mongoose';

class AttendanceService {
  /**
   * Mark attendance for a single student
   * @param {Object} attendanceData - Attendance data
   * @param {string} attendanceData.studentId - Student ID
   * @param {string} attendanceData.courseId - Course/Class ID
   * @param {Date} attendanceData.date - Attendance date
   * @param {string} attendanceData.status - Attendance status (Present, Absent, Late, etc.)
   * @param {string} attendanceData.markedBy - User ID who is marking attendance
   * @param {string} attendanceData.school - School ID
   * @param {string} [attendanceData.remarks] - Optional remarks
   * @param {string} [attendanceData.periodId] - Optional period ID
   * @returns {Promise<Object>} Created attendance record
   */
  static async markAttendance(attendanceData) {
   
    this.validateRequiredFields(attendanceData);
    this.validateObjectIds(attendanceData);

 
    if (
      ![
        'Present',
        'Absent',
        'Late',
        'Excused',
        'Out of School Suspension',
      ].includes(attendanceData.status)
    ) {
      throw new Error(
        'Invalid attendance status. Must be: Present, Absent, Late, Excused, or Out of School Suspension'
      );
    }

    const studentExists = await Student.findById(attendanceData.studentId);
    if (!studentExists) {
      throw new Error('Student not found');
    }

   
    const courseExists = await Class.findById(attendanceData.courseId);
    if (!courseExists) {
      throw new Error('Course/Class not found');
    }

    // Check for duplicate attendance (same student, course, and date)
    const normalizedDate = new Date(attendanceData.date);
    normalizedDate.setHours(0, 0, 0, 0);

    const duplicateAttendance = await Attendance.findOne({
      studentId: attendanceData.studentId,
      courseId: attendanceData.courseId,
      date: {
        $gte: normalizedDate,
        $lt: new Date(normalizedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (duplicateAttendance) {
      throw new Error(
        'Attendance already marked for this student on this date for this course'
      );
    }

    // Create attendance record
    const attendance = new Attendance({
      studentId: attendanceData.studentId,
      courseId: attendanceData.courseId,
      date: normalizedDate,
      status: attendanceData.status,
      remarks: attendanceData.remarks || '',
      markedBy: attendanceData.markedBy,
      school: attendanceData.school,
      periodId: attendanceData.periodId || null,
      metadata: {
        source: attendanceData.source || 'WEB',
        ipAddress: attendanceData.ipAddress || null,
      },
    });

    await attendance.save();
    return attendance.toObject();
  }

  /**
   * Mark attendance for multiple students (bulk operation)
   * @param {Array<Object>} attendanceRecords - Array of attendance records
   * @param {string} markedBy - User ID who is marking attendance
   * @param {string} school - School ID
   * @returns {Promise<Object>} Result with success count and error details
   */
  static async markAttendanceBulk(attendanceRecords, markedBy, school) {
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new Error('Attendance records must be a non-empty array');
    }

    if (!markedBy) {
      throw new Error('markedBy (User ID) is required for bulk marking');
    }

    if (!school) {
      throw new Error('school (School ID) is required for bulk marking');
    }

    // Prepare records with common fields
    const processedRecords = attendanceRecords.map((record) => ({
      ...record,
      markedBy,
      school,
      date: new Date(record.date),
    }));

    // Validate each record
    for (let i = 0; i < processedRecords.length; i++) {
      try {
        this.validateRequiredFields(processedRecords[i]);
        this.validateObjectIds(processedRecords[i]);

        // Validate status
        if (
          ![
            'Present',
            'Absent',
            'Late',
            'Excused',
            'Out of School Suspension',
          ].includes(processedRecords[i].status)
        ) {
          throw new Error(
            `Record ${i + 1}: Invalid attendance status. Must be: Present, Absent, Late, Excused, or Out of School Suspension`
          );
        }
      } catch (error) {
        throw new Error(`Record ${i + 1}: ${error.message}`);
      }
    }

    // Attempt bulk insert
    try {
      const result = await Attendance.insertMany(processedRecords, {
        ordered: false,
      });

      return {
        success: true,
        totalMarked: result.length,
        records: result.map((r) => r.toObject()),
        errors: [],
      };
    } catch (error) {
     
      if (error.code === 11000) {
        const successCount = error.insertedDocs ? error.insertedDocs.length : 0;
        const duplicateErrors = error.writeErrors
          ? error.writeErrors
              .filter((e) => e.code === 11000)
              .map((e) => ({
                index: e.index,
                message: 'Duplicate attendance record',
                recordData: processedRecords[e.index],
              }))
          : [];

        return {
          success: false,
          totalMarked: successCount,
          records: error.insertedDocs
            ? error.insertedDocs.map((r) => r.toObject())
            : [],
          errors: duplicateErrors,
          message: `${successCount} records marked, ${duplicateErrors.length} duplicates skipped`,
        };
      }

      throw error;
    }
  }

  /**
   * Get attendance records by filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Attendance records
   */
  static async getAttendance(filters) {
    const query = {};

    if (filters.studentId) query.studentId = filters.studentId;
    if (filters.courseId) query.courseId = filters.courseId;
    if (filters.school) query.school = filters.school;

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
    }

    if (filters.status) query.status = filters.status;

    const attendance = await Attendance.find(query)
      .populate('studentId', 'firstName lastName studentId')
      .populate('courseId', 'className courseCode')
      .populate('markedBy', 'firstName lastName email')
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return attendance;
  }

  /**
   * Get student attendance summary
   * @param {string} studentId - Student ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} [courseId] - Optional course ID to filter by
   * @returns {Promise<Object>} Attendance summary
   */
  static async getStudentAttendanceSummary(
    studentId,
    startDate,
    endDate,
    courseId = null
  ) {
 
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date cannot be greater than end date');
    }

    const query = {
      studentId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (courseId) {
      query.courseId = courseId;
    }

    const records = await Attendance.find(query).lean();

    const summary = {
      studentId,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      total: records.length,
      byStatus: {
        present: records.filter((r) => r.status === 'Present').length,
        absent: records.filter((r) => r.status === 'Absent').length,
        late: records.filter((r) => r.status === 'Late').length,
        excused: records.filter((r) => r.status === 'Excused').length,
        outOfSchoolSuspension: records.filter(
          (r) => r.status === 'Out of School Suspension'
        ).length,
      },
      attendancePercentage: records.length
        ? (
            (records.filter((r) => r.status === 'Present').length /
              records.length) *
            100
          ).toFixed(2)
        : 0,
      records,
    };

    return summary;
  }

  /**
   * Update attendance record
   * @param {string} attendanceId - Attendance record ID
   * @param {Object} updateData - Data to update
   * @param {string} editedBy - User ID who is editing
   * @returns {Promise<Object>} Updated attendance record
   */
  static async updateAttendance(attendanceId, updateData, editedBy) {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    // Validate status if being updated
    if (
      updateData.status &&
      ![
        'Present',
        'Absent',
        'Late',
        'Excused',
        'Out of School Suspension',
      ].includes(updateData.status)
    ) {
      throw new Error('Invalid attendance status');
    }

    // Update fields
    if (updateData.status) attendance.status = updateData.status;
    if (updateData.remarks !== undefined)
      attendance.remarks = updateData.remarks;

    // Mark as edited
    attendance.markAsEdited(editedBy);

    await attendance.save();
    return attendance.toObject();
  }

  /**
   * Delete attendance record
   * @param {string} attendanceId - Attendance record ID
   * @returns {Promise<Object>} Deleted attendance record
   */
  static async deleteAttendance(attendanceId) {
    const attendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return attendance.toObject();
  }

  /**
   * Get attendance codes
   * @returns {Promise<Array>} List of attendance codes
   */
  static async getAttendanceCodes() {
    const codes = [
      {
        code: 'P',
        title: 'Present',
        description: 'Student is present',
        isExcused: false,
        isPresent: true,
      },
      {
        code: 'A',
        title: 'Absent',
        description: 'Student is absent',
        isExcused: false,
        isPresent: false,
      },
      {
        code: 'L',
        title: 'Late',
        description: 'Student is late',
        isExcused: false,
        isPresent: true,
      },
      {
        code: 'E',
        title: 'Excused',
        description: 'Student absence is excused',
        isExcused: true,
        isPresent: false,
      },
      {
        code: 'OSS',
        title: 'Out of School Suspension',
        description: 'Student is on out of school suspension',
        isExcused: true,
        isPresent: false,
      },
    ];

    return codes;
  }

  /**
   * Private helper methods
   */

  /**
   * Validate required fields
   * @param {Object} data - Data to validate
   * @throws {Error} If required fields are missing
   */
  static validateRequiredFields(data) {
    const requiredFields = ['studentId', 'courseId', 'date', 'status', 'markedBy', 'school'];
    const missingFields = requiredFields.filter(
      (field) => !data[field]
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields: ${missingFields.join(', ')}`
      );
    }
  }

  /**
   * Validate ObjectIds
   * @param {Object} data - Data to validate
   * @throws {Error} If ObjectIds are invalid
   */
  static validateObjectIds(data) {
    const objectIdFields = ['studentId', 'courseId', 'markedBy', 'school', 'periodId'];

    for (const field of objectIdFields) {
      if (data[field] && !isValidObjectId(data[field])) {
        throw new Error(`Invalid ${field} format`);
      }
    }
  }
}

export default AttendanceService;
