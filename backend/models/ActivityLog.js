import mongoose from "mongoose";
const schema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  action: { type: String, required: true },
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  details: String
}, { timestamps: true });
export default mongoose.model("ActivityLog", schema);
