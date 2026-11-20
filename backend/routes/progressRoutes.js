import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validate.js";
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from "../controllers/crudController.js";
const router = Router();
router.use(protect);
router.get("/", listRecords("progress"));
router.post("/", authorize("System Administrator", "Administrator", "Project Manager"), createRecord("progress"));
router.get("/:id", validateObjectId(), getRecord("progress"));
router.patch("/:id", validateObjectId(), updateRecord("progress"));
router.delete("/:id", authorize("System Administrator", "Administrator", "Project Manager"), validateObjectId(), deleteRecord("progress"));

export default router;
