import Attendance from "../models/attendance.model.js"
import { sendSuccess, sendError } from "../utils/http.js"

/** Normalize any date-string to midnight UTC so comparisons are consistent. */
const normalizeDate = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  d.setUTCHours(0, 0, 0, 0)
  return d
}

// ─── GET /api/attendance?date=...&className=... ──────────────────────
export const getAttendance = async (req, res) => {
  try {
    const { date, className } = req.query
    if (!date) {
      return sendError(res, 400, "VALIDATION_ERROR", "date query param is required")
    }

    const normalizedDate = normalizeDate(date)
    if (!normalizedDate) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid date format")
    }

    const query = { date: normalizedDate }
    if (className) query.className = className

    const data = await Attendance.find(query)
      .sort({ studentName: 1 })
      .lean()

    return sendSuccess(res, data)
  } catch (err) {
    return sendError(res, 500, "ATTENDANCE_FETCH_FAILED", err.message)
  }
}

// ─── POST /api/attendance  { date, records } ─────────────────────────
export const saveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body

    if (!date || !Array.isArray(records) || records.length === 0) {
      return sendError(res, 400, "VALIDATION_ERROR", "date and a non-empty records[] are required")
    }

    const normalizedDate = normalizeDate(date)
    if (!normalizedDate) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid date format")
    }

    const validStatuses = new Set(["Present", "Absent"])

    const ops = records.map((r, i) => {
      if (!r.studentId || !r.status) {
        throw new Error(`Record #${i}: studentId and status are required`)
      }
      if (!validStatuses.has(r.status)) {
        throw new Error(`Record #${i}: status must be "Present" or "Absent"`)
      }

      return {
        updateOne: {
          filter: {
            studentId: r.studentId,
            date: normalizedDate,
          },
          update: {
            $set: {
              status: r.status,
              className: r.className || "",
              studentName: r.studentName || "",
              markedBy: req.user?.id || "system",
            },
          },
          upsert: true,
        },
      }
    })

    const result = await Attendance.bulkWrite(ops, { ordered: false })

    return sendSuccess(res, {
      matched: result.matchedCount,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
    }, 201)
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 400, "DUPLICATE_ENTRY", "Duplicate attendance detected")
    }
    return sendError(res, err.message?.startsWith("Record #") ? 400 : 500,
      "ATTENDANCE_SAVE_FAILED", err.message)
  }
}

// ─── GET /api/attendance/summary?date=...&className=... ──────────────
export const getAttendanceSummary = async (req, res) => {
  try {
    const { date, className } = req.query
    if (!date || !className) {
      return sendError(res, 400, "VALIDATION_ERROR", "date and className are required")
    }

    const normalizedDate = normalizeDate(date)
    if (!normalizedDate) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid date format")
    }

    const result = await Attendance.aggregate([
      { $match: { date: normalizedDate, className } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])

    let present = 0
    let absent = 0

    for (const r of result) {
      if (r._id === "Present") present = r.count
      if (r._id === "Absent") absent = r.count
    }

    return sendSuccess(res, { total: present + absent, present, absent })
  } catch (err) {
    return sendError(res, 500, "SUMMARY_FETCH_FAILED", err.message)
  }
}