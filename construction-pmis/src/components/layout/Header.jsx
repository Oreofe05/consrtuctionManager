import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

function Header({ setMobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />

          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-400">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        <button className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            AO
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">
              Admin Officer
            </p>
            <p className="text-xs text-slate-500">
              Project Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;