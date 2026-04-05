import { Router } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  listStudents,
} from '../controllers/studentController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// Get all students (with pagination and filters)
router.get('/', requirePermissions('students:read'), getAllStudents);
router.get('/:id', requirePermissions('students:read'), getStudentById);
router.post('/', requirePermissions('admin:manage'), createStudent);
router.put('/:id', requirePermissions('admin:manage'), updateStudent);
router.delete('/:id', requirePermissions('admin:manage'), deleteStudent);

// Legacy endpoint for list (supports existing code)
router.get('/list', requirePermissions('students:read'), listStudents);

export default router;
