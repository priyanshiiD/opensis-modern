import mongoose from 'mongoose';

export const CLASS_STATUSES = ['Active', 'Inactive'];

const classSchema = new mongoose.Schema(
  {
    classId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    gradeLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5,
    },
    teacherId: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-\d{2}$/, 'academicYear must be in YYYY-YY format (e.g. "2025-26")'],
    },
    capacity: {
      type: Number,
      min: 1,
    },
status: {
      type: String,
      enum: CLASS_STATUSES,
      default: 'Active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'classes',
  }
);

classSchema.index({ gradeLevel: 1, status: 1 });
classSchema.index({ academicYear: 1, status: 1 });
classSchema.index({ teacherId: 1 });

const Class = mongoose.model('Class', classSchema);

export default Class;
