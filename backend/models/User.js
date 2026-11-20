import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["System Administrator", "Project Manager", "Site Engineer", "Finance Officer", "Administrator", "Team Member"], default: "Site Engineer" },
  department: { type: String, trim: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  phone: { type: String, trim: true },
  jobTitle: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function (candidate) { return bcrypt.compare(candidate, this.password); };
export default mongoose.model("User", userSchema);
