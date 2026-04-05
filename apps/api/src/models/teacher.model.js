import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],

    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],

    role: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);


teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


teacherSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  if (update.$set && update.$set.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 10);
  }
});


teacherSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Teacher", teacherSchema);