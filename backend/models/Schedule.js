import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Upcoming", "In Progress", "Completed", "Overdue"], default: "Upcoming" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Schedule", schema);
