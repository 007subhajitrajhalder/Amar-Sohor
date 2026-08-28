import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Car,
  DoorOpen,
  Droplets,
  Sparkles,
  Trash2,
  UserRound,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import { getAdminRecommendations } from "./adminRecommendationsData";
import { useAdminTheme } from "./useAdminTheme";

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getRecommendationStatus(recommendation) {
  if (!recommendation.assignedMember) return "Pending allocation";
  if (recommendation.status === "INSTALLED") return "Installed";
  if (recommendation.status === "APPROVED") return "Approved";
  return "Under investigation";
}

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
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.08) 28%, rgb(218,218,211) 48%, rgb(112,166,174) 76%, rgb(69,105,122) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)"
  },
  {
    background:
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.10) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)"
  }
];

function AdminDashboardPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const recommendations = getAdminRecommendations();
  const pendingRecommendations = recommendations.filter((item) => !item.assignedMember).length;
  const activeRecommendations = recommendations.filter(
    (item) => item.assignedMember && item.status !== "INSTALLED"
  ).length;
  const completedRecommendations = recommendations.filter(
    (item) => item.status === "INSTALLED"
  ).length;
  const latestRecommendations = [...recommendations]
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
    .slice(0, 3);

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

      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />

      <section className={`admin-dashboard-welcome relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : ""}`}>
        <div className="admin-dashboard-reveal" style={{ "--dashboard-delay": "80ms" }}>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Admin Dashboard
          </h1>
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
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-amber-200">
              <Activity size={14} aria-hidden="true" />
              Service coverage
            </div>
          </article>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" style={{ "--dashboard-delay": "380ms" }}>
          <Link
            to="/admin/users"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition"
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
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition"
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
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition"
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

          <Link
            to="/admin/recommendations"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition"
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-200">
                <Sparkles size={22} aria-hidden="true" />
              </div>
              <ArrowUpRight size={21} className="text-white/50 transition group-hover:text-white" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/50">Proposals</p>
            <h2 className="mt-2 text-xl font-bold text-white">Citizen Recommendations</h2>

            <p className="mt-3 text-sm leading-6 text-white/60">Review new facility suggestions and allocate agency members.</p>
          </Link>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-5 lg:grid-cols-[1.35fr_1fr]" style={{ "--dashboard-delay": "480ms" }}>
          <section className="admin-glass-card flex min-h-72 h-full flex-col rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100/60">
                  Citizen proposals
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">Citizen recommendations</h2>
              </div>
              <Link
                to="/admin/recommendations"
                className="text-xs font-semibold text-cyan-200 transition hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-3">
                <p className="text-2xl font-bold text-amber-200">{pendingRecommendations}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">Pending</p>
              </div>
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-3">
                <p className="text-2xl font-bold text-cyan-200">{activeRecommendations}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">In progress</p>
              </div>
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-3">
                <p className="text-2xl font-bold text-emerald-200">{completedRecommendations}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">Completed</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {latestRecommendations.map((recommendation) => {
                const FacilityIcon = FACILITY_ICONS[recommendation.facilityType] || Sparkles;
                const target = recommendation.assignedMember
                  ? `/admin/recommendations/${recommendation.id}/progress`
                  : `/admin/recommendations/${recommendation.id}/allocate`;

                return (
                  <Link
                    key={recommendation.id}
                    to={target}
                    className="admin-glass-card admin-navigable-card flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 transition"
                  >
                    <div className="rounded-full bg-cyan-300/15 p-2 text-cyan-200">
                      <FacilityIcon size={16} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{recommendation.title}</p>
                      <p className="mt-1 truncate text-xs text-white/50">
                        {recommendation.location} · {getRecommendationStatus(recommendation)}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="shrink-0 text-white/40" aria-hidden="true" />
                  </Link>
                );
              })}
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
