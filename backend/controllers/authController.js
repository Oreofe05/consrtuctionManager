import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, status: user.status, phone: user.phone, jobTitle: user.jobTitle });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  if (role && role !== "Site Engineer") return res.status(403).json({ success: false, message: "Only administrators can assign privileged roles during user management" });
  const user = await User.create({ name, email, password, role: "Site Engineer", department });
  res.status(201).json({ success: true, data: { user: safeUser(user), token: makeToken(user._id) } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() }).select("+password");
  if (!user || (!user.isActive || user.status === "Inactive") || !(await user.comparePassword(password || ""))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  res.json({ success: true, data: { user: safeUser(user), token: makeToken(user._id) } });
});

export const me = asyncHandler(async (req, res) => res.json({ success: true, data: { user: safeUser(req.user) } }));
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "jobTitle"];
  allowed.forEach(key => { if (req.body[key] !== undefined) req.user[key] = req.body[key]; });
  await req.user.save();
  res.json({ success: true, data: { user: safeUser(req.user) } });
});
export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword || ""))) return res.status(400).json({ success: false, message: "Current password is incorrect" });
  if (!req.body.newPassword || req.body.newPassword.length < 8) return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: "Password changed. Please sign in again." });
});
export const logout = asyncHandler(async (_req, res) => res.json({ success: true, message: "Logged out. Remove the token on the client." }));
