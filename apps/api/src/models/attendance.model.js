import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
{
  studentId: { 
    type: Number, 
    required: true 
  },

  studentName: { 
    type: String, 
    required: true,
    trim: true 
  },

  className: { 
    type: String, 
    required: true 
  },

  date: { 
    type: Date, 
    required: true,
    default: () => {
      const d = new Date()
      d.setUTCHours(0, 0, 0, 0)   
      return d
    }
  },

  status: { 
    type: String, 
    enum: ['Present', 'Absent'], 
    required: true 
  },

  markedBy: { 
    type: String, 
    required: true 
  }

},
{ timestamps: true })

// Unique: one record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true })

// Speeds up the most common query: filter by class + date
attendanceSchema.index({ className: 1, date: 1 })

export default mongoose.model("Attendance", attendanceSchema)