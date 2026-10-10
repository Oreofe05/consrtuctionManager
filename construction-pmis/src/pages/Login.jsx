import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-3 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  function fillDemoAccount(accountEmail, accountPassword) {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-white lg:grid lg:grid-cols-2">
      {/* Branding panel */}
      <section className="relative hidden overflow-hidden border-r-2 border-slate-800 bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full border-[55px] border-slate-800/40" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full border-[45px] border-slate-800/40" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 text-amber-400">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              BuildControl
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Project Management
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-5 inline-flex items-center gap-2 rounded border-2 border-amber-500/50 bg-slate-950 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <ShieldCheck size={16} strokeWidth={2.5} />
            CONSTRUCTION MANAGEMENT PLATFORM
          </div>

          <h2 className="text-4xl font-black uppercase tracking-tight leading-tight xl:text-5xl text-white">
            Every project.
            <br />
            Every resource.
            <br />
            <span className="text-amber-400">In one place.</span>
          </h2>

          <p className="mt-6 max-w-md text-xs font-bold leading-relaxed text-slate-300">
            Monitor construction projects, manage resource inventory, track expenditures, and review site progress from a centralized dashboard.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded border-2 border-slate-800 bg-slate-950 p-5 shadow-xl">
              <Building2 size={20} strokeWidth={2.5} className="text-amber-400" />
              <p className="mt-3 text-xs font-black uppercase text-white">Project Oversight</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                Keep track of schedules and deliverables.
              </p>
            </div>

            <div className="rounded border-2 border-slate-800 bg-slate-950 p-5 shadow-xl">
              <ShieldCheck size={20} strokeWidth={2.5} className="text-amber-400" />
              <p className="mt-3 text-xs font-black uppercase text-white">Role Access</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                Manage user permissions and accounts.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] font-black uppercase tracking-wider text-slate-400">
          UNIVERSITY OF IBADAN · INFRASTRUCTURE PROJECT MANAGEMENT
        </p>
      </section>

      {/* Login form */}
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 sm:px-10 lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
              <Building2 size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-black uppercase text-white">
                BuildControl
              </h1>
              <p className="text-[10px] font-black uppercase text-amber-400">
                Project Management
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-900 text-amber-400">
              <LockKeyhole size={22} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Welcome Back
            </h2>

            <p className="mt-1.5 text-xs font-bold leading-relaxed text-slate-400 uppercase">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                EMAIL ADDRESS <span className="text-amber-500">*</span>
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={2.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                  placeholder="name@buildcontrol.demo"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-xs font-black uppercase tracking-wider text-slate-300"
                >
                  PASSWORD <span className="text-amber-500">*</span>
                </label>
                <span className="text-[10px] font-black uppercase text-amber-400">
                  DEMO CREDENTIALS BELOW
                </span>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  strokeWidth={2.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                  placeholder="Enter your password"
                  className={`${inputClass} pl-10 pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-800 p-1.5 text-slate-400 hover:border-amber-500 hover:text-amber-400"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded border-2 border-rose-500 bg-rose-950/80 p-3 text-xs font-black uppercase text-rose-300"
              >
                <AlertTriangle size={16} strokeWidth={2.5} className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-4 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{loading ? "SIGNING IN..." : "SIGN IN"}</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </form>

          {/* Demo account shortcuts */}
          <div className="mt-8 rounded-md border-2 border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={15} strokeWidth={2.5} />
              <span>QUICK DEMO ACCESS</span>
            </div>

            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              Click a role to quickly populate credentials:
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  fillDemoAccount("admin@buildcontrol.demo", "Admin@123")
                }
                className="rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                Administrator
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount("manager@buildcontrol.demo", "Manager@123")
                }
                className="rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                Project Manager
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount("engineer@buildcontrol.demo", "Engineer@123")
                }
                className="rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                Site Engineer
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount("finance@buildcontrol.demo", "Finance@123")
                }
                className="rounded border-2 border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
              >
                Finance Officer
              </button>
            </div>
          </div>

          <p className="mt-7 text-center text-[10px] font-black uppercase tracking-wider text-slate-500 leading-relaxed">
            BUILDCONTROL · UNIVERSITY OF IBADAN CASE STUDY
            <br />
            DEMO MODE — NO REAL CREDENTIALS REQUIRED.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;