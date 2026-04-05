import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    profileId: {
      type: Number,
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    usernameLower: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
      minlength: 8
    },    
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'login_authentication'
  }
);

userSchema.pre('validate', function setUsernameLower() {
  if (this.username) {
    this.usernameLower = this.username.trim().toLowerCase();
  }
  
});

const User = mongoose.model('User', userSchema);

export default User;