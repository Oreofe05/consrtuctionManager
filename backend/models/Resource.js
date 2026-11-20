import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Labour", "Material", "Equipment"], default: "Material" },
  category: { type: String, default: "Building Materials" },
  description: String, supplier: String,
  unit: { type: String, default: "Units" },
  quantity: { type: Number, required: true, min: 0 },
  requiredQuantity: { type: Number, min: 0, default: 0 },
  availableQuantity: { type: Number, min: 0, default: 0 },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  projectId: String, projectCode: String, projectName: String,
  unitCost: { type: Number, min: 0, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Resource", schema);
