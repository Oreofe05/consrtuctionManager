import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-2">
      {/* Left panel */}
      <section className="relative hidden overflow-hidden border-r border-slate-800 bg-slate-900 p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">BuildControl</h1>
            <p className="text-xs text-amber-400">Project Management</p>
          </div>
        </div>

        <div className="max-w-lg">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-950 px-3.5 py-1.5 text-xs font-medium text-amber-400">
            <ShieldCheck size={14} />
            Construction Management Platform
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Every project.
            <br />
            Every resource.
            <br />
            <span className="text-amber-400">In one place.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
            Monitor construction projects, manage resources, track spending, and
            review site progress from one dashboard.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          University of Ibadan · Infrastructure Project Management
        </p>
      </section>

      {/* Right panel */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <LockKeyhole size={22} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  placeholder="name@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  placeholder="Enter your password"
                  className={`${inputClass} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-amber-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:opacity-70"
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-amber-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;