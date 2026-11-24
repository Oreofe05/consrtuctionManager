import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-white antialiased">
      {/* Soft background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content area */}
      <div className="relative flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Clean simple footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} BuildControl · University of Ibadan
            </p>
            <p className="text-slate-600">
              Construction Project Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;