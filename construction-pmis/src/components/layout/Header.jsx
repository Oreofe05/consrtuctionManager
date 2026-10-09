import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  HardHat,
} from "lucide-react";

function Header({ setMobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-slate-800 bg-slate-900 px-4 text-white shadow-md sm:px-6 lg:px-8">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar menu"
          className="rounded border-2 border-slate-700 bg-slate-800 p-2 text-slate-200 transition-colors hover:border-amber-500 hover:bg-slate-700 hover:text-white lg:hidden"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Bolder Site Status Badge */}
        <div className="hidden items-center gap-2 rounded border-2 border-slate-800 bg-slate-950 px-3 py-1 text-xs font-black tracking-wider text-white sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono uppercase text-slate-400 font-extrabold">SITE:</span>
          <span className="font-mono text-amber-400 font-black">SECTOR-09</span>
        </div>

        {/* Bolder Technical Search Bar */}
        <div className="hidden items-center gap-2.5 rounded border-2 border-slate-700 bg-slate-950 px-3.5 py-1.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/40 md:flex">
          <Search size={16} strokeWidth={2.5} className="text-amber-500" />

          <input
            type="text"
            placeholder="Search blueprints, RFIs, sites..."
            className="w-64 bg-transparent font-mono text-xs font-bold text-white placeholder-slate-400 outline-none"
          />

          <kbd className="rounded border-2 border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-black text-amber-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell with High-Vis Amber Pulse */}
        <button 
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

        {/* Bolder User Profile Button */}
        <button className="group flex items-center gap-3 rounded border-2 border-transparent p-1 transition-all hover:border-slate-700 hover:bg-slate-800/80">
          <div className="relative flex h-8 w-8 items-center justify-center rounded border-2 border-amber-500/60 bg-slate-950 font-mono text-xs font-black text-amber-400 shadow-inner group-hover:border-amber-400">
            AO
            <HardHat size={11} strokeWidth={2.5} className="absolute -bottom-1 -right-1 text-amber-500" />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-black leading-none text-white uppercase tracking-wide group-hover:text-amber-400">
              Admin Officer
            </p>
            <p className="mt-1 font-mono text-[10px] font-extrabold leading-none text-slate-300">
              PROJECT ADMINISTRATOR
            </p>
          </div>

          <ChevronDown
            size={15}
            strokeWidth={2.5}
            className="hidden text-slate-400 transition-transform group-hover:text-amber-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;