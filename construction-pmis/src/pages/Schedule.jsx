import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  ClipboardList,
  ArrowRight,
  Search,
  ChevronDown,
  HardHat,
  Activity,
  ShieldAlert,
} from "lucide-react";

import { getProjects } from "../data/projects";
import { getTasks } from "../data/tasks";

function formatDate(dateString) {
  if (!dateString) return "NOT SCHEDULED";

  const date = new Date(`${dateString.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "NOT SCHEDULED";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function SummaryCard({ title, value, icon, badgeStyle, valueStyle = "text-white" }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-center gap-3.5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${badgeStyle}`}>
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

function Schedule() {
  const projects = getProjects();
  const tasks = getTasks();

  const [view, setView] = useState("All");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All");

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const scheduleItems = useMemo(() => {
    const projectItems = projects.map((project) => ({
      id: `project-${project.id || project.code}`,
      type: "Project",
      title: project.name,
      reference: project.code,
      startDate: project.startDate,
      dueDate: project.endDate,
      status: project.status || "Planning",
      progress: Number(project.progress) || 0,
      responsible: project.manager || "NOT ASSIGNED",
      projectId: project.id || project.code,
    }));

    const taskItems = tasks.map((task) => ({
      id: `task-${task.id}`,
      type: "Task",
      title: task.title,
      reference: task.projectCode || "",
      startDate: task.createdAt?.slice(0, 10) || "",
      dueDate: task.dueDate,
      status: task.status || "Pending",
      progress: task.status === "Completed" ? 100 : 0,
      responsible: task.assignee || "NOT ASSIGNED",
      projectId: task.projectId,
      taskId: task.id,
    }));

    return [...projectItems, ...taskItems].sort((a, b) => {
      const dateA = a.dueDate || "9999-12-31";
      const dateB = b.dueDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
  }, [projects, tasks]);

  function getScheduleState(item) {
    if (item.type === "Project" && item.status === "Completed") {
      return "Completed";
    }

    if (item.type === "Task" && item.status === "Completed") {
      return "Completed";
    }

    if (item.dueDate && item.dueDate < todayString) {
      return "Overdue";
    }

    if (item.dueDate && item.dueDate === todayString) {
      return "Due Today";
    }

    if (item.type === "Task" && item.status === "In Progress") {
      return "In Progress";
    }

    return "Upcoming";
  }

  const filteredItems = scheduleItems.filter((item) => {
    const matchesView = view === "All" || item.type === view;

    const matchesSearch = [
      item.title,
      item.reference,
      item.responsible,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const state = getScheduleState(item);

    const matchesPeriod =
      period === "All" ||
      (period === "Overdue" && state === "Overdue") ||
      (period === "Upcoming" &&
        item.dueDate >= todayString &&
        state !== "Completed") ||
      (period === "Completed" && state === "Completed");

    return matchesView && matchesSearch && matchesPeriod;
  });

  const overdueCount = scheduleItems.filter(
    (item) => getScheduleState(item) === "Overdue"
  ).length;

  const upcomingCount = scheduleItems.filter(
    (item) =>
      item.dueDate >= todayString &&
      getScheduleState(item) !== "Completed"
  ).length;

  const completedCount = scheduleItems.filter(
    (item) => getScheduleState(item) === "Completed"
  ).length;

  const projectCount = projects.length;
  const taskCount = tasks.length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <CalendarDays size={15} strokeWidth={2.5} /> FIELD SCHEDULE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">CRITICAL PATH MONITORING</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Schedule & Critical Path Control
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
            Monitor site construction timelines, trade deadlines, critical milestone target dates, and assigned labor directives.
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
        >
          <CalendarDays size={18} strokeWidth={2.5} />
          <span>SCHEDULE FIELD TASK</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Scheduled Items"
          value={scheduleItems.length}
          icon={<CalendarDays size={20} strokeWidth={2.5} />}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
          valueStyle="text-sky-400"
        />

        <SummaryCard
          title="Upcoming Deadlines"
          value={upcomingCount}
          icon={<Clock3 size={20} strokeWidth={2.5} />}
          badgeStyle="border-amber-500/50 text-amber-400 bg-slate-950"
          valueStyle="text-amber-400"
        />

        <SummaryCard
          title="Overdue Directives"
          value={overdueCount}
          icon={<AlertTriangle size={20} strokeWidth={2.5} />}
          badgeStyle="border-rose-500/50 text-rose-400 bg-slate-950"
          valueStyle="text-rose-400"
        />

        <SummaryCard
          title="Completed Milestones"
          value={completedCount}
          icon={<CheckCircle2 size={20} strokeWidth={2.5} />}
          badgeStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />
      </div>

      {/* Project and Task Totals */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">ACTIVE SITE DOSSIERS</p>
            <p className="mt-1 text-2xl font-black text-white">
              {projectCount}
            </p>
            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
              Tracked by commencement and target completion baselines
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
            <FolderKanban size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">ASSIGNED FIELD TASKS</p>
            <p className="mt-1 text-2xl font-black text-white">
              {taskCount}
            </p>
            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
              Tracked by field target deadlines and task status
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
            <ClipboardList size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Schedule Register */}
      <div className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="border-b-2 border-slate-800/80 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <Activity size={16} strokeWidth={2.5} />
            <span>CRITICAL PATH REGISTER</span>
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
            Site Project & Activity Timeline
          </h2>
          <p className="mt-0.5 text-xs font-bold text-slate-300">
            Audit project deadlines, field work directives, and critical path targets.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project, task, or assigned supervisor..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <select
                value={view}
                onChange={(event) => setView(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL ITEM TYPES ]</option>
                <option value="Project" className="bg-slate-950 text-white font-black">PROJECTS ONLY</option>
                <option value="Task" className="bg-slate-950 text-white font-black">TASKS ONLY</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL SCHEDULE STATES ]</option>
                <option value="Upcoming" className="bg-slate-950 text-white font-black">UPCOMING DEADLINES</option>
                <option value="Overdue" className="bg-slate-950 text-white font-black">OVERDUE DIRECTIVES</option>
                <option value="Completed" className="bg-slate-950 text-white font-black">COMPLETED MILESTONES</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-500">
              <CalendarDays size={32} strokeWidth={2.5} />
            </div>
            <h3 className="mt-4 text-sm font-black uppercase tracking-wider text-white">
              No Schedule Items Located
            </h3>
            <p className="mt-1 max-w-sm text-xs font-bold leading-relaxed text-slate-400 uppercase">
              No active tasks or project milestones satisfy current parameter queries.
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
            {filteredItems.map((item) => {
              const state = getScheduleState(item);

              const stateStyle =
                state === "Completed"
                  ? "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : state === "Overdue"
                    ? "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                    : state === "Due Today"
                      ? "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      : state === "In Progress"
                        ? "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                        : "border-slate-700 bg-slate-950 text-slate-300";

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-950/80 md:flex-row md:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-400">
                    {item.type === "Project" ? (
                      <FolderKanban size={22} strokeWidth={2.5} />
                    ) : (
                      <ClipboardList size={22} strokeWidth={2.5} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black uppercase tracking-wide text-white">
                        {item.title}
                      </h3>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-slate-700 uppercase">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-bold text-slate-400 uppercase">
                      SITE CODE: {item.reference || "UNASSIGNED"}
                      {" · "}
                      SUPERVISOR: {item.responsible}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-slate-300 uppercase">
                      <span>
                        COMMENCEMENT: {formatDate(item.startDate)}
                      </span>
                      <span
                        className={
                          state === "Overdue"
                            ? "font-black text-rose-400"
                            : ""
                        }
                      >
                        TARGET DEADLINE: {formatDate(item.dueDate)}
                      </span>
                    </div>

                    {item.type === "Project" && (
                      <div className="mt-3 max-w-sm">
                        <div className="mb-1 flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>PHYSICAL PROGRESS</span>
                          <span className="text-sky-400">{item.progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-xs bg-slate-950 border border-slate-800">
                          <div
                            className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, item.progress)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                    <span
                      className={`inline-flex whitespace-nowrap rounded border-2 px-3 py-1 text-[10px] font-black uppercase tracking-wider ${stateStyle}`}
                    >
                      {state}
                    </span>

                    <Link
                      to={
                        item.type === "Task"
                          ? `/tasks/${item.taskId}/edit`
                          : `/projects/${item.projectId}`
                      }
                      className="inline-flex items-center gap-1 text-xs font-black text-amber-400 hover:underline uppercase"
                    >
                      <span>VIEW DOSSIER</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </Link>
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

export default Schedule;