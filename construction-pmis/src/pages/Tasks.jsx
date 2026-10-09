import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Trash2,
  Pencil,
  ArrowRight,
  ListTodo,
  ChevronDown,
  Activity,
  HardHat,
} from "lucide-react";

import { getProjects } from "../data/projects";
import { getTasks, updateTask, deleteTask } from "../data/tasks";

const statusStyles = {
  Pending: "border-slate-700 bg-slate-950 text-slate-300",
  "In Progress": "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
  Completed: "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
};

const priorityStyles = {
  Low: "border-slate-700 bg-slate-950 text-slate-300",
  Medium: "border-sky-500 bg-sky-950 text-sky-300",
  High: "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
  Critical: "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
};

function formatDate(dateString) {
  if (!dateString) return "NO DUE DATE";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "INVALID DATE";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function SummaryCard({ title, value, icon, iconStyle, valueStyle = "text-white" }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-center gap-3.5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${iconStyle}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{title}</p>
          <p className={`mt-1 break-words text-2xl font-black tracking-tight ${valueStyle}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState(() => getTasks());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const projects = getProjects();

  // Match a task to its project using either the project ID or code.
  const projectLookup = useMemo(() => {
    const lookup = {};

    projects.forEach((project) => {
      if (project.id) lookup[String(project.id)] = project;
      if (project.code) lookup[String(project.code)] = project;
    });

    return lookup;
  }, [projects]);

  function getTaskProject(task) {
    return (
      projectLookup[String(task.projectId)] ||
      projectLookup[String(task.projectCode)] ||
      null
    );
  }

  const today = new Date().toLocaleDateString("en-CA");

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate < today &&
      task.status !== "Completed"
  ).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const project = getTaskProject(task);

      const searchText = [
        task.title,
        task.description,
        task.assignee,
        task.projectName,
        task.projectCode,
        project?.name,
        project?.code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "All" ||
        String(task.projectId) === projectFilter ||
        String(task.projectCode) === projectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    projectFilter,
    projectLookup,
  ]);

  function handleStatusChange(taskId, newStatus) {
    const updatedTasks = updateTask(taskId, { status: newStatus });
    setTasks(updatedTasks);
  }

  function handleDelete(taskId) {
    const confirmed = window.confirm(
      "ARE YOU SURE YOU WANT TO DELETE THIS TASK DIRECTIVE?"
    );

    if (!confirmed) return;

    const updatedTasks = deleteTask(taskId);
    setTasks(updatedTasks);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setProjectFilter("All");
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12 font-mono">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <ClipboardList size={15} strokeWidth={2.5} /> FIELD OPERATIONS
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">TASK DIRECTIVES</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Tasks & Work Activities
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
            Assign construction activities, issue site directives, monitor field progress, and track target deadlines.
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>ISSUE NEW TASK</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Directives"
          value={totalTasks}
          icon={<ClipboardList size={20} strokeWidth={2.5} />}
          iconStyle="border-sky-500/50 text-sky-400 bg-slate-950"
          valueStyle="text-sky-400"
        />

        <SummaryCard
          title="In Progress"
          value={inProgressTasks}
          icon={<Clock3 size={20} strokeWidth={2.5} />}
          iconStyle="border-amber-500/50 text-amber-400 bg-slate-950"
          valueStyle="text-amber-400"
        />

        <SummaryCard
          title="Completed"
          value={completedTasks}
          icon={<CheckCircle2 size={20} strokeWidth={2.5} />}
          iconStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />

        <SummaryCard
          title="Overdue"
          value={overdueTasks}
          icon={<AlertTriangle size={20} strokeWidth={2.5} />}
          iconStyle="border-rose-500/50 text-rose-400 bg-slate-950"
          valueStyle="text-rose-400"
        />
      </div>

      {/* Task Register */}
      <div className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="border-b-2 border-slate-800/80 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                <Activity size={16} strokeWidth={2.5} />
                <span>TASK REGISTER</span>
              </div>
              <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
                Active Field Directives
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400">
                DISPLAYING {filteredTasks.length} OF {totalTasks} TOTAL REGISTERED TASKS
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search directives, sites, supervisors..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL STATUSES ]</option>
                <option value="Pending" className="bg-slate-950 text-white font-black">PENDING</option>
                <option value="In Progress" className="bg-slate-950 text-white font-black">IN PROGRESS</option>
                <option value="Completed" className="bg-slate-950 text-white font-black">COMPLETED</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL PRIORITIES ]</option>
                <option value="Low" className="bg-slate-950 text-white font-black">LOW</option>
                <option value="Medium" className="bg-slate-950 text-white font-black">MEDIUM</option>
                <option value="High" className="bg-slate-950 text-white font-black">HIGH</option>
                <option value="Critical" className="bg-slate-950 text-white font-black">CRITICAL</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL SITE PROJECTS ]</option>

                {projects.map((project) => (
                  <option
                    key={project.id || project.code}
                    value={String(project.id || project.code)}
                    className="bg-slate-950 text-white font-black"
                  >
                    {project.code ? `${project.code} — ` : ""}{project.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-500">
              <ListTodo size={32} strokeWidth={2.5} />
            </div>

            <h3 className="mt-4 text-sm font-black uppercase tracking-wider text-white">
              {totalTasks === 0
                ? "No Directives Created Yet"
                : "No Matching Tasks Located"}
            </h3>

            <p className="mt-1 max-w-sm text-xs font-bold leading-relaxed text-slate-400 uppercase">
              {totalTasks === 0
                ? "Issue your first construction task directive to begin monitoring assignments, deadlines, and field work."
                : "Modify search parameters or reset status filters to locate target tasks."}
            </p>

            {totalTasks === 0 ? (
              <Link
                to="/tasks/new"
                className="mt-6 flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>ISSUE FIRST TASK</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-xs font-black uppercase text-amber-400 hover:underline"
              >
                CLEAR ALL QUERY FILTERS
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
            {filteredTasks.map((task) => {
              const project = getTaskProject(task);

              const isOverdue =
                task.dueDate &&
                task.dueDate < today &&
                task.status !== "Completed";

              return (
                <div
                  key={task.id}
                  className="p-5 transition-colors hover:bg-slate-950/80"
                >
                  <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black uppercase tracking-wide text-white">
                          {task.title}
                        </h3>

                        <span
                          className={`inline-flex items-center rounded border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            priorityStyles[task.priority] ||
                            priorityStyles.Medium
                          }`}
                        >
                          {task.priority || "MEDIUM"}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-col gap-2 text-xs font-bold text-slate-300 uppercase sm:flex-row sm:flex-wrap sm:gap-x-5">
                        <span className="flex items-center gap-1.5">
                          <ClipboardList
                            size={15}
                            strokeWidth={2.5}
                            className="shrink-0 text-amber-500"
                          />
                          <span>
                            {project?.name ||
                              task.projectName ||
                              task.projectCode ||
                              "UNASSIGNED SITE"}
                          </span>
                        </span>

                        {project?.location && (
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <MapPin size={15} strokeWidth={2.5} className="shrink-0 text-amber-500" />
                            <span>{project.location}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1.5">
                          <CalendarDays
                            size={15}
                            strokeWidth={2.5}
                            className="shrink-0 text-amber-500"
                          />
                          <span
                            className={
                              isOverdue ? "font-black text-rose-400" : ""
                            }
                          >
                            {isOverdue ? "OVERDUE: " : "TARGET DUE: "}
                            {formatDate(task.dueDate)}
                          </span>
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-bold text-slate-400 uppercase">
                        SUPERVISOR RESPONSIBLE:{" "}
                        <span className="font-black text-white">
                          {task.assignee || "UNASSIGNED"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:min-w-[280px] xl:justify-end">
                      <div className="min-w-[130px]">
                        <label
                          htmlFor={`status-${task.id}`}
                          className="mb-1 block text-[10px] font-black text-slate-400 uppercase"
                        >
                          DIRECTIVE STATUS
                        </label>

                        <div className="relative">
                          <select
                            id={`status-${task.id}`}
                            value={task.status || "Pending"}
                            onChange={(event) =>
                              handleStatusChange(
                                task.id,
                                event.target.value
                              )
                            }
                            className={`w-full rounded border-2 px-3 py-1.5 text-xs font-black uppercase outline-none transition-colors cursor-pointer ${
                              statusStyles[task.status] ||
                              statusStyles.Pending
                            }`}
                          >
                            <option value="Pending" className="bg-slate-950 text-white font-black">PENDING</option>
                            <option value="In Progress" className="bg-slate-950 text-white font-black">IN PROGRESS</option>
                            <option value="Completed" className="bg-slate-950 text-white font-black">COMPLETED</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 sm:pt-0">
                        <Link
                          to={`/tasks/${task.id}/edit`}
                          title="Edit directive"
                          aria-label={`Edit ${task.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                        >
                          <Pencil size={15} strokeWidth={2.5} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          title="Delete directive"
                          aria-label={`Delete ${task.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>

                        {project && (
                          <Link
                            to={`/projects/${project.id || project.code}`}
                            title="View site dossier"
                            aria-label={`View project for ${task.title}`}
                            className="flex h-9 w-9 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-slate-300 transition-colors hover:border-sky-500 hover:text-sky-400"
                          >
                            <ArrowRight size={15} strokeWidth={2.5} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;