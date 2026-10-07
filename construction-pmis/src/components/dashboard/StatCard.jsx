import {
  FolderKanban,
  CircleCheck,
  Clock3,
  Wallet,
} from "lucide-react";

const iconMap = {
  projects: FolderKanban,
  completed: CircleCheck,
  pending: Clock3,
  budget: Wallet,
};

function StatCard({ type, title, value, description, trend }) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-semibold text-emerald-600">
          {trend}
        </span>

        <span className="text-xs text-slate-400">{description}</span>
      </div>
    </div>
  );
}

export default StatCard;