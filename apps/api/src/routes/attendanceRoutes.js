import express from "express"
import {
  getAttendance,
  saveAttendance,
  getAttendanceSummary
} from "../controllers/attendanceController.js"

import { authMiddleware, requirePermissions } from "../middleware/auth.js"

const router = express.Router()

router.get(
  "/",
  authMiddleware,
  requirePermissions("attendance:read"),
  getAttendance
)

router.post(
  "/",
  authMiddleware,
  requirePermissions("attendance:write"),
  saveAttendance
)

router.get(
  "/summary",
  authMiddleware,
  requirePermissions("attendance:read"),
  getAttendanceSummary
)

export default router