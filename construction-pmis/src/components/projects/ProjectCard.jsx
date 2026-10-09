import {
  CalendarDays,
  MapPin,
  Wallet,
  ArrowUpRight,
  HardHat,
  Activity,
} from "lucide-react";
import ProjectStatus from "./ProjectStatus";

function ProjectCard({ project }) {
  return (
    <div className="group relative rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl text-white transition-all hover:border-slate-700 hover:shadow-2xl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
            <span className="rounded bg-slate-800 px-2 py-0.5 font-black uppercase tracking-wider text-amber-400 border-2 border-slate-700">
              {project.code}
            </span>
          </div>

          <h3 className="truncate font-mono text-base font-black uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
            {project.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-slate-300">
            <MapPin size={13} strokeWidth={2.5} className="text-amber-500 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
        </div>

        {/* Project Status Badge Component */}
        <div className="shrink-0">
          <ProjectStatus status={project.status} />
        </div>
      </div>

      {/* Industrial Progress Track */}
      <div className="mt-5 border-t-2 border-slate-800/80 pt-4">
        <div className="mb-2 flex items-center justify-between font-mono text-xs font-black">
          <span className="flex items-center gap-1.5 text-slate-300 uppercase">
            <Activity size={14} strokeWidth={2.5} className="text-amber-500" /> SITE PROGRESS
          </span>

          <span className="font-black text-amber-400">
            {project.progress}% <span className="text-[10px] text-slate-400 font-extrabold">COMPLETE</span>
          </span>
        </div>

        <div className="relative h-2.5 w-full overflow-hidden rounded-xs bg-slate-950 border-2 border-slate-800">
          <div
            className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Parameter Metric Blocks */}
      <div className="mt-5 grid grid-cols-2 gap-3 font-mono">
        <div className="rounded border-2 border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
            <Wallet size={13} strokeWidth={2.5} className="text-slate-300" />
            ALLOCATED BUDGET
          </div>

          <p className="mt-1 text-xs font-black text-white">
            {project.budget}
          </p>
        </div>

        <div className="rounded border-2 border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
            <CalendarDays size={13} strokeWidth={2.5} className="text-slate-300" />
            TARGET DEADLINE
          </div>

          <p className="mt-1 text-xs font-black text-white">
            {project.deadline}
          </p>
        </div>
      </div>

      {/* Footer Crew & Action */}
      <div className="mt-5 flex items-center justify-between border-t-2 border-slate-800/80 pt-3.5">
        {/* Operator Initials Badges */}
        <div className="flex items-center gap-1.5">
          <div className="mr-1 font-mono text-[10px] font-black text-slate-400 uppercase hidden sm:block">
            CREW:
          </div>
          <div className="flex -space-x-1">
            {project.team.map((member) => (
              <div
                key={member}
                className="flex h-7 w-7 items-center justify-center rounded border-2 border-slate-700 bg-slate-950 font-mono text-[10px] font-black text-amber-400 shadow-md transition-transform hover:z-10 hover:scale-110"
              >
                {member}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button className="group/btn flex items-center gap-1 font-mono text-xs font-black uppercase text-slate-200 transition-colors hover:text-amber-400">
          <span>SITE DOSSIER</span>
          <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;