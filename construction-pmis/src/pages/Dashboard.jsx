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
    icon: Building2,
    color: "text-sky-400 bg-sky-500/10",
  },
  {
    title: "Completed Projects",
    value: "27",
    change: "+4 this month",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Pending Items",
    value: "18",
    change: "5 need attention",
    icon: FileText,
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    title: "Total Spent",
    value: "₦184.6M",
    change: "Across projects",
    icon: Wallet,
    color: "text-purple-400 bg-purple-500/10",
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
    barColor: "bg-emerald-400",
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
    barColor: "bg-amber-400",
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
    barColor: "bg-rose-500",
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
    color: "text-sky-400 bg-sky-500/10",
  },
  {
    title: "New expense logged",
    detail: "Accommodation Block C · ₦1.25M",
    time: "Today, 8:40 AM",
    icon: Wallet,
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Upcoming deadline",
    detail: "Electrical installation inspection",
    time: "Yesterday",
    icon: CalendarDays,
    color: "text-amber-400 bg-amber-500/10",
  },
];

function StatusBadge({ status }) {
  const styles = {
    "On Track": "bg-emerald-500/15 text-emerald-400",
    "Needs Attention": "bg-amber-500/15 text-amber-400",
    Delayed: "bg-rose-500/15 text-rose-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 transition hover:text-amber-300"
        >
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.name || "Team Member").split(" ")[0];
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("en-NG", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date())
      );
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
  }).format(new Date());

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-10">
      {/* Welcome */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div className="max-w-2xl">
            <p className="text-sm text-amber-400">Welcome back</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Overview of ongoing construction projects, deadlines, and budget
              tracking for University of Ibadan.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/projects/new")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-400"
              >
                <Plus size={16} />
                Add Project
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                <FileText size={16} />
                View Reports
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Local time (WAT)</p>
              <p className="text-lg font-semibold text-white">
                {currentTime || "--:--:--"}
              </p>
              <p className="text-xs text-slate-500">{today}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <SectionHeading
          title="Overview"
          subtitle="Key metrics across your projects"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.change}</p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Health + Projects */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <SectionHeading
            title="Project Status"
            subtitle="Health across active sites"
          />
          <div className="space-y-5">
            {projectHealth.map((item) => {
              const total = projectHealth.reduce((s, p) => s + p.count, 0);
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {item.count} projects
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-amber-400">
              <HardHat size={16} />
              <p className="text-sm font-medium text-white">Quick reminder</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Review delayed projects before approving extra expenses or
              resources.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 xl:col-span-2">
          <SectionHeading
            title="Active Projects"
            subtitle="Progress and budget status"
            action="View all"
            onAction={() => navigate("/projects")}
          />
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.code}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs text-amber-400">{project.code}</p>
                    <h3 className="mt-0.5 font-medium text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.location} · {project.manager}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-500">Completion</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${project.barColor}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-3 text-sm">
                  <div>
                    <p className="text-slate-500">Budget</p>
                    <p className="font-medium text-white">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Spent</p>
                    <p className="font-medium text-white">{project.spent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadlines + Activity */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <SectionHeading
            title="Upcoming Deadlines"
            subtitle="Inspections and milestones"
            action="View schedule"
            onAction={() => navigate("/schedule")}
          />
          <div className="space-y-3">
            {deadlines.map((deadline) => (
              <div
                key={deadline.task}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <CalendarDays size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white">
                    {deadline.task}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {deadline.title}
                  </p>
                  <p className="mt-1.5 text-xs text-amber-400">
                    Due: {deadline.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    deadline.priority === "High"
                      ? "bg-rose-500/15 text-rose-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}
                >
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
          <SectionHeading
            title="Recent Updates"
            subtitle="Latest activity from your team"
            action="View reports"
            onAction={() => navigate("/reports")}
          />
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.title} className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      {activity.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {activity.detail}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-300">
                Data verification
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Confirm inspection reports with site supervisors before updating
                records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly review */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">
              Weekly Progress Review
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Check milestones, assignments, and expenditure for the week.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/reports")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-amber-500/40 hover:text-amber-400"
        >
          Open Reports
          <ArrowRight size={15} />
        </button>
      </section>
    </div>
  );
}

export default Dashboard;