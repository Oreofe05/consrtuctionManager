import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Resource from "../models/Resource.js";
import Expenditure from "../models/Expenditure.js";
import ProgressUpdate from "../models/ProgressUpdate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const projectReport = asyncHandler(async (req, res) => {
  const filter = req.query.project ? { _id: req.query.project } : {};
  const projects = await Project.find(filter).populate("manager teamMembers", "name email");
  const reports = await Promise.all(projects.map(async project => {
    const [tasks, resources, expenses, progress] = await Promise.all([
      Task.find({ project: project._id }),
      Resource.find({ project: project._id }),
      Expenditure.find({ project: project._id, ...(req.query.from || req.query.to ? { date: { ...(req.query.from ? { $gte: new Date(req.query.from) } : {}), ...(req.query.to ? { $lte: new Date(req.query.to) } : {}) } } : {}) }),
      ProgressUpdate.find({ project: project._id }).sort({ reportDate: -1 })
    ]);
    const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
    return { project, tasks: { total: tasks.length, completed: tasks.filter(t => t.status === "Completed").length, items: tasks }, resources, expenditure: { total: spent, records: expenses }, remainingBudget: project.budget - spent, progressHistory: progress };
  }));
  res.json({ success: true, data: reports });
});
