import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user || (!user.isActive || user.status === "Inactive")) throw Object.assign(new Error("Account is unavailable"), { statusCode: 401 });
  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(Object.assign(new Error("You do not have permission to perform this action"), { statusCode: 403 }));
  }
  next();
};
