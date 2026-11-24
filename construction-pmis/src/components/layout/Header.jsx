import { useCallback, useEffect, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  LogOut,
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
  if (Number.isNaN(date.getTime())) return "";

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

  useEffect(() => {
    const handleFocus = () => refreshNotifications();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshNotifications]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
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
      navigate(`/projects/${encodeURIComponent(notification.projectCode)}`);
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

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 transition focus-within:border-amber-500/50 md:flex">
          <Search size={16} className="text-slate-500" />
          <input
            type="search"
            placeholder="Search projects, tasks..."
            className="w-56 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className={`relative rounded-xl p-2 transition ${
              notificationsOpen
                ? "bg-amber-500/10 text-amber-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="fixed inset-0 z-40 cursor-default bg-transparent"
              />

              <div className="absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Notifications
                    </h2>
                    <p className="text-xs text-slate-500">
                      {unreadCount === 0
                        ? "You're all caught up"
                        : `${unreadCount} unread`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                {unreadCount > 0 && (
                  <div className="flex justify-end border-b border-slate-100 px-4 py-2">
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      <CheckCheck size={14} />
                      Mark all as read
                    </button>
                  </div>
                )}

                <div className="max-h-[360px] overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-10 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Inbox size={20} />
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-800">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    recentNotifications.map((notification) => {
                      const Icon = notificationIcons[notification.type] || Bell;
                      const iconColor =
                        notificationColors[notification.type] ||
                        notificationColors.general;

                      return (
                        <div
                          key={notification.id}
                          className={`border-b border-slate-100 p-3.5 transition hover:bg-slate-50 ${
                            notification.isRead ? "bg-white" : "bg-blue-50/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                            >
                              <Icon size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => handleOpenNotification(notification)}
                                className="block w-full text-left"
                              >
                                <div className="flex items-start gap-2">
                                  <p className="flex-1 text-sm font-medium leading-5 text-slate-900">
                                    {notification.title}
                                  </p>
                                  {!notification.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                  )}
                                </div>
                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                  {notification.message}
                                </p>
                                <p className="mt-1.5 text-[11px] text-slate-400">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </button>

                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600"
                                >
                                  <Check size={12} />
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

                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/notifications");
                  }}
                  className="flex w-full items-center justify-center gap-2 bg-slate-50 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  View all notifications
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="hidden h-6 w-px bg-slate-800 sm:block" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-400">
            {initials}
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-32 truncate text-sm font-medium text-white">
              {user?.name || "User"}
            </p>
            <p className="max-w-36 truncate text-xs text-slate-500">
              {user?.role || "Team Member"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;