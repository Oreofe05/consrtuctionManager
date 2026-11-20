import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Expenditure from "../models/Expenditure.js";
import ActivityLog from "../models/ActivityLog.js";
import Schedule from "../models/Schedule.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (_req, res) => {
  const now = new Date();
  const [totalProjects, activeProjects, completedProjects, delayedProjects, totalTasks, completedTasks, pendingTasks, upcomingDeadlines, recentActivities, budgets] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: { $in: ["Planning", "On Track", "At Risk"] } }),
    Project.countDocuments({ status: "Completed" }),
    Project.countDocuments({ $or: [{ status: "Delayed" }, { expectedEndDate: { $lt: now }, status: { $ne: "Completed" } }] }),
    Task.countDocuments(),
    Task.countDocuments({ status: "Completed" }),
    Task.countDocuments({ status: { $in: ["Pending", "In Progress", "Blocked"] } }),
    Schedule.find({ endDate: { $gte: now }, status: { $ne: "Completed" } }).populate("project", "name").sort({ endDate: 1 }).limit(8),
    ActivityLog.find().populate("actor", "name").populate("project", "name").sort({ createdAt: -1 }).limit(10),
    Project.aggregate([{ $group: { _id: null, totalBudget: { $sum: "$budget" } } }])
  ]);
  const spent = await Expenditure.aggregate([{ $group: { _id: null, totalSpent: { $sum: "$amount" } } }]);
  res.json({ success: true, data: {
    projects: { total: totalProjects, active: activeProjects, completed: completedProjects, delayedOrAtRisk: delayedProjects },
    tasks: { total: totalTasks, completed: completedTasks, pending: pendingTasks },
    deadlines: upcomingDeadlines,
    recentActivities,
    finance: { totalBudget: budgets[0]?.totalBudget || 0, totalExpenditure: spent[0]?.totalSpent || 0, remainingBudget: (budgets[0]?.totalBudget || 0) - (spent[0]?.totalSpent || 0) }
  } });
});
