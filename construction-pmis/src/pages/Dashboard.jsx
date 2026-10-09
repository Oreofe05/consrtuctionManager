import {
  ArrowRight,
  Activity,
  ClipboardCheck,
  HardHat,
  ShieldAlert,
  Clock,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import ProjectHealth from "../components/dashboard/ProjectHealth";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import RecentActivity from "../components/dashboard/RecentActivity";
import BudgetChart from "../components/dashboard/BudgetChart";

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-12 text-white">
      {/* Page Header / Site Control Terminal */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          {/* Breadcrumb & Operational Badge */}
          <div className="mb-2.5 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <Activity size={15} strokeWidth={2.5} className="animate-pulse" /> SITE CONTROL TERMINAL
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">SECTOR-09 OVERVIEW</span>
          </div>

          <h1 className="font-mono text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Site Ops: <span className="text-amber-400">Admin Officer</span>
          </h1>

          <p className="mt-2 max-w-2xl font-mono text-xs font-bold text-slate-300 leading-relaxed">
            Real-time field operations, critical path deadlines, and budget tracking across active sites.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded border-2 border-slate-800 bg-slate-900 px-3.5 py-2 font-mono text-xs font-extrabold text-slate-200">
            <Clock size={15} strokeWidth={2.5} className="text-amber-500" />
            <span>SHIFT TIME: <strong className="text-white font-black">09:42 WAT</strong></span>
          </div>

          <button className="group flex items-center gap-2.5 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_0_22px_rgba(245,158,11,0.5)]">
            <HardHat size={18} strokeWidth={2.5} />
            <span>NEW SITE PROJECT</span>
            <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          type="projects"
          title="Active Site Projects"
          value="12"
          trend="+2 ACTIVE"
          description="this month"
        />

        <StatCard
          type="completed"
          title="Handed Over Projects"
          value="27"
          trend="+4 DELIVERED"
          description="this year"
        />

        <StatCard
          type="pending"
          title="Pending Site RFIs"
          value="18"
          trend="-6 ACTION REQ"
          description="from last week"
        />

        <StatCard
          type="budget"
          title="Total Expenditure Log"
          value="₦184.6M"
          trend="68.4% UTILIZED"
          description="of allocated cap"
        />
      </div>

      {/* Main Execution Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProjectHealth />
        </div>

        <ProjectProgress />
      </div>

      {/* Financial & Field Schedule */}
      <div className="grid gap-6 xl:grid-cols-2">
        <BudgetChart />
        <UpcomingDeadlines />
      </div>

      {/* Activity Log & Directive Banner */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentActivity />

        {/* Weekly Field Review Banner */}
        <div className="relative overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 p-6 shadow-xl text-white flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-mono text-amber-400 shadow-inner">
                <ClipboardCheck size={22} strokeWidth={2.5} />
              </div>

              <span className="flex items-center gap-1.5 rounded border-2 border-amber-500/50 bg-amber-950 px-2.5 py-1 font-mono text-xs font-black text-amber-400 uppercase">
                <ShieldAlert size={14} strokeWidth={2.5} /> ACTION REQUIRED
              </span>
            </div>

            <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
              Weekly Field Operations Review
            </h2>

            <p className="mt-2.5 max-w-md font-sans text-xs font-bold leading-relaxed text-slate-200">
              Three site sectors currently require immediate administrative attention. Review flagged delays, expenditure variances, and field reports before the upcoming site coordinator briefing.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t-2 border-slate-800/80 pt-4 font-mono text-xs">
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-3">
                <span className="text-slate-400 block uppercase font-black text-[10px]">FLAGGED DELAYS</span>
                <span className="text-rose-400 font-black text-base">3 SITES</span>
              </div>
              <div className="rounded border-2 border-slate-800 bg-slate-950 p-3">
                <span className="text-slate-400 block uppercase font-black text-[10px]">NEXT BRIEFING</span>
                <span className="text-amber-400 font-black text-base">14:00 WAT</span>
              </div>
            </div>
          </div>

          <button className="mt-6 flex w-fit items-center gap-2 rounded border-2 border-slate-700 bg-slate-800 px-5 py-3 font-mono text-xs font-black text-white transition-colors hover:border-amber-500 hover:bg-slate-700 hover:text-amber-400">
            <span>REVIEW SITE DOSSIERS</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;