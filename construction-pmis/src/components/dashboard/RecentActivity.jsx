import { Clock, History, ArrowRight } from "lucide-react";

const activities = [
  {
    initials: "AO",
    role: "Admin Officer",
    text: "Admin Officer updated the progress of Engineering Renovation.",
    time: "18 minutes ago",
    isLive: true,
  },
  {
    initials: "PM",
    role: "Project Manager",
    text: "Project Manager added a new milestone to Accommodation Block C.",
    time: "1 hour ago",
    isLive: false,
  },
  {
    initials: "FO",
    role: "Finance Officer",
    text: "Finance Officer recorded a ₦4.2M expenditure.",
    time: "3 hours ago",
    isLive: false,
  },
  {
    initials: "SE",
    role: "Site Engineer",
    text: "Site Engineer submitted a weekly progress report.",
    time: "Yesterday",
    isLive: false,
  },
];

function RecentActivity() {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800/80 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Site Audit & Activity Log
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-300">
            Real-time field operations & financial log feed
          </p>
        </div>

        <button className="group flex items-center gap-1.5 rounded border-2 border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-black text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400">
          <span>FULL AUDIT</span>
          <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="p-5">
        <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-800">
          {activities.map((activity, index) => (
            <div key={activity.text || index} className="relative flex items-start gap-4 group">
              {/* Initials Technical Badge */}
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 font-mono text-xs font-black text-amber-400 shadow-md transition-colors group-hover:border-amber-500">
                {activity.initials}
              </div>

              {/* Log Entry Content */}
              <div className="flex-1 rounded border-2 border-slate-800 bg-slate-950 p-3.5 transition-colors group-hover:border-slate-700">
                <p className="text-xs font-extrabold text-white leading-relaxed font-sans">
                  {activity.text}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t-2 border-slate-800/80 pt-2 font-mono text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock size={13} strokeWidth={2.5} className="text-slate-400" />
                    {activity.time}
                  </span>

                  {activity.isLive ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-black">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE ENTRY
                    </span>
                  ) : (
                    <span className="text-slate-400 font-extrabold">LOGGED</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="border-t-2 border-slate-800/80 px-5 py-3 bg-slate-950/80 font-mono text-xs font-bold text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-amber-400 font-black">
          <History size={14} strokeWidth={2.5} /> ENCRYPTED FIELD AUDIT TRAIL
        </span>
        <span className="text-slate-400 font-extrabold">AUTO-SYNC ENABLED</span>
      </div>
    </div>
  );
}

export default RecentActivity;