import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Receipt,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  HardHat,
  CalendarDays,
  Banknote,
  Filter,
  TrendingUp,
  ShieldAlert,
  ChevronDown,
  Activity,
} from "lucide-react";

import { getProjects } from "../data/projects";
import {
  getExpenditures,
  addExpenditure,
  updateExpenditure,
  deleteExpenditure,
} from "../data/expenditures";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const categories = [
  "Materials",
  "Labour",
  "Equipment",
  "Transportation",
  "Professional Fees",
  "Permits & Approvals",
  "Utilities",
  "Maintenance",
  "Other",
];

const paymentMethods = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Card",
  "Other",
];

const statuses = ["Pending", "Approved", "Paid", "Rejected"];

// Pure Tailwind input styling string
const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

const initialForm = {
  description: "",
  projectId: "",
  category: "Materials",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  payee: "",
  paymentMethod: "Bank Transfer",
  status: "Pending",
  notes: "",
};

function StatusBadge({ status }) {
  const styles = {
    Paid: "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
    Approved: "border-sky-500 bg-sky-950 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
    Pending: "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
    Rejected: "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
        styles[status] || "border-slate-700 bg-slate-950 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

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

function Expenditure() {
  const [projects] = useState(() => getProjects());
  const [expenditures, setExpenditures] = useState(() =>
    getExpenditures()
  );

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const projectLookup = useMemo(() => {
    const lookup = {};

    projects.forEach((project) => {
      lookup[project.id] = project;
      lookup[project.code] = project;
    });

    return lookup;
  }, [projects]);

  const getProjectName = (projectId) => {
    const project = projectLookup[projectId];
    return project?.name || "Unknown project";
  };

  const totals = useMemo(() => {
    const total = expenditures.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const approved = expenditures
      .filter((item) => ["Approved", "Paid"].includes(item.status))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const pending = expenditures
      .filter((item) => item.status === "Pending")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const paid = expenditures
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      total,
      approved,
      pending,
      paid,
      count: expenditures.length,
    };
  }, [expenditures]);

  const filteredExpenditures = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expenditures.filter((item) => {
      const matchesSearch =
        !query ||
        item.description?.toLowerCase().includes(query) ||
        item.payee?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        getProjectName(item.projectId).toLowerCase().includes(query);

      const matchesProject =
        projectFilter === "All" ||
        String(item.projectId) === projectFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    expenditures,
    search,
    projectFilter,
    categoryFilter,
    statusFilter,
    projectLookup,
  ]);

  const openCreateForm = () => {
    setForm({
      ...initialForm,
      projectId: projects[0]
        ? String(projects[0].id || projects[0].code)
        : "",
    });
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (item) => {
    setForm({
      description: item.description || "",
      projectId: String(item.projectId || ""),
      category: item.category || "Materials",
      amount: String(item.amount ?? ""),
      date: item.date || "",
      payee: item.payee || "",
      paymentMethod: item.paymentMethod || "Bank Transfer",
      status: item.status || "Pending",
      notes: item.notes || "",
    });

    setEditingId(item.id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
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

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Please enter a valid expense amount greater than zero.");
      return;
    }

    if (!projects.length) {
      window.alert("Create a project before recording an expense.");
      return;
    }

    const selectedProject = projectLookup[form.projectId];

    if (!selectedProject) {
      window.alert("Please select a valid project.");
      return;
    }

    const expenseData = {
      ...form,
      amount,
      projectId: String(form.projectId),
      projectName: selectedProject.name,
      projectCode: selectedProject.code || "",
    };

    try {
      if (editingId) {
        updateExpenditure(editingId, expenseData);
        setExpenditures(getExpenditures());
      } else {
        addExpenditure(expenseData);
        setExpenditures(getExpenditures());
      }

      closeForm();
    } catch (error) {
      console.error("Unable to save expenditure:", error);
      window.alert("Unable to save this expense. Please try again.");
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "CONFIRM: Delete this expense record from field financial logs?"
    );

    if (!confirmed) return;

    try {
      deleteExpenditure(id);
      setExpenditures(getExpenditures());
    } catch (error) {
      console.error("Unable to delete expenditure:", error);
      window.alert("Unable to delete this expense. Please try again.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setProjectFilter("All");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12">
      {/* Page Heading & Actions */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <Wallet size={15} strokeWidth={2.5} /> PROJECT FINANCE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">EXPENDITURE LOG</span>
          </div>

          <h1 className="font-mono text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Expenditure & Cost Management
          </h1>

          <p className="mt-2 max-w-2xl font-mono text-xs font-bold text-slate-300 leading-relaxed">
            Record material disbursements, contractor payables, and monitor capital spending against project budgets.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_0_22px_rgba(245,158,11,0.5)]"
        >
          <Plus size={19} strokeWidth={2.5} />
          <span>RECORD FIELD EXPENSE</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Expenditure"
          value={currency.format(totals.total)}
          subtitle={`${totals.count} RECORDED TRANSACTION${totals.count === 1 ? "" : "S"}`}
          icon={Wallet}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
        />

        <SummaryCard
          title="Approved Expenses"
          value={currency.format(totals.approved)}
          subtitle="AUTHORIZED CAPITAL DISBURSEMENTS"
          icon={CheckCircle2}
          badgeStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />

        <SummaryCard
          title="Pending Expenses"
          value={currency.format(totals.pending)}
          subtitle="AWAITING AUDIT APPROVAL"
          icon={Clock}
          badgeStyle="border-amber-500/50 text-amber-400 bg-slate-950"
          valueStyle="text-amber-400"
        />

        <SummaryCard
          title="Amount Paid"
          value={currency.format(totals.paid)}
          subtitle="DISBURSED VENDOR PAYMENTS"
          icon={Banknote}
          badgeStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />
      </div>

      {/* Project Budget Overview Section */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6 font-mono">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={16} strokeWidth={2.5} />
              <span>CAPITAL MONITORING</span>
            </div>
            <h2 className="mt-1 text-base font-black uppercase tracking-wider text-white">
              Project Budget Overview
            </h2>
            <p className="mt-0.5 text-xs font-bold text-slate-300">
              Compare recorded site expenditure against approved financial allocations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase">
            <TrendingUp size={16} strokeWidth={2.5} />
            <span>REAL-TIME AUDIT LOG</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded border-2 border-slate-800 bg-slate-950 p-6 text-center">
            <HardHat className="mx-auto mb-3 text-amber-500" size={32} strokeWidth={2.5} />
            <p className="font-mono text-sm font-black uppercase text-white">
              No Projects Initialized
            </p>
            <p className="mt-1 text-xs font-bold text-slate-400">
              Provision a project dossier before logging field expenditure.
            </p>
            <Link
              to="/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-4 py-2 font-mono text-xs font-black uppercase text-slate-950 hover:bg-amber-400"
            >
              CREATE PROJECT
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {projects.map((project) => {
              const projectId = String(project.id || project.code);

              const spent = expenditures
                .filter(
                  (item) => String(item.projectId) === projectId
                )
                .filter((item) => item.status !== "Rejected")
                .reduce(
                  (sum, item) => sum + Number(item.amount || 0),
                  0
                );

              const budget = Number(project.budget || 0);
              const percentage =
                budget > 0 ? (spent / budget) * 100 : 0;
              const overBudget = budget > 0 && spent > budget;
              const remaining = budget - spent;

              return (
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
                        <Link
                          to={`/projects/${project.id || project.code}`}
                          className="hover:text-amber-400 transition-colors"
                        >
                          {project.name}
                        </Link>
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        overBudget
                          ? "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                          : "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {overBudget ? "OVER BUDGET" : "WITHIN BUDGET"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        RECORDED SPENDING
                      </p>
                      <p className="mt-0.5 text-base font-black text-white">
                        {currency.format(spent)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        APPROVED BUDGET
                      </p>
                      <p className="mt-0.5 text-xs font-black text-amber-400">
                        {currency.format(budget)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-xs bg-slate-900 border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        overBudget
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                          : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      }`}
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-black">
                    <span className="text-slate-400">
                      {percentage.toFixed(1)}% CONSUMED
                    </span>
                    <span
                      className={
                        remaining < 0
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }
                    >
                      {remaining < 0 ? "EXCEEDED BY " : "REMAINING "}
                      {currency.format(Math.abs(remaining))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Expense Register Table Section */}
      <section className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="border-b-2 border-slate-800/80 p-5 font-mono sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                <Receipt size={16} strokeWidth={2.5} />
                <span>FINANCIAL LOG</span>
              </div>
              <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
                Expense Register
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-300">
                View and manage all authorized field expenditure logs.
              </p>
            </div>

            <span className="w-fit rounded border-2 border-slate-700 bg-slate-950 px-3 py-1 font-mono text-xs font-black text-amber-400 uppercase">
              {filteredExpenditures.length} RECORD{filteredExpenditures.length === 1 ? "" : "S"} LOGGED
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 font-mono">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search description, payee, site..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL PROJECTS ]</option>
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

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL CATEGORIES ]</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-slate-950 text-white font-black">
                    {category.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL STATUSES ]</option>
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-slate-950 text-white font-black">
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              <Filter size={14} strokeWidth={2.5} className="text-amber-500" />
              <span>RESET FILTERS</span>
            </button>
          </div>
        </div>

        {filteredExpenditures.length === 0 ? (
          <div className="px-5 py-16 text-center font-mono sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 text-amber-500">
              <Receipt size={32} strokeWidth={2.5} />
            </div>

            <h3 className="mt-4 font-mono text-base font-black uppercase tracking-wider text-white">
              {expenditures.length === 0
                ? "No Expenses Logged Yet"
                : "No Matching Expenses Located"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs font-bold leading-relaxed text-slate-300">
              {expenditures.length === 0
                ? "Start tracking field disbursements by recording your first expense entry."
                : "Adjust search queries or active filter parameters."}
            </p>

            {expenditures.length === 0 ? (
              <button
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 font-mono text-xs font-black uppercase text-slate-950 transition-all hover:bg-amber-400"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>RECORD FIRST EXPENSE</span>
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="mt-6 rounded border-2 border-slate-700 bg-slate-800 px-5 py-2.5 font-mono text-xs font-black uppercase text-white transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                RESET FILTERS
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left font-mono text-xs">
              <thead className="bg-slate-950 text-[11px] font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800">
                <tr>
                  <th className="px-6 py-4">EXPENSE / CATEGORY</th>
                  <th className="px-6 py-4">SITE PROJECT</th>
                  <th className="px-6 py-4">TRANSACTION DATE</th>
                  <th className="px-6 py-4">PAYEE / VENDOR</th>
                  <th className="px-6 py-4">AMOUNT & METHOD</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
                {filteredExpenditures.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-950/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400">
                          <Receipt size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-black uppercase text-white tracking-wide">
                            {item.description}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                            CATEGORY: {item.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="max-w-[210px] truncate font-black text-white uppercase">
                        {getProjectName(item.projectId)}
                      </p>
                      <p className="mt-0.5 text-[10px] font-black text-amber-400">
                        {item.projectCode || ""}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-300">
                      {item.date
                        ? new Date(
                            `${item.date}T00:00:00`
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).toUpperCase()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-300 uppercase">
                      {item.payee || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-emerald-400">
                        {currency.format(Number(item.amount || 0))}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                        {item.paymentMethod || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          title="Edit expense record"
                          aria-label={`Edit ${item.description}`}
                          className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                        >
                          <Pencil size={15} strokeWidth={2.5} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete expense record"
                          aria-label={`Delete ${item.description}`}
                          className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create / Edit Expense Modal Dialog */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-2xl text-white">
            <div className="flex items-start justify-between border-b-2 border-slate-800/80 px-5 py-4 font-mono sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                  <HardHat size={16} strokeWidth={2.5} />
                  <span>FIELD DISBURSEMENT ENTRY</span>
                </div>
                <h2 className="mt-1 text-lg font-black uppercase tracking-wider text-white">
                  {editingId ? "Update Expenditure Entry" : "Record New Field Expense"}
                </h2>
                <p className="mt-0.5 text-xs font-bold text-slate-300">
                  Specify payee vendor, cost category, and authorized amount.
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
                  EXPENSE DESCRIPTION <span className="text-amber-500">*</span>
                </label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="e.g. Purchase of 200 bags of Dangote Cement"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    EXPENSE CATEGORY <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category} className="bg-slate-950 text-white font-black">
                          {category.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    DISBURSEMENT AMOUNT (₦) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="e.g. 250000"
                    className={`${inputClass} text-emerald-400`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    EXPENSE DATE <span className="text-amber-500">*</span>
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

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    SUPPLIER / PAYEE VENDOR
                  </label>
                  <input
                    name="payee"
                    value={form.payee}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g. ABC Building Supplies Ltd"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    PAYMENT METHOD <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method} className="bg-slate-950 text-white font-black">
                          {method.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    APPROVAL / PAYMENT STATUS <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status} className="bg-slate-950 text-white font-black">
                          {status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    MARK STATUS AS PAID ONLY ONCE FUNDS HAVE BEEN DISBURSED.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                    ADDITIONAL AUDIT NOTES
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="Provide additional field invoice references or receipt IDs..."
                    className={`${inputClass} min-h-24 resize-y py-3`}
                  />
                </div>
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
                  <span>{editingId ? "SAVE EXPENSE CHANGES" : "COMMIT EXPENSE ENTRY"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenditure;