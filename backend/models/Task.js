import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  projectId: String, projectCode: String, projectName: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignee: { type: String, default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed", "Blocked"], default: "Pending" },
  startDate: Date, dueDate: Date, completedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Task", schema);
