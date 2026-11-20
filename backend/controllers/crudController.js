import { asyncHandler } from "../utils/asyncHandler.js";
import { pagination, textSearch, dateRange } from "../utils/apiFeatures.js";
import { logActivity } from "../services/activityService.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Schedule from "../models/Schedule.js";
import Resource from "../models/Resource.js";
import Expenditure from "../models/Expenditure.js";
import ProgressUpdate from "../models/ProgressUpdate.js";

const populateMap = {
  projects: "teamMembers managerUser createdBy",
  tasks: "project assignedTo createdBy",
  schedules: "project createdBy",
  resources: "project createdBy",
  expenditures: "project recordedBy",
  progress: "project reportedBy"
};
const searchMap = {
  projects: ["name", "description", "location"],
  tasks: ["title", "description"],
  schedules: ["title", "description"],
  resources: ["name", "type", "description"],
  expenditures: ["category", "description"]
};
const models = { projects: Project, tasks: Task, schedules: Schedule, resources: Resource, expenditures: Expenditure, progress: ProgressUpdate };
async function refreshProjectSpent(projectId) { if (!projectId) return; const totals = await Expenditure.aggregate([{ $match: { project: projectId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]); await Project.findByIdAndUpdate(projectId, { spent: totals[0]?.total || 0 }); }

export function listRecords(kind) {
  return asyncHandler(async (req, res) => {
    const Model = models[kind];
    const { page, limit, skip } = pagination(req);
    const filter = { ...textSearch(req.query.search, searchMap[kind] || []) };
    if (req.query.project && ["tasks", "schedules", "resources", "expenditures", "progress"].includes(kind)) { const p = await Project.findOne({ $or: [{ _id: req.query.project }, { code: String(req.query.project).toUpperCase() }] }); if (p) filter.project = p._id; }
    if (req.query.status && ["projects", "tasks", "schedules"].includes(kind)) filter.status = req.query.status;
    if (req.query.type && kind === "resources") filter.type = req.query.type;
    if (req.query.assignedTo && kind === "tasks") filter.assignedTo = req.query.assignedTo;
    Object.assign(filter, dateRange(req.query, kind === "expenditures" ? "date" : "createdAt"));
    const [data, total] = await Promise.all([
      Model.find(filter).populate(populateMap[kind]).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Model.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  });
}
export function getRecord(kind) {
  return asyncHandler(async (req, res) => {
    const item = kind === "projects"
      ? await Project.findOne({ $or: [{ _id: req.params.id }, { code: String(req.params.id).toUpperCase() }] }).populate(populateMap[kind])
      : await models[kind].findById(req.params.id).populate(populateMap[kind]);
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: item });
  });
}
export function createRecord(kind) {
  return asyncHandler(async (req, res) => {
    const Model = models[kind];
    const body = { ...req.body };
    if (kind === "progress" && body.progress !== undefined && body.percentage === undefined) body.percentage = body.progress;
    if (kind === "progress" && body.notes && !body.description) body.description = body.notes;
    if (kind === "resources" && !body.type) body.type = "Material";
    if (kind === "tasks" && body.priority === "Critical") body.priority = "Urgent";
    if (kind === "projects") body.createdBy = req.user._id;
    if (kind === "tasks" || kind === "schedules" || kind === "resources") body.createdBy = req.user._id;
    if (kind === "expenditures") body.recordedBy = req.user._id;
    if (kind === "progress") body.reportedBy = req.user._id;
    if (kind !== "projects" && body.projectId && !body.project) {
      const linkedProject = await Project.findOne({ $or: [{ _id: body.projectId }, { code: String(body.projectId).toUpperCase() }] });
      if (!linkedProject) return res.status(400).json({ success: false, message: "Selected project was not found" });
      body.project = linkedProject._id; body.projectId = linkedProject.code; body.projectCode = linkedProject.code; body.projectName = linkedProject.name;
    }
    if (kind !== "projects" && body.projectCode && !body.project) {
      const linkedProject = await Project.findOne({ code: String(body.projectCode).toUpperCase() });
      if (!linkedProject) return res.status(400).json({ success: false, message: "Selected project was not found" });
      body.project = linkedProject._id; body.projectId = linkedProject.code; body.projectCode = linkedProject.code; body.projectName = linkedProject.name;
    }
    if (kind === "tasks" && body.assignee && !body.assignedTo) {
      const assignedUser = await User.findOne({ $or: [{ name: body.assignee }, { email: body.assignee }] });
      if (assignedUser) body.assignedTo = assignedUser._id;
    }
    const item = await Model.create(body);
    if (kind === "progress") {
      await Project.findByIdAndUpdate(item.project, { progress: item.percentage });
    }
    if (kind === "expenditures") await refreshProjectSpent(item.project);
    const projectId = kind === "projects" ? item._id : item.project;
    const notifyUsers = kind === "projects" ? (item.teamMembers || []) : [];
    await logActivity({ actor: req.user._id, project: projectId, action: `${kind.slice(0, -1)} created`, entityType: kind, entityId: item._id, details: `${kind.slice(0, -1)} "${item.title || item.name || item.description || ""}" was created`, notifyUsers });
    res.status(201).json({ success: true, data: item });
  });
}
export function updateRecord(kind) {
  return asyncHandler(async (req, res) => {
    const Model = models[kind];
    if (kind === "progress" && req.body.progress !== undefined && req.body.percentage === undefined) req.body.percentage = req.body.progress;
    if (kind === "progress" && req.body.notes && !req.body.description) req.body.description = req.body.notes;
    if (kind === "resources" && !req.body.type) req.body.type = "Material";
    if (kind === "tasks" && req.body.priority === "Critical") req.body.priority = "Urgent";
    if (kind !== "projects" && req.body.projectId && !req.body.project) {
      const linkedProject = await Project.findOne({ $or: [{ _id: req.body.projectId }, { code: String(req.body.projectId).toUpperCase() }] });
      if (linkedProject) { req.body.project = linkedProject._id; req.body.projectId = linkedProject.code; req.body.projectCode = linkedProject.code; req.body.projectName = linkedProject.name; }
    }
    const item = kind === "projects"
      ? await Project.findOneAndUpdate({ $or: [{ _id: req.params.id }, { code: String(req.params.id).toUpperCase() }] }, req.body, { new: true, runValidators: true })
      : await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    if (kind === "progress") await Project.findByIdAndUpdate(item.project, { progress: item.percentage });
    if (kind === "expenditures") await refreshProjectSpent(item.project);
    const projectId = kind === "projects" ? item._id : item.project;
    await logActivity({ actor: req.user._id, project: projectId, action: `${kind.slice(0, -1)} updated`, entityType: kind, entityId: item._id });
    res.json({ success: true, data: item });
  });
}
export function deleteRecord(kind) {
  return asyncHandler(async (req, res) => {
    if (kind === "projects" && !["Administrator", "System Administrator"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only administrators can delete projects" });
    }
    const item = kind === "projects"
      ? await Project.findOneAndDelete({ $or: [{ _id: req.params.id }, { code: String(req.params.id).toUpperCase() }] })
      : await models[kind].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    if (kind === "expenditures") await refreshProjectSpent(item.project);
    if (kind === "projects") {
      await Promise.all([Task.deleteMany({ project: item._id }), Schedule.deleteMany({ project: item._id }), Resource.deleteMany({ project: item._id }), Expenditure.deleteMany({ project: item._id }), ProgressUpdate.deleteMany({ project: item._id })]);
    }
    res.json({ success: true, message: "Record deleted" });
  });
}
export const assignTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: req.body.assignedTo }, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  await logActivity({ actor: req.user._id, project: task.project, action: "Task assigned", entityType: "Task", entityId: task._id, details: "A task was assigned to a team member", notifyUsers: req.body.assignedTo ? [req.body.assignedTo] : [] });
  res.json({ success: true, data: task });
});
