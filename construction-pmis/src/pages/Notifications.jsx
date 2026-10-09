
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
  deadline: "bg-amber-50 text-amber-700",
  budget: "bg-emerald-50 text-emerald-700",
  progress: "bg-blue-50 text-blue-700",
  task: "bg-rose-50 text-rose-700",
  report: "bg-purple-50 text-purple-700",
  general: "bg-slate-100 text-slate-700",
};

function formatNotificationDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

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
    <div className="mx-auto max-w-[1400px] space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Bell size={17} />
            Communication Centre
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Notifications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep track of project deadlines, budget alerts, task updates,
            and construction progress.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total notifications
            </p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Bell size={19} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {notifications.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Available to your account
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Unread
            </p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Inbox size={19} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {unreadCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Require your attention
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Read
            </p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <CheckCheck size={19} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {notifications.length - unreadCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Already reviewed
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  filter === option.value
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {option.value === "unread" && unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Your notifications
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "notification"
                : "notifications"}{" "}
              displayed
            </p>
          </div>

          <Clock size={18} className="text-slate-400" />
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Inbox size={28} />
            </div>
            <h3 className="mt-4 font-bold text-slate-900">
              No notifications found
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try another filter or search term. New notifications will
              appear here when they are added.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notification) => {
              const Icon =
                notificationIcons[notification.type] || Bell;
              const iconColor =
                notificationColors[notification.type] ||
                notificationColors.general;

              return (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 transition sm:gap-4 sm:p-5 ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50/40"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}

                      {notification.priority === "high" && (
                        <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                          High priority
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>
                        {formatNotificationDate(notification.createdAt)}
                      </span>
                      {notification.projectCode && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-semibold text-slate-500">
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                      >
                        Open details
                        <ArrowRight size={14} />
                      </button>

                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white"
                        >
                          <Check size={14} />
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-xs leading-5 text-slate-400">
        BuildControl notifications are currently stored in this browser.
        They are sample records, not live alerts from the construction site.
      </p>
    </div>
  );
}

export default Notifications;