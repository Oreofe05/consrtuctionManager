import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pagination } from "../utils/apiFeatures.js";
export const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req);
  const filter = { user: req.user._id };
  if (req.query.unread === "true") filter.isRead = false;
  const [data, total] = await Promise.all([Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), Notification.countDocuments(filter)]);
  res.json({ success: true, data, pagination: { page, limit, total } });
});
export const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true }, { new: true });
  if (!item) return res.status(404).json({ success: false, message: "Notification not found" });
  res.json({ success: true, data: item });
});
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: "All notifications marked as read" });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const item = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ success: false, message: "Notification not found" });
  res.json({ success: true, message: "Notification deleted" });
});
