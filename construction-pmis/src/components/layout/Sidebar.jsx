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
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
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
    ],
  },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FolderKanban size={21} />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                BuildControl
              </h1>
              <p className="text-[11px] text-slate-500">
                Project Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((section) => (
            <div key={section.label} className="mb-7">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        group flex items-center gap-3 rounded-xl px-3 py-2.5
                        text-sm font-medium text-slate-600
                        transition-colors
                        hover:bg-slate-100 hover:text-slate-900
                        ${
                          item.name === "Dashboard"
                            ? "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                            : ""
                        }
                      `}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 p-4">
          <a
            href="/users"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Users size={18} strokeWidth={1.8} />
            Users
          </a>

          <a
            href="/settings"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings size={18} strokeWidth={1.8} />
            Settings
          </a>

          <a
            href="/help"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <HelpCircle size={18} strokeWidth={1.8} />
            Help & Support
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;