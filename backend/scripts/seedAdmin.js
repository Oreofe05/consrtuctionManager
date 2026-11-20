import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is missing");
await mongoose.connect(uri);
const email = process.env.ADMIN_EMAIL || "admin@buildcontrol.local";
const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 8) throw new Error("Set ADMIN_PASSWORD to at least 8 characters in backend/.env");
const existing = await User.findOne({ email });
if (existing) { console.log(`Administrator already exists: ${email}`); }
else { await User.create({ name: "BuildControl Administrator", email, password, role: "System Administrator", department: "Administration" }); console.log(`Administrator created: ${email}`); }
await mongoose.disconnect();
