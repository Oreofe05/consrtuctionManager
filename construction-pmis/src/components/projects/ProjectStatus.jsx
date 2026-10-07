function ProjectStatus({ status }) {
  const styles = {
    "On Track": "bg-emerald-50 text-emerald-700",
    "At Risk": "bg-amber-50 text-amber-700",
    Delayed: "bg-red-50 text-red-700",
    Completed: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default ProjectStatus;