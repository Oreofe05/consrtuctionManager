import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  HardHat,
  Plus,
  Wallet,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const statCards = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: Building2,
    color: "blue",
  },
  {
    title: "Completed Projects",
    value: "27",
    change: "+4 this month",
    trend: "up",
    icon: CheckCircle2,
    color: "emerald",
  },
  {
    title: "Pending Inquiries",
    value: "18",
    change: "5 require attention",
    trend: "down",
    icon: FileText,
    color: "amber",
  },
  {
    title: "Total Spent",
    value: "₦184.6M",
    change: "Across sample projects",
    trend: "up",
    icon: Wallet,
    color: "purple",
  },
];

const projectHealth = [
  { label: "On Track", count: 7, color: "bg-emerald-400" },
  { label: "Needs Attention", count: 3, color: "bg-amber-400" },
  { label: "Delayed", count: 2, color: "bg-rose-500" },
];

const projects = [
  {
    code: "UI-ENG-001",
    name: "Faculty of Engineering Renovation",
    location: "Faculty of Engineering",
    manager: "Amina Yusuf",
    progress: 78,
    status: "On Track",
    budget: "₦48.5M",
    spent: "₦32.45M",
    color: "bg-emerald-400",
  },
  {
    code: "UI-HOS-002",
    name: "Student Accommodation Block C",
    location: "Student Residential Area",
    manager: "Emmanuel Okafor",
    progress: 54,
    status: "Needs Attention",
    budget: "₦86.2M",
    spent: "₦58.7M",
    color: "bg-amber-400",
  },
  {
    code: "UI-LIB-003",
    name: "Central Library Extension",
    location: "Kenneth Dike Library",
    manager: "Tobias Williams",
    progress: 31,
    status: "Delayed",
    budget: "₦72.8M",
    spent: "₦42.1M",
    color: "bg-rose-500",
  },
];

const deadlines = [
  {
    title: "Engineering Renovation",
    task: "Electrical installation inspection",
    date: "12 Oct 2026",
    priority: "High",
  },
  {
    title: "Accommodation Block C",
    task: "Concrete quality assessment",
    date: "14 Oct 2026",
    priority: "Medium",
  },
  {
    title: "Central Library Extension",
    task: "Submit progress report",
    date: "16 Oct 2026",
    priority: "High",
  },
];

const activities = [
  {
    title: "Project progress updated",
    detail: "Engineering Renovation · 74% → 78%",
    time: "Today, 9:15 AM",
    icon: Activity,
    color: "border-sky-500/50 text-sky-400 bg-slate-950",
  },
  {
    title: "New expense logged",
    detail: "Accommodation Block C · ₦1.25M",
    time: "Today, 8:40 AM",
    icon: Wallet,
    color: "border-emerald-500/50 text-emerald-400 bg-slate-950",
  },
  {
    title: "Upcoming deadline",
    detail: "Electrical installation inspection",
    time: "Yesterday",
    icon: CalendarDays,
    color: "border-amber-500/50 text-amber-400 bg-slate-950",
  },
];

const colorStyles = {
  blue: {
    icon: "border-sky-500/50 text-sky-400 bg-slate-950",
    accent: "border-l-sky-500",
  },
  emerald: {
    icon: "border-emerald-500/50 text-emerald-400 bg-slate-950",
    accent: "border-l-emerald-500",
  },
  amber: {
    icon: "border-amber-500/50 text-amber-400 bg-slate-950",
    accent: "border-l-amber-500",
  },
  purple: {
    icon: "border-purple-500/50 text-purple-400 bg-slate-950",
    accent: "border-l-purple-500",
  },
};

