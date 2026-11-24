import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowRight,
  MapPin,
  CalendarDays,
  RotateCcw,
  Wallet,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../data/projects";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "Not set";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyles(status) {
  switch (status) {
    case "On Track":
      return "bg-emerald-500/15 text-emerald-400";
    case "At Risk":
      return "bg-amber-500/15 text-amber-400";
    case "Delayed":
      return "bg-rose-500/15 text-rose-400";
    case "Completed":
      return "bg-sky-500/15 text-sky-400";
    default:
      return "bg-slate-800 text-slate-400";
  }
}

function ProjectCard({ project }) {
  const progress = Math.min(100, Math.max(0, Number(project.progress) || 0));

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <FolderKanban size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-400">
              {project.code || project.id}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {project.category || "General Construction"}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(
            project.status
          )}`}
        >
          {project.status || "Planning"}
        </span>
      </div>

      <h2 className="mt-4 text-base font-semibold text-white group-hover:text-amber-400 transition">
        {project.name}
      </h2>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
        <MapPin size={14} className="shrink-0 text-slate-500" />
        <span className="truncate">{project.location || "Location unassigned"}</span>
      </div>

      <div className="mt-5 flex-1">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Activity size={14} /> Progress
          </span>
          <span className="font-medium text-white">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              project.status === "Delayed"
                ? "bg-rose-500"
                : project.status === "At Risk"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs text-slate-500">Budget</p>
            <p className="mt-0.5 text-sm font-medium text-white truncate">
              {formatCurrency(project.budget)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs text-slate-500">Spent</p>
            <p className="mt-0.5 text-sm font-medium text-amber-400 truncate">
              {formatCurrency(project.spent)}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <CalendarDays size={13} /> Target
            </span>
            <span className="text-white">{formatDate(project.endDate)}</span>
          </div>
          {project.manager && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Manager</span>
              <span className="truncate max-w-[140px] text-slate-300">
                {project.manager}
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/projects/${encodeURIComponent(String(project.id || project.code))}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:text-amber-400"
      >
        View details
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}

function Projects() {
  const [projects, setProjects] = useState(() => getProjects());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(projects.map((p) => p.category).filter(Boolean)),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = [
        project.name,
        project.code,
        project.id,
        project.location,
        project.manager,
        project.category,
      ].some((v) => String(v || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchTerm, statusFilter, categoryFilter]);

  const activeCount = projects.filter((p) => p.status !== "Completed").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const atRiskCount = projects.filter(
    (p) => p.status === "At Risk" || p.status === "Delayed"
  ).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + (Number(p.budget) || 0),
    0
  );

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
  };

  const refreshProjects = () => setProjects(getProjects());

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm text-amber-400">Projects</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Construction Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Monitor delivery, budgets, and status across all University of
            Ibadan construction sites.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={refreshProjects}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            <RotateCcw size={16} />
            Refresh
          </button>
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-400"
          >
            <Plus size={16} />
            Add Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Projects</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <FolderKanban size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <Clock3 size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{activeCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">At Risk / Delayed</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-rose-400">
            {atRiskCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Budget</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatCurrency(totalBudget)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {completedCount} completed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
        >
          <option value="All">All statuses</option>
          <option value="On Track">On Track</option>
          <option value="At Risk">At Risk</option>
          <option value="Delayed">Delayed</option>
          <option value="Completed">Completed</option>
          <option value="Planning">Planning</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All categories" : cat}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl border border-slate-700 px-3 py-2.5 text-sm text-slate-400 transition hover:text-white"
        >
          Reset
        </button>
      </div>

      {/* Project grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 py-16 text-center">
          <FolderKanban size={32} className="mx-auto text-slate-600" />
          <p className="mt-3 text-sm font-medium text-slate-300">
            No projects found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project.code}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;