export function notFound(req, res, _next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";
  if (err.name === "ValidationError") { status = 400; message = Object.values(err.errors).map(e => e.message).join(", "); }
  if (err.name === "CastError") { status = 400; message = "Invalid record ID"; }
  if (err.code === 11000) { status = 409; message = "A record with that value already exists"; }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") { status = 401; message = "Invalid or expired token"; }
  res.status(status).json({ success: false, message, ...(process.env.NODE_ENV === "development" && { stack: err.stack }) });
}
export function createError(message, statusCode = 400) {
  const error = new Error(message); error.statusCode = statusCode; return error;
}
