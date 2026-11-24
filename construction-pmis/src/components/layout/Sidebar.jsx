import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  CalendarDays,
  Package,
  Wallet,
  TrendingUp,
  FileText,
  Users,
  Settings,
  HelpCircle,
  X,
  HardHat,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// What each role is allowed to see
const ROLE_MENUS = {
  "System Administrator": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/expenditure",
    "/progress",
    "/reports",
    "/notifications",
    "/users",
    "/settings",
    "/help",
  ],
  "Project Manager": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/expenditure",
    "/progress",
    "/reports",
    "/notifications",
    "/settings",
    "/help",
  ],
  "Site Engineer": [
    "/",
    "/projects",
    "/tasks",
    "/schedule",
    "/resources",
    "/progress",
    "/notifications",
    "/help",
  ],
  "Finance Officer": [
    "/",
    "/projects",
    "/expenditure",
    "/reports",
    "/notifications",
    "/help",
  ],
};

const navigation = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/", end: true },
    ],
  },
  {
    label: "Project Management",
    items: [
      { name: "Projects", icon: FolderKanban, path: "/projects" },
      { name: "Tasks & Activities", icon: ListTodo, path: "/tasks" },
      { name: "Schedule", icon: CalendarDays, path: "/schedule" },
    ],
  },
  {
    label: "Resources & Finance",
    items: [
      { name: "Resources", icon: Package, path: "/resources" },
      { name: "Expenditure", icon: Wallet, path: "/expenditure" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { name: "Progress", icon: TrendingUp, path: "/progress" },
      { name: "Reports", icon: FileText, path: "/reports" },
      { name: "Notifications", icon: Bell, path: "/notifications" },
    ],
  },
];

const bottomNavigation = [
  { name: "Users & Crews", icon: Users, path: "/users" },
  { name: "System Settings", icon: Settings, path: "/settings" },
  { name: "Help & Support", icon: HelpCircle, path: "/help" },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user } = useAuth();
  const role = user?.role || "";
  const allowedPaths = ROLE_MENUS[role] || [];

  const canShow = (path) => allowedPaths.includes(path);

  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-amber-500/10 text-amber-400"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-slate-800/80 bg-slate-950
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <HardHat size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white">
                BuildControl
              </h1>
              <p className="text-[11px] text-slate-500">University of Ibadan</p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((section) => {
            const visibleItems = section.items.filter((item) =>
              canShow(item.path)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-6">
                <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        className={linkClasses}
                      >
                        <Icon size={18} strokeWidth={1.75} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="shrink-0 border-t border-slate-800/80 p-3 space-y-0.5">
          {bottomNavigation
            .filter((item) => canShow(item.path))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={linkClasses}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;