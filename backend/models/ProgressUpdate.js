import mongoose from "mongoose";
const schema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  projectId: String, projectCode: String, projectName: String,
  percentage: { type: Number, min: 0, max: 100 },
  progress: { type: Number, min: 0, max: 100 },
  plannedProgress: { type: Number, min: 0, max: 100, default: 0 },
  description: String, notes: String,
  reportDate: Date, date: { type: Date, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
schema.pre("validate", function () {
  if (this.progress !== undefined && this.percentage === undefined) this.percentage = this.progress;
  if (this.percentage !== undefined && this.progress === undefined) this.progress = this.percentage;
  if (!this.description && this.notes) this.description = this.notes;
  if (!this.notes && this.description) this.notes = this.description;
  if (!this.reportDate && this.date) this.reportDate = this.date;
});
export default mongoose.model("ProgressUpdate", schema);