function StatCard({ item }) {
  const Icon = item.icon;
  const styles = colorStyles[item.color];

  return (
    <div
      className={`rounded-md border-2 border-slate-800 border-l-4 ${styles.accent} bg-slate-900 p-5 shadow-xl font-mono transition-all hover:border-amber-500`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            {item.title}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            {item.value}
          </h3>
          <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
            {item.change}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${styles.icon}`}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 font-mono border-b-2 border-slate-800/80 pb-3">
      <div>
        <h2 className="text-base font-black uppercase tracking-wider text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs font-bold text-slate-400 uppercase">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 transition-colors hover:underline"
        >
          <span>{action}</span>
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "On Track": "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
    "Needs Attention": "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
    Delayed: "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
    Completed: "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
  };

  return (
    <span
      className={`inline-flex rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
        styles[status] || "border-slate-700 bg-slate-950 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "Team Member";
  const firstName = userName.split(" ")[0];

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const formattedTime = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());

      setCurrentTime(formattedTime);
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date()).toUpperCase();

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 font-mono text-white px-3 sm:px-6">
      {/* Page heading */}
      <section className="relative overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded border-2 border-amber-500/50 bg-slate-950 px-3 py-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                ACTIVE WORKSPACE DASHBOARD
              </span>
            </div>

            <h1 className="break-words text-3xl font-black uppercase tracking-tight sm:text-4xl text-white">
              WELCOME BACK, <span className="text-amber-400">{firstName}</span>
            </h1>

            <p className="mt-3 text-xs font-bold leading-relaxed text-slate-300 uppercase">
              Here is a quick overview of ongoing construction projects, upcoming deadlines, and budget tracking for your team.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/projects/new")}
                className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>ADD NEW PROJECT</span>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="flex items-center justify-center gap-2 rounded border-2 border-slate-800 bg-slate-950 px-5 py-3 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                <FileText size={16} strokeWidth={2.5} />
                <span>VIEW REPORTS</span>
              </button>
            </div>
          </div>

          {/* Live clock */}
          <div className="flex flex-wrap items-center gap-4 rounded border-2 border-slate-800 bg-slate-950 p-4 shadow-xl sm:p-5 xl:min-w-[285px]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
              <Clock size={22} strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                LOCAL TIME
              </p>

              <p className="mt-1 font-mono text-xl font-black tracking-wide text-amber-400">
                {currentTime || "--:--:--"}
              </p>

              <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase">
                <span className="text-amber-400 font-black">WAT · UTC+1</span>
                <span>•</span>
                <span className="text-slate-400">{today}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section>
        <SectionHeading
          title="Overview Summary"
          subtitle="Real-time key performance indicators across your projects."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* Health and project progress */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <SectionHeading
            title="Project Status Breakdown"
            subtitle="Current health status across active sites."
          />

          <div className="space-y-5">
            {projectHealth.map((item) => {
              const total = projectHealth.reduce(
                (sum, project) => sum + project.count,
                0
              );
              const percentage = Math.round(
                (item.count / total) * 100
              );

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                      />
                      <span className="text-xs font-black uppercase text-white">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-black text-amber-400">
                      {item.count} PROJECTS
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] font-black text-slate-400 uppercase">
                    {percentage}% OF TOTAL
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded border-2 border-slate-800 bg-slate-950 p-4 shadow-inner">
            <div className="flex items-center gap-2.5 text-amber-400">
              <HardHat size={18} strokeWidth={2.5} />
              <p className="text-xs font-black uppercase tracking-wider text-white">
                Quick Reminder
              </p>
            </div>
            <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-400 uppercase">
              Please review projects marked as delayed or needing attention before approving additional expenses or resource allocations.
            </p>
          </div>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl xl:col-span-2">
          <SectionHeading
            title="Active Projects Progress"
            subtitle="Recent physical completion percentages and budget statuses."
            action="VIEW ALL PROJECTS"
            onAction={() => navigate("/projects")}
          />

          <div className="space-y-5">
            {projects.map((project) => (
              <div
                key={project.code}
                className="rounded border-2 border-slate-800 bg-slate-950 p-4 transition-colors hover:border-amber-500"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-black tracking-widest text-amber-400">
                      {project.code}
                    </p>
                    <h3 className="mt-1 font-black uppercase text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-slate-400 uppercase">
                      {project.location} · Lead: {project.manager}
                    </p>
                  </div>

                  <StatusBadge status={project.status} />
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-black uppercase text-slate-300">
                      COMPLETION RATE
                    </span>
                    <span className="font-black text-amber-400">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                    <div
                      className={`h-full rounded-full transition-all ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t-2 border-slate-800/80 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">BUDGET</p>
                    <p className="mt-0.5 font-black text-white">
                      {project.budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">SPENT SO FAR</p>
                    <p className="mt-0.5 font-black text-white">
                      {project.spent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadlines and recent activity */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <SectionHeading
            title="Upcoming Deadlines"
            subtitle="Important site inspections and scheduled milestones."
            action="VIEW SCHEDULE"
            onAction={() => navigate("/schedule")}
          />

          <div className="space-y-3">
            {deadlines.map((deadline) => (
              <div
                key={deadline.task}
                className="flex items-start gap-3.5 rounded border-2 border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-amber-500/40 bg-slate-900 text-amber-400">
                  <CalendarDays size={18} strokeWidth={2.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black uppercase text-white">
                    {deadline.task}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                    {deadline.title}
                  </p>
                  <p className="mt-2 text-[11px] font-black uppercase text-amber-400">
                    DUE: {deadline.date}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    deadline.priority === "High"
                      ? "border-rose-500 bg-rose-950 text-rose-300"
                      : "border-amber-500 bg-amber-950 text-amber-300"
                  }`}
                >
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl">
          <SectionHeading
            title="Recent Updates"
            subtitle="Latest log entries and activity feed from your team."
            action="VIEW REPORTS"
            onAction={() => navigate("/reports")}
          />

          <div className="space-y-5">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={activity.title} className="flex gap-3.5 items-start">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 ${activity.color}`}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black uppercase text-white">
                      {activity.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase">
                      {activity.detail}
                    </p>
                    <p className="mt-1 text-[10px] font-black text-amber-400 uppercase">
                      {activity.time}
                    </p>
                  </div>

                  {index === 0 && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3.5 rounded border-2 border-amber-500/40 bg-amber-950/40 p-4 shadow-inner">
            <AlertTriangle
              size={18}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-amber-400"
            />
            <div>
              <p className="text-xs font-black uppercase text-amber-300">
                Data Verification Note
              </p>
              <p className="mt-1 text-[10px] font-bold leading-relaxed text-amber-200/90 uppercase">
                Please double-check physical inspection reports with site supervisors before updating project records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly review banner */}
      <section className="flex flex-col justify-between gap-4 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
            <Activity size={20} strokeWidth={2.5} />
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-white">
              Weekly Progress Review
            </h2>
            <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
              Check overall milestone progress, staff assignments, and expenditure reports for the week.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="flex items-center justify-center gap-2 rounded border-2 border-slate-800 bg-slate-950 px-5 py-2.5 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400 shrink-0"
        >
          <span>OPEN REPORTS</span>
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </section>

      <p className="text-center text-[10px] font-black uppercase tracking-wider text-slate-500 leading-relaxed">
        BUILDCONTROL · UNIVERSITY OF IBADAN CONSTRUCTION PROJECT MANAGEMENT PROTOTYPE
        <br />
        DASHBOARD METRICS AND LOG RECORDS ARE DEMONSTRATION SAMPLE DATA.
      </p>
    </div>
  );
}

export default Dashboard;