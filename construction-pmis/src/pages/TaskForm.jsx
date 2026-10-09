import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Save,
  AlertCircle,
  ChevronDown,
  HardHat,
  Activity,
} from "lucide-react";

import { getProjects } from "../data/projects";
import { getTasks, addTask, updateTask } from "../data/tasks";

const initialForm = {
  title: "",
  projectId: "",
  description: "",
  assignee: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
};

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function TaskForm() {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const isEditing = Boolean(taskId);
  const projects = getProjects();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setForm((current) => ({
        ...current,
        projectId: projects[0]?.id || projects[0]?.code || "",
      }));
      return;
    }

    const existingTask = getTasks().find(
      (task) => task.id === taskId
    );

    if (existingTask) {
      setForm({
        ...initialForm,
        ...existingTask,
        projectId: existingTask.projectId || "",
      });
    } else {
      setError("Task record not located in site database. It may have been purged.");
    }
  }, [taskId, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a valid task directive title.");
      return;
    }

    if (!form.projectId) {
      setError("Please select a target construction site project.");
      return;
    }

    if (!form.assignee.trim()) {
      setError("Please enter the site engineer or supervisor responsible.");
      return;
    }

    if (!form.dueDate) {
      setError("Please specify a target completion deadline.");
      return;
    }

    const selectedProject = projects.find(
      (project) =>
        String(project.id || project.code) === String(form.projectId)
    );

    const taskData = {
      ...form,
      title: form.title.trim(),
      assignee: form.assignee.trim(),
      description: form.description.trim(),
      projectName: selectedProject?.name || "Unknown Project",
      projectCode: selectedProject?.code || "",
    };

    if (isEditing) {
      updateTask(taskId, taskData);
    } else {
      addTask(taskData);
    }

    navigate("/tasks");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-white pb-12 font-mono">
      {/* Header */}
      <div>
        <Link
          to="/tasks"
          className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase text-slate-400 transition-colors hover:text-amber-400"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>RETURN TO TASK DIRECTIVE REGISTER</span>
        </Link>

        <div className="flex items-start gap-3.5 border-b-2 border-slate-800/80 pb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
            <ClipboardList size={24} strokeWidth={2.5} />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={14} strokeWidth={2.5} />
              <span>FIELD DIRECTIVE EDITOR</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl mt-0.5">
              {isEditing ? "Modify Task Directive" : "Issue New Field Task"}
            </h1>
            <p className="mt-1 text-xs font-bold text-slate-400">
              {isEditing
                ? "Update field task parameters, milestone deadlines, and responsible supervisors."
                : "Assign construction activities and define completion target timelines."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8"
      >
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded border-2 border-rose-500 bg-rose-950/80 p-4 text-xs font-black uppercase text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          >
            <AlertCircle size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            1. Task Directive Specification
          </h2>
          <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase">
            Define activity scope and associate with an active construction site dossier.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              TASK TITLE / DIRECTIVE <span className="text-amber-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. FOUNDATION REINFORCEMENT AUDIT & EXCAVATION"
              className={inputClass}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="projectId"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              TARGET CONSTRUCTION SITE <span className="text-amber-500">*</span>
            </label>

            <div className="relative">
              <select
                id="projectId"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                required
              >
                <option value="" className="bg-slate-950 text-white font-black">[ SELECT SITE PROJECT ]</option>

                {projects.map((project) => (
                  <option
                    key={project.id || project.code}
                    value={project.id || project.code}
                    className="bg-slate-950 text-white font-black"
                  >
                    {project.code ? `${project.code} — ` : ""}{project.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {projects.length === 0 && (
              <p className="mt-2 text-[10px] font-black uppercase text-amber-400">
                NO ACTIVE SITE DOSSIERS FOUND. REGISTER A PROJECT PRIOR TO ISSUING TASKS.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              SCOPE OF WORK & TECHNICAL INSTRUCTIONS
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detail required labor, materials, equipment specs, and safety precautions..."
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <div className="border-t-2 border-slate-800/80" />

        {/* Assignment and Schedule */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            2. Responsible Personnel & Milestone Schedule
          </h2>
          <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase">
            Assign field supervisor responsibility, target priority, and completion deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="assignee"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              PERSON RESPONSIBLE / SUPERVISOR <span className="text-amber-500">*</span>
            </label>

            <input
              id="assignee"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="e.g. ENG. O. OKONKWO"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              TARGET DUE DATE <span className="text-amber-500">*</span>
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              PRIORITY LEVEL
            </label>

            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="Low" className="bg-slate-950 text-white font-black">LOW PRIORITY</option>
                <option value="Medium" className="bg-slate-950 text-white font-black">MEDIUM PRIORITY</option>
                <option value="High" className="bg-slate-950 text-white font-black">HIGH PRIORITY</option>
                <option value="Critical" className="bg-slate-950 text-white font-black">CRITICAL PATH</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
            >
              OPERATIONAL STATUS
            </label>

            <div className="relative">
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="Pending" className="bg-slate-950 text-white font-black">PENDING</option>
                <option value="In Progress" className="bg-slate-950 text-white font-black">IN PROGRESS</option>
                <option value="Completed" className="bg-slate-950 text-white font-black">COMPLETED</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-800/80 pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/tasks"
            className="flex items-center justify-center rounded border-2 border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            DISCARD CHANGES
          </Link>

          <button
            type="submit"
            disabled={projects.length === 0}
            className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-2.5 text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} strokeWidth={2.5} />
            <span>{isEditing ? "COMMIT DIRECTIVE CHANGES" : "ISSUE FIELD DIRECTIVE"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;