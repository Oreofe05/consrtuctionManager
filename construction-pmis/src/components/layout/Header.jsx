
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  HardHat,
  LogOut,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // Get initials from the logged-in user's name
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
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded border-2 border-slate-800 bg-slate-950 p-2 text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          <Bell size={18} strokeWidth={2.5} />

          <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-slate-900" />
          </span>
        </button>

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

