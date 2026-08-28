import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Check,
  ClipboardList,
  Clock3,
  Home,
  Moon,
  Sun,
  UserRound,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminBrandLockup from "./AdminBrandLockup";
import { useAdminTheme } from "./useAdminTheme";

const auraLayers = [
  {
    background:
      "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
    mixBlendMode: "screen",
    filter: "blur(125px)"
  },
  {
    background:
      "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
    mixBlendMode: "screen",
    filter: "blur(50px)"
  }
];

const lightAuraLayers = [
  {
    background:
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(178,235,242,0.12) 28%, rgb(255,255,255) 18%, rgb(77,182,200) 68%, rgb(45,100,130) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)"
  },
  {
    background:
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(178,235,242,0.22) 34%, rgb(255,255,255) 66%, rgb(77,182,200) 82%, rgb(45,100,130) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)"
  }
];

function AdminDashboardPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
      {auraLayers.map((layer, index) => (
        <div
          key={`dark-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)",
            opacity: isLightMode ? 0 : 1
          }}
        />
      ))}

      {lightAuraLayers.map((layer, index) => (
        <div
          key={`light-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)",
            opacity: isLightMode ? 1 : 0
          }}
        />
      ))}

      <section className={`admin-dashboard-welcome relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : ""}`}>
        <div className="admin-dashboard-reveal flex items-center justify-between" style={{ "--dashboard-delay": "80ms" }}>
          <div>
            <AdminBrandLockup />
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLightMode((currentMode) => !currentMode)}
              aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
              className={`group relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${isLightMode ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"}`}
            >
              <Sun size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-0 scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"}`} aria-hidden="true" />
              <Moon size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-90 scale-75 opacity-50" : "rotate-0 scale-110 opacity-100"}`} aria-hidden="true" />
              <span className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${isLightMode ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60" : "translate-x-0 bg-cyan-200 shadow-lg shadow-cyan-200/50"}`}>
                <span className="absolute inset-0 rounded-full bg-white/30 transition-opacity duration-700 group-hover:opacity-80" />
              </span>
            </button>

            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-xl transition ${isLightMode ? "border-slate-300 bg-white/70 text-slate-700 shadow-slate-300/30 hover:bg-white" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 hover:bg-white/20"}`}
            >
              <Home size={16} aria-hidden="true" />
              Home
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-reveal admin-glass-card mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-white/30 p-5 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl sm:flex-row sm:items-center" style={{ "--dashboard-delay": "180ms" }}>
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">All systems operational</p>
              <p className="mt-1 text-xs text-white/55">Your city platform is running smoothly.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-white/60">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" aria-hidden="true" />
              99.9% uptime
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <Clock3 size={16} className="text-cyan-200" aria-hidden="true" />
              Updated just now
            </span>
          </div>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-5 md:grid-cols-3" style={{ "--dashboard-delay": "280ms" }}>
          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-100">
                <Users size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                People
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Registered Users</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">2480</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Total active accounts</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan-200/70">
              <Activity size={14} aria-hidden="true" />
              Growing community
            </div>
          </article>

          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-emerald-100">
                <UserRound size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Network
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Agency Members</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">128</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Across all agencies</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-200/70">
              <Activity size={14} aria-hidden="true" />
              Active network
            </div>
          </article>

          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-amber-100">
                <Building2 size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Partners
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Agencies</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">4</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Registered service agencies</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-amber-200/70">
              <Activity size={14} aria-hidden="true" />
              Service coverage
            </div>
          </article>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-5 md:grid-cols-3" style={{ "--dashboard-delay": "380ms" }}>
          <Link
            to="/admin/users"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-100">
                <Users size={22} aria-hidden="true" />
              </div>
              <ArrowUpRight size={21} className="text-white/50 transition group-hover:text-white" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/50">People</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight">Manage Users</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Review registered citizens and manage account access.</p>
          </Link>

          <Link
            to="/admin/agencies"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-emerald-100">
                <Building2 size={22} aria-hidden="true" />
              </div>
              <ArrowUpRight size={21} className="text-white/50 transition group-hover:text-white" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/50">Partners</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight">Manage Agencies</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Organize agencies and manage their assigned members.</p>
          </Link>
          <Link
            to="/admin/complaints"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-amber-100">
                <ClipboardList size={22} aria-hidden="true" />
              </div>
              <ArrowUpRight size={21} className="text-white/50 transition group-hover:text-white" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/50">Reports</p>
            <h2 className="mt-2 text-xl font-bold text-white">View All Complaints</h2>

            <p className="mt-3 text-sm leading-6 text-white/60">Monitor complaints and their current statuses.</p>
          </Link>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-5 lg:grid-cols-[1.35fr_1fr]" style={{ "--dashboard-delay": "480ms" }}>
          <section className="admin-glass-card flex min-h-72 h-full flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100/60">
                  Live feed
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">Recent activity</h2>
              </div>
              <Activity size={21} className="text-cyan-200/70" aria-hidden="true" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="admin-glass-card live-feed-row new-citizen-card flex items-start gap-4 rounded-xl border border-white/10 px-3 py-4 first:pt-4">
                <div className="mt-1 rounded-full bg-cyan-300/15 p-2 text-cyan-200">
                  <Users size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">New citizen account registered</p>
                  <p className="mt-1 text-xs text-white/50">Ananya Sen joined the platform</p>
                </div>
                <span className="whitespace-nowrap text-xs text-white/40">12 min ago</span>
              </div>

              <div className="admin-glass-card live-feed-row flex items-start gap-4 rounded-xl border border-white/10 px-3 py-4">
                <div className="mt-1 rounded-full bg-amber-300/15 p-2 text-amber-200">
                  <ClipboardList size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Complaint moved under investigation</p>
                  <p className="mt-1 text-xs text-white/50">Report #102 was assigned to KMC Water</p>
                </div>
                <span className="whitespace-nowrap text-xs text-white/40">28 min ago</span>
              </div>

              <div className="admin-glass-card live-feed-row flex items-start gap-4 rounded-xl border border-white/10 px-3 py-4 last:pb-4">
                <div className="mt-1 rounded-full bg-emerald-300/15 p-2 text-emerald-200">
                  <Check size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Public facility issue resolved</p>
                  <p className="mt-1 text-xs text-white/50">New Market Parking report completed</p>
                </div>
                <span className="whitespace-nowrap text-xs text-white/40">1 hr ago</span>
              </div>
            </div>
          </section>

          <section className="admin-glass-card admin-status-card flex h-full min-h-72 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/60">
                  Current queue
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">Complaint status</h2>
              </div>
              <Link
                to="/admin/complaints"
                className="text-xs font-semibold text-amber-200 transition hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="mt-7 space-y-3">
              <div className="admin-glass-card queue-status-row pending-request-card rounded-xl border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/70">Pending</span>
                  <span className="rounded-full bg-amber-300/15 px-3 py-1 text-sm font-bold text-amber-200">18</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[49%] rounded-full bg-amber-300" />
                </div>
              </div>

              <div className="admin-glass-card queue-status-row rounded-xl border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/70">Under investigation</span>
                  <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-sm font-bold text-cyan-200">9</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[25%] rounded-full bg-cyan-300" />
                </div>
              </div>

              <div className="admin-glass-card queue-status-row rounded-xl border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/70">Resolved</span>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-bold text-emerald-200">10</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[28%] rounded-full bg-emerald-300" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;