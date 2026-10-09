
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
  Activity,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
        end: true,
      },
    ],
  },
  {
    label: "Project Management",
    items: [
      {
        name: "Projects",
        icon: FolderKanban,
        path: "/projects",
      },
      {
        name: "Tasks & Activities",
        icon: ListTodo,
        path: "/tasks",
      },
      {
        name: "Schedule",
        icon: CalendarDays,
        path: "/schedule",
      },
    ],
  },
  {
    label: "Resources & Finance",
    items: [
      {
        name: "Resources",
        icon: Package,
        path: "/resources",
      },
      {
        name: "Expenditure",
        icon: Wallet,
        path: "/expenditure",
      },
    ],
  },
  {
    label: "Monitoring",
    items: [
      {
        name: "Progress",
        icon: TrendingUp,
        path: "/progress",
      },
      {
        name: "Reports",
        icon: FileText,
        path: "/reports",
      },
      {
        name: "Notifications",
        icon: Bell,
        path: "/notifications",
      },
    ],
  },
];

const bottomNavigation = [
  { name: "Users & Crews", icon: Users, path: "/users" },
  { name: "System Settings", icon: Settings, path: "/settings" },
  { name: "Help & Specs", icon: HelpCircle, path: "/help" },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const linkClasses = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-black transition-all duration-150 ${
      isActive
        ? "bg-slate-900 text-amber-400 border-l-4 border-amber-500 shadow-md"
        : "text-slate-200 hover:bg-slate-900/80 hover:text-white border-l-4 border-transparent"
    }`;


  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r-2 border-slate-800 bg-slate-950 text-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b-2 border-slate-800/80 px-4">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded border-2 border-amber-500/60 bg-slate-900 text-amber-400 shadow-inner group-hover:border-amber-400">
              <HardHat size={19} strokeWidth={2.5} className="transition-transform group-hover:scale-105" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-mono text-base font-black tracking-wider text-white uppercase">
                  BuildControl
                </h1>
                <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] font-black text-amber-400 border-2 border-slate-700">
                  v2.4
                </span>
              </div>
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                Site Ops & Construction
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded border-2 border-slate-800 bg-slate-900 p-1.5 text-slate-300 transition-colors hover:text-white lg:hidden"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-thumb-slate-800">
          {navigation.map((section) => (
            <div key={section.label} className="mb-6">
              <div className="mb-2 flex items-center justify-between px-3">
                <p className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">
                  {section.label}
                </p>
                <div className="h-0.5 flex-1 bg-slate-800 ml-2" />
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={linkClasses}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={17}
                            strokeWidth={2.5}
                            className={`transition-colors ${
                              isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400"
                            }`}
                          />
                          <span className="truncate uppercase tracking-wide">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Site Operational Status Card */}
        <div className="mx-3 my-2 rounded border-2 border-slate-800 bg-slate-900 p-3 shadow-md">
          <div className="flex items-center justify-between font-mono text-xs text-slate-200 font-extrabold">
            <span className="flex items-center gap-1.5 text-emerald-400 font-black">
              <Activity size={14} strokeWidth={2.5} /> ALL SYSTEMS GO
            </span>
            <span className="text-amber-400 font-black">98.4% EFF</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: "84%" }} />
          </div>
          <p className="mt-2 font-mono text-[10px] font-extrabold text-slate-300 text-right uppercase">
            Active Shift: <strong className="text-white">Crew B (Day)</strong>
          </p>
        </div>

        {/* Bottom Nav Section */}
        <div className="shrink-0 border-t-2 border-slate-800/80 p-3 space-y-1 bg-slate-950">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={linkClasses}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      strokeWidth={2.5}
                      className={`transition-colors ${
                        isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400"
                      }`}
                    />
                    <span className="truncate uppercase tracking-wide">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;