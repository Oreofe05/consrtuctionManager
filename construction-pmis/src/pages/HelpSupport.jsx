import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileBarChart,
  Mail,
  MessageSquare,
  Search,
  Send,
  Wallet,
  Wrench,
  Activity,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const faqs = [
  {
    category: "Projects",
    question: "How do I create a new construction project?",
    answer:
      "Open Projects from the sidebar and select Add Project. Complete the project name, code, location, category, budget, dates, manager, and other required details. Save the form to add the project to your register.",
  },
  {
    category: "Tasks",
    question: "How can I create and update project tasks?",
    answer:
      "Navigate to Tasks & Activities. Use the create-task option to enter the task title, associated project, assignee, priority, due date, and status. You can later update the task status or edit its details from the task register.",
  },
  {
    category: "Expenditure",
    question: "How do I record construction expenditure?",
    answer:
      "Open Expenditure and add a new expense. Select the relevant project, enter the amount, category, date, description, and payment status. The expenditure register and its summaries will update using the records you enter.",
  },
  {
    category: "Progress",
    question: "How do I update the progress of a project?",
    answer:
      "Open Progress, create a progress report, select the project, and enter the actual completion percentage, planned percentage, reporting date, and notes. Saving the report updates the project's current progress in this demo.",
  },
  {
    category: "Reports",
    question: "Can I export project reports?",
    answer:
      "Yes. Open Reports, choose the report type, and apply the available project, date, or search filters. Use the CSV export option to download the displayed report data for use in a spreadsheet application.",
  },
  {
    category: "Users",
    question: "How do I manage system users?",
    answer:
      "Open Users to view the user register, search for a user, filter by role or status, and add or edit records. You can also change a user's active status. These are frontend demo controls, not secure server-side access permissions.",
  },
  {
    category: "Data",
    question: "Where is my data stored?",
    answer:
      "Currently, BuildControl stores projects, tasks, resources, expenditure, progress reports, users, and settings in your browser's localStorage. Data is local to this browser and device. Clearing browser site data may delete it, and it is not automatically shared with other users. A backend and database are needed for centralized, persistent multi-user storage.",
  },
  {
    category: "Settings",
    question: "Do settings automatically change every module?",
    answer:
      "Settings are currently saved locally. Some preferences are demonstrative and do not yet affect every module. A future backend and shared application configuration can make these settings consistent throughout the system.",
  },
];

