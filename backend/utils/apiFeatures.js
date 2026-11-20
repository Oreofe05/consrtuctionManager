export function pagination(req) {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}
export function textSearch(query, fields) {
  if (!query) return {};
  const safe = String(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { $or: fields.map(field => ({ [field]: { $regex: safe, $options: "i" } })) };
}
export function dateRange(query, field = "createdAt") {
  const filter = {};
  if (query.from || query.to) {
    filter[field] = {};
    if (query.from && !Number.isNaN(Date.parse(query.from))) filter[field].$gte = new Date(query.from);
    if (query.to && !Number.isNaN(Date.parse(query.to))) filter[field].$lte = new Date(query.to);
  }
  return filter;
}
