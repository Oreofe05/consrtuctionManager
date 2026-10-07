import { useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  AlertTriangle,
  CircleAlert,
} from "lucide-react";

import ProjectCard from "../components/projects/ProjectCard";
import ProjectFilters from "../components/projects/ProjectFilters";
import { Link } from "react-router-dom";

const projects = [
  {
    id: 1,
    code: "UI-ENG-001",
    name: "Faculty of Engineering Renovation",
    location: "Engineering Complex",
    status: "On Track",
    progress: 78,
    budget: "₦48.5M",
    deadline: "Nov 18, 2026",
    team: ["AO", "PM", "SE"],
  },
  {
    id: 2,
    code: "UI-HOS-002",
    name: "Student Accommodation Block C",
    location: "Halls of Residence",
    status: "At Risk",
    progress: 54,
    budget: "₦86.2M",
    deadline: "Dec 04, 2026",
    team: ["PM", "FO", "SE"],
  },
  {
    id: 3,
    code: "UI-LIB-003",
    name: "Central Library Extension",
    location: "Main Library",
    status: "Delayed",
    progress: 31,
    budget: "₦72.8M",
    deadline: "Oct 28, 2026",
    team: ["AO", "SE"],
  },
  {
    id: 4,
    code: "UI-SCI-004",
    name: "Science Complex Development",
    location: "Science Faculty",
    status: "On Track",
    progress: 64,
    budget: "₦115.4M",
    deadline: "Jan 22, 2027",
    team: ["PM", "SE", "FO"],
  },
  {
    id: 5,
    code: "UI-ADM-005",
    name: "Administrative Block Renovation",
    location: "Administrative Area",
    status: "Completed",
    progress: 100,
    budget: "₦34.6M",
    deadline: "Sep 30, 2026",
    team: ["AO", "PM"],
  },
  {
    id: 6,
    code: "UI-LAB-006",
    name: "Computer Laboratory Upgrade",
    location: "Faculty of Science",
    status: "On Track",
    progress: 42,
    budget: "₦29.7M",
    deadline: "Dec 19, 2026",
    team: ["SE", "FO"],
  },
];

function Projects() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.code.toLowerCase().includes(search.toLowerCase()) ||
        project.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || project.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const statistics = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: "On Track",
      value: projects.filter((p) => p.status === "On Track").length,
      icon: CheckCircle2,
    },
    {
      label: "At Risk",
      value: projects.filter((p) => p.status === "At Risk").length,
      icon: AlertTriangle,
    },
    {
      label: "Delayed",
      value: projects.filter((p) => p.status === "Delayed").length,
      icon: CircleAlert,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Project Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage construction projects, monitor progress and track project
            health from one place.
          </p>
        </div>

        <Link
            to="/projects/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
            >
            <Plus size={17} />
            New Project
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                    {stat.value}
                  </p>
                </div>

                <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 sm:flex">
                  <Icon size={17} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <ProjectFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* Results */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </p>

          <p className="text-xs text-slate-400">
            Updated recently
          </p>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <FolderKanban
              size={32}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No projects found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;