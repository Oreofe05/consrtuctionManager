const activities = [
  {
    initials: "AO",
    text: "Admin Officer updated the progress of Engineering Renovation.",
    time: "18 minutes ago",
  },
  {
    initials: "PM",
    text: "Project Manager added a new milestone to Accommodation Block C.",
    time: "1 hour ago",
  },
  {
    initials: "FO",
    text: "Finance Officer recorded a ₦4.2M expenditure.",
    time: "3 hours ago",
  },
  {
    initials: "SE",
    text: "Site Engineer submitted a weekly progress report.",
    time: "Yesterday",
  },
];

function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Recent Activity
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Latest updates across the system
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((activity) => (
          <div key={activity.text} className="flex gap-3 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
              {activity.initials}
            </div>

            <div>
              <p className="text-sm leading-5 text-slate-700">
                {activity.text}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;