import { AlertTriangle, CheckCircle2, CircleAlert } from "lucide-react";

const projects = [
  {
    name: "Faculty of Engineering Renovation",
    location: "Engineering Complex",
    progress: 78,
    status: "On Track",
    type: "success",
  },
  {
    name: "Student Accommodation Block C",
    location: "Halls of Residence",
    progress: 54,
    status: "At Risk",
    type: "warning",
  },
  {
    name: "Central Library Extension",
    location: "Main Library",
    progress: 31,
    status: "Delayed",
    type: "danger",
  },
];

const statusConfig = {
  success: {
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50",
    bar: "bg-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-amber-600 bg-amber-50",
    bar: "bg-amber-500",
  },
  danger: {
    icon: CircleAlert,
    className: "text-red-600 bg-red-50",
    bar: "bg-red-500",
  },
};

function ProjectHealth() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">
            Project Health
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Current status of active projects
          </p>
        </div>

        <button className="text-xs font-semibold text-slate-700 hover:text-slate-950">
          View all
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {projects.map((project) => {
          const config = statusConfig[project.type];
          const Icon = config.icon;

          return (
            <div key={project.name} className="px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {project.location}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
                >
                  <Icon size={13} />
                  {project.status}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${config.bar}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <span className="w-9 text-right text-xs font-semibold text-slate-700">
                  {project.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectHealth;