import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  X,
  CalendarDays,
  Activity,
  Trash2,
  FileText,
  Target,
  ChevronDown,
  HardHat,
  ShieldAlert,
} from "lucide-react";

import {
  getProjects,
  saveProjects,
} from "../data/projects";

import {
  getProgressUpdates,
  addProgressUpdate,
  deleteProgressUpdate,
} from "../data/progress";

const percent = (value) => `${Number(value || 0).toFixed(0)}%`;

const dateLabel = (value) => {
  if (!value) return "NOT SET";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? "NOT SET"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
};

// Pure Tailwind input styling variable
const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function SummaryCard({ title, value, subtitle, icon: Icon, badgeStyle, valueStyle = "text-white" }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{title}</p>
          <h3 className={`mt-3 break-words text-2xl font-black tracking-tight ${valueStyle}`}>
            {value}
          </h3>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">{subtitle}</p>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 ${badgeStyle}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function ProgressBadge({ project }) {
  const status = project.progressStatus || "Not Updated";

  const styles = {
    "On Track": "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
    "Needs Attention": "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
    "Behind Schedule": "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
    Completed: "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
    "Not Updated": "border-slate-700 bg-slate-950 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
        styles[status] || styles["Not Updated"]
      }`}
    >
      {status}
    </span>
  );
}

function Progress() {
  const [projects, setProjects] = useState(() => getProjects());
  const [updates, setUpdates] = useState(() => getProgressUpdates());

  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState({
    projectId: "",
    progress: "",
    plannedProgress: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const projectLookup = useMemo(() => {
    const lookup = {};

    projects.forEach((project) => {
      lookup[String(project.id || project.code)] = project;
    });

    return lookup;
  }, [projects]);

  const getProjectName = (projectId) => {
    const project = projectLookup[String(projectId)];
    return project?.name || "Unknown project";
  };

  const progressByProject = useMemo(() => {
    const result = {};

    updates.forEach((update) => {
      const key = String(update.projectId);

      if (!result[key]) result[key] = [];
      result[key].push(update);
    });

    Object.values(result).forEach((items) => {
      items.sort((a, b) => {
        const dateDifference = String(b.date || "").localeCompare(
          String(a.date || "")
        );

        return dateDifference ||
          String(b.createdAt || "").localeCompare(
            String(a.createdAt || "")
          );
      });
    });

    return result;
  }, [updates]);

  const projectRows = useMemo(() => {
    return projects.map((project) => {
      const key = String(project.id || project.code);
      const history = progressByProject[key] || [];
      const latest = history[0];

      const currentProgress = Math.min(
        100,
        Math.max(0, Number(project.progress || 0))
      );

      const plannedProgress = latest
        ? Number(latest.plannedProgress || 0)
        : currentProgress;

      let progressStatus = "Not Updated";

      if (currentProgress >= 100) {
        progressStatus = "Completed";
      } else if (!latest) {
        progressStatus = "Not Updated";
      } else if (currentProgress < plannedProgress - 10) {
        progressStatus = "Behind Schedule";
      } else if (currentProgress < plannedProgress) {
        progressStatus = "Needs Attention";
      } else {
        progressStatus = "On Track";
      }

      return {
        ...project,
        currentProgress,
        plannedProgress,
        progressStatus,
        latestDate: latest?.date || "",
        latestNotes: latest?.notes || "",
        updateCount: history.length,
      };
    });
  }, [projects, progressByProject]);

  const summary = useMemo(() => {
    const total = projectRows.length;

    const average = total
      ? projectRows.reduce(
          (sum, project) => sum + project.currentProgress,
          0
        ) / total
      : 0;

    return {
      total,
      average,
      onTrack: projectRows.filter(
        (project) => project.progressStatus === "On Track"
      ).length,
      attention: projectRows.filter((project) =>
        ["Needs Attention", "Behind Schedule"].includes(
          project.progressStatus
        )
      ).length,
      completed: projectRows.filter(
        (project) => project.progressStatus === "Completed"
      ).length,
    };
  }, [projectRows]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projectRows.filter((project) => {
      const matchesSearch =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.code?.toLowerCase().includes(query) ||
        project.manager?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        project.progressStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projectRows, search, statusFilter]);

  const openForm = (project = null) => {
    setForm({
      projectId: project
        ? String(project.id || project.code)
        : projects[0]
          ? String(projects[0].id || projects[0].code)
          : "",
      progress: String(project?.progress ?? ""),
      plannedProgress: String(
        project?.plannedProgress ?? project?.progress ?? ""
      ),
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });

    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const current = Number(form.progress);
    const planned = Number(form.plannedProgress);

    if (
      !Number.isFinite(current) ||
      current < 0 ||
      current > 100
    ) {
      window.alert("Actual progress must be between 0 and 100.");
      return;
    }

    if (
      !Number.isFinite(planned) ||
      planned < 0 ||
      planned > 100
    ) {
      window.alert("Planned progress must be between 0 and 100.");
      return;
    }

    const selectedProject = projectLookup[form.projectId];

    if (!selectedProject) {
      window.alert("Please select a valid project.");
      return;
    }

    try {
      addProgressUpdate({
        projectId: String(form.projectId),
        projectName: selectedProject.name,
        projectCode: selectedProject.code || "",
        progress: current,
        plannedProgress: planned,
        date: form.date,
        notes: form.notes.trim(),
      });

      const updatedProjects = projects.map((project) => {
        const key = String(project.id || project.code);

        if (key !== String(form.projectId)) return project;

        return {
          ...project,
          progress: current,
          progressStatus:
            current >= 100
              ? "Completed"
              : current < planned - 10
                ? "Behind Schedule"
                : current < planned
                  ? "Needs Attention"
                  : "On Track",
        };
      });

      saveProjects(updatedProjects);
      setProjects(updatedProjects);
      setUpdates(getProgressUpdates());
      closeForm();
    } catch (error) {
      console.error("Unable to save progress update:", error);
      window.alert("Unable to save the progress update.");
    }
  };

  const handleDeleteUpdate = (update) => {
    const confirmed = window.confirm(
      "CONFIRM: Delete this progress report? Project progress will be recalculated from remaining logs."
    );

    if (!confirmed) return;

    try {
      const remaining = getProgressUpdates().filter(
        (item) => item.id !== update.id
      );

      deleteProgressUpdate(update.id);

      const project = projectLookup[String(update.projectId)];

      if (project) {
        const remainingForProject = remaining
          .filter(
            (item) =>
              String(item.projectId) === String(update.projectId)
          )
          .sort((a, b) => {
            const dateDifference = String(b.date || "").localeCompare(
              String(a.date || "")
            );

            return dateDifference ||
              String(b.createdAt || "").localeCompare(
                String(a.createdAt || "")
              );
          });

        const latest = remainingForProject[0];

        const updatedProjects = projects.map((item) => {
          if (
            String(item.id || item.code) !== String(update.projectId)
          ) {
            return item;
          }

          if (latest) {
            return {
              ...item,
              progress: Number(latest.progress),
            };
          }

          return {
            ...item,
            progress: 0,
            progressStatus: "Not Updated",
          };
        });

        saveProjects(updatedProjects);
        setProjects(updatedProjects);
      }

      setUpdates(getProgressUpdates());
    } catch (error) {
      console.error("Unable to delete progress report:", error);
      window.alert("Unable to delete this progress report.");
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <Activity size={15} strokeWidth={2.5} /> FIELD AUDIT
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">PROGRESS MONITORING</span>
          </div>

          <h1 className="font-mono text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Progress & Milestone Tracking
          </h1>

          <p className="mt-2 max-w-2xl font-mono text-xs font-bold text-slate-300 leading-relaxed">
            Monitor physical construction milestones, completion rates, planned vs. actual schedule variance, and site logs.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          disabled={projects.length === 0}
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={19} strokeWidth={2.5} />
          <span>LOG PROGRESS REPORT</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Active Sites"
          value={summary.total}
          subtitle="PROJECTS UNDER MONITORING"
          icon={Target}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
        />

        <SummaryCard
          title="Average Completion"
          value={percent(summary.average)}
          subtitle="AGGREGATE PHYSICAL PROGRESS"
          icon={TrendingUp}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
          valueStyle="text-sky-400"
        />

        <SummaryCard
          title="On Track Sites"
          value={summary.onTrack}
          subtitle="MEETING SCHEDULE TARGETS"
          icon={CheckCircle2}
          badgeStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />

        <SummaryCard
          title="Requires Attention"
          value={summary.attention}
          subtitle="BEHIND PLANNED SCHEDULE"
          icon={AlertTriangle}
          badgeStyle="border-amber-500/50 text-amber-400 bg-slate-950"
          valueStyle="text-amber-400"
        />
      </div>

      {/* Completion Overview Cards */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6 font-mono">
        <div className="mb-6 flex items-center justify-between border-b-2 border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={16} strokeWidth={2.5} />
              <span>COMPLETION RATIOS</span>
            </div>
            <h2 className="mt-1 text-base font-black uppercase tracking-wider text-white">
              Project Completion Overview
            </h2>
            <p className="mt-0.5 text-xs font-bold text-slate-300">
              Real-time site physical progress tracked against planned targets.
            </p>
          </div>
        </div>

        {projectRows.length === 0 ? (
          <div className="rounded border-2 border-slate-800 bg-slate-950 p-6 text-center">
            <HardHat className="mx-auto mb-3 text-amber-500" size={32} strokeWidth={2.5} />
            <p className="font-mono text-sm font-black uppercase text-white">
              No Projects Under Audit
            </p>
            <p className="mt-1 text-xs font-bold text-slate-400">
              Provision a project dossier to begin tracking construction progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {projectRows.map((project) => (
              <div
                key={project.id || project.code}
                className="rounded border-2 border-slate-800 bg-slate-950 p-4 font-mono shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-slate-700 uppercase">
                      {project.code || "PROJECT"}
                    </span>
                    <h3 className="mt-1.5 font-mono text-sm font-black uppercase text-white truncate">
                      {project.name}
                    </h3>
                  </div>

                  <span className="shrink-0 text-xl font-black text-sky-400">
                    {percent(project.currentProgress)}
                  </span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-xs bg-slate-900 border border-slate-800">
                  <div
                    className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all duration-500"
                    style={{
                      width: `${project.currentProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <ProgressBadge project={project} />
                  <button
                    onClick={() => openForm(project)}
                    className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase text-amber-400 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950"
                  >
                    + LOG UPDATE
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t-2 border-slate-800/80 pt-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">PLANNED TARGET</p>
                    <p className="mt-0.5 text-xs font-black text-white">
                      {percent(project.plannedProgress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">LAST REPORTED</p>
                    <p className="mt-0.5 text-xs font-black text-amber-400">
                      {dateLabel(project.latestDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Progress Register Table */}
      <section className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="border-b-2 border-slate-800/80 p-5 font-mono sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                <Target size={16} strokeWidth={2.5} />
                <span>AUDIT REGISTER</span>
              </div>
              <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
                Project Schedule Register
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-300">
                Compare physical progress against target baselines and schedule variances.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project or site manager..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL STATUSES ]</option>
                <option value="On Track" className="bg-slate-950 text-white font-black">ON TRACK</option>
                <option value="Needs Attention" className="bg-slate-950 text-white font-black">NEEDS ATTENTION</option>
                <option value="Behind Schedule" className="bg-slate-950 text-white font-black">BEHIND SCHEDULE</option>
                <option value="Completed" className="bg-slate-950 text-white font-black">COMPLETED</option>
                <option value="Not Updated" className="bg-slate-950 text-white font-black">NOT UPDATED</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="px-5 py-12 text-center font-mono text-xs font-bold text-slate-400">
            NO PROJECTS MATCH CURRENT SEARCH OR FILTER CRITERIA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left font-mono text-xs">
              <thead className="bg-slate-950 text-[11px] font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800">
                <tr>
                  <th className="px-6 py-4">SITE PROJECT</th>
                  <th className="px-6 py-4">ACTUAL PROGRESS</th>
                  <th className="px-6 py-4">PLANNED TARGET</th>
                  <th className="px-6 py-4">VARIANCE</th>
                  <th className="px-6 py-4">ESTIMATED COMPLETION</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
                {filteredProjects.map((project) => {
                  const variance =
                    project.currentProgress - project.plannedProgress;

                  return (
                    <tr
                      key={project.id || project.code}
                      className="hover:bg-slate-950/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-black uppercase text-white tracking-wide">
                          {project.name}
                        </p>
                        <p className="mt-0.5 text-[10px] font-black text-amber-400">
                          {project.code || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-black text-sky-400 text-sm">
                        {percent(project.currentProgress)}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-300">
                        {percent(project.plannedProgress)}
                      </td>

                      <td
                        className={`px-6 py-4 font-black ${
                          variance < 0
                            ? "text-rose-400"
                            : variance > 0
                              ? "text-emerald-400"
                              : "text-slate-300"
                        }`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance.toFixed(0)}%
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-300">
                        {dateLabel(project.endDate)}
                      </td>

                      <td className="px-6 py-4">
                        <ProgressBadge project={project} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openForm(project)}
                          className="rounded border-2 border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-black text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400 uppercase"
                        >
                          UPDATE
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Progress History Log */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6 font-mono">
        <div className="mb-5 border-b-2 border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <FileText size={16} strokeWidth={2.5} />
            <span>AUDIT TRAIL</span>
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
            Progress Report History Log
          </h2>
          <p className="mt-0.5 text-xs font-bold text-slate-300">
            Historical sequence of field progress reports logged into system archives.
          </p>
        </div>

        {updates.length === 0 ? (
          <div className="rounded border-2 border-slate-800 bg-slate-950 px-5 py-10 text-center">
            <FileText className="mx-auto text-amber-500" size={32} strokeWidth={2.5} />
            <p className="mt-3 font-mono text-xs font-black uppercase text-white">
              No History Logs Recorded
            </p>
            <p className="mt-1 text-xs font-bold text-slate-400">
              Submitted progress entries will appear here in chronological order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <div
                key={update.id}
                className="flex flex-col justify-between gap-4 rounded border-2 border-slate-800 bg-slate-950 p-4 font-mono sm:flex-row sm:items-start"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
                    <CalendarDays size={18} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-black uppercase text-white">
                      {update.projectName || getProjectName(update.projectId)}
                    </p>

                    <p className="mt-0.5 text-[10px] font-black text-amber-400">
                      DATE: {dateLabel(update.date)}
                      {update.projectCode ? ` · SITE: ${update.projectCode}` : ""}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black">
                      <span className="rounded border border-sky-500/50 bg-sky-950 px-2 py-1 text-sky-300 uppercase">
                        ACTUAL: {percent(update.progress)}
                      </span>
                      <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 uppercase">
                        PLANNED: {percent(update.plannedProgress)}
                      </span>
                    </div>

                    {update.notes && (
                      <p className="mt-3 max-w-2xl whitespace-pre-wrap rounded bg-slate-900 p-2.5 border border-slate-800 text-xs font-bold leading-relaxed text-slate-300">
                        {update.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteUpdate(update)}
                  title="Delete progress report"
                  aria-label="Delete progress report"
                  className="self-end rounded border-2 border-slate-800 bg-slate-900 p-2 text-slate-400 transition-colors hover:border-rose-500 hover:text-rose-400 sm:self-start"
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Update Progress Modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-2xl text-white">
            <div className="flex items-start justify-between border-b-2 border-slate-800/80 px-5 py-4 font-mono sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                  <HardHat size={16} strokeWidth={2.5} />
                  <span>PROGRESS ENTRY LOG</span>
                </div>
                <h2 className="mt-1 text-lg font-black uppercase tracking-wider text-white">
                  Update Site Progress
                </h2>
                <p className="mt-0.5 text-xs font-bold text-slate-300">
                  Record updated physical completion figures for field monitoring.
                </p>
              </div>

              <button
                onClick={closeForm}
                aria-label="Close form"
                className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 font-mono sm:p-7">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                  CONSTRUCTION PROJECT <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                  >
                    <option value="" className="bg-slate-950 text-slate-500">[ SELECT PROJECT ]</option>
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

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    ACTUAL PROGRESS (%) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={form.progress}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    required
                    placeholder="e.g. 65"
                    className={`${inputClass} text-sky-400`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    PLANNED TARGET (%) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="plannedProgress"
                    value={form.plannedProgress}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    required
                    placeholder="e.g. 75"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    REPORT DATE <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      strokeWidth={2.5}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
                    />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    FIELD AUDIT NOTES
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1500}
                    placeholder="Describe completed structural milestones, material delays, or ongoing site activity..."
                    className={`${inputClass} min-h-24 resize-y py-3`}
                  />
                </div>
              </div>

              <div className="rounded border border-amber-500/40 bg-amber-950/40 p-3 text-[11px] font-bold leading-relaxed text-amber-300">
                <strong>ACTUAL PROGRESS</strong> represents verified physical work completed. <strong>PLANNED TARGET</strong> represents baseline expected completion.
              </div>

              <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-800/80 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded border-2 border-slate-800 bg-slate-900 px-5 py-2.5 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-2.5 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>COMMIT PROGRESS REPORT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;