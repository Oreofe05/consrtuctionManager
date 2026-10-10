import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Search,
  Trash2,
  Wallet,
  Activity,
  AlertTriangle,
  ArrowRight,
  Inbox,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../data/notifications";

const notificationIcons = {
  deadline: CalendarClock,
  budget: Wallet,
  progress: Activity,
  task: AlertTriangle,
  report: FileText,
  general: Bell,
};

const notificationColors = {
  deadline: "border-amber-500/50 text-amber-400 bg-slate-950",
  budget: "border-emerald-500/50 text-emerald-400 bg-slate-950",
  progress: "border-sky-500/50 text-sky-400 bg-slate-950",
  task: "border-rose-500/50 text-rose-400 bg-slate-950",
  report: "border-purple-500/50 text-purple-400 bg-slate-950",
  general: "border-slate-700 text-slate-300 bg-slate-950",
};

function formatNotificationDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "DATE UNAVAILABLE";
  }

  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date).toUpperCase();
}

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-3 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const refreshNotifications = useCallback(() => {
    setNotifications(getNotificationsForUser(user));
  }, [user]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.isRead) ||
      (filter === "read" && notification.isRead);

    const searchText =
      `${notification.title} ${notification.message} ${notification.projectCode || ""}`.toLowerCase();

    return matchesFilter && searchText.includes(search.toLowerCase());
  });

  function handleMarkAsRead(id) {
    markNotificationAsRead(id, user);
    refreshNotifications();
  }

  function handleMarkAllAsRead() {
    markAllNotificationsAsRead(user);
    refreshNotifications();
  }

  function handleDelete(id) {
    deleteNotification(id, user);
    refreshNotifications();
  }

  function handleOpenNotification(notification) {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id, user);
      refreshNotifications();
    }

    if (notification.projectCode) {
      navigate(
        `/projects/${encodeURIComponent(notification.projectCode)}`
      );
    } else if (notification.type === "report") {
      navigate("/reports");
    } else {
      navigate("/projects");
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 sm:space-y-8 pb-12 font-mono text-white px-3 sm:px-6">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-800/80 pb-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <Bell size={15} strokeWidth={2.5} /> COMMUNICATION CENTRE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">SYSTEM ALERTS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase">
            Operations Notifications
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300 uppercase">
            Monitor critical project milestone deadlines, budget thresholds, task directives, and site progress dispatches.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center justify-center gap-2 rounded border-2 border-slate-800 bg-slate-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-50 shrink-0 w-full sm:w-auto"
        >
          <CheckCheck size={16} strokeWidth={2.5} />
          <span>MARK ALL AS READ</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 truncate">
              Total Dispatches
            </p>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-sky-500/50 bg-slate-950 text-sky-400">
              <Bell size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-white truncate">
            {notifications.length}
          </p>
          <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase truncate">
            AVAILABLE TO OPERATOR ACCOUNT
          </p>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 truncate">
              Unread Alerts
            </p>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
              <Inbox size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-amber-400 truncate">
            {unreadCount}
          </p>
          <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase truncate">
            REQUIRES IMMEDIATE REVIEW
          </p>
        </div>

        <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 truncate">
              Reviewed Dispatches
            </p>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-emerald-500/50 bg-slate-950 text-emerald-400">
              <CheckCheck size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-emerald-400 truncate">
            {notifications.length - unreadCount}
          </p>
          <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase truncate">
            AUDITED & ACKNOWLEDGED
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={16}
              strokeWidth={2.5}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="SEARCH NOTIFICATIONS..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "ALL" },
              { value: "unread", label: "UNREAD" },
              { value: "read", label: "READ" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`rounded border-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  filter === option.value
                    ? "border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    : "border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-500 hover:text-amber-400"
                }`}
              >
                <span>{option.label}</span>
                {option.value === "unread" && unreadCount > 0 && (
                  <span className="ml-2 rounded bg-amber-950 px-1.5 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b-2 border-slate-800/80 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white truncate">
              System Dispatches
            </h2>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase truncate">
              DISPLAYING {filteredNotifications.length} OF {notifications.length} NOTIFICATIONS
            </p>
          </div>

          <Clock size={18} strokeWidth={2.5} className="text-amber-500 shrink-0" />
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-500">
              <Inbox size={28} strokeWidth={2.5} />
            </div>
            <h3 className="mt-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              No Notifications Located
            </h3>
            <p className="mt-1 max-w-sm text-xs font-bold leading-relaxed text-slate-400 uppercase">
              No dispatch records satisfy active filter or search query parameters.
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-800/80">
            {filteredNotifications.map((notification) => {
              const Icon =
                notificationIcons[notification.type] || Bell;
              const iconColor =
                notificationColors[notification.type] ||
                notificationColors.general;

              return (
                <div
                  key={notification.id}
                  className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5 transition-colors ${
                    notification.isRead
                      ? "bg-slate-900/60"
                      : "bg-slate-950/80 border-l-4 border-l-amber-500"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${iconColor}`}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-black uppercase text-white truncate">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                      )}

                      {notification.priority === "high" && (
                        <span className="rounded border border-rose-500 bg-rose-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-300">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300 uppercase">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-black text-slate-400 uppercase">
                      <span>
                        {formatNotificationDate(notification.createdAt)}
                      </span>
                      {notification.projectCode && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-black text-amber-400">
                            {notification.projectCode}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleOpenNotification(notification)
                        }
                        className="flex items-center gap-1.5 rounded border-2 border-amber-400 bg-amber-500 px-3 py-2 text-[11px] font-black uppercase text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all hover:bg-amber-400"
                      >
                        <span>OPEN DETAILS</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>

                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                          className="flex items-center gap-1.5 rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                        >
                          <Check size={14} strokeWidth={2.5} />
                          <span>MARK AS READ</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="flex items-center gap-1.5 rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-wider text-slate-500 leading-relaxed px-2">
        BUILDCONTROL NOTIFICATIONS ARE STORED LOCALLY IN BROWSER STORAGE.
        <br />
        DISPATCHES ARE DEMO TERMINAL ALERTS, NOT REAL-TIME SITE TELEMETRY.
      </p>
    </div>
  );
}

export default Notifications;
