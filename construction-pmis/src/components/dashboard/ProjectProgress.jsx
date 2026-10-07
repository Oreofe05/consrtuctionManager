import { ArrowUpRight } from "lucide-react";

function ProjectProgress() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Overall Project Progress
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Across all active construction projects
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight size={14} />
          8.4%
        </div>
      </div>

      <div className="mt-7 flex items-center gap-6">
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(#0f172a 0deg 237deg, #e2e8f0 237deg 360deg)",
            }}
          />

          <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-white">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">66%</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Complete
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">Completed</p>
            <p className="mt-1 text-lg font-bold text-slate-900">14</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">In Progress</p>
            <p className="mt-1 text-lg font-bold text-slate-900">8</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Delayed</p>
            <p className="mt-1 text-lg font-bold text-red-600">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectProgress;