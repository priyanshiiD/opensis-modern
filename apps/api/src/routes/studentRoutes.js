import { Router } from 'express';
import { listStudents } from '../controllers/studentController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();

router.get('/students', authMiddleware, requirePermissions('students:read'), listStudents);

export default router;
