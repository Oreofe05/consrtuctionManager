import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jun", budget: 12, spent: 8 },
  { month: "Jul", budget: 18, spent: 14 },
  { month: "Aug", budget: 22, spent: 17 },
  { month: "Sep", budget: 28, spent: 21 },
  { month: "Oct", budget: 32, spent: 24 },
];

function BudgetChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Budget Utilization
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Monthly budget against expenditure
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">₦24.6M</p>
          <p className="text-[11px] text-slate-400">spent this month</p>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `₦${value}M`}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              formatter={(value) => `₦${value}M`}
            />

            <Bar
              dataKey="budget"
              fill="#cbd5e1"
              radius={[5, 5, 0, 0]}
              name="Budget"
            />

            <Bar
              dataKey="spent"
              fill="#0f172a"
              radius={[5, 5, 0, 0]}
              name="Spent"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BudgetChart;