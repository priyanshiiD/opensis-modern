import mongoose from 'mongoose';

export const TEACHER_STATUSES = ['Active', 'Inactive'];
export const TEACHER_GENDERS = ['male', 'female', 'other', 'unspecified'];

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 1,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    department: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
      default: '',
    },
    gender: {
      type: String,
      enum: TEACHER_GENDERS,
      default: 'unspecified',
    },
    status: {
      type: String,
      enum: TEACHER_STATUSES,
      default: 'Active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'teachers',
  }
);

teacherSchema.index({ lastName: 1, firstName: 1 });
teacherSchema.index({ status: 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
