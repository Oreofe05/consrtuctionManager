import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validate.js";
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from "../controllers/crudController.js";
const router = Router();
router.use(protect);
router.get("/", listRecords("schedules"));
router.post("/", authorize("System Administrator", "Administrator", "Project Manager"), createRecord("schedules"));
router.get("/:id", validateObjectId(), getRecord("schedules"));
router.patch("/:id", validateObjectId(), updateRecord("schedules"));
router.delete("/:id", authorize("System Administrator", "Administrator", "Project Manager"), validateObjectId(), deleteRecord("schedules"));

export default router;
