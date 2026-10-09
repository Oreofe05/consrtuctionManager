import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  UserRound,
  Wallet,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CircleDollarSign,
  ClipboardList,
  Package,
  Activity,
  Building2,
  CalendarCheck,
  FileText,
  ChevronRight,
  HardHat,
  TrendingUp,
  CircleHelp,
} from "lucide-react";

import { getProjectById } from "../data/projects";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "NOT SPECIFIED";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date.toUpperCase();

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

function getStatusStyles(status) {
  switch (status) {
    case "On Track":
      return {
        badge: "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
        dot: "bg-emerald-400",
        icon: CheckCircle2,
        message: "SITE PROGRESS OPERATING ACCORDING TO PLANNED TIMELINE.",
      };
    case "At Risk":
      return {
        badge: "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
        dot: "bg-amber-400",
        icon: AlertTriangle,
        message: "SITE OPERATIONS REQUIRE IMMEDIATE AUDIT AND CLOSE MONITORING.",
      };
    case "Delayed":
      return {
        badge: "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
        dot: "bg-rose-400",
        icon: AlertTriangle,
        message: "CRITICAL SCHEDULE DELAY. REVIEW OUTSTANDING SITE ACTIVITIES.",
      };
    case "Completed":
      return {
        badge: "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
        dot: "bg-sky-400",
        icon: CheckCircle2,
        message: "PROJECT HANDOVER LOGGED. SITE OPERATIONS COMPLETED.",
      };
    default:
      return {
        badge: "border-slate-700 bg-slate-950 text-slate-300",
        dot: "bg-slate-400",
        icon: Clock3,
        message: "PROJECT IN INITIAL PROVISIONING AND PLANNING STAGE.",
      };
  }
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 font-mono sm:flex-row sm:items-end border-b-2 border-slate-800/80 pb-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-wider text-amber-400">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-0.5 text-base font-black uppercase tracking-wider text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs font-bold text-slate-300">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, note, icon: Icon, badgeStyle, valueStyle = "text-white" }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{label}</p>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 ${badgeStyle}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <p className={`mt-3 break-words text-2xl font-black tracking-tight ${valueStyle}`}>
        {value}
      </p>
      {note && (
        <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">{note}</p>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 font-mono">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-400">
        <Icon size={17} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
        <p className="mt-0.5 break-words text-xs font-black text-white uppercase">
          {value || "NOT SPECIFIED"}
        </p>
      </div>
    </div>
  );
}

