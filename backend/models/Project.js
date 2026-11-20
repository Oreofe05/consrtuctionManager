import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  location: { type: String, required: true, trim: true },
  budget: { type: Number, required: true, min: 0 },
  spent: { type: Number, min: 0, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  expectedEndDate: Date,
  actualEndDate: Date,
  status: { type: String, enum: ["Planning", "On Track", "At Risk", "Delayed", "Completed"], default: "Planning" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  manager: { type: String, default: "" },
  team: [{ type: String }],
  managerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
projectSchema.virtual("id").get(function () { return this.code; });
projectSchema.index({ name: "text", code: "text", location: "text" });
export default mongoose.model("Project", projectSchema);
