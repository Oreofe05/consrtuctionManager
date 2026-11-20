import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { projectReport } from "../controllers/reportController.js";
const router = Router();
router.use(protect, authorize("System Administrator", "Administrator", "Project Manager"));
router.get("/projects", projectReport);
export default router;
