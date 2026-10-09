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
  HardHat,
  Filter,
  ShieldAlert,
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
  if (!date) return "NOT SET";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return String(date).toUpperCase();

  return parsedDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function getStatusBadgeStyles(status) {
  switch (status) {
    case "On Track":
      return "border-emerald-500 bg-emerald-950/90 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]";
    case "At Risk":
      return "border-amber-500 bg-amber-950/90 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]";
    case "Delayed":
      return "border-rose-500 bg-rose-950/90 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.25)]";
    case "Completed":
      return "border-sky-500 bg-sky-950/90 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.25)]";
    case "Planning":
    default:
      return "border-slate-700 bg-slate-950 text-slate-300";
  }
}

function ProjectCard({ project }) {
  const progress = Math.min(
    100,
    Math.max(0, Number(project.progress) || 0)
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl text-white transition-all hover:border-slate-700 hover:shadow-2xl">
      {/* Project Card Header */}
      <div className="border-b-2 border-slate-800/80 pb-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400 shadow-inner">
              <FolderKanban size={20} strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-amber-400 border border-slate-700 uppercase">
                  {project.code || project.id}
                </span>
              </div>

              <p className="mt-1 font-mono text-[10px] font-bold text-slate-400 uppercase truncate">
                {project.category || "GENERAL CONSTRUCTION"}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${getStatusBadgeStyles(
              project.status
            )}`}
          >
            {project.status || "PLANNING"}
          </span>
        </div>

        <h2 className="font-mono text-base font-black uppercase tracking-wide text-white transition-colors group-hover:text-amber-400 leading-snug">
          {project.name}
        </h2>

        <div className="mt-2.5 flex items-center gap-1.5 font-mono text-xs font-bold text-slate-300">
          <MapPin size={13} strokeWidth={2.5} className="text-amber-500 shrink-0" />
          <span className="truncate">
            {project.location || "LOCATION UNASSIGNED"}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-4 flex-1">
        <div className="mb-2 flex items-center justify-between font-mono text-xs font-black">
          <span className="flex items-center gap-1.5 text-slate-300 uppercase">
            <Activity size={14} strokeWidth={2.5} className="text-amber-500" /> SITE PROGRESS
          </span>

          <span className="font-black text-amber-400">
            {progress}% <span className="text-[10px] text-slate-400 font-extrabold">COMPLETE</span>
          </span>
        </div>

        <div
          className="relative h-2.5 overflow-hidden rounded-xs bg-slate-950 border-2 border-slate-800"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full transition-all duration-500 ${
              project.status === "Delayed"
                ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                : project.status === "At Risk"
                  ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Financial Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 font-mono">
          <div className="rounded border-2 border-slate-800 bg-slate-950 p-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase block">
              ALLOCATED CAP
            </span>
            <p className="mt-0.5 text-xs font-black text-white truncate">
              {formatCurrency(project.budget)}
            </p>
          </div>

          <div className="rounded border-2 border-slate-800 bg-slate-950 p-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase block">
              EXPENDED LOG
            </span>
            <p className="mt-0.5 text-xs font-black text-amber-400 truncate">
              {formatCurrency(project.spent)}
            </p>
          </div>
        </div>

        {/* Timeline & Manager Details */}
        <div className="mt-4 space-y-2 border-t-2 border-slate-800/80 pt-3 font-mono text-xs font-bold">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-black">
              <CalendarDays size={13} strokeWidth={2.5} className="text-amber-500" /> TARGET COMPLETION
            </span>
            <span className="text-white font-black">{formatDate(project.endDate)}</span>
          </div>

          {project.manager && (
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] font-black text-slate-400 uppercase">SITE MANAGER</span>
              <span className="text-slate-200 font-extrabold truncate max-w-[140px]">{project.manager}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Button */}
      <Link
        to={`/projects/${encodeURIComponent(
          String(project.id || project.code)
        )}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-800 py-2.5 font-mono text-xs font-black uppercase text-slate-200 transition-all hover:border-amber-500 hover:bg-slate-700 hover:text-amber-400"
      >
        <span>ACCESS SITE DOSSIER</span>
        <ArrowRight size={15} strokeWidth={2.5} />
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
      ...new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
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
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchTerm, statusFilter, categoryFilter]);

  const activeCount = projects.filter(
    (project) => project.status !== "Completed"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const atRiskCount = projects.filter(
    (project) =>
      project.status === "At Risk" ||
      project.status === "Delayed"
  ).length;

  const totalBudget = projects.reduce(
    (total, project) => total + (Number(project.budget) || 0),
    0
  );

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
  };

  const refreshProjects = () => {
    setProjects(getProjects());
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 text-white pb-12">
      {/* Page Heading & Directives */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <FolderKanban size={15} strokeWidth={2.5} /> SITE DIRECTORY
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">ACTIVE DOSSIERS</span>
          </div>

          <h1 className="font-mono text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Construction Project Registry
          </h1>

          <p className="mt-2 max-w-2xl font-mono text-xs font-bold text-slate-300 leading-relaxed">
            Monitor structural delivery, capital expenditure logs, and flagged site variances across all sectors.
          </p>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={refreshProjects}
            className="flex items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-800 px-4 py-3 font-mono text-xs font-black uppercase text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            <span>SYNC DATA</span>
          </button>

          <Link
            to="/projects/new"
            className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_0_22px_rgba(245,158,11,0.5)]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>REGISTER NEW SITE</span>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Site Projects
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400">
              <FolderKanban size={18} strokeWidth={2.5} />
            </div>
          </div>

          <p className="mt-3 font-mono text-3xl font-black text-white">
            {projects.length}
          </p>

          <p className="mt-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
            REGISTERED FIELD DOSSIERS
          </p>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-black uppercase tracking-wider text-slate-300">
              Active Construction
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-sky-500/50 bg-slate-950 font-mono text-sky-400">
              <Clock3 size={18} strokeWidth={2.5} />
            </div>
          </div>

          <p className="mt-3 font-mono text-3xl font-black text-white">
            {activeCount}
          </p>

          <p className="mt-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
            IN-PROGRESS FIELD OPERATIONS
          </p>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-black uppercase tracking-wider text-slate-300">
              At Risk / Delayed
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-rose-500/50 bg-slate-950 font-mono text-rose-400">
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
          </div>

          <p className="mt-3 font-mono text-3xl font-black text-rose-400">
            {atRiskCount}
          </p>

          <p className="mt-2 font-mono text-[10px] font-bold text-rose-400/80 uppercase">
            ACTION REQUIRED ON SITE
          </p>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-black uppercase tracking-wider text-slate-300">
              Completed Handovers
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-emerald-500/50 bg-slate-950 font-mono text-emerald-400">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </div>
          </div>

          <p className="mt-3 font-mono text-3xl font-black text-emerald-400">
            {completedCount}
          </p>

          <p className="mt-2 font-mono text-[10px] font-bold text-emerald-400/80 uppercase">
            COMMISSIONED PROJECTS
          </p>
        </div>
      </div>

      {/* Total Capital Summary Terminal */}
      <div className="flex flex-col justify-between gap-4 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-amber-400">
            <Wallet size={16} strokeWidth={2.5} />
            <span>TOTAL ALLOCATED CAPITAL PORTFOLIO</span>
          </div>

          <p className="mt-1 font-mono text-3xl font-black text-white sm:text-4xl">
            {formatCurrency(totalBudget)}
          </p>
        </div>

        <p className="max-w-md font-mono text-xs font-bold text-slate-300 leading-relaxed uppercase">
          Review individual site parameters, expenditure logs, completion dates, and risk ratings below.
        </p>
      </div>

      {/* Search & Filter Terminal Controls */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="project-search"
              className="mb-2 block font-mono text-xs font-black uppercase tracking-wider text-slate-300"
            >
              SEARCH SITE DOSSIERS
            </label>

            <div className="relative">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />

              <input
                id="project-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by title, site code, location, manager..."
                className="w-full rounded border-2 border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block font-mono text-xs font-black uppercase tracking-wider text-slate-300"
              >
                SITE STATUS FILTER
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded border-2 border-slate-800 bg-slate-950 px-3 py-2.5 font-mono text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 sm:min-w-44"
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL STATUSES ]</option>
                <option value="Planning" className="bg-slate-950 text-slate-300 font-black">● PLANNING</option>
                <option value="On Track" className="bg-slate-950 text-emerald-400 font-black">● ON TRACK</option>
                <option value="At Risk" className="bg-slate-950 text-amber-400 font-black">▲ AT RISK</option>
                <option value="Delayed" className="bg-slate-950 text-rose-400 font-black">■ DELAYED</option>
                <option value="Completed" className="bg-slate-950 text-sky-400 font-black">✓ COMPLETED</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block font-mono text-xs font-black uppercase tracking-wider text-slate-300"
              >
                SECTOR CATEGORY
              </label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded border-2 border-slate-800 bg-slate-950 px-3 py-2.5 font-mono text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 sm:min-w-48"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-slate-950 text-white font-black">
                    {category === "All"
                      ? "[ ALL CATEGORIES ]"
                      : category.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Counter & Filter Reset Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-800/80 pt-3 font-mono text-xs font-extrabold text-slate-300">
          <p>
            SHOWING{" "}
            <span className="font-black text-amber-400">
              {filteredProjects.length}
            </span>{" "}
            OF{" "}
            <span className="font-black text-white">
              {projects.length}
            </span>{" "}
            REGISTERED DOSSIERS
          </p>

          {(searchTerm ||
            statusFilter !== "All" ||
            categoryFilter !== "All") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-mono text-xs font-black uppercase text-amber-400 transition-colors hover:text-amber-300"
            >
              CLEAR FILTER PARAMETERS
            </button>
          )}
        </div>
      </section>

      {/* Project Cards Grid / Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project.code}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border-2 border-dashed border-slate-800 bg-slate-900 px-5 py-16 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 text-amber-500">
            <ShieldAlert size={32} strokeWidth={2.5} />
          </div>

          <h2 className="mt-4 font-mono text-lg font-black uppercase tracking-wider text-white">
            No Active Dossiers Located
          </h2>

          <p className="mx-auto mt-2 max-w-md font-mono text-xs font-bold leading-relaxed text-slate-300">
            No construction sites match your filter query. Adjust parameters or register a new project.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded border-2 border-slate-700 bg-slate-800 px-5 py-2.5 font-mono text-xs font-black uppercase text-white transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              RESET FILTERS
            </button>

            <Link
              to="/projects/new"
              className="flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 font-mono text-xs font-black uppercase text-slate-950 transition-all hover:bg-amber-400"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>REGISTER NEW SITE</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;