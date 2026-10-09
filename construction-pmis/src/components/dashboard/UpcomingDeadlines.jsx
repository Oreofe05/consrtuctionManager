import { CalendarClock, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

const deadlines = [
  {
    task: "Foundation inspection",
    project: "Engineering Renovation",
    date: "Oct 09",
    priority: "High",
    code: "TSK-01",
  },
  {
    task: "Electrical installation",
    project: "Accommodation Block C",
    date: "Oct 11",
    priority: "Medium",
    code: "TSK-02",
  },
  {
    task: "Roofing completion",
    project: "Library Extension",
    date: "Oct 14",
    priority: "High",
    code: "TSK-03",
  },
  {
    task: "Material delivery",
    project: "Science Complex",
    date: "Oct 17",
    priority: "Low",
    code: "TSK-04",
  },
];

const priorityStyles = {
  High: {
    badge: "text-rose-300 bg-rose-950 border-rose-500",
    dot: "bg-rose-500",
  },
  Medium: {
    badge: "text-amber-300 bg-amber-950 border-amber-500",
    dot: "bg-amber-500",
  },
  Low: {
    badge: "text-emerald-300 bg-emerald-950 border-emerald-500",
    dot: "bg-emerald-500",
  },
};

function UpcomingDeadlines() {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800/80 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Target Field Schedule & Deadlines
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-300">
            Critical path inspections & site deliverables
          </p>
        </div>

        <button className="group flex items-center gap-1.5 rounded border-2 border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-black text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400">
          <span>ALL TASKS</span>
          <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Deadlines Item List */}
      <div className="divide-y-2 divide-slate-800/80">
        {deadlines.map((item) => {
          const style = priorityStyles[item.priority] || priorityStyles.Low;

          return (
            <div
              key={`${item.task}-${item.date}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-950/60 transition-colors group"
            >
              {/* Task Details */}
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 font-mono text-amber-400 shadow-inner group-hover:border-amber-500">
                  <CalendarClock size={19} strokeWidth={2.5} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-black text-amber-400 border border-slate-700">
                      {item.code || "TSK"}
                    </span>
                    <p className="truncate text-xs font-black uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                      {item.task}
                    </p>
                  </div>

                  <p className="mt-1 truncate font-mono text-xs font-bold text-slate-300">
                    {item.project}
                  </p>
                </div>
              </div>

              {/* Due Date & Priority Badge */}
              <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                <div className="rounded border-2 border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-xs font-black text-amber-400">
                  {item.date}
                </div>

                <div
                  className={`flex items-center gap-1.5 rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${style.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  {item.priority}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Bar */}
      <div className="border-t-2 border-slate-800/80 px-5 py-3 bg-slate-950/80 font-mono text-xs font-bold text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-amber-400 font-black">
          <ShieldAlert size={14} strokeWidth={2.5} /> 2 CRITICAL PATH ITEMS DUE THIS WEEK
        </span>
        <span className="text-slate-400 font-extrabold">GANTT AUTO-SYNC</span>
      </div>
    </div>
  );
}

export default UpcomingDeadlines;