
import { useCallback, useEffect, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  HardHat,
  LogOut,
  UserRound,
  Check,
  CheckCheck,
  CalendarClock,
  Wallet,
  Activity,
  AlertTriangle,
  FileText,
  ArrowRight,
  X,
  Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../data/notifications";

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

function formatTime(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function Header({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(() => {
    setNotifications(getNotificationsForUser(user));
  }, [user]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Refresh when returning to the browser tab.
  useEffect(() => {
    const handleFocus = () => refreshNotifications();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshNotifications]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );

  const unreadCount = unreadNotifications.length;

  const recentNotifications = notifications.slice(0, 5);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleOpenNotification(notification) {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id, user);
      refreshNotifications();
    }

    setNotificationsOpen(false);

    if (notification.projectCode) {
      navigate(
        `/projects/${encodeURIComponent(notification.projectCode)}`
      );
    } else if (notification.type === "report") {
      navigate("/reports");
    } else {
      navigate("/notifications");
    }
  }

  function handleMarkAsRead(notificationId) {
    markNotificationAsRead(notificationId, user);
    refreshNotifications();
  }

  function handleMarkAllAsRead() {
    markAllNotificationsAsRead(user);
    refreshNotifications();
  }

  // Get initials from the logged-in user's name.
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-slate-800 bg-slate-900 px-4 text-white shadow-md sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar menu"
          className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-200 transition-colors hover:border-amber-500 hover:bg-slate-700 hover:text-white lg:hidden"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Site Status Badge */}
        <div className="hidden items-center gap-2 rounded border-2 border-slate-800 bg-slate-950 px-3 py-1 text-xs font-black tracking-wider text-white sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          <span className="font-mono font-extrabold uppercase text-slate-400">
            SITE:
          </span>

          <span className="font-mono font-black text-amber-400">
            Construction HQ
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden items-center gap-2.5 rounded border-2 border-slate-700 bg-slate-950 px-3.5 py-1.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/40 md:flex">
          <Search
            size={16}
            strokeWidth={2.5}
            className="text-amber-500"
          />

          <input
            type="search"
            placeholder="Search projects, tasks, sites..."
            aria-label="Search"
            className="w-64 bg-transparent font-mono text-xs font-bold text-white placeholder-slate-400 outline-none"
          />

          <kbd className="rounded border-2 border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-black text-amber-400">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
            className={`relative rounded border-2 p-2 transition-colors ${
              notificationsOpen
                ? "border-amber-500 bg-slate-800 text-amber-400"
                : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Bell size={18} strokeWidth={2.5} />

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-amber-500 px-1 text-[10px] font-black leading-none text-slate-950">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationsOpen && (
            <>
              {/* Click outside to close */}
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setNotificationsOpen(false)}
                className="fixed inset-0 z-40 cursor-default bg-transparent"
              />

              <div
                role="dialog"
                aria-label="Recent notifications"
                className="absolute right-0 z-50 mt-3 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:w-[380px]"
              >
                {/* Dropdown heading */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Notifications
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {unreadCount === 0
                        ? "You're all caught up"
                        : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notification panel"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Dropdown actions */}
                {unreadCount > 0 && (
                  <div className="flex justify-end border-b border-slate-100 px-4 py-2">
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
                    >
                      <CheckCheck size={14} />
                      Mark all as read
                    </button>
                  </div>
                )}

                {/* Recent notification list */}
                <div className="max-h-[390px] overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-10 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Inbox size={23} />
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-800">
                        No notifications yet
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Updates will appear here when available.
                      </p>
                    </div>
                  ) : (
                    recentNotifications.map((notification) => {
                      const Icon =
                        notificationIcons[notification.type] || Bell;

                      const iconColor =
                        notificationColors[notification.type] ||
                        notificationColors.general;

                      return (
                        <div
                          key={notification.id}
                          className={`border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
                            notification.isRead ? "bg-white" : "bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                            >
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenNotification(notification)
                                }
                                className="block w-full text-left"
                              >
                                <div className="flex items-start gap-2">
                                  <p className="flex-1 text-sm font-bold leading-5 text-slate-900">
                                    {notification.title}
                                  </p>

                                  {!notification.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                  )}
                                </div>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {notification.message}
                                </p>

                                <p className="mt-2 text-[10px] text-slate-400">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </button>

                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                                >
                                  <Check size={13} />
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Full notifications page */}
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/notifications");
                  }}
                  className="flex w-full items-center justify-center gap-2 bg-slate-50 px-4 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  View all notifications
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="hidden h-6 w-0.5 bg-slate-800 sm:block" />

        {/* Logged-in User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-amber-500/60 bg-slate-950 font-mono text-xs font-black text-amber-400 shadow-inner">
            {initials}

            <HardHat
              size={11}
              strokeWidth={2.5}
              className="absolute -bottom-1 -right-1 text-amber-500"
            />
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-36 truncate text-xs font-black uppercase leading-none tracking-wide text-white">
              {user?.name || "User"}
            </p>

            <p className="mt-1 max-w-40 truncate font-mono text-[10px] font-extrabold uppercase leading-none text-slate-300">
              {user?.role || "Project Team"}
            </p>
          </div>

          <UserRound
            size={16}
            className="hidden text-slate-400 sm:block"
          />

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded border-2 border-slate-800 bg-slate-950 p-2 text-slate-300 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