function ProjectDetails() {
  const { projectId } = useParams();

  const project = useMemo(() => {
    const decodedId = decodeURIComponent(projectId || "");
    return getProjectById(decodedId);
  }, [projectId]);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center font-mono">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-900 text-amber-500">
          <CircleHelp size={32} strokeWidth={2.5} />
        </div>
        <h1 className="mt-5 text-xl font-black text-white uppercase tracking-wider">
          PROJECT DOSSIER NOT FOUND
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs font-bold leading-relaxed text-slate-400 uppercase">
          This project record may have been purged from database archives, or the URL key is invalid.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 text-xs font-black uppercase text-slate-950 hover:bg-amber-400"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>RETURN TO PROJECT DIRECTORY</span>
        </Link>
      </div>
    );
  }

  const progress = Math.min(
    100,
    Math.max(0, Number(project.progress) || 0)
  );
  const budget = Number(project.budget) || 0;
  const spent = Number(project.spent) || 0;
  const remaining = budget - spent;
  const budgetUsed = budget > 0 ? (spent / budget) * 100 : 0;
  const status = getStatusStyles(project.status);
  const StatusIcon = status.icon;

  const details = [
    {
      icon: Building2,
      label: "Project classification",
      value: project.category,
    },
    {
      icon: MapPin,
      label: "Site location",
      value: project.location,
    },
    {
      icon: UserRound,
      label: "Project engineer / manager",
      value: project.manager,
    },
    {
      icon: CalendarDays,
      label: "Site commencement date",
      value: formatDate(project.startDate),
    },
    {
      icon: CalendarCheck,
      label: "Target completion date",
      value: formatDate(project.endDate),
    },
    {
      icon: HardHat,
      label: "Assigned site crew",
      value: `${project.team?.length || 0} ASSIGNED PERSONNEL`,
    },
  ];

  const milestones = [
    {
      title: "PROJECT INITIATION & MOBILIZATION",
      description: "Site setup, surveying, permits, and foundation equipment deployment.",
      done: true,
    },
    {
      title: "STRUCTURAL EXECUTION PHASE",
      description: "Substructure, reinforced concrete frame, and masonry works.",
      done: progress >= 50,
    },
    {
      title: "MEP & FINISHING PHASE",
      description: "Mechanical, electrical, plumbing installation and interior fitting.",
      done: progress >= 75,
    },
    {
      title: "FINAL AUDIT & SITE HANDOVER",
      description: "Quality inspection, snag list rectification, and project client handover.",
      done: progress >= 100,
    },
  ];

  const controlLinks = [
    {
      label: "TASKS & FIELD ACTIVITIES",
      description: "Organize and monitor site labor directives",
      icon: ClipboardList,
      href: "#tasks",
      tone: "blue",
    },
    {
      label: "PROJECT SCHEDULE & TIMELINE",
      description: "Review site dates, critical path, and milestones",
      icon: CalendarDays,
      href: "#timeline",
      tone: "purple",
    },
    {
      label: "SITE RESOURCES & INVENTORY",
      description: "Audit allocated construction materials and fleet",
      icon: Package,
      href: "#resources",
      tone: "amber",
    },
    {
      label: "PROGRESS REPORTS & LOGS",
      description: "Review physical site completion logs",
      icon: FileText,
      href: "#activity",
      tone: "green",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-white pb-12 font-mono">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-300">
          <Link to="/projects" className="text-amber-400 hover:underline">
            PROJECTS
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="max-w-[260px] truncate text-white">
            {project.name}
          </span>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          <span>RETURN TO DIRECTORY</span>
        </Link>
      </div>

      {/* Project Header Identity Dossier */}
      <section className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-1.5 bg-amber-500" />

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
            <div className="flex min-w-0 items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400 sm:flex">
                <Building2 size={28} strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-800 px-2.5 py-1 text-xs font-black text-amber-400 border border-slate-700 uppercase">
                    {project.code || project.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded border-2 px-3 py-0.5 text-xs font-black uppercase tracking-wider ${status.badge}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                    {project.status || "Planning"}
                  </span>
                </div>

                <h1 className="break-words font-mono text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {project.name}
                </h1>

                <p className="mt-3 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
                  {project.description ||
                    "Site overview, progress monitoring, budget allocation, and operational control register."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black text-slate-300">
                  <span className="inline-flex items-center gap-1.5 uppercase">
                    <MapPin size={15} className="text-amber-500" strokeWidth={2.5} />
                    {project.location || "LOCATION NOT SPECIFIED"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 uppercase">
                    <UserRound size={15} className="text-amber-500" strokeWidth={2.5} />
                    {project.manager || "MANAGER NOT ASSIGNED"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <a
                href="#overview"
                className="inline-flex items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                OVERVIEW
              </a>
              <a
                href="#budget"
                className="inline-flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-4 py-2.5 text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
              >
                <Wallet size={16} strokeWidth={2.5} />
                <span>BUDGET CONTROL</span>
              </a>
            </div>
          </div>

          {/* Project Health Alert */}
          <div className="mt-6 flex items-start gap-3 rounded border-2 border-slate-800 bg-slate-950 p-4">
            <div className={`mt-0.5 rounded border p-1.5 ${status.badge}`}>
              <StatusIcon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                PROJECT STATUS: {project.status || "PLANNING"}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-300 uppercase leading-snug">
                {status.message}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary KPI Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Physical Completion"
          value={`${progress}%`}
          note="VERIFIED FIELD MILESTONES"
          icon={Activity}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
          valueStyle="text-sky-400"
        />
        <MetricCard
          label="Allocated Budget"
          value={formatCurrency(budget)}
          note="APPROVED CAPITAL ALLOCATION"
          icon={Wallet}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
        />
        <MetricCard
          label="Recorded Expenditure"
          value={formatCurrency(spent)}
          note={`${budgetUsed.toFixed(1)}% OF CAPITAL ALLOCATION`}
          icon={CircleDollarSign}
          badgeStyle="border-amber-500/50 text-amber-400 bg-slate-950"
          valueStyle="text-amber-400"
        />
        <MetricCard
          label="Remaining Allocation"
          value={formatCurrency(remaining)}
          note={
            remaining < 0
              ? "EXPENDITURE EXCEEDS APPROVED BUDGET"
              : "AVAILABLE UNCOMMITTED ALLOCATION"
          }
          icon={TrendingUp}
          badgeStyle={
            remaining < 0
              ? "border-rose-500/50 text-rose-400 bg-slate-950"
              : "border-emerald-500/50 text-emerald-400 bg-slate-950"
          }
          valueStyle={remaining < 0 ? "text-rose-400" : "text-emerald-400"}
        />
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Project Overview Section */}
          <section
            id="overview"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="DOSSIER INFORMATION"
              title="Project Specifications"
              description="Core operational and managerial metadata assigned to this site."
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {details.map((item) => (
                <InfoItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            {project.description && (
              <div className="mt-7 border-t-2 border-slate-800/80 pt-5">
                <p className="text-xs font-black uppercase text-amber-400">
                  PROJECT SCOPE & OBJECTIVE
                </p>
                <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300 uppercase">
                  {project.description}
                </p>
              </div>
            )}
          </section>

          {/* Progress Monitoring Gauge */}
          <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
            <SectionHeading
              eyebrow="DELIVERY MONITORING"
              title="Physical Progress Tracking"
              description="Track field completion percentage against overall site scope."
            />

            <div className="rounded border-2 border-slate-800 bg-slate-950 p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    CURRENT PHYSICAL COMPLETION
                  </p>
                  <p className="mt-0.5 text-3xl font-black text-sky-400">
                    {progress}%
                  </p>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  {100 - progress}% OUTSTANDING SCOPE
                </p>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-xs bg-slate-900 border border-slate-800"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    project.status === "Delayed"
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      : project.status === "At Risk"
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>0% · SITE MOBILIZATION</span>
                <span>100% · HANDOVER READY</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-3.5">
                <p className="text-[10px] font-black text-slate-400 uppercase">PROJECT STATUS</p>
                <p className="mt-1 text-xs font-black text-amber-400 uppercase">
                  {project.status || "PLANNING"}
                </p>
              </div>
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-3.5">
                <p className="text-[10px] font-black text-slate-400 uppercase">COMMENCEMENT</p>
                <p className="mt-1 text-xs font-black text-white">
                  {formatDate(project.startDate)}
                </p>
              </div>
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-3.5">
                <p className="text-[10px] font-black text-slate-400 uppercase">TARGET COMPLETION</p>
                <p className="mt-1 text-xs font-black text-white">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>
          </section>

          {/* Schedule Timeline Section */}
          <section
            id="timeline"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="CRITICAL PATH"
              title="Project Timeline & Milestones"
              description="Sequential summary of construction phases and completion markers."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={16} strokeWidth={2.5} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase">COMMENCEMENT DATE</span>
                </div>
                <p className="mt-1.5 text-base font-black text-white">
                  {formatDate(project.startDate)}
                </p>
              </div>

              <div className="rounded border-2 border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarCheck size={16} strokeWidth={2.5} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase">TARGET COMPLETION</span>
                </div>
                <p className="mt-1.5 text-base font-black text-white">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                INDICATIVE SITE PHASES
              </h3>
              <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase">
                Phases are calculated based on reported overall site physical progress.
              </p>

              <div className="mt-5 space-y-5">
                {milestones.map((milestone, index) => (
                  <div key={milestone.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 ${
                          milestone.done
                            ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                            : "border-slate-800 bg-slate-950 text-slate-500"
                        }`}
                      >
                        {milestone.done ? (
                          <CheckCircle2 size={16} strokeWidth={2.5} />
                        ) : (
                          <Clock3 size={15} strokeWidth={2.5} />
                        )}
                      </div>
                      {index !== milestones.length - 1 && (
                        <div className="mt-2 min-h-5 w-0.5 flex-1 bg-slate-800" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-black uppercase text-white">
                          {milestone.title}
                        </p>
                        <span
                          className={`rounded border-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            milestone.done
                              ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                              : "border-slate-800 bg-slate-950 text-slate-400"
                          }`}
                        >
                          {milestone.done ? "REACHED" : "PENDING"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Budget Control Section */}
          <section
            id="budget"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="FINANCIAL AUDIT"
              title="Budget Control & Allocations"
              description="Audit project capital allocations against recorded site expenditure logs."
            />

            <div className="rounded border-2 border-slate-800 bg-slate-950 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    APPROVED PROJECT BUDGET
                  </p>
                  <p className="mt-1 break-words text-2xl font-black text-white sm:text-3xl">
                    {formatCurrency(budget)}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
                  <Wallet size={20} strokeWidth={2.5} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t-2 border-slate-800/80 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    RECORDED EXPENDITURE
                  </p>
                  <p className="mt-0.5 break-words text-base font-black text-emerald-400">
                    {formatCurrency(spent)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    REMAINING ALLOCATION
                  </p>
                  <p className="mt-0.5 break-words text-base font-black text-amber-400">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black text-slate-300 uppercase">
                  BUDGET UTILIZATION RATIO
                </p>
                <p className="text-xs font-black text-amber-400">
                  {budgetUsed.toFixed(1)}%
                </p>
              </div>

              <div
                className="mt-2.5 h-3 overflow-hidden rounded-xs bg-slate-950 border border-slate-800"
                role="progressbar"
                aria-valuenow={Math.min(100, Math.max(0, budgetUsed))}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    budgetUsed > 100
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      : budgetUsed >= 85
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, budgetUsed))}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-400 uppercase">
                UTILIZATION RATIO REFLECTS COMMITTED FIELD EXPENSES DIVIDED BY APPROVED BUDGET CAPITAL.
              </p>
            </div>
          </section>

          {/* Tasks Module Placeholder */}
          <section
            id="tasks"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="WORK DISPATCH"
              title="Tasks & Field Activities"
              description="Module for assigning individual site tasks, crew leaders, and completion targets."
            />

            <div className="flex flex-col items-start gap-3 rounded border-2 border-dashed border-slate-800 bg-slate-950 p-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
                <ClipboardList size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white">
                  TASK MANAGEMENT MODULE READY
                </p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                  Tasks are linked dynamically to this project dossier via the site activity register.
                </p>
              </div>
            </div>
          </section>

          {/* Resources Module Placeholder */}
          <section
            id="resources"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="FLEET & MATERIALS"
              title="Project Resources & Stock"
              description="Resource manifest for tracking allocated cement, steel, heavy equipment, and consumables."
            />

            <div className="flex items-start gap-3 rounded border-2 border-dashed border-slate-800 bg-slate-950 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white">
                  RESOURCE MANIFEST CONFIGURED
                </p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                  Equipment and material records are filtered by target site project code.
                </p>
              </div>
            </div>
          </section>

          {/* Progress Activity History Placeholder */}
          <section
            id="activity"
            className="scroll-mt-24 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <SectionHeading
              eyebrow="AUDIT ARCHIVE"
              title="Progress Reports & Activity Logs"
              description="Historical record of progress updates, budget re-allocations, and engineering notes."
            />

            <div className="flex items-start gap-3 rounded border-2 border-dashed border-slate-800 bg-slate-950 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white">
                  AUDIT LOG ARCHIVE ACTIVE
                </p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                  Historical site progress updates and field reports appear in the project history timeline.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Right Sidebar Controls */}
        <aside className="space-y-6 xl:sticky xl:top-24">
          {/* Quick Navigation Control Box */}
          <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400">
              PROJECT CONTROL TERMINAL
            </h2>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
              Navigate quickly to primary management modules.
            </p>

            <div className="mt-4 space-y-2">
              {controlLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded border-2 border-slate-800 bg-slate-950 p-2.5 transition-colors hover:border-amber-500 hover:bg-slate-900"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-900 text-amber-400">
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase text-white">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase truncate">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2.5}
                      className="shrink-0 text-slate-500"
                    />
                  </a>
                );
              })}
            </div>
          </section>

          {/* Project Assigned Team Panel */}
          <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
            <div className="flex items-center justify-between gap-3 border-b-2 border-slate-800/80 pb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-400">
                PROJECT CREW & STAFF
              </h2>
              <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase">
                {project.team?.length || 0} MEMBERS
              </span>
            </div>

            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">
              Personnel identifiers currently assigned to site operations.
            </p>

            {project.team?.length > 0 ? (
              <div className="mt-4 space-y-2.5">
                {project.team.map((member, index) => (
                  <div
                    key={`${member}-${index}`}
                    className="flex items-center gap-3 rounded border border-slate-800 bg-slate-950 p-2"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-900 text-xs font-black text-amber-400 uppercase">
                      {member.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase">
                        {member}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                        FIELD ASSIGNED STAFF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded border border-slate-800 bg-slate-950 p-3 text-center text-xs font-bold text-slate-400 uppercase">
                NO SITE CREW MEMBERS ASSIGNED YET.
              </div>
            )}
          </section>

          {/* Schedule Summary Box */}
          <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b-2 border-slate-800/80 pb-3">
              SCHEDULE SUMMARY
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-950 text-amber-400">
                  <CalendarDays size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">COMMENCEMENT</p>
                  <p className="mt-0.5 text-xs font-black text-white">
                    {formatDate(project.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-950 text-amber-400">
                  <CalendarCheck size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">TARGET COMPLETION</p>
                  <p className="mt-0.5 text-xs font-black text-white">
                    {formatDate(project.endDate)}
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#timeline"
              className="mt-4 flex items-center justify-between border-t-2 border-slate-800/80 pt-3 text-xs font-black uppercase text-amber-400 hover:underline"
            >
              <span>VIEW SITE TIMELINE</span>
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </a>
          </section>

          {/* Back Navigation Button */}
          <Link
            to="/projects"
            className="flex items-center justify-center gap-2 rounded border-2 border-slate-800 bg-slate-900 px-4 py-3 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>RETURN TO PROJECT DIRECTORY</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default ProjectDetails;