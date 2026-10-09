import { AlertTriangle, CheckCircle2, CircleAlert, MapPin, ArrowRight } from "lucide-react";

const projects = [
  {
    name: "Faculty of Engineering Renovation",
    location: "Engineering Complex - Block A",
    progress: 78,
    status: "On Track",
    type: "success",
    code: "SITE-01",
  },
  {
    name: "Student Accommodation Block C",
    location: "Halls of Residence - East Wing",
    progress: 54,
    status: "At Risk",
    type: "warning",
    code: "SITE-02",
  },
  {
    name: "Central Library Extension",
    location: "Main Library - Foundation Zone",
    progress: 31,
    status: "Delayed",
    type: "danger",
    code: "SITE-03",
  },
];

const statusConfig = {
  success: {
    icon: CheckCircle2,
    className: "text-emerald-300 bg-emerald-950 border-emerald-500",
    bar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    textClass: "text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-amber-300 bg-amber-950 border-amber-500",
    bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    textClass: "text-amber-400",
  },
  danger: {
    icon: CircleAlert,
    className: "text-rose-300 bg-rose-950 border-rose-500",
    bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
    textClass: "text-rose-400",
  },
};

function ProjectHealth() {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800/80 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Active Project Health & Site Status
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-300">
            Real-time execution milestones & risk monitoring
          </p>
        </div>

        <button className="group flex items-center gap-1.5 rounded border-2 border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-black text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400">
          <span>VIEW ALL SITES</span>
          <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Projects List */}
      <div className="divide-y-2 divide-slate-800/80">
        {projects.map((project) => {
          const config = statusConfig[project.type];
          const Icon = config.icon;

          return (
            <div key={project.name} className="px-5 py-4.5 hover:bg-slate-950/60 transition-colors">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-black text-amber-400 border border-slate-700">
                      {project.code}
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wide text-white">
                      {project.name}
                    </h3>
                  </div>

                  <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-slate-300">
                    <MapPin size={13} className="text-amber-500 shrink-0" strokeWidth={2.5} />
                    {project.location}
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className={`self-start flex items-center gap-1.5 rounded border-2 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider ${config.className}`}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  {project.status}
                </div>
              </div>

              {/* Technical Progress Gauge */}
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-xs bg-slate-950 border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${config.bar}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 font-mono text-sm font-black text-white">
                  <span className={config.textClass}>{project.progress}%</span>
                  <span className="text-[10px] text-slate-400 font-extrabold">COMPLETE</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Bar */}
      <div className="border-t-2 border-slate-800/80 px-5 py-3 bg-slate-950/80 font-mono text-xs font-bold text-slate-300 flex items-center justify-between">
        <span>UPDATED 5 MINS AGO BY SITE SUP.</span>
        <span className="text-emerald-400 font-black">2 ON TRACK / 1 ACTION REQ.</span>
      </div>
    </div>
  );
}

export default ProjectHealth;