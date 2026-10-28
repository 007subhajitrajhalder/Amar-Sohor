import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
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
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./useAdminTheme";

const FACILITY_ICONS = {
  dustbin: Trash2,
  waste: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  restroom: DoorOpen,
  parking: Car,
};

function getFacilityIcon(categoryName = "") {
  const cat = String(categoryName).toLowerCase();
  for (const [key, Icon] of Object.entries(FACILITY_ICONS)) {
    if (cat.includes(key)) return Icon;
  }
  return Sparkles;
}

function getRecommendationStatusLabel(status) {
  switch (status) {
    case "INSTALLED":
      return "Installed";
    case "APPROVED":
      return "Approved";
    case "UNDER_INVESTIGATION":
      return "Under Investigation";
    case "ALLOCATED":
      return "Allotted";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Pending Allocation";
  }
}

const auraLayers = [
  {
    background:
      "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
    mixBlendMode: "screen",
    filter: "blur(125px)",
  },
  {
    background:
      "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
    mixBlendMode: "screen",
    filter: "blur(50px)",
  },
];

const lightAuraLayers = [
  {
    background:
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.08) 28%, rgb(218,218,211) 48%, rgb(112,166,174) 76%, rgb(69,105,122) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)",
  },
  {
    background:
      "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.10) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
    mixBlendMode: "multiply",
    filter: "blur(90px)",
  },
];

function AdminDashboardPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();

  // Fetch consolidated live analytics from backend database
  const dashboardResource = useApi("/admin/dashboard");
  const health = useApi("/health");

  const stats = dashboardResource.data || {
    users: { total: 0, citizens: 0, officers: 0, admins: 0 },
    agencies: { total: 0, members: 0, facilities: 0 },
    complaints: { total: 0, pending: 0, under_investigation: 0, resolved: 0 },
    recommendations: { total: 0, pending: 0, active: 0, completed: 0, recent: [] },
  };

  const complaintsTotal = stats.complaints?.total || 0;
  const pendingComplaints = stats.complaints?.pending || 0;
  const underInvestigationComplaints = stats.complaints?.under_investigation || 0;
  const resolvedComplaints = stats.complaints?.resolved || 0;

  const pendingComplaintsPercent = complaintsTotal > 0
    ? Math.round((pendingComplaints / complaintsTotal) * 100)
    : 0;
  const investigationComplaintsPercent = complaintsTotal > 0
    ? Math.round((underInvestigationComplaints / complaintsTotal) * 100)
    : 0;
  const resolvedComplaintsPercent = complaintsTotal > 0
    ? Math.round((resolvedComplaints / complaintsTotal) * 100)
    : 0;

  const recentRecommendations = stats.recommendations?.recent || [];

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""
      }`}
    >
      <ApiState {...dashboardResource} />

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
            opacity: isLightMode ? 0 : 1,
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
            opacity: isLightMode ? 1 : 0,
          }}
        />
      ))}

      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <ApiState error={dashboardResource.error || health.error} />

      <section
        className={`admin-dashboard-welcome relative z-10 mx-auto max-w-6xl ${
          isLightMode ? "text-slate-900" : ""
        }`}
      >
        <div className="admin-dashboard-reveal" style={{ "--dashboard-delay": "80ms" }}>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Municipal Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Real-time urban operations, grievance resolution rates, and infrastructure suggestions.
          </p>
        </div>

        {/* Live Connectivity Banner */}
        <div
          className="admin-dashboard-reveal admin-glass-card mt-7 flex flex-col justify-between gap-5 rounded-2xl border border-white/30 p-5 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl sm:flex-row sm:items-center"
          style={{ "--dashboard-delay": "180ms" }}
        >
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {health.data ? "System API and Database Connected" : "Connecting to Database..."}
              </p>
              <p className="mt-0.5 text-xs text-white/55">
                MySQL database & REST server operational on live network.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-white/60">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" aria-hidden="true" />
              {health.data ? "Connected" : "Checking status"}
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <Clock3 size={16} className="text-cyan-200" aria-hidden="true" />
              Live Database Queries
            </span>
          </div>
        </div>

        {/* Top 3 Analytical KPI Cards */}
        <div
          className="admin-dashboard-reveal mt-7 grid gap-5 sm:grid-cols-3"
          style={{ "--dashboard-delay": "280ms" }}
        >
          {/* Registered Users */}
          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-100">
                <Users size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Directory
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Total System Users</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">
              {stats.users?.total ?? 0}
            </h2>
            <p className="mt-2 text-xs font-medium text-emerald-300">
              {stats.users?.citizens ?? 0} citizens &bull; {stats.users?.officers ?? 0} officers
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-200/80">
              <Activity size={14} aria-hidden="true" />
              {stats.users?.admins ?? 0} administrator accounts
            </div>
          </article>

          {/* Agency Members */}
          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-emerald-100">
                <UserRound size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Personnel
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Field Agency Officers</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">
              {stats.agencies?.members ?? 0}
            </h2>
            <p className="mt-2 text-xs font-medium text-emerald-300">
              Assigned across {stats.agencies?.total ?? 0} municipal agencies
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-200/80">
              <Activity size={14} aria-hidden="true" />
              Active field response roster
            </div>
          </article>

          {/* Agencies & Facilities */}
          <article className="admin-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-amber-100">
                <Building2 size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Infrastructure
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Agencies & Facilities</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">
              {stats.agencies?.total ?? 0}
            </h2>
            <p className="mt-2 text-xs font-medium text-amber-200">
              Managing {stats.agencies?.facilities ?? 0} civic public facilities
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-200/80">
              <Activity size={14} aria-hidden="true" />
              City-wide coverage
            </div>
          </article>
        </div>

        {/* Quick Navigational Portal Links */}
        <div
          className="admin-dashboard-reveal mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          style={{ "--dashboard-delay": "380ms" }}
        >
          <Link
            to="/admin/users"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-100">
                  <Users size={22} aria-hidden="true" />
                </div>
                <ArrowUpRight
                  size={21}
                  className="text-white/50 transition group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-white/50">
                Accounts
              </p>
              <h2 className="mt-1.5 text-xl font-bold tracking-tight">Manage Users</h2>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Review citizens, officers, contact records, and account activity.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs font-semibold text-cyan-200">
              {stats.users?.total ?? 0} registered &rarr;
            </div>
          </Link>

          <Link
            to="/admin/agencies"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-emerald-100">
                  <Building2 size={22} aria-hidden="true" />
                </div>
                <ArrowUpRight
                  size={21}
                  className="text-white/50 transition group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-white/50">
                Partners
              </p>
              <h2 className="mt-1.5 text-xl font-bold tracking-tight">Manage Agencies</h2>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Organize departments, staff allocations, and designated facilities.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs font-semibold text-emerald-300">
              {stats.agencies?.total ?? 0} departments &rarr;
            </div>
          </Link>

          <Link
            to="/admin/complaints"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-amber-100">
                  <ClipboardList size={22} aria-hidden="true" />
                </div>
                <ArrowUpRight
                  size={21}
                  className="text-white/50 transition group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-white/50">
                Reports
              </p>
              <h2 className="mt-1.5 text-xl font-bold text-white">View All Complaints</h2>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Monitor citizen grievances, evidence, and officer resolution reports.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs font-semibold text-amber-300">
              {complaintsTotal} total complaints &rarr;
            </div>
          </Link>

          <Link
            to="/admin/recommendations"
            className="admin-glass-card admin-navigable-card group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-200">
                  <Sparkles size={22} aria-hidden="true" />
                </div>
                <ArrowUpRight
                  size={21}
                  className="text-white/50 transition group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-white/50">
                Proposals
              </p>
              <h2 className="mt-1.5 text-xl font-bold text-white">Recommendations</h2>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Review new facility proposals and assign them to agency officers.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs font-semibold text-cyan-200">
              {stats.recommendations?.total ?? 0} submitted &rarr;
            </div>
          </Link>
        </div>

        {/* Analytical Panels: Recommendations & Complaint Queue */}
        <div
          className="admin-dashboard-reveal mt-7 grid gap-5 lg:grid-cols-[1.35fr_1fr]"
          style={{ "--dashboard-delay": "480ms" }}
        >
          {/* Left Panel: Citizen Proposals */}
          <section className="admin-glass-card flex min-h-72 h-full flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100/60">
                    Infrastructure Pipeline
                  </p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight">Citizen Recommendations</h2>
                </div>
                <Link
                  to="/admin/recommendations"
                  className="text-xs font-semibold text-cyan-200 transition hover:text-white"
                >
                  View all ({stats.recommendations?.total ?? 0})
                </Link>
              </div>

              {/* Status Tally Boxes */}
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-200">
                    {stats.recommendations?.pending ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                    Needs Allocation
                  </p>
                </div>
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-center">
                  <p className="text-2xl font-bold text-cyan-200">
                    {stats.recommendations?.active ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                    Under Review
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-200">
                    {stats.recommendations?.completed ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                    Installed
                  </p>
                </div>
              </div>

              {/* Latest Recent Recommendations */}
              <div className="mt-5 space-y-2.5">
                {recentRecommendations.map((recommendation) => {
                  const FacilityIcon = getFacilityIcon(recommendation.category_name);
                  const isAllocated = Boolean(recommendation.assigned_agent_id);
                  const target = isAllocated
                    ? `/admin/recommendations/${recommendation.id}/progress`
                    : `/admin/recommendations/${recommendation.id}/allocate`;

                  return (
                    <Link
                      key={recommendation.id}
                      to={target}
                      className="admin-glass-card admin-navigable-card flex items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 transition hover:border-cyan-200/40 hover:bg-white/10"
                    >
                      <div className="rounded-xl bg-cyan-300/15 p-2 text-cyan-200">
                        <FacilityIcon size={16} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{recommendation.title}</p>
                        <p className="mt-0.5 truncate text-xs text-white/50">
                          {recommendation.landmark || recommendation.address} &bull;{" "}
                          <span className="text-cyan-200">
                            {getRecommendationStatusLabel(recommendation.status)}
                          </span>
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-white/40 transition group-hover:text-white"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}

                {recentRecommendations.length === 0 && (
                  <div className="rounded-xl border border-white/10 p-6 text-center text-xs text-white/50">
                    No recommendations submitted yet in the database.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: Complaint Status Queue */}
          <section className="admin-glass-card admin-status-card flex h-full min-h-72 flex-col justify-between rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/60">
                    Current Queue
                  </p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight">Complaint Status</h2>
                </div>
                <Link
                  to="/admin/complaints"
                  className="text-xs font-semibold text-amber-200 transition hover:text-white"
                >
                  View all ({complaintsTotal})
                </Link>
              </div>

              <div className="mt-6 space-y-3.5">
                {/* Pending */}
                <div className="admin-glass-card queue-status-row pending-request-card rounded-xl border border-white/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-white/80">Pending Action</span>
                      <p className="text-[11px] text-white/45">Awaiting agent inspection</p>
                    </div>
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-sm font-bold text-amber-200">
                      {pendingComplaints} ({pendingComplaintsPercent}%)
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${pendingComplaintsPercent}%` }}
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Under Investigation */}
                <div className="admin-glass-card queue-status-row rounded-xl border border-white/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-white/80">Under Investigation</span>
                      <p className="text-[11px] text-white/45">Field team assigned & repairing</p>
                    </div>
                    <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-sm font-bold text-cyan-200">
                      {underInvestigationComplaints} ({investigationComplaintsPercent}%)
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${investigationComplaintsPercent}%` }}
                      className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Resolved */}
                <div className="admin-glass-card queue-status-row rounded-xl border border-white/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-white/80">Resolved</span>
                      <p className="text-[11px] text-white/45">Closed with photo verification</p>
                    </div>
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-bold text-emerald-200">
                      {resolvedComplaints} ({resolvedComplaintsPercent}%)
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${resolvedComplaintsPercent}%` }}
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-3 text-xs text-white/50 flex justify-between items-center">
              <span>Overall Resolution Rate</span>
              <strong className="text-emerald-300 font-bold text-sm">
                {resolvedComplaintsPercent}%
              </strong>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;
