import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import {
  ArrowLeft,
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  ClipboardList,
  Sparkles,
  X,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";

function UserManagementPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const resource = useApi("/admin/users");

  // Map all users regardless of role (ADMIN, AGENT, USER)
  const users = useMemo(() => {
    return (resource.data || []).map((u) => ({
      id: u.user_id,
      name: u.full_name || "Unknown User",
      email: u.email || "No email provided",
      phone: u.phone || "No phone provided",
      role: (u.role || "USER").toUpperCase(),
      joinedDate: u.created_at
        ? new Date(u.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Registered",
      totalReports: u.total_reports || 0,
      totalRecommendations: u.total_recommendations || 0,
    }));
  }, [resource.data]);

  // Aggregate stats across all users
  const totalReportsCount = useMemo(() => {
    return users.reduce((sum, u) => sum + u.totalReports, 0);
  }, [users]);

  const totalRecsCount = useMemo(() => {
    return users.reduce((sum, u) => sum + u.totalRecommendations, 0);
  }, [users]);

  const roleCounts = useMemo(() => {
    const counts = { ALL: users.length, USER: 0, AGENT: 0, ADMIN: 0 };
    for (const u of users) {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      } else {
        counts[u.role] = 1;
      }
    }
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;
      const matchesSearch =
        !term ||
        `${user.name} ${user.email} ${user.phone} ${user.role}`
          .toLowerCase()
          .includes(term);
      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300">
            <ShieldAlert size={12} />
            ADMIN
          </span>
        );
      case "AGENT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
            <ShieldCheck size={12} />
            AGENCY OFFICER
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-200">
            <User size={12} />
            CITIZEN (USER)
          </span>
        );
    }
  };

  return (
    <main
      className={`admin-user-management-page relative min-h-screen w-full bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 blur-[125px] md:blur-[180px]"
        style={{
          background:
            "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 blur-[50px] md:blur-[72px]"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.09) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
          mixBlendMode: "multiply",
          filter: "blur(90px)",
          opacity: isLightMode ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div className="z-[1]">
        <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
        <ApiState {...resource} />

        <section className="admin-user-management-content mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/admin/dashboard"
              className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-end">
            <div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                User Management
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Directory of all registered accounts including citizens, agency officers, and administrators.
              </p>
            </div>

            <div className="admin-glass-card admin-user-glass-card flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 text-white">
              <Users size={19} className="text-cyan-200" aria-hidden="true" />
              <div>
                <p className="text-xs text-white/50">Total Registered Users</p>
                <p className="mt-0.5 text-lg font-bold">{users.length}</p>
              </div>
            </div>
          </div>

          {/* Top Analytical Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Total Users</p>
                <Users size={18} className="text-cyan-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{users.length}</p>
              <p className="mt-1 text-xs text-emerald-300">
                {roleCounts.USER || 0} Citizens &bull; {roleCounts.AGENT || 0} Officers &bull; {roleCounts.ADMIN || 0} Admins
              </p>
            </div>

            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Total Grievances Filed</p>
                <ClipboardList size={18} className="text-amber-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{totalReportsCount}</p>
              <p className="mt-1 text-xs text-amber-200">Citizen complaints submitted</p>
            </div>

            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Total Amenity Proposals</p>
                <Sparkles size={18} className="text-cyan-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{totalRecsCount}</p>
              <p className="mt-1 text-xs text-cyan-200">Recommendations recorded</p>
            </div>
          </div>

          {/* Role Filter Chips and Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, phone, or role..."
                aria-label="Search users"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-10 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Role Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              {[
                { id: "ALL", label: `All (${roleCounts.ALL})` },
                { id: "USER", label: `Citizens (${roleCounts.USER || 0})` },
                { id: "AGENT", label: `Officers (${roleCounts.AGENT || 0})` },
                { id: "ADMIN", label: `Admins (${roleCounts.ADMIN || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    roleFilter === tab.id
                      ? "bg-cyan-500/30 text-cyan-100 shadow-sm border border-cyan-400/40"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-white/50 text-right">
            Showing <strong className="text-white font-bold">{filteredUsers.length}</strong> of{" "}
            {users.length} accounts
          </div>

          {/* User Cards List */}
          <div className="mt-4 grid gap-4">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="admin-glass-card admin-user-glass-card group flex flex-col justify-between gap-5 rounded-2xl border border-white/20 p-5 text-white shadow-xl shadow-cyan-950/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-950/40 md:flex-row md:items-center md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300/15 text-xl font-bold text-cyan-100 shadow-inner">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-bold tracking-tight text-white">{user.name}</h2>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70">
                      <a
                        href={`mailto:${user.email}`}
                        className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
                      >
                        <Mail size={13} className="text-cyan-300" aria-hidden="true" />
                        <span>{user.email}</span>
                      </a>

                      <a
                        href={`tel:${user.phone}`}
                        className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
                      >
                        <Phone size={13} className="text-cyan-300" aria-hidden="true" />
                        <span>{user.phone}</span>
                      </a>

                      <span className="inline-flex items-center gap-1.5 text-white/50">
                        <Calendar size={13} aria-hidden="true" />
                        <span>Joined {user.joinedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analytical Activity Metrics */}
                <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
                  <div className="min-w-[100px] rounded-xl border border-amber-300/25 bg-amber-400/10 px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-amber-300">
                      <ClipboardList size={15} />
                      <span className="text-lg font-bold">{user.totalReports}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-semibold text-white/60">Reports Filed</p>
                  </div>

                  <div className="min-w-[100px] rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-cyan-200">
                      <Sparkles size={15} />
                      <span className="text-lg font-bold">{user.totalRecommendations}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-semibold text-white/60">Proposals</p>
                  </div>
                </div>
              </article>
            ))}

            {filteredUsers.length === 0 && (
              <div className="admin-glass-card rounded-2xl border border-white/20 px-6 py-12 text-center text-white">
                <Search size={24} className="mx-auto text-cyan-200/70" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-bold">No users found</h2>
                <p className="mt-2 text-sm text-white/55">Try a different search term or change the role filter.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserManagementPage;
