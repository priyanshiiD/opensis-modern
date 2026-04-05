import { Router } from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { authMiddleware, requirePermissions } from "../middleware/auth.js";

const router = Router();


router.use(authMiddleware);

router.get("/", requirePermissions("teachers:read"), getAllTeachers);
router.get("/:id", requirePermissions("teachers:read"), getTeacherById);


router.post("/", requirePermissions("admin:manage"), createTeacher);
router.put("/:id", requirePermissions("admin:manage"), updateTeacher);
router.delete("/:id", requirePermissions("admin:manage"), deleteTeacher);

export default router;