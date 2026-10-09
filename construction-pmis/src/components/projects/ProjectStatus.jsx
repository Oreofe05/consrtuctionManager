import React from "react";

function ProjectStatus({ status }) {
  const styles = {
    "On Track": {
      badge: "border-emerald-500 bg-emerald-950/90 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      dot: "bg-emerald-400",
      prefix: "●",
    },
    "At Risk": {
      badge: "border-amber-500 bg-amber-950/90 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      dot: "bg-amber-400",
      prefix: "▲",
    },
    Delayed: {
      badge: "border-rose-500 bg-rose-950/90 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
      dot: "bg-rose-500",
      prefix: "■",
    },
    Completed: {
      badge: "border-sky-500 bg-sky-950/90 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.2)]",
      dot: "bg-sky-400",
      prefix: "✓",
    },
  };

  const currentStyle = styles[status] || {
    badge: "border-slate-700 bg-slate-950 text-slate-300",
    dot: "bg-slate-400",
    prefix: "•",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider transition-all ${currentStyle.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`} />
      <span>{status}</span>
    </span>
  );
}

export default ProjectStatus;