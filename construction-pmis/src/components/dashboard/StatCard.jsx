import {
  FolderKanban,
  CircleCheck,
  Clock3,
  Wallet,
  TrendingUp,
  Activity,
} from "lucide-react";

const iconMap = {
  projects: FolderKanban,
  completed: CircleCheck,
  pending: Clock3,
  budget: Wallet,
};

const styleMap = {
  projects: {
    badge: "border-amber-500/60 text-amber-400 bg-slate-950",
    indicator: "bg-amber-500",
  },
  completed: {
    badge: "border-emerald-500/60 text-emerald-400 bg-slate-950",
    indicator: "bg-emerald-500",
  },
  pending: {
    badge: "border-sky-500/60 text-sky-400 bg-slate-950",
    indicator: "bg-sky-500",
  },
  budget: {
    badge: "border-emerald-500/60 text-emerald-400 bg-slate-950",
    indicator: "bg-emerald-500",
  },
};

function StatCard({ type, title, value, description, trend }) {
  const Icon = iconMap[type] || FolderKanban;
  const cardStyle = styleMap[type] || styleMap.projects;

  const isNegative = trend && (trend.includes("-") || trend.toLowerCase().includes("delay") || trend.toLowerCase().includes("over"));

  return (
    <div className="group relative rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl text-white transition-all hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${cardStyle.indicator}`} />
            <p className="font-mono text-[11px] font-black uppercase tracking-wider text-slate-300">
              {title}
            </p>
          </div>

          {/* Bolder Value Text */}
          <h3 className="mt-2.5 font-mono text-3xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
            {value}
          </h3>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 font-mono shadow-inner ${cardStyle.badge}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t-2 border-slate-800/80 pt-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* Bolder Trend Text */}
          <span
            className={`flex items-center gap-1 font-black ${
              isNegative ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            <TrendingUp size={14} strokeWidth={2.5} className={isNegative ? "rotate-180" : ""} />
            {trend}
          </span>
          <span className="text-slate-600 font-bold">|</span>
          <span className="text-slate-300 font-bold truncate max-w-[140px]">{description}</span>
        </div>

        <Activity size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
      </div>
    </div>
  );
}

export default StatCard;