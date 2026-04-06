import mongoose from 'mongoose';

export const STUDENT_STATUSES = ['Active', 'Inactive'];
export const STUDENT_GENDERS = ['male', 'female', 'other', 'unspecified'];

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 1
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    middleName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ''
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    altId: {
      type: String,
      trim: true,
      maxlength: 30,
      unique: true,
      sparse: true
    },
    commonName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
      default: ''
    },
    gender: {
      type: String,
      enum: STUDENT_GENDERS,
      default: 'unspecified'
    },
    dob: {
      type: Date,
      default: null
    },
    ethnicity: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ''
    },
    language: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ''
    },
    estimatedGradDate: {
      type: Date,
      default: null
    },
    className: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 20
    },
    status: {
      type: String,
      enum: STUDENT_STATUSES,
      default: 'Active'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'students'
  }
);

studentSchema.pre('save', function normalizeStudentFields() {
  if (typeof this.firstName === 'string') {
    this.firstName = this.firstName.trim();
  }

  if (typeof this.middleName === 'string') {
    this.middleName = this.middleName.trim();
  }

  if (typeof this.lastName === 'string') {
    this.lastName = this.lastName.trim();
  }

  if (typeof this.altId === 'string') {
    this.altId = this.altId.trim();
  }

  if (typeof this.commonName === 'string') {
    this.commonName = this.commonName.trim();
  }

  if (typeof this.email === 'string') {
    this.email = this.email.trim().toLowerCase();
  }

  if (typeof this.phone === 'string') {
    this.phone = this.phone.trim();
  }

  if (typeof this.ethnicity === 'string') {
    this.ethnicity = this.ethnicity.trim();
  }

  if (typeof this.language === 'string') {
    this.language = this.language.trim();
  }

  if (typeof this.className === 'string') {
    this.className = this.className.trim();
  }

  
});

studentSchema.index({ className: 1, status: 1 });
studentSchema.index({ lastName: 1, firstName: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;