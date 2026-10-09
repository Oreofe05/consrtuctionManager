import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  Users,
  Wallet,
  ShieldAlert,
  HardHat,
  ArrowRight,
  Activity,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addProject } from "../data/projects";

const initialForm = {
  name: "",
  code: "",
  category: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
  manager: "",
  status: "Planning",
  progress: 0,
};

const managers = [
  "Mr. Adewale Ogun",
  "Mrs. Tola Williams",
  "Engr. Ibrahim Musa",
  "Dr. Samuel Okafor",
];

const categories = [
  "New Construction",
  "Renovation",
  "Maintenance",
  "Expansion",
  "Infrastructure",
];

function AddProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "PROJECT TITLE IS REQUIRED";
    }

    if (!form.code.trim()) {
      newErrors.code = "SITE TASK CODE IS REQUIRED";
    }

    if (!form.category) {
      newErrors.category = "SELECT A PROJECT CATEGORY";
    }

    if (!form.location.trim()) {
      newErrors.location = "SITE LOCATION IS REQUIRED";
    }

    if (!form.startDate) {
      newErrors.startDate = "START DATE IS REQUIRED";
    }

    if (!form.endDate) {
      newErrors.endDate = "EXPECTED END DATE IS REQUIRED";
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      newErrors.endDate = "END DATE CANNOT PRECEDE START DATE";
    }

    if (!form.budget || Number(form.budget) <= 0) {
      newErrors.budget = "ENTER A VALID BUDGET GREATER THAN ZERO";
    }

    if (!form.manager) {
      newErrors.manager = "ASSIGN A SITE PROJECT MANAGER";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setGeneralError("CANNOT COMMENCE SITE REGISTRATION: COMPLETE ALL MANDATORY FIELDS.");
      return;
    }

    const newProject = {
      id: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget),
      spent: 0,
      manager: form.manager,
      status: form.status,
      progress: Number(form.progress),
      team: ["PM"],
    };

    addProject(newProject);

    setSubmitted(true);
    setGeneralError("");
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setGeneralError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl items-center justify-center p-4">
        <div className="w-full rounded-md border-2 border-slate-800 bg-slate-900 p-8 text-center shadow-2xl text-white sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded border-2 border-emerald-500 bg-emerald-950 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 font-mono text-2xl font-black uppercase tracking-wider text-white">
            Site Dossier Established
          </h1>

          <p className="mx-auto mt-3 max-w-md font-sans text-xs font-bold leading-relaxed text-slate-300">
            Project specs have been validated and deployed to the BuildControl operational database.
          </p>

          <div className="mt-6 rounded border-2 border-slate-800 bg-slate-950 p-5 text-left font-mono">
            <span className="text-[10px] font-black uppercase text-amber-400">PROJECT TITLE</span>
            <p className="mt-1 font-mono text-base font-black text-white uppercase">
              {form.name}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-slate-800/80 pt-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">SITE TASK CODE</span>
                <p className="mt-1 text-sm font-black text-amber-400">
                  {form.code.toUpperCase()}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">ALLOCATED CAP</span>
                <p className="mt-1 text-sm font-black text-emerald-400">
                  ₦{Number(form.budget).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/projects")}
              className="group flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-3 font-mono text-xs font-black uppercase text-slate-950 transition-all hover:bg-amber-400"
            >
              <span>VIEW SITE DIRECTORY</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-800 px-6 py-3 font-mono text-xs font-black uppercase text-white transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>REGISTER ANOTHER SITE</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-white pb-12">
      {/* Navigation & Header Section */}
      <div>
        <Link
          to="/projects"
          className="group mb-4 inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:text-amber-400"
        >
          <ArrowLeft size={16} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
          <span>RETURN TO SITE DIRECTORY</span>
        </Link>

        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <HardHat size={15} strokeWidth={2.5} /> SITE REGISTRATION TERMINAL
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">NEW SITE DOSSIER</span>
          </div>

          <h1 className="font-mono text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Register New Construction Site
          </h1>

          <p className="mt-2 max-w-2xl font-mono text-xs font-bold text-slate-300 leading-relaxed">
            Provision operational metadata, timelines, and financial capital for active site monitoring.
          </p>
        </div>
      </div>

      {/* General Form Error Alert Banner */}
      {generalError && (
        <div className="flex items-center gap-3 rounded border-2 border-rose-500 bg-rose-950 p-4 font-mono text-xs font-black text-rose-300 shadow-xl">
          <ShieldAlert size={20} strokeWidth={2.5} className="shrink-0 text-rose-400" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <section className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-slate-800/80 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400 shadow-inner">
              <FileText size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                Core Project Metadata
              </h2>

              <p className="mt-0.5 font-mono text-xs font-bold text-slate-300">
                Primary identifying specifications & site geography
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <FormField
              label="PROJECT TITLE"
              required
              error={errors.name}
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. FACULTY OF ENGINEERING RENOVATION"
                className={inputClass(errors.name)}
              />
            </FormField>

            <FormField
              label="SITE TASK CODE"
              required
              error={errors.code}
            >
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="e.g. UI-ENG-007"
                className={inputClass(errors.code)}
              />
            </FormField>

            <FormField
              label="PROJECT CATEGORY"
              required
              error={errors.category}
            >
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="[ SELECT CATEGORY ]"
                options={categories}
                error={errors.category}
              />
            </FormField>

            <FormField
              label="ASSIGNED PROJECT MANAGER"
              required
              error={errors.manager}
            >
              <Select
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="[ SELECT PROJECT MANAGER ]"
                options={managers}
                error={errors.manager}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="SITE LOCATION & COORDINATES"
                required
                error={errors.location}
              >
                <div className="relative">
                  <MapPin
                    size={16}
                    strokeWidth={2.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  />

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Faculty of Engineering Complex, Zone B"
                    className={`${inputClass(errors.location)} pl-9`}
                  />
                </div>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="PROJECT SCOPE & OBJECTIVES"
                error={errors.description}
              >
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detail structural parameters, deliverables, and site boundaries..."
                  className={`${inputClass()} min-h-28 resize-y py-3`}
                />
              </FormField>
            </div>
          </div>
        </section>

        {/* Section 2: Timeline & Budget */}
        <section className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-slate-800/80 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400 shadow-inner">
              <CalendarDays size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                Timeline & Financial Capital
              </h2>

              <p className="mt-0.5 font-mono text-xs font-bold text-slate-300">
                Scheduled completion target & allocated budget cap
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <FormField
              label="COMMENCEMENT DATE"
              required
              error={errors.startDate}
            >
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass(errors.startDate)}
              />
            </FormField>

            <FormField
              label="EXPECTED COMPLETION DATE"
              required
              error={errors.endDate}
            >
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate}
                onChange={handleChange}
                className={inputClass(errors.endDate)}
              />
            </FormField>

            <FormField
              label="ALLOCATED BUDGET CAP"
              required
              error={errors.budget}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-black text-amber-500">
                  ₦
                </span>

                <input
                  type="number"
                  name="budget"
                  min="0"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass(errors.budget)} pl-8`}
                />
              </div>
            </FormField>

            <FormField label="INITIAL STATUS">
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  "Planning",
                  "On Track",
                  "At Risk",
                  "Delayed",
                ]}
              />
            </FormField>
          </div>
        </section>

        {/* Section 3: Setup & Progress */}
        <section className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-slate-800/80 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400 shadow-inner">
              <Users size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                Initial Execution State
              </h2>

              <p className="mt-0.5 font-mono text-xs font-bold text-slate-300">
                Baseline completion percentage & financial preview
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between font-mono">
                <label className="text-xs font-black uppercase text-slate-300">
                  INITIAL PROGRESS METRIC
                </label>

                <span className="text-sm font-black text-amber-400">
                  {form.progress}% COMPLETE
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                name="progress"
                value={form.progress}
                onChange={handleChange}
                className="mt-4 w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded border border-slate-800"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] font-black text-slate-400">
                <span>0% [ PHASE 1 ]</span>
                <span>50% [ MID-PHASE ]</span>
                <span>100% [ HANDOVER ]</span>
              </div>
            </div>

            <div className="rounded border-2 border-slate-800 bg-slate-950 p-4 font-mono">
              <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase">
                <Wallet size={15} strokeWidth={2.5} className="text-amber-500" />
                CAPITAL ALLOCATION PREVIEW
              </div>

              <p className="mt-2 font-mono text-2xl font-black text-white">
                ₦{Number(form.budget || 0).toLocaleString()}
              </p>

              <p className="mt-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                TOTAL AUTHORIZED FIELD EXPENDITURE CAP
              </p>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded border-2 border-slate-800 bg-slate-900 px-5 py-3 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            CANCEL REGISTRATION
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 rounded border-2 border-slate-800 bg-slate-900 px-5 py-3 font-mono text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            <span>RESET TERMINAL</span>
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>COMMENCE PROJECT DEPLOYMENT</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs font-black uppercase tracking-wider text-slate-300">
        {label}
        {required && <span className="ml-1 text-amber-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 font-mono text-xs font-black uppercase text-rose-400">
          ▲ {error}
        </p>
      )}
    </div>
  );
}

function Select({
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass(error)} appearance-none pr-10 font-mono text-xs font-black text-amber-400 cursor-pointer`}
      >
        {placeholder && (
          <option value="" className="bg-slate-950 text-slate-400">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-white font-black">
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        strokeWidth={2.5}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function inputClass(error = false) {
  return `h-11 w-full rounded border-2 ${
    error ? "border-rose-500 bg-rose-950/40 text-rose-200" : "border-slate-800 bg-slate-950 text-white"
  } px-3.5 font-mono text-xs font-black placeholder:text-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40`;
}

export default AddProject;