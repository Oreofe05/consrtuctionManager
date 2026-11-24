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
  Trash2,
  Pencil,
  ListTodo,
} from "lucide-react";
import { getProjects } from "../data/projects";
import { getTasks, updateTask, deleteTask } from "../data/tasks";

const statusStyles = {
  Pending: "bg-slate-800 text-slate-300",
  "In Progress": "bg-sky-500/15 text-sky-400",
  Completed: "bg-emerald-500/15 text-emerald-400",
};

const priorityStyles = {
  Low: "bg-slate-800 text-slate-400",
  Medium: "bg-sky-500/15 text-sky-400",
  High: "bg-amber-500/15 text-amber-400",
  Critical: "bg-rose-500/15 text-rose-400",
};

function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Tasks() {
  const [tasks, setTasks] = useState(() => getTasks());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const projects = getProjects();

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
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate < today && t.status !== "Completed"
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

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, projectLookup]);

  function handleStatusChange(taskId, newStatus) {
    setTasks(updateTask(taskId, { status: newStatus }));
  }

  function handleDelete(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setTasks(deleteTask(taskId));
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setProjectFilter("All");
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm text-amber-400">Tasks</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Tasks & Activities
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Assign work, track progress, and manage deadlines across construction sites.
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-400"
        >
          <Plus size={16} />
          New Task
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <ClipboardList size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-white">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-semibold text-amber-400">
                {inProgressTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-semibold text-emerald-400">
                {completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Overdue</p>
              <p className="text-2xl font-semibold text-rose-400">
                {overdueTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, assignees, projects..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
          >
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
          >
            <option value="All">All projects</option>
            {projects.map((p) => (
              <option key={p.id || p.code} value={String(p.id || p.code)}>
                {p.code ? `${p.code} — ` : ""}
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-700 px-3 py-2.5 text-sm text-slate-400 transition hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800/80 px-5 py-4">
          <h2 className="text-base font-semibold text-white">Task list</h2>
          <p className="text-sm text-slate-500">
            Showing {filteredTasks.length} of {totalTasks} tasks
          </p>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ListTodo size={32} className="text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-300">
              {totalTasks === 0 ? "No tasks yet" : "No tasks match your filters"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {totalTasks === 0
                ? "Create your first task to get started."
                : "Try adjusting search or filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredTasks.map((task) => {
              const project = getTaskProject(task);
              const isOverdue =
                task.dueDate &&
                task.dueDate < today &&
                task.status !== "Completed";

              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-white">{task.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[task.status] || statusStyles.Pending
                        }`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          priorityStyles[task.priority] || priorityStyles.Medium
                        }`}
                      >
                        {task.priority}
                      </span>
                      {isOverdue && (
                        <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                          Overdue
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      {(project?.name || task.projectName) && (
                        <span>
                          {project?.code || task.projectCode} ·{" "}
                          {project?.name || task.projectName}
                        </span>
                      )}
                      {task.assignee && <span>Assignee: {task.assignee}</span>}
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="rounded-xl border border-slate-700 p-2 text-slate-400 transition hover:border-amber-500/40 hover:text-amber-400"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="rounded-xl border border-slate-700 p-2 text-slate-400 transition hover:border-rose-500/40 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
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