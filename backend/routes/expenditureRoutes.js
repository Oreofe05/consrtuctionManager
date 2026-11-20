import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validate.js";
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from "../controllers/crudController.js";
const router = Router();
router.use(protect);
router.get("/", listRecords("expenditures"));
router.post("/", authorize("System Administrator", "Administrator", "Project Manager", "Finance Officer"), createRecord("expenditures"));
router.get("/:id", validateObjectId(), getRecord("expenditures"));
router.patch("/:id", validateObjectId(), updateRecord("expenditures"));
router.delete("/:id", authorize("System Administrator", "Administrator", "Project Manager"), validateObjectId(), deleteRecord("expenditures"));

export default router;
