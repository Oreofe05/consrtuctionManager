import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  FileText,
  FolderKanban,
  Wallet,
  CheckSquare,
  TrendingUp,
  Search,
  RotateCcw,
  FileSpreadsheet,
  ChevronDown,
  Activity,
  HardHat,
} from "lucide-react";

import { getProjects } from "../data/projects";
import { getTasks } from "../data/tasks";
import { getExpenditures } from "../data/expenditures";
import { getProgressUpdates } from "../data/progress";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}`.slice(0, 10) + "T00:00:00");

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
};

const getProjectName = (projectId, projects) =>
  projects.find((project) => project.id === projectId)?.name ||
  "UNASSIGNED PROJECT";

const escapeCSV = (value) => {
  let text = String(value ?? "");

  // Reduce the risk of spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800";

const reportTypes = [
  { value: "projects", label: "Project Summary", icon: FolderKanban },
  { value: "expenditure", label: "Expenditure", icon: Wallet },
  { value: "tasks", label: "Tasks & Activities", icon: CheckSquare },
  { value: "progress", label: "Progress Reports", icon: TrendingUp },
];

function SummaryCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{title}</p>
          <h3 className="mt-3 break-words text-2xl font-black tracking-tight text-white">
            {value}
          </h3>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">{subtitle}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "Unknown").toLowerCase();

  let classes = "border-slate-700 bg-slate-950 text-slate-300";

  if (
    ["completed", "paid", "approved", "on track", "done"].includes(
      normalized
    )
  ) {
    classes = "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
  } else if (
    ["at risk", "pending", "in progress"].includes(normalized)
  ) {
    classes = "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
  } else if (
    ["delayed", "rejected", "overdue", "blocked"].includes(normalized)
  ) {
    classes = "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${classes}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

function Reports() {
  const [projects] = useState(() => getProjects());
  const [tasks] = useState(() => getTasks());
  const [expenditures] = useState(() => getExpenditures());
  const [progressUpdates] = useState(() => getProgressUpdates());

  const [reportType, setReportType] = useState("projects");
  const [projectFilter, setProjectFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedReport = reportTypes.find(
    (report) => report.value === reportType
  );

  const reportData = useMemo(() => {
    const inDateRange = (date) => {
      if (!date) {
        return !startDate && !endDate;
      }

      const normalizedDate = String(date).slice(0, 10);

      if (startDate && normalizedDate < startDate) return false;
      if (endDate && normalizedDate > endDate) return false;

      return true;
    };

    const matchesProject = (projectId) =>
      projectFilter === "all" || projectId === projectFilter;

    const matchesSearch = (values) =>
      values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );

    if (reportType === "projects") {
      return {
        columns: [
          { key: "code", label: "Project Code" },
          { key: "name", label: "Project Name" },
          { key: "category", label: "Category" },
          { key: "manager", label: "Project Manager" },
          { key: "budget", label: "Budget" },
          { key: "recordedExpenditure", label: "Recorded Expenditure" },
          { key: "progress", label: "Progress (%)" },
          { key: "status", label: "Status" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
        ],
        rows: projects
          .filter((project) => matchesProject(project.id))
          .filter((project) =>
            matchesSearch([
              project.name,
              project.code,
              project.manager,
              project.category,
            ])
          )
          .map((project) => {
            const recordedExpenditure = expenditures
              .filter(
                (item) =>
                  item.projectId === project.id &&
                  item.status !== "Rejected"
              )
              .reduce((total, item) => total + Number(item.amount || 0), 0);

            return {
              id: project.id,
              code: project.code,
              name: project.name,
              category: project.category,
              manager: project.manager,
              budget: Number(project.budget || 0),
              recordedExpenditure,
              progress: Number(project.progress || 0),
              status: project.status,
              startDate: project.startDate,
              endDate: project.endDate,
            };
          }),
      };
    }

    if (reportType === "expenditure") {
      return {
        columns: [
          { key: "description", label: "Description" },
          { key: "projectName", label: "Project" },
          { key: "category", label: "Category" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Date" },
          { key: "payee", label: "Payee / Supplier" },
          { key: "status", label: "Status" },
        ],
        rows: expenditures
          .filter((item) => matchesProject(item.projectId))
          .filter((item) => inDateRange(item.date))
          .filter((item) =>
            matchesSearch([
              item.description,
              item.category,
              item.payee,
              item.status,
              getProjectName(item.projectId, projects),
            ])
          )
          .map((item) => ({
            ...item,
            projectName: getProjectName(item.projectId, projects),
            amount: Number(item.amount || 0),
          })),
      };
    }

    if (reportType === "tasks") {
      return {
        columns: [
          { key: "title", label: "Task" },
          { key: "projectName", label: "Project" },
          { key: "assignee", label: "Assigned To" },
          { key: "priority", label: "Priority" },
          { key: "dueDate", label: "Due Date" },
          { key: "status", label: "Status" },
        ],
        rows: tasks
          .filter((task) => matchesProject(task.projectId))
          .filter((task) => inDateRange(task.dueDate))
          .filter((task) =>
            matchesSearch([
              task.title,
              task.assignee,
              task.priority,
              task.status,
              getProjectName(task.projectId, projects),
            ])
          )
          .map((task) => ({
            ...task,
            projectName: getProjectName(task.projectId, projects),
          })),
      };
    }

    return {
      columns: [
        { key: "projectName", label: "Project" },
        { key: "date", label: "Report Date" },
        { key: "progress", label: "Actual Progress (%)" },
        { key: "plannedProgress", label: "Planned Progress (%)" },
        { key: "variance", label: "Variance (%)" },
        { key: "notes", label: "Notes" },
      ],
      rows: progressUpdates
        .filter((update) => matchesProject(update.projectId))
        .filter((update) => inDateRange(update.date))
        .filter((update) =>
          matchesSearch([
            update.notes,
            getProjectName(update.projectId, projects),
          ])
        )
        .map((update) => ({
          ...update,
          projectName: getProjectName(update.projectId, projects),
          progress: Number(update.progress || 0),
          plannedProgress: Number(update.plannedProgress || 0),
          variance:
            Number(update.progress || 0) -
            Number(update.plannedProgress || 0),
        })),
    };
  }, [
    reportType,
    projectFilter,
    startDate,
    endDate,
    searchTerm,
    projects,
    tasks,
    expenditures,
    progressUpdates,
  ]);

  const summary = useMemo(() => {
    const rows = reportData.rows;

    if (reportType === "projects") {
      return [
        {
          title: "Projects Listed",
          value: rows.length,
          subtitle: "MATCHING CURRENT FILTERS",
          icon: FolderKanban,
        },
        {
          title: "Total Budget",
          value: formatCurrency(
            rows.reduce((sum, row) => sum + row.budget, 0)
          ),
          subtitle: "BUDGET FOR LISTED PROJECTS",
          icon: Wallet,
        },
        {
          title: "Recorded Expenditure",
          value: formatCurrency(
            rows.reduce((sum, row) => sum + row.recordedExpenditure, 0)
          ),
          subtitle: "NON-REJECTED EXPENDITURE",
          icon: BarChart3,
        },
        {
          title: "Average Progress",
          value: rows.length
            ? `${Math.round(
                rows.reduce((sum, row) => sum + row.progress, 0) /
                  rows.length
              )}%`
            : "0%",
          subtitle: "ACROSS LISTED PROJECTS",
          icon: TrendingUp,
        },
      ];
    }

    if (reportType === "expenditure") {
      const approvedOrPaid = rows.filter((row) =>
        ["approved", "paid"].includes(
          String(row.status).toLowerCase()
        )
      );

      return [
        {
          title: "Entries",
          value: rows.length,
          subtitle: "EXPENDITURE RECORDS",
          icon: FileText,
        },
        {
          title: "Total Recorded",
          value: formatCurrency(
            rows.reduce((sum, row) => sum + row.amount, 0)
          ),
          subtitle: "ALL LISTED STATUSES",
          icon: Wallet,
        },
        {
          title: "Approved / Paid",
          value: formatCurrency(
            approvedOrPaid.reduce((sum, row) => sum + row.amount, 0)
          ),
          subtitle: "APPROVED & PAID ENTRIES",
          icon: CheckSquare,
        },
        {
          title: "Pending",
          value: rows.filter(
            (row) => String(row.status).toLowerCase() === "pending"
          ).length,
          subtitle: "AWAITING AUDIT DECISION",
          icon: BarChart3,
        },
      ];
    }

    if (reportType === "tasks") {
      return [
        {
          title: "Tasks Listed",
          value: rows.length,
          subtitle: "MATCHING CURRENT FILTERS",
          icon: CheckSquare,
        },
        {
          title: "Completed",
          value: rows.filter(
            (row) => String(row.status).toLowerCase() === "completed"
          ).length,
          subtitle: "MARKED AS COMPLETED",
          icon: FolderKanban,
        },
        {
          title: "In Progress",
          value: rows.filter(
            (row) => String(row.status).toLowerCase() === "in progress"
          ).length,
          subtitle: "ACTIVE WORK DIRECTIVES",
          icon: TrendingUp,
        },
        {
          title: "Overdue",
          value: rows.filter(
            (row) =>
              row.dueDate &&
              row.dueDate < new Date().toISOString().slice(0, 10) &&
              !["completed", "done"].includes(
                String(row.status).toLowerCase()
              )
          ).length,
          subtitle: "PAST TARGET COMPLETION",
          icon: BarChart3,
        },
      ];
    }

    return [
      {
        title: "Reports Listed",
        value: rows.length,
        subtitle: "MATCHING PROGRESS RECORDS",
        icon: FileText,
      },
      {
        title: "Average Actual",
        value: rows.length
          ? `${Math.round(
              rows.reduce((sum, row) => sum + row.progress, 0) /
                rows.length
            )}%`
          : "0%",
        subtitle: "AVERAGE REPORTED PROGRESS",
        icon: TrendingUp,
      },
      {
        title: "Average Planned",
        value: rows.length
          ? `${Math.round(
              rows.reduce((sum, row) => sum + row.plannedProgress, 0) /
                rows.length
            )}%`
          : "0%",
        subtitle: "AVERAGE PLANNED TARGET",
        icon: BarChart3,
      },
      {
        title: "Ahead of Plan",
        value: rows.filter((row) => row.variance > 0).length,
        subtitle: "REPORTS ABOVE PLANNED TARGET",
        icon: CheckSquare,
      },
    ];
  }, [reportData, reportType]);

  const displayValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "—";

    if (["budget", "recordedExpenditure", "amount"].includes(key)) {
      return formatCurrency(value);
    }

    if (["startDate", "endDate", "date", "dueDate"].includes(key)) {
      return formatDate(value);
    }

    if (["progress", "plannedProgress"].includes(key)) {
      return `${value}%`;
    }

    if (key === "variance") {
      const number = Number(value);
      return `${number > 0 ? "+" : ""}${number}%`;
    }

    return String(value).toUpperCase();
  };

  const exportCSV = () => {
    if (!reportData.rows.length) return;

    const header = reportData.columns.map((column) =>
      escapeCSV(column.label)
    );

    const body = reportData.rows.map((row) =>
      reportData.columns
        .map((column) => escapeCSV(row[column.key]))
        .join(",")
    );

    const csvContent = [
      header.join(","),
      ...body,
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `buildcontrol-${reportType}-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setProjectFilter("all");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12 font-mono">
      {/* Page Heading & CSV Trigger */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <BarChart3 size={15} strokeWidth={2.5} /> AUDIT ARCHIVE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">REPORTS & ANALYTICS</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Reports & Operational Analytics
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
            Compile operational performance dossiers, expenditure logs, task completions, and capital progress audits across construction sites.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={!reportData.rows.length}
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} strokeWidth={2.5} />
          <span>EXPORT CSV DOSSIER</span>
        </button>
      </div>

      {/* Report Type Selection Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const active = reportType === report.value;

          return (
            <button
              key={report.value}
              type="button"
              onClick={() => setReportType(report.value)}
              className={`flex items-center gap-3 rounded-md border-2 p-4 text-left transition-all ${
                active
                  ? "border-amber-400 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 ${
                  active
                    ? "border-amber-400 bg-amber-500 text-slate-950"
                    : "border-slate-800 bg-slate-900 text-amber-400"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>

              <div>
                <p
                  className={`text-xs font-black uppercase tracking-wider ${
                    active ? "text-amber-400" : "text-white"
                  }`}
                >
                  {report.label}
                </p>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                  {report.value === "projects" && "BUDGET & SITE STATUS"}
                  {report.value === "expenditure" && "COSTS & PAYABLE LOGS"}
                  {report.value === "tasks" && "DIRECTIVES & DUE DATES"}
                  {report.value === "progress" && "PLANNED VS ACTUAL TARGETS"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </div>

      {/* Report Filter Panel */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={16} strokeWidth={2.5} />
              <span>PARAMETER FILTERS</span>
            </div>
            <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
              Filter Audit Parameters
            </h2>
            <p className="mt-0.5 text-xs font-bold text-slate-300">
              Narrow query boundaries prior to compiling CSV export.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            <RotateCcw size={14} strokeWidth={2.5} className="text-amber-500" />
            <span>RESET FILTERS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              TARGET SITE PROJECT
            </label>
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="all" className="bg-slate-950 text-white font-black">[ ALL PROJECTS ]</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id} className="bg-slate-950 text-white font-black">
                    {project.code ? `${project.code} — ` : ""}{project.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              FROM DATE
            </label>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              disabled={reportType === "projects"}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              TO DATE
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              disabled={reportType === "projects"}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              SEARCH RECORDS
            </label>
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search report entries..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        {reportType === "tasks" && (
          <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase">
            TASK DATE FILTERS ARE EVALUATED AGAINST TASK TARGET DUE DATES.
          </p>
        )}

        {reportType === "progress" && (
          <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase">
            PROGRESS DATE FILTERS ARE EVALUATED AGAINST AUDIT REPORT ENTRY DATES.
          </p>
        )}

        {reportType === "projects" && (
          <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase">
            PROJECT DOSSIER ENTRIES ARE FILTERED BY PROJECT AND KEYWORD. DATE FILTERS ARE OMITTED.
          </p>
        )}
      </section>

      {/* Main Report Data Table */}
      <section className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="flex flex-col gap-3 border-b-2 border-slate-800/80 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
              <FileSpreadsheet size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                {selectedReport?.label}
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400">
                {reportData.rows.length} RECORD{reportData.rows.length === 1 ? "" : "S"} LOCATED IN DOSSIER
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            disabled={!reportData.rows.length}
            className="inline-flex items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={15} strokeWidth={2.5} />
            <span>DOWNLOAD CSV</span>
          </button>
        </div>

        {reportData.rows.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-500">
              <FileText size={32} strokeWidth={2.5} />
            </div>
            <h3 className="mt-4 text-sm font-black uppercase tracking-wider text-white">
              No Dossier Records Located
            </h3>
            <p className="mt-1 max-w-sm text-xs font-bold leading-relaxed text-slate-400 uppercase">
              No matching data entries satisfy active report boundaries or search query parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left font-mono text-xs">
              <thead className="bg-slate-950 text-[11px] font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800">
                <tr>
                  {reportData.columns.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-5 py-4 font-black"
                    >
                      {column.label.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
                {reportData.rows.map((row, index) => (
                  <tr
                    key={row.id || `${reportType}-${index}`}
                    className="hover:bg-slate-950/80 transition-colors"
                  >
                    {reportData.columns.map((column) => (
                      <td
                        key={column.key}
                        className="max-w-[300px] px-5 py-4 text-xs font-bold text-slate-300 uppercase"
                      >
                        {column.key === "status" ? (
                          <StatusBadge status={row[column.key]} />
                        ) : column.key === "progress" &&
                          reportType === "projects" ? (
                          <div className="min-w-[110px]">
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-sky-400">
                                {row.progress}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-xs bg-slate-950 border border-slate-800">
                              <div
                                className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, row.progress)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : column.key === "variance" ? (
                          <span
                            className={`font-black ${
                              row.variance > 0
                                ? "text-emerald-400"
                                : row.variance < 0
                                ? "text-rose-400"
                                : "text-slate-300"
                            }`}
                          >
                            {displayValue(column.key, row[column.key])}
                          </span>
                        ) : (
                          <span
                            className={
                              ["budget", "recordedExpenditure", "amount"].includes(
                                column.key
                              )
                                ? "whitespace-nowrap font-black text-emerald-400"
                                : ""
                            }
                          >
                            {displayValue(column.key, row[column.key])}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t-2 border-slate-800/80 bg-slate-950 px-5 py-3 text-[10px] font-black text-slate-400 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>BUILDCONTROL · FIELD OPERATIONS SYSTEM ARCHIVE</span>
          <span>
            GENERATED ON{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </span>
        </div>
      </section>
    </div>
  );
}

export default Reports;