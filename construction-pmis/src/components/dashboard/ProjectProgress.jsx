import { ArrowUpRight, Activity, Layers, AlertCircle, CheckCircle } from "lucide-react";

function ProjectProgress() {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Overall Execution Progress
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-300">
            Across active site sectors & structural phases
          </p>
        </div>

        {/* Growth Rate Metric Badge */}
        <div className="flex items-center gap-1 rounded border-2 border-emerald-500/50 bg-emerald-950 px-2.5 py-1 font-mono text-xs font-black text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
          <ArrowUpRight size={15} strokeWidth={2.5} />
          <span>+8.4%</span>
        </div>
      </div>

      {/* Main Gauge & Metrics Grid */}
      <div className="mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Radial Conic Gauge */}
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-slate-950 p-2 border-2 border-slate-800 shadow-2xl">
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background:
                "conic-gradient(#f59e0b 0deg 237deg, #334155 237deg 360deg)",
            }}
          />

          {/* Inner Gauge Cutout */}
          <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-slate-900 border-2 border-slate-800 shadow-md">
            <div className="text-center">
              <p className="font-mono text-4xl font-black tracking-tight text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                66%
              </p>
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-300">
                TOTAL DONE
              </p>
            </div>
          </div>
        </div>

        {/* Bolder Structured Metric Rows */}
        <div className="w-full flex-1 space-y-2.5 font-mono">
          {/* Completed Block */}
          <div className="flex items-center justify-between rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} strokeWidth={2.5} className="text-emerald-400" />
              <span className="text-xs font-black text-slate-200">COMPLETED</span>
            </div>
            <span className="text-base font-black text-emerald-400">14</span>
          </div>

          {/* In Progress Block */}
          <div className="flex items-center justify-between rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <Activity size={16} strokeWidth={2.5} className="text-amber-400 animate-pulse" />
              <span className="text-xs font-black text-slate-200">IN PROGRESS</span>
            </div>
            <span className="text-base font-black text-amber-400">8</span>
          </div>

          {/* Delayed Block */}
          <div className="flex items-center justify-between rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} strokeWidth={2.5} className="text-rose-400" />
              <span className="text-xs font-black text-slate-200">DELAYED</span>
            </div>
            <span className="text-base font-black text-rose-400">3</span>
          </div>
        </div>
      </div>

      {/* Industrial Footer Status */}
      <div className="mt-5 flex items-center justify-between border-t-2 border-slate-800/80 pt-3 font-mono text-xs font-black text-slate-300">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Layers size={14} strokeWidth={2.5} /> PHASE 3: STRUCTURAL FRAMING
        </span>
        <span className="text-slate-400">25 TOTAL SITES</span>
      </div>
    </div>
  );
}

export default ProjectProgress;