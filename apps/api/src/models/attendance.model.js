/**
 * Attendance Model
 * Represents student attendance records
 * Based on openSIS-Classic: attendance_period and attendance_day tables
 */

import mongoose from 'mongoose';

/**
 * Attendance Code Schema - Defines available attendance status codes
 * Maps to openSIS-Classic: attendance_codes table
 */
const attendanceCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Attendance code is required'],
      enum: ['P', 'A', 'L', 'E', 'OSS'], // Present, Absent, Late, Excused, Out of School Suspension
      uppercase: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Attendance status title is required'],
      enum: ['Present', 'Absent', 'Late', 'Excused', 'Out of School Suspension'],
    },
    description: {
      type: String,
      default: '',
    },
    isExcused: {
      type: Boolean,
      default: false,
    },
    isPresent: {
      type: Boolean,
      default: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Attendance Schema - Stores individual attendance records
 * Maps to openSIS-Classic: attendance_period table
 */
const attendanceSchema = new mongoose.Schema(
  {
    // Student reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },

    // Course/Period reference
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Course/Class ID is required'],
      index: true,
    },

    // Period reference (if marking period-level attendance)
    periodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolPeriod',
      default: null,
    },

    // Attendance date
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },

    // Attendance status code
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused', 'Out of School Suspension'],
      required: [true, 'Attendance status is required'],
      default: 'Present',
    },

    // Status code (single letter: P, A, L, E, OSS)
    statusCode: {
      type: String,
      enum: ['P', 'A', 'L', 'E', 'OSS'],
      default: 'P',
    },

    // Optional remarks/notes for attendance (e.g., reason for absence)
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
      trim: true,
      default: '',
    },

    // Who marked this attendance (Teacher/Admin reference)
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by User ID is required'],
    },

    // School reference for multi-school support
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },

    // Academic year/term reference
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      default: null,
    },

    // Is this attendance marked/confirmed
    isMarked: {
      type: Boolean,
      default: true,
    },

    // Track if attendance was edited (for audit purposes)
    isEdited: {
      type: Boolean,
      default: false,
    },

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    // Additional metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      source: {
        type: String,
        enum: ['WEB', 'MOBILE', 'API', 'BULK_IMPORT'],
        default: 'WEB',
      },
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for optimized queries
 */
// Unique index to prevent duplicate attendance marking for same student, course, and date
attendanceSchema.index(
  { studentId: 1, courseId: 1, date: 1 },
  { unique: true, sparse: true, name: 'unique_attendance_per_course' }
);

// Index for finding attendance by student and date range
attendanceSchema.index({ studentId: 1, date: 1 });

// Index for finding attendance by course and date
attendanceSchema.index({ courseId: 1, date: 1 });

// Index for finding attendance by school and date
attendanceSchema.index({ school: 1, date: 1 });

// Index for finding marked attendance
attendanceSchema.index({ markedBy: 1, date: 1 });

/**
 * Virtual: attendance record identifier
 */
attendanceSchema.virtual('recordId').get(function () {
  return `${this.studentId}-${this.courseId}-${this.date}`;
});

/**
 * Pre-save middleware
 */
attendanceSchema.pre('save', function (next) {
  // Auto-set statusCode based on status if not explicitly set
  if (this.isModified('status')) {
    const statusCodeMap = {
      Present: 'P',
      Absent: 'A',
      Late: 'L',
      Excused: 'E',
      'Out of School Suspension': 'OSS',
    };
    this.statusCode = statusCodeMap[this.status] || 'P';
  }

  next();
});



// Mark attendance as edited
attendanceSchema.methods.markAsEdited = function (userId) {
  this.isEdited = true;
  this.editedBy = userId;
  this.editedAt = new Date();
  return this;
};

// Get attendance summary
attendanceSchema.methods.getSummary = function () {
  return {
    _id: this._id,
    studentId: this.studentId,
    courseId: this.courseId,
    date: this.date,
    status: this.status,
    markedBy: this.markedBy,
    remarks: this.remarks,
  };
};



// Check if attendance already exists for student, course, and date
attendanceSchema.statics.checkDuplicate = async function (studentId, courseId, date) {
  const existingAttendance = await this.findOne({
    studentId,
    courseId,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  return !!existingAttendance;
};

// Get student attendance summary for a date range
attendanceSchema.statics.getStudentAttendanceSummary = async function (
  studentId,
  startDate,
  endDate,
  courseId = null
) {
  const query = {
    studentId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (courseId) {
    query.courseId = courseId;
  }

  const records = await this.find(query).lean();

  return {
    total: records.length,
    present: records.filter((r) => r.status === 'Present').length,
    absent: records.filter((r) => r.status === 'Absent').length,
    late: records.filter((r) => r.status === 'Late').length,
    excused: records.filter((r) => r.status === 'Excused').length,
    records,
  };
};


attendanceSchema.statics.createBulk = async function (attendanceRecords) {
  try {
    const result = await this.insertMany(attendanceRecords, { ordered: false });
    return {
      success: result.length,
      records: result,
    };
  } catch (error) {
    // Handle duplicate key errors separately
    if (error.code === 11000) {
      const duplicates = error.writeErrors
        ? error.writeErrors.filter((e) => e.code === 11000).length
        : 0;
      const successful = error.insertedDocs ? error.insertedDocs.length : 0;

      return {
        success: successful,
        duplicates,
        records: error.insertedDocs || [],
        errors: error.writeErrors || [],
      };
    }
    throw error;
  }
};


const AttendanceCode = mongoose.model('AttendanceCode', attendanceCodeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

export { Attendance, AttendanceCode };
