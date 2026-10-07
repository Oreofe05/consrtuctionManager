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
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Project name is required.";
    }

    if (!form.code.trim()) {
      newErrors.code = "Project code is required.";
    }

    if (!form.category) {
      newErrors.category = "Select a project category.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Project location is required.";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      newErrors.endDate = "End date cannot be before the start date.";
    }

    if (!form.budget || Number(form.budget) <= 0) {
      newErrors.budget = "Enter a valid project budget.";
    }

    if (!form.manager) {
      newErrors.manager = "Select a project manager.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("New project:", form);

    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Project Created Successfully
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            The project information has been validated and is ready to be
            stored in the project management system.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
            <p className="text-xs text-slate-400">Project</p>
            <p className="mt-1 font-semibold text-slate-900">
              {form.name}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Project Code</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {form.code}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Budget</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  ₦{Number(form.budget).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/projects")}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Projects
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Add Another Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-7">
        <Link
          to="/projects"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Project Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Add New Project
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create a new construction project and provide the information
            required to monitor it throughout its lifecycle.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                General information about the construction project.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <FormField
              label="Project Name"
              required
              error={errors.name}
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Faculty of Engineering Renovation"
                className={inputClass(errors.name)}
              />
            </FormField>

            <FormField
              label="Project Code"
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
              label="Project Category"
              required
              error={errors.category}
            >
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Select category"
                options={categories}
                error={errors.category}
              />
            </FormField>

            <FormField
              label="Project Manager"
              required
              error={errors.manager}
            >
              <Select
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="Select project manager"
                options={managers}
                error={errors.manager}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Project Location"
                required
                error={errors.location}
              >
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Faculty of Engineering Complex"
                    className={`${inputClass(errors.location)} pl-10`}
                  />
                </div>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Project Description"
                error={errors.description}
              >
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the purpose and scope of the project..."
                  className={`${inputClass()} min-h-28 resize-y py-3`}
                />
              </FormField>
            </div>
          </div>
        </section>

        {/* Timeline & Budget */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Timeline & Budget
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Define the planned project period and financial allocation.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <FormField
              label="Start Date"
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
              label="Expected Completion Date"
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
              label="Allocated Budget"
              required
              error={errors.budget}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₦
                </span>

                <input
                  type="number"
                  name="budget"
                  min="0"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass(errors.budget)} pl-9`}
                />
              </div>
            </FormField>

            <FormField label="Initial Status">
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

        {/* Team & Progress */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Users size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Project Setup
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Configure the initial monitoring state of the project.
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Initial Progress
                </label>

                <span className="text-sm font-bold text-slate-900">
                  {form.progress}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                name="progress"
                value={form.progress}
                onChange={handleChange}
                className="mt-4 w-full accent-slate-900"
              />

              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Wallet size={15} />
                Budget Preview
              </div>

              <p className="mt-2 text-xl font-bold text-slate-900">
                ₦
                {Number(form.budget || 0).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Allocated project budget
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
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
        className={`${inputClass(error)} appearance-none pr-10`}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function inputClass(error = false) {
  return `h-11 w-full rounded-xl border ${
    error ? "border-red-300 bg-red-50/30" : "border-slate-200"
  } bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100`;
}

export default AddProject;