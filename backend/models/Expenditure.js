import mongoose from "mongoose";
const schema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  projectId: String, projectCode: String, projectName: String,
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Pending", "Approved", "Paid", "Rejected"], default: "Pending" },
  date: { type: Date, required: true, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Expenditure", schema);
