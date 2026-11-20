import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pagination, textSearch } from "../utils/apiFeatures.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req);
  const filter = { ...textSearch(req.query.search, ["name", "email", "jobTitle"]) };
  if (req.query.role) filter.role = req.query.role;
  const [users, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);
  res.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
export const updateUser = asyncHandler(async (req, res) => {
  const allowed = ["name", "email", "role", "phone", "jobTitle", "isActive", "department", "status"];
  const update = {};
  if (req.body.status !== undefined) update.isActive = req.body.status === "Active";
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});
export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) return res.status(400).json({ success: false, message: "You cannot delete your own account" });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, message: "User deleted" });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, phone, jobTitle } = req.body;
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ success: false, message: "Name, email and a password of at least 8 characters are required" });
  const user = await User.create({ name, email, password, role: role || "Site Engineer", department, phone, jobTitle });
  const safe = user.toObject(); delete safe.password;
  res.status(201).json({ success: true, data: safe });
});
