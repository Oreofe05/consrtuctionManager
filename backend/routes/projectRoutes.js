import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validate.js";
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from "../controllers/crudController.js";
const router = Router();
router.use(protect);
router.get("/", listRecords("projects"));
router.post("/", authorize("System Administrator", "Administrator", "Project Manager"), createRecord("projects"));
router.get("/:id", getRecord("projects"));
router.patch("/:id", updateRecord("projects"));
router.delete("/:id", authorize("System Administrator", "Administrator"), deleteRecord("projects"));

export default router;
