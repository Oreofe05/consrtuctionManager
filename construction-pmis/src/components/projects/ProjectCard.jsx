import {
  CalendarDays,
  MapPin,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import ProjectStatus from "./ProjectStatus";

function ProjectCard({ project }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-900" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {project.code}
            </span>
          </div>

          <h3 className="truncate text-base font-semibold text-slate-900">
            {project.name}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} />
            <span className="truncate">{project.location}</span>
          </div>
        </div>

        <ProjectStatus status={project.status} />
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            Project progress
          </span>

          <span className="text-xs font-bold text-slate-900">
            {project.progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Wallet size={13} />
            Budget
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {project.budget}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CalendarDays size={13} />
            Deadline
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {project.deadline}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex -space-x-2">
          {project.team.map((member) => (
            <div
              key={member}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-700"
            >
              {member}
            </div>
          ))}
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 transition group-hover:text-slate-900">
          View details
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;