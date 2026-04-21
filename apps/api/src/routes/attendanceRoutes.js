import { Router } from 'express';
import AttendanceController from '../controllers/attendanceController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);


router.get('/codes', AttendanceController.getAttendanceCodes);
router.post(
  '/mark',
  requirePermissions('attendance:write'),
  AttendanceController.markAttendance
);

router.post(
  '/mark-bulk',
  requirePermissions('attendance:write'),
  AttendanceController.markAttendanceBulk
);

router.get(
  '/',
  requirePermissions('attendance:read'),
  AttendanceController.getAttendance
);


router.get(
  '/student/:studentId/summary',
  requirePermissions('attendance:read'),
  AttendanceController.getStudentAttendanceSummary
);


router.put(
  '/:attendanceId',
  requirePermissions('attendance:write'),
  AttendanceController.updateAttendance
);


router.delete(
  '/:attendanceId',
  requirePermissions('attendance:write'),
  AttendanceController.deleteAttendance
);

export default router;
