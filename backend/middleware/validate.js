import mongoose from "mongoose";
export function validateObjectId(param = "id") {
  return (req, _res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return next(Object.assign(new Error(`Invalid ${param}`), { statusCode: 400 }));
    }
    next();
  };
}
export function requireFields(...fields) {
  return (req, _res, next) => {
    const missing = fields.filter(field => req.body[field] === undefined || req.body[field] === "");
    if (missing.length) return next(Object.assign(new Error(`Required fields: ${missing.join(", ")}`), { statusCode: 400 }));
    next();
  };
}
