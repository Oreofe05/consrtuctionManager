import { CalendarClock } from "lucide-react";

const deadlines = [
  {
    task: "Foundation inspection",
    project: "Engineering Renovation",
    date: "Oct 09",
    priority: "High",
  },
  {
    task: "Electrical installation",
    project: "Accommodation Block C",
    date: "Oct 11",
    priority: "Medium",
  },
  {
    task: "Roofing completion",
    project: "Library Extension",
    date: "Oct 14",
    priority: "High",
  },
  {
    task: "Material delivery",
    project: "Science Complex",
    date: "Oct 17",
    priority: "Low",
  },
];

function UpcomingDeadlines() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Upcoming Deadlines
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Activities requiring attention
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {deadlines.map((item) => (
          <div
            key={`${item.task}-${item.date}`}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <CalendarClock size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {item.task}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {item.project}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-slate-900">
                {item.date}
              </p>

              <p
                className={`mt-1 text-[10px] font-semibold ${
                  item.priority === "High"
                    ? "text-red-600"
                    : item.priority === "Medium"
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {item.priority}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingDeadlines;