import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validate.js";
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from "../controllers/crudController.js";
const router = Router();
router.use(protect);
router.get("/", listRecords("resources"));
router.post("/", authorize("System Administrator", "Administrator", "Project Manager"), createRecord("resources"));
router.get("/:id", validateObjectId(), getRecord("resources"));
router.patch("/:id", validateObjectId(), updateRecord("resources"));
router.delete("/:id", authorize("System Administrator", "Administrator", "Project Manager"), validateObjectId(), deleteRecord("resources"));

export default router;
