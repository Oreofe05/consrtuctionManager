import { useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Mail,
  CalendarDays,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  HardHat,
  ShieldAlert,
} from "lucide-react";

import {
  getSettings,
  saveSettings,
  resetSettings,
} from "../data/settings";

const sections = [
  { id: "general", label: "General", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function Settings() {
  const [settings, setSettings] = useState(() => getSettings());
  const [activeSection, setActiveSection] = useState("general");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const updateNestedField = (section, field, value) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
    setMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    try {
      saveSettings(settings);
      setMessageType("success");
      setMessage("Your settings have been saved successfully.");
    } catch (error) {
      console.error("Unable to save settings:", error);
      setMessageType("error");
      setMessage("Unable to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    try {
      const defaults = resetSettings();
      setSettings(defaults);
      setShowResetConfirm(false);
      setMessageType("success");
      setMessage("Settings have been restored to their defaults.");
    } catch (error) {
      console.error("Unable to reset settings:", error);
      setMessageType("error");
      setMessage("Unable to reset settings. Please try again.");
    }
  };

  const Toggle = ({ checked, onChange, title, description }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-800/80 font-mono">
      <div>
        <p className="text-xs font-black uppercase text-white">{title}</p>
        <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors ${
          checked ? "border-amber-400 bg-amber-500" : "border-slate-700 bg-slate-950"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
            checked ? "left-[22px] bg-slate-950" : "left-0.5 bg-slate-500"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-7 text-white pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <SettingsIcon size={15} strokeWidth={2.5} /> SYSTEM ADMINISTRATION
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">SYSTEM PARAMETERS</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            System Settings & Controls
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
            Configure BuildControl organization parameters, notification directives, and operational application preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center justify-center gap-2 rounded border-2 border-slate-700 bg-slate-900 px-4 py-3 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
        >
          <RotateCcw size={16} strokeWidth={2.5} className="text-amber-500" />
          <span>RESTORE SYSTEM DEFAULTS</span>
        </button>
      </div>

      {/* Save feedback banner */}
      {message && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded border-2 p-4 text-xs font-black uppercase ${
            messageType === "success"
              ? "border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={18} strokeWidth={2.5} className="shrink-0" />
          ) : (
            <AlertTriangle size={18} strokeWidth={2.5} className="shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Settings Navigation */}
        <aside className="rounded-md border-2 border-slate-800 bg-slate-900 p-3 shadow-xl">
          <p className="px-3 pb-3 pt-2 text-[10px] font-black uppercase tracking-wider text-amber-400 border-b-2 border-slate-800/80 mb-2">
            CONTROL SECTIONS
          </p>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded border-2 px-3 py-2.5 text-left text-xs font-black uppercase transition-all ${
                    active
                      ? "border-amber-400 bg-slate-950 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      : "border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-950/50 hover:text-white"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Form */}
        <form
          onSubmit={handleSave}
          className="min-w-0 space-y-6"
        >
          {activeSection === "general" && (
            <>
              <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
                <div className="mb-6 flex items-center gap-3 border-b-2 border-slate-800/80 pb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
                    <Building2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-wider text-white">
                      Organization Dossier
                    </h2>
                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                      Primary entity specifications associated with BuildControl operations.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      ORGANIZATION NAME <span className="text-amber-500">*</span>
                    </label>
                    <input
                      value={settings.organizationName}
                      onChange={(event) =>
                        updateField("organizationName", event.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      SYSTEM IDENTIFIER NAME <span className="text-amber-500">*</span>
                    </label>
                    <input
                      value={settings.systemName}
                      onChange={(event) =>
                        updateField("systemName", event.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      DEPARTMENT / DIRECTORATE <span className="text-amber-500">*</span>
                    </label>
                    <input
                      value={settings.department}
                      onChange={(event) =>
                        updateField("department", event.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      OFFICIAL CONTACT EMAIL
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        strokeWidth={2.5}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
                      />
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(event) =>
                          updateField("contactEmail", event.target.value)
                        }
                        placeholder="department@example.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
                <div className="mb-6 flex items-center gap-3 border-b-2 border-slate-800/80 pb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
                    <SlidersHorizontal size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-wider text-white">
                      Regional Formatting
                    </h2>
                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                      Define global financial currency standards and date formatting conventions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      OPERATIONAL CURRENCY
                    </label>
                    <div className="relative">
                      <select
                        value={settings.currency}
                        onChange={(event) =>
                          updateField("currency", event.target.value)
                        }
                        className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                      >
                        <option value="NGN" className="bg-slate-950 text-white font-black">NGN — NIGERIAN NAIRA (₦)</option>
                        <option value="USD" className="bg-slate-950 text-white font-black">USD — US DOLLAR ($)</option>
                        <option value="GBP" className="bg-slate-950 text-white font-black">GBP — BRITISH POUND (£)</option>
                      </select>
                      <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                      SYSTEM DATE FORMAT
                    </label>
                    <div className="relative">
                      <select
                        value={settings.dateFormat}
                        onChange={(event) =>
                          updateField("dateFormat", event.target.value)
                        }
                        className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                      >
                        <option value="DD/MM/YYYY" className="bg-slate-950 text-white font-black">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY" className="bg-slate-950 text-white font-black">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD" className="bg-slate-950 text-white font-black">YYYY-MM-DD</option>
                      </select>
                      <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <p className="mt-4 rounded border border-amber-500/40 bg-amber-950/40 p-3 text-[11px] font-bold leading-relaxed text-amber-300">
                  REGIONAL PARAMETERS ARE PERSISTED LOCALLY. MODULE COMPONENTS READ THESE SETTINGS TO FORMAT CURRENCY AND DATES DYNAMICALLY.
                </p>
              </section>
            </>
          )}

          {activeSection === "notifications" && (
            <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
              <div className="mb-4 flex items-center gap-3 border-b-2 border-slate-800/80 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
                  <Bell size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-white">
                    Notification Directives
                  </h2>
                  <p className="mt-0.5 text-xs font-bold text-slate-400">
                    Configure automated field alerts, deadline triggers, and status updates.
                  </p>
                </div>
              </div>

              <div>
                <Toggle
                  title="PROJECT STATUS UPDATES"
                  description="Automated alerts relating to physical project milestone updates and completion states."
                  checked={settings.notifications.projectUpdates}
                  onChange={(value) =>
                    updateNestedField("notifications", "projectUpdates", value)
                  }
                />

                <Toggle
                  title="TASK DEADLINE REMINDERS"
                  description="Automated alerts for approaching field labor task due dates and critical paths."
                  checked={settings.notifications.taskDeadlines}
                  onChange={(value) =>
                    updateNestedField("notifications", "taskDeadlines", value)
                  }
                />

                <Toggle
                  title="BUDGET VARIANCE ALERTS"
                  description="Immediate alerts when site expenditure exceeds target cost thresholds."
                  checked={settings.notifications.budgetAlerts}
                  onChange={(value) =>
                    updateNestedField("notifications", "budgetAlerts", value)
                  }
                />

                <Toggle
                  title="PROGRESS REPORT LOGS"
                  description="Notifications when field audit reports are logged into database archives."
                  checked={settings.notifications.progressReports}
                  onChange={(value) =>
                    updateNestedField("notifications", "progressReports", value)
                  }
                />
              </div>

              <p className="mt-5 rounded border border-slate-800 bg-slate-950 p-3 text-[11px] font-bold leading-relaxed text-slate-400">
                NOTIFICATION DIRECTIVES STORE USER PREFERENCES. EMAIL AND PUSH TRANSMISSION REQUIRES ACTIVE SERVER DISPATCH PIPELINE.
              </p>
            </section>
          )}

          {activeSection === "preferences" && (
            <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
              <div className="mb-4 flex items-center gap-3 border-b-2 border-slate-800/80 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-white">
                    Terminal View Preferences
                  </h2>
                  <p className="mt-0.5 text-xs font-bold text-slate-400">
                    Configure terminal layout densities and dashboard view defaults.
                  </p>
                </div>
              </div>

              <div>
                <Toggle
                  title="COMPACT DATA TABLES"
                  description="Render high-density tabular layouts across all audit and project registers."
                  checked={settings.preferences.compactTable}
                  onChange={(value) =>
                    updateNestedField("preferences", "compactTable", value)
                  }
                />

                <Toggle
                  title="WELCOME BANNER DISPLAY"
                  description="Display operational welcome banner on the main executive dashboard."
                  checked={settings.preferences.showWelcomeMessage}
                  onChange={(value) =>
                    updateNestedField(
                      "preferences",
                      "showWelcomeMessage",
                      value
                    )
                  }
                />
              </div>

              <p className="mt-5 rounded border border-slate-800 bg-slate-950 p-3 text-[11px] font-bold leading-relaxed text-slate-400">
                PREFERENCES ARE STORED IN LOCAL STORAGE AND APPLY AUTOMATICALLY TO TERMINAL INTERFACES.
              </p>
            </section>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t-2 border-slate-800/80 pt-5">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-6 py-2.5 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
            >
              <Save size={16} strokeWidth={2.5} />
              <span>COMMIT SETTINGS</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            className="w-full max-w-md rounded-md border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl font-mono text-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-500">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>

            <h2
              id="reset-title"
              className="mt-4 text-base font-black uppercase tracking-wider text-white"
            >
              RESET ALL SYSTEM SETTINGS?
            </h2>

            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-400 uppercase">
              THIS ACTION RESTORES DEFAULT ORGANIZATION METADATA AND REGIONAL PREFERENCES. PROJECT RECORDS, TASKS, EXPENDITURES, AND USER ACCOUNTS WILL NOT BE AFFECTED.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded border-2 border-slate-800 bg-slate-900 px-4 py-2 text-xs font-black uppercase text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded border-2 border-amber-400 bg-amber-500 px-4 py-2 text-xs font-black uppercase text-slate-950 transition-colors hover:bg-amber-400"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;