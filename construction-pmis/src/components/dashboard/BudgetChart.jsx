import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DollarSign, ArrowUpRight, ShieldAlert } from "lucide-react";

const data = [
  { month: "Jun", budget: 12, spent: 8 },
  { month: "Jul", budget: 18, spent: 14 },
  { month: "Aug", budget: 22, spent: 17 },
  { month: "Sep", budget: 28, spent: 21 },
  { month: "Oct", budget: 32, spent: 24 },
];

/* Bold Custom Monospaced Industrial Tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const budgetVal = payload.find((p) => p.dataKey === "budget")?.value || 0;
    const spentVal = payload.find((p) => p.dataKey === "spent")?.value || 0;
    const remaining = budgetVal - spentVal;

    return (
      <div className="rounded border-2 border-slate-700 bg-slate-950 p-3.5 font-mono shadow-2xl">
        <p className="text-xs font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800 pb-1.5 mb-2.5">
          MONTH: <span className="text-amber-400 font-black">{label}</span>
        </p>
        <div className="space-y-1.5 text-xs">
          <p className="flex justify-between gap-6 text-slate-200 font-extrabold">
            <span>Allocated:</span>
            <span className="font-black text-white">₦{budgetVal}M</span>
          </p>
          <p className="flex justify-between gap-6 text-amber-400 font-black">
            <span>Expended:</span>
            <span className="font-black">₦{spentVal}M</span>
          </p>
          <p className="flex justify-between gap-6 text-emerald-400 border-t-2 border-slate-800 pt-1.5 text-xs font-black">
            <span>Variance:</span>
            <span className="font-black">+₦{remaining}M under</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function BudgetChart() {
  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl text-white">
      {/* Chart Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Budget Utilization & Cost Control
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-300">
            Monthly cap allocation vs site expenditure log
          </p>
        </div>

        {/* Total Metric Badge */}
        <div className="flex items-center gap-3 rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400 shadow-inner">
            <DollarSign size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xl font-black text-white">₦24.6M</span>
              <span className="flex items-center text-xs font-mono font-black text-emerald-400">
                <ArrowUpRight size={14} strokeWidth={2.5} /> 75%
              </span>
            </div>
            <p className="font-mono text-[10px] font-black uppercase text-slate-400">
              Spent this month
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Chart Legend */}
      <div className="mt-4 flex items-center justify-end gap-5 font-mono text-xs font-black">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-slate-600" />
          <span className="text-slate-300 uppercase">Allocated Cap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-amber-500" />
          <span className="text-amber-400 uppercase">Actual Expended</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#475569", strokeWidth: 2 }}
              tickLine={{ stroke: "#475569", strokeWidth: 2 }}
              tick={{ fill: "#f1f5f9", fontSize: 12, fontFamily: "monospace", fontWeight: 800 }}
            />

            <YAxis
              axisLine={{ stroke: "#475569", strokeWidth: 2 }}
              tickLine={{ stroke: "#475569", strokeWidth: 2 }}
              tick={{ fill: "#f1f5f9", fontSize: 12, fontFamily: "monospace", fontWeight: 800 }}
              tickFormatter={(value) => `₦${value}M`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />

            <Bar
              dataKey="budget"
              fill="#475569"
              radius={[2, 2, 0, 0]}
              name="Budget"
            />

            <Bar
              dataKey="spent"
              fill="#f59e0b"
              radius={[2, 2, 0, 0]}
              name="Spent"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Industrial Footnote Status */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-slate-800/80 pt-3 font-mono text-xs font-black text-slate-300">
        <span className="flex items-center gap-1.5 text-amber-400">
          <ShieldAlert size={14} strokeWidth={2.5} /> ON TARGET: +₦8.0M REMAINING RESERVE
        </span>
        <span className="text-slate-400">REF: COST-LOG-2026-Q3</span>
      </div>
    </div>
  );
}

export default BudgetChart;