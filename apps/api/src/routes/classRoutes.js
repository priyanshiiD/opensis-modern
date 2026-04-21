import { Router } from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  enrollStudents,
  getEnrolledStudents,
} from '../controllers/classController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', requirePermissions('teachers:read'), getAllClasses);
router.post('/', requirePermissions('admin:manage'), createClass);
router.post('/:classId/enroll', requirePermissions('admin:manage'), enrollStudents);
router.get('/:classId/students', requirePermissions('teachers:read'), getEnrolledStudents);
router.get('/:classId', requirePermissions('teachers:read'), getClassById);
router.put('/:classId', requirePermissions('admin:manage'), updateClass);
router.delete('/:classId', requirePermissions('admin:manage'), deleteClass);

export default router;