const quickLinks = [
  {
    title: "Manage projects",
    description: "Create projects and review project details.",
    to: "/projects",
    icon: Building2,
    color: "border-sky-500/50 text-sky-400 bg-slate-950",
  },
  {
    title: "Tasks & activities",
    description: "Track assignments, deadlines, and status.",
    to: "/tasks",
    icon: ClipboardList,
    color: "border-purple-500/50 text-purple-400 bg-slate-950",
  },
  {
    title: "Record expenditure",
    description: "Review costs and expense records.",
    to: "/expenditure",
    icon: Wallet,
    color: "border-emerald-500/50 text-emerald-400 bg-slate-950",
  },
  {
    title: "Update progress",
    description: "Record site progress and reporting notes.",
    to: "/progress",
    icon: CalendarDays,
    color: "border-amber-500/50 text-amber-400 bg-slate-950",
  },
  {
    title: "View reports",
    description: "Filter records and export CSV reports.",
    to: "/reports",
    icon: FileBarChart,
    color: "border-rose-500/50 text-rose-400 bg-slate-950",
  },
  {
    title: "Manage resources",
    description: "Review materials and inventory levels.",
    to: "/resources",
    icon: Wrench,
    color: "border-cyan-500/50 text-cyan-400 bg-slate-950",
  },
];

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function HelpSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General enquiry",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer} ${faq.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccess(false);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const existing = JSON.parse(
        localStorage.getItem("construction_pmis_support_requests") || "[]"
      );

      const request = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "Saved locally",
      };

      localStorage.setItem(
        "construction_pmis_support_requests",
        JSON.stringify([request, ...existing])
      );

      setForm({
        name: "",
        email: "",
        topic: "General enquiry",
        message: "",
      });
      setSuccess(true);
    } catch (err) {
      console.error("Unable to save support request:", err);
      setError(
        "Your request could not be saved in this browser. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 font-mono text-white">
      {/* Page heading */}
      <div className="border-b-2 border-slate-800/80 pb-6">
        <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
          <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
            <CircleHelp size={15} strokeWidth={2.5} /> HELP CENTRE
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-black">SUPPORT DIRECTIVES</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
          Help & Support Terminal
        </h1>

        <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
          Access system operational documentation, review frequently asked questions, and log technical support tickets.
        </p>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-slate-800/40" />
        <div className="pointer-events-none absolute -bottom-24 right-36 h-56 w-56 rounded-full border-[30px] border-slate-800/40" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded border-2 border-amber-500/50 bg-slate-950 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-amber-400">
            <BookOpen size={14} strokeWidth={2.5} />
            BUILDCONTROL OPERATIONS MANUAL
          </span>

          <h2 className="mt-5 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            System Terminal Assistance
          </h2>

          <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300 uppercase">
            Search operational FAQs or navigate directly to project management modules. Access tools for tracking resources, budgets, and physical site progress.
          </p>

          <div className="mt-6 flex max-w-xl items-center gap-3 rounded border-2 border-slate-800 bg-slate-950 px-4 py-2.5 shadow-inner">
            <Search className="shrink-0 text-amber-500" size={18} strokeWidth={2.5} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setOpenFaq(0);
              }}
              placeholder="SEARCH HELP ARTICLES AND FAQS..."
              className="w-full border-0 bg-transparent font-mono text-xs font-black text-white placeholder-slate-500 outline-none"
              aria-label="Search frequently asked questions"
            />
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <Activity size={16} strokeWidth={2.5} />
            <span>MODULE NAVIGATION</span>
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
            Quick Access Terminal
          </h2>
          <p className="mt-0.5 text-xs font-bold text-slate-400 uppercase">
            Jump directly to core construction management modules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group flex items-start gap-4 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-amber-500 hover:bg-slate-950"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${item.color}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black uppercase text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-slate-400 uppercase">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 group-hover:underline">
                    <span>OPEN MODULE</span>
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ and contact */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
          <div className="flex items-start gap-3.5 border-b-2 border-slate-800/80 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
              <CircleHelp size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400 uppercase">
                Operational guides and reference answers for BuildControl.
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y-2 divide-slate-800/80">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={faq.question} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-amber-400"
                      aria-expanded={isOpen}
                    >
                      <div>
                        <span className="mb-1 inline-block rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                          {faq.category}
                        </span>
                        <span className="block text-xs font-black uppercase leading-relaxed text-white">
                          {faq.question}
                        </span>
                      </div>

                      <ChevronDown
                        size={18}
                        strokeWidth={2.5}
                        className={`shrink-0 text-amber-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="pb-3 pr-5 text-xs font-bold leading-relaxed text-slate-400 uppercase">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Search
                  size={28}
                  strokeWidth={2.5}
                  className="mx-auto text-slate-600"
                />
                <p className="mt-3 text-xs font-black uppercase tracking-wider text-white">
                  No Matching FAQs Located
                </p>
                <p className="mt-1 text-xs font-bold text-slate-400 uppercase">
                  Modify search query parameters.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-xs font-black uppercase text-amber-400 hover:underline"
                >
                  CLEAR SEARCH QUERY
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Support form */}
        <section
          id="contact-support"
          className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6"
        >
          <div className="flex items-start gap-3.5 border-b-2 border-slate-800/80 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
              <MessageSquare size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Log Support Ticket
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400 uppercase">
                Submit an operational query or report an issue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="support-name"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                FULL NAME <span className="text-amber-500">*</span>
              </label>
              <input
                id="support-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="ENG. O. OKONKWO"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="support-email"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                EMAIL ADDRESS <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={2.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
                />
                <input
                  id="support-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="department@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="support-topic"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                SUPPORT TOPIC
              </label>
              <select
                id="support-topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option className="bg-slate-950 text-white font-black">GENERAL ENQUIRY</option>
                <option className="bg-slate-950 text-white font-black">PROJECTS AND TASKS</option>
                <option className="bg-slate-950 text-white font-black">BUDGET AND EXPENDITURE</option>
                <option className="bg-slate-950 text-white font-black">RESOURCES AND INVENTORY</option>
                <option className="bg-slate-950 text-white font-black">REPORTS AND PROGRESS</option>
                <option className="bg-slate-950 text-white font-black">USERS AND SETTINGS</option>
                <option className="bg-slate-950 text-white font-black">TECHNICAL ISSUE</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="support-message"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                ISSUE DESCRIPTION <span className="text-amber-500">*</span>
              </label>
              <textarea
                id="support-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                placeholder="Detail technical issue or operational question..."
                className={`${inputClass} resize-y`}
              />
              <p className="mt-1 text-right text-[10px] font-bold text-slate-400">
                {form.message.length}/2000 CHARACTERS
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded border-2 border-rose-500 bg-rose-950/80 p-3 text-xs font-black uppercase text-rose-300"
              >
                <AlertTriangle size={16} strokeWidth={2.5} className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded border-2 border-emerald-500 bg-emerald-950/80 p-3 text-xs font-black uppercase text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                <CheckCircle2 size={16} strokeWidth={2.5} className="shrink-0 text-emerald-400" />
                <span>
                  SUPPORT REQUEST SAVED LOCALLY TO BROWSER STORAGE.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-4 py-3 text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
            >
              <Send size={16} strokeWidth={2.5} />
              <span>COMMIT SUPPORT TICKET</span>
            </button>

            <p className="text-[10px] font-bold leading-relaxed text-slate-400 uppercase">
              TERMINAL DEMO MODE: TICKETS ARE STORED LOCALLY IN BROWSER STORAGE.
            </p>
          </form>
        </section>
      </div>

      {/* Footer note */}
      <div className="flex flex-col gap-3 rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-amber-500/40 bg-slate-950 text-amber-400">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Need Further Technical Guidance?
            </h3>
            <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase">
              Review module documentation or search operational FAQs above.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 text-xs font-black uppercase text-amber-400 hover:underline"
        >
          <span>RETURN TO COMMAND DASHBOARD</span>
          <ArrowRight size={15} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export default HelpSupport;