import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Boxes,
  Wallet,
  AlertTriangle,
  Trash2,
  X,
  Pencil,
  ShieldAlert,
  HardHat,
  ChevronDown,
  Layers,
} from "lucide-react";

import { getProjects } from "../data/projects";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
} from "../data/resources";

const inputStyles = "h-11 w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

const initialForm = {
  name: "",
  category: "Building Materials",
  projectId: "",
  unit: "Bags",
  quantity: "",
  requiredQuantity: "",
  unitCost: "",
  supplier: "",
};

const categories = [
  "Building Materials",
  "Equipment",
  "Machinery",
  "Electrical",
  "Plumbing",
  "Safety Equipment",
  "Other",
];

const units = [
  "Bags",
  "Pieces",
  "Tonnes",
  "Kilograms",
  "Cubic metres",
  "Litres",
  "Metres",
  "Units",
  "Hours",
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function Resources() {
  const projects = getProjects();

  const [resources, setResources] = useState(() => getResources());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const projectLookup = useMemo(() => {
    const lookup = {};

    projects.forEach((project) => {
      if (project.id) lookup[String(project.id)] = project;
      if (project.code) lookup[String(project.code)] = project;
    });

    return lookup;
  }, [projects]);

  function getProject(resource) {
    return (
      projectLookup[String(resource.projectId)] ||
      projectLookup[String(resource.projectCode)] ||
      null
    );
  }

  function getStockState(resource) {
    const quantity = Number(resource.quantity) || 0;
    const required = Number(resource.requiredQuantity) || 0;

    if (quantity <= 0) return "Out of Stock";
    if (required > 0 && quantity < required) return "Low Stock";

    return "Available";
  }

  const totalQuantityValue = resources.reduce(
    (total, resource) =>
      total +
      (Number(resource.quantity) || 0) *
        (Number(resource.unitCost) || 0),
    0
  );

  const lowStockCount = resources.filter((resource) =>
    ["Low Stock", "Out of Stock"].includes(getStockState(resource))
  ).length;

  const filteredResources = resources.filter((resource) => {
    const project = getProject(resource);

    const searchableText = [
      resource.name,
      resource.category,
      resource.supplier,
      project?.name,
      project?.code,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      resource.category === categoryFilter;

    const matchesProject =
      projectFilter === "All" ||
      String(resource.projectId) === projectFilter ||
      String(resource.projectCode) === projectFilter;

    const state = getStockState(resource);

    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "Low Stock" &&
        ["Low Stock", "Out of Stock"].includes(state)) ||
      state === stockFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesProject &&
      matchesStock
    );
  });

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...initialForm,
      projectId: projects[0]
        ? String(projects[0].id || projects[0].code)
        : "",
    });
    setError("");
    setShowForm(true);
  }

  function openEditForm(resource) {
    setEditingId(resource.id);
    setForm({
      name: resource.name || "",
      category: resource.category || "Building Materials",
      projectId: String(resource.projectId || resource.projectCode || ""),
      unit: resource.unit || "Units",
      quantity: String(resource.quantity ?? ""),
      requiredQuantity: String(resource.requiredQuantity ?? ""),
      unitCost: String(resource.unitCost ?? ""),
      supplier: resource.supplier || "",
    });
    setError("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a resource name.");
      return;
    }

    if (!form.projectId) {
      setError("Please assign this resource to a project.");
      return;
    }

    if (
      form.quantity === "" ||
      !Number.isFinite(Number(form.quantity)) ||
      Number(form.quantity) < 0
    ) {
      setError("Please specify a valid available stock quantity.");
      return;
    }

    if (
      form.requiredQuantity === "" ||
      !Number.isFinite(Number(form.requiredQuantity)) ||
      Number(form.requiredQuantity) < 0
    ) {
      setError("Please specify a valid target quantity.");
      return;
    }

    if (
      form.unitCost === "" ||
      !Number.isFinite(Number(form.unitCost)) ||
      Number(form.unitCost) < 0
    ) {
      setError("Please specify a valid unit cost.");
      return;
    }

    const selectedProject = projectLookup[form.projectId];

    const resourceData = {
      name: form.name.trim(),
      category: form.category,
      projectId: form.projectId,
      projectCode: selectedProject?.code || "",
      projectName: selectedProject?.name || "Unknown Project",
      unit: form.unit,
      quantity: Number(form.quantity),
      requiredQuantity: Number(form.requiredQuantity),
      unitCost: Number(form.unitCost),
      supplier: form.supplier.trim(),
    };

    if (editingId) {
      const updated = updateResource(editingId, resourceData);
      setResources(updated);
    } else {
      const created = addResource(resourceData);
      setResources((current) => [created, ...current]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this resource record?")) return;

    const updated = deleteResource(id);
    setResources(updated);
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 text-white pb-12 px-3 sm:px-6 font-mono">
      {/* Page Heading & Actions Header */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <Package size={15} strokeWidth={2.5} /> INVENTORY & LOGISTICS
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">MATERIAL LIST</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Resource & Inventory Management
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold text-slate-300 leading-relaxed">
            Track construction materials, equipment, stock levels, required quantities, and supplier costs across your projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={projects.length === 0}
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>ADD NEW RESOURCE</span>
        </button>
      </div>

      {projects.length === 0 && (
        <div className="flex items-center gap-3 rounded border-2 border-amber-500 bg-amber-950 p-4 font-mono text-xs font-black text-amber-300 shadow-xl">
          <ShieldAlert size={20} strokeWidth={2.5} className="shrink-0 text-amber-400" />
          <span>Please create at least one project before adding resources.</span>
          <Link
            to="/projects/new"
            className="ml-auto underline text-white font-black hover:text-amber-400"
          >
            CREATE PROJECT
          </Link>
        </div>
      )}

      {/* Summary KPI Control Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Resources"
          value={resources.length}
          subtext="LOGGED MATERIAL ENTRIES"
          icon={<Package size={20} strokeWidth={2.5} />}
          badgeStyle="border-sky-500/50 text-sky-400 bg-slate-950"
        />

        <SummaryCard
          title="Low / Out of Stock"
          value={lowStockCount}
          subtext="REQUIRES ATTENTION"
          icon={<AlertTriangle size={20} strokeWidth={2.5} />}
          badgeStyle="border-rose-500/50 text-rose-400 bg-slate-950"
          valueStyle="text-rose-400"
        />

        <SummaryCard
          title="Total Inventory Value"
          value={formatCurrency(totalQuantityValue)}
          subtext="TOTAL CAPITAL IN FIELD"
          icon={<Wallet size={20} strokeWidth={2.5} />}
          badgeStyle="border-emerald-500/50 text-emerald-400 bg-slate-950"
          valueStyle="text-emerald-400"
        />

        <SummaryCard
          title="Categories"
          value={new Set(resources.map((item) => item.category)).size}
          subtext="ACTIVE MATERIAL GROUPS"
          icon={<Boxes size={20} strokeWidth={2.5} />}
          badgeStyle="border-amber-500/50 text-amber-400 bg-slate-950"
        />
      </div>

      {/* Add/Edit Form Terminal Panel */}
      {showForm && (
        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-2xl text-white sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-3 border-b-2 border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-amber-400">
                <HardHat size={16} strokeWidth={2.5} />
                <span>RESOURCE FORM</span>
              </div>
              <h2 className="mt-1 font-mono text-lg font-black uppercase tracking-wider text-white">
                {editingId ? "Edit Resource" : "Add New Resource"}
              </h2>
              <p className="mt-0.5 font-mono text-xs font-bold text-slate-300">
                Enter material details, unit metrics, and supplier information for a project.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close resource form"
              className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded border-2 border-rose-500 bg-rose-950 p-3.5 font-mono text-xs font-black text-rose-300"
            >
              <ShieldAlert size={16} strokeWidth={2.5} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 font-mono">
              <FormField label="Resource Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Portland Cement Grade 42.5N"
                  className={inputStyles}
                  required
                />
              </FormField>

              <FormField label="Category" required>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-9 text-amber-400 cursor-pointer`}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-slate-950 text-white font-black">
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FormField>

              <FormField label="Assigned Project" required>
                <div className="relative">
                  <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-9 text-amber-400 cursor-pointer`}
                    required
                  >
                    <option value="" className="bg-slate-950 text-slate-500">[ SELECT PROJECT ]</option>
                    {projects.map((project) => (
                      <option
                        key={project.id || project.code}
                        value={String(project.id || project.code)}
                        className="bg-slate-950 text-white font-black"
                      >
                        {project.code} — {project.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FormField>

              <FormField label="Available Quantity (Stock)" required>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="any"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  className={inputStyles}
                  required
                />
              </FormField>

              <FormField label="Required Target Quantity" required>
                <input
                  name="requiredQuantity"
                  type="number"
                  min="0"
                  step="any"
                  value={form.requiredQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  className={inputStyles}
                  required
                />
              </FormField>

              <FormField label="Unit of Measure" required>
                <div className="relative">
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-9 text-amber-400 cursor-pointer`}
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit} className="bg-slate-950 text-white font-black">
                        {unit}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FormField>

              <FormField label="Unit Cost (₦)" required>
                <input
                  name="unitCost"
                  type="number"
                  min="0"
                  step="any"
                  value={form.unitCost}
                  onChange={handleChange}
                  placeholder="e.g. 12000"
                  className={`${inputStyles} text-emerald-400`}
                  required
                />
              </FormField>

              <FormField label="Supplier / Vendor">
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="e.g. Dangote Cement Plc"
                  className={inputStyles}
                />
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-800/80 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded border-2 border-slate-800 bg-slate-900 px-5 py-2.5 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-2.5 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>{editingId ? "SAVE CHANGES" : "ADD RESOURCE"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory & Filter Control Terminal Table */}
      <div className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="border-b-2 border-slate-800/80 p-5">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-amber-400">
            <Layers size={16} strokeWidth={2.5} />
            <span>INVENTORY REGISTRY</span>
          </div>
          <h2 className="font-mono text-base font-black uppercase tracking-wider text-white mt-0.5">
            Resource List
          </h2>
          <p className="mt-0.5 font-mono text-xs font-bold text-slate-300">
            Search, filter, and manage material stock levels across your active projects.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 font-mono sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search resource, supplier, or project..."
                className="w-full rounded border-2 border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full appearance-none rounded border-2 border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 cursor-pointer"
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL CATEGORIES ]</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-slate-950 text-white font-black">
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className="w-full appearance-none rounded border-2 border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 cursor-pointer"
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL PROJECTS ]</option>
                {projects.map((project) => (
                  <option
                    key={project.id || project.code}
                    value={String(project.id || project.code)}
                    className="bg-slate-950 text-white font-black"
                  >
                    {project.code} — {project.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="w-full appearance-none rounded border-2 border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 cursor-pointer"
              >
                <option value="All" className="bg-slate-950 text-white font-black">[ ALL STOCK LEVELS ]</option>
                <option value="Available" className="bg-slate-950 text-emerald-400 font-black">● AVAILABLE</option>
                <option value="Low Stock" className="bg-slate-950 text-amber-400 font-black">▲ LOW STOCK</option>
                <option value="Out of Stock" className="bg-slate-950 text-rose-400 font-black">■ OUT OF STOCK</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="px-5 py-16 text-center font-mono">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 text-amber-500">
              <Package size={32} strokeWidth={2.5} />
            </div>

            <h3 className="mt-4 text-base font-black uppercase tracking-wider text-white">
              {resources.length === 0
                ? "No Resources Added Yet"
                : "No Matching Resources Found"}
            </h3>

            <p className="mt-2 text-xs font-bold text-slate-300 max-w-md mx-auto">
              {resources.length === 0
                ? "Add your first resource to start tracking materials and equipment stock."
                : "Try adjusting your search or filter settings."}
            </p>

            {resources.length === 0 && projects.length > 0 && (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 text-xs font-black uppercase text-slate-950 transition-all hover:bg-amber-400"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>ADD FIRST RESOURCE</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left font-mono text-xs">
              <thead className="bg-slate-950 text-[11px] font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">RESOURCE / SUPPLIER</th>
                  <th className="px-5 py-3.5">PROJECT</th>
                  <th className="px-5 py-3.5">STOCK LEVEL</th>
                  <th className="px-5 py-3.5">TARGET REQUIRED</th>
                  <th className="px-5 py-3.5">UNIT COST</th>
                  <th className="px-5 py-3.5">TOTAL VALUE</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
                {filteredResources.map((resource) => {
                  const project = getProject(resource);
                  const stockState = getStockState(resource);

                  const totalValue =
                    (Number(resource.quantity) || 0) *
                    (Number(resource.unitCost) || 0);

                  const statusStyle =
                    stockState === "Out of Stock"
                      ? "border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                      : stockState === "Low Stock"
                        ? "border-amber-500 bg-amber-950 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        : "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]";

                  return (
                    <tr key={resource.id} className="hover:bg-slate-950/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400">
                            <Package size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="font-black uppercase text-white tracking-wide">
                              {resource.name}
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                              CATEGORY: {resource.category}
                            </p>
                            {resource.supplier && (
                              <p className="mt-0.5 text-[10px] font-bold text-slate-300 uppercase">
                                SUPPLIER: {resource.supplier}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {project ? (
                          <Link
                            to={`/projects/${project.id || project.code}`}
                            className="group/link block"
                          >
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-slate-700 group-hover/link:border-amber-400 transition-colors">
                              {project.code}
                            </span>
                            <span className="mt-1 block max-w-[180px] truncate text-[11px] font-bold text-slate-300 uppercase">
                              {project.name}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 font-bold uppercase">
                            {resource.projectName || "N/A"}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-black text-white">
                        {resource.quantity} <span className="text-[10px] text-slate-400 font-extrabold">{resource.unit}</span>
                      </td>

                      <td className="px-5 py-4 font-black text-slate-300">
                        {resource.requiredQuantity} <span className="text-[10px] text-slate-400 font-extrabold">{resource.unit}</span>
                      </td>

                      <td className="px-5 py-4 font-black text-slate-300">
                        {formatCurrency(resource.unitCost)}
                      </td>

                      <td className="px-5 py-4 font-black text-emerald-400">
                        {formatCurrency(totalValue)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusStyle}`}
                        >
                          <span>{stockState}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(resource)}
                            title="Edit resource"
                            aria-label={`Edit ${resource.name}`}
                            className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                          >
                            <Pencil size={15} strokeWidth={2.5} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(resource.id)}
                            title="Delete resource"
                            aria-label={`Delete ${resource.name}`}
                            className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
                          >
                            <Trash2 size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtext, icon, badgeStyle, valueStyle = "text-white" }) {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded border-2 ${badgeStyle}`}>
          {icon}
        </div>
      </div>
      <p className={`mt-3 text-2xl font-black break-words ${valueStyle}`}>
        {value}
      </p>
      <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">
        {subtext}
      </p>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
        {label}
        {required && <span className="ml-1 text-amber-500">*</span>}
      </label>

      {children}
    </div>
  );
}

export default Resources;