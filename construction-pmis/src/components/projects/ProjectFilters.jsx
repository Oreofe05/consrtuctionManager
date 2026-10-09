import { Search, SlidersHorizontal, Filter, ChevronDown } from "lucide-react";

function ProjectFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border-2 border-slate-800 bg-slate-900 p-3 shadow-xl text-white md:flex-row md:items-center md:justify-between">
      
      {/* Industrial Search Terminal */}
      <div className="relative w-full md:max-w-md">
        <Search
          size={16}
          strokeWidth={2.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search site codes, project titles, locations..."
          className="h-10 w-full rounded border-2 border-slate-800 bg-slate-950 pl-9 pr-16 font-mono text-xs font-black text-white placeholder-slate-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40"
        />

        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-black text-slate-300">
          FILTER
        </span>
      </div>

      {/* Filter Options Group */}
      <div className="flex w-full items-center gap-2.5 sm:w-auto">
        
        {/* Status Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <SlidersHorizontal
            size={15}
            strokeWidth={2.5}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full appearance-none rounded border-2 border-slate-800 bg-slate-950 pl-9 pr-9 font-mono text-xs font-black text-amber-400 outline-none transition-colors hover:border-slate-700 focus:border-amber-500 sm:w-48"
          >
            <option value="All" className="bg-slate-950 text-white font-black">
              [ ALL STATUSES ]
            </option>
            <option value="On Track" className="bg-slate-950 text-emerald-400 font-black">
              ● ON TRACK
            </option>
            <option value="At Risk" className="bg-slate-950 text-amber-400 font-black">
              ▲ AT RISK
            </option>
            <option value="Delayed" className="bg-slate-950 text-rose-400 font-black">
              ■ DELAYED
            </option>
            <option value="Completed" className="bg-slate-950 text-sky-400 font-black">
              ✓ COMPLETED
            </option>
          </select>

          <ChevronDown
            size={15}
            strokeWidth={2.5}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Filter Specs Button */}
        <button className="hidden h-10 items-center gap-2 rounded border-2 border-slate-700 bg-slate-800 px-4 font-mono text-xs font-black text-white transition-colors hover:border-amber-500 hover:text-amber-400 sm:flex">
          <Filter size={14} strokeWidth={2.5} className="text-amber-500" />
          <span>MORE PARAMETERS</span>
        </button>
      </div>
    </div>
  );
}

export default ProjectFilters;