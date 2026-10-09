import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-white selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Background Architectural Grid Pattern Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: `24px 24px`
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Viewport Container (Aligned to w-64 sidebar width) */}
      <div className="flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
        <Header setMobileOpen={setMobileOpen} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Industrial Site Footer Bar */}
        <footer className="border-t-2 border-slate-800 bg-slate-950 px-4 py-3 font-mono text-xs font-bold text-slate-300 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-black text-white">BUILDCONTROL PLATFORM v2.4</span>
            <span className="text-slate-700 font-black">|</span>
            <span className="text-emerald-400 font-black">FIELD OPERATIONS ACTIVE</span>
          </div>
          <div>
            <span className="text-amber-400 font-black">ENCRYPTED PROTOCOL TLS 1.3</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;