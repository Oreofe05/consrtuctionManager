import {
  ArrowRight,
  Activity,
  ClipboardCheck,
  HardHat,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import ProjectHealth from "../components/dashboard/ProjectHealth";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import RecentActivity from "../components/dashboard/RecentActivity";
import BudgetChart from "../components/dashboard/BudgetChart";

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Activity size={14} />
            Project Control Center
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Good evening, Admin Officer.
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Here's what's happening across your construction projects today.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          <HardHat size={17} />
          New Project
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          type="projects"
          title="Active Projects"
          value="12"
          trend="+2"
          description="this month"
        />

        <StatCard
          type="completed"
          title="Completed Projects"
          value="27"
          trend="+4"
          description="this year"
        />

        <StatCard
          type="pending"
          title="Pending Activities"
          value="18"
          trend="-6"
          description="from last week"
        />

        <StatCard
          type="budget"
          title="Total Expenditure"
          value="₦184.6M"
          trend="68.4%"
          description="of allocated budget"
        />
      </div>

      {/* Main Dashboard */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProjectHealth />
        </div>

        <ProjectProgress />
      </div>

      {/* Financial + Deadlines */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <BudgetChart />
        <UpcomingDeadlines />
      </div>

      {/* Activity */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecentActivity />

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <ClipboardCheck size={21} />
              </div>

              <h2 className="text-xl font-semibold">
                Weekly Project Review
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                Three projects currently require attention. Review delayed
                activities, expenditure and submitted progress reports before
                the next project meeting.
              </p>
            </div>

            <button className="mt-8 flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Review Projects
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;