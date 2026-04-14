import { Router } from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', requirePermissions('teachers:read'), getAllClasses);
router.get('/:classId', requirePermissions('teachers:read'), getClassById);
router.post('/', requirePermissions('admin:manage'), createClass);
router.put('/:classId', requirePermissions('admin:manage'), updateClass);
router.delete('/:classId', requirePermissions('admin:manage'), deleteClass);

export default router;
