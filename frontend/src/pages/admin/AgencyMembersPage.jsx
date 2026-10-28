import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import {
  ArrowLeft,
  ArrowUpDown,
  Mail,
  Phone,
  Search,
  UserPlus,
  Users,
  X,
  Navigation,
  ClipboardList,
  Sparkles,
  Building2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./useAdminTheme";

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

function AgencyMembersPage() {
  const navigate = useNavigate();
  const { agencyId } = useParams();

  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  // Fetch agency metadata and members dynamically from backend
  const agencyResource = useApi("/admin/agencies");
  const memberResource = useApi("/admin/agency-members?agency_id=" + agencyId);

  const selectedAgency = useMemo(() => {
    return (agencyResource.data || []).find(
      (a) => a.agency_id === Number(agencyId)
    );
  }, [agencyResource.data, agencyId]);

  const members = useMemo(() => {
    return (memberResource.data || []).map((m) => ({
      id: m.agent_id,
      agentId: m.agent_id,
      userId: m.user_id,
      fullName: m.full_name || "Civic Officer",
      email: m.email || "Not recorded",
      phone: m.phone || "Not recorded",
      role: m.role || "AGENT",
      agencyId: m.agency_id,
      agencyName: m.agency_name || selectedAgency?.agency_name || "Agency",
      latitude:
        m.latitude !== null && m.latitude !== undefined
          ? Number(m.latitude).toFixed(5)
          : null,
      longitude:
        m.longitude !== null && m.longitude !== undefined
          ? Number(m.longitude).toFixed(5)
          : null,
      facilitiesCount: m.facilities_count ?? m.allotted_facilities ?? 0,
      allottedReports: m.allotted_reports || 0,
      allottedRecommendations: m.allotted_recommendations || 0,
    }));
  }, [memberResource.data, selectedAgency]);

  const totalAllottedReports = useMemo(
    () => members.reduce((sum, m) => sum + m.allottedReports, 0),
    [members]
  );
  const totalAllottedRecs = useMemo(
    () => members.reduce((sum, m) => sum + m.allottedRecommendations, 0),
    [members]
  );
  const totalJurisdictionFacilities = useMemo(
    () => members.reduce((sum, m) => sum + m.facilitiesCount, 0),
    [members]
  );

  const filteredMembers = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    return members
      .filter((member) => {
        if (!term) return true;
        return (
          member.fullName.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term) ||
          member.phone.includes(term)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "facilities") return b.facilitiesCount - a.facilitiesCount;
        if (sortOrder === "reports") return b.allottedReports - a.allottedReports;
        if (sortOrder === "recs") return b.allottedRecommendations - a.allottedRecommendations;
        return a.fullName.localeCompare(b.fullName);
      });
  }, [members, searchText, sortOrder]);

  if (agencyResource.loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <ApiState loading={true} />
      </main>
    );
  }

  if (!selectedAgency && !agencyResource.loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100e0b] px-5">
        <section className="admin-glass-card relative z-[1] rounded-2xl border border-white/20 p-8 text-center text-white shadow-2xl">
          <h1 className="text-2xl font-bold text-rose-400">Agency Not Found</h1>
          <p className="mt-3 text-white/60">No agency found matching ID #{agencyId}.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/agencies")}
            className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
          >
            Return to Agency Management
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`admin-agency-members-page relative min-h-screen bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""
      }`}
    >
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
      <ApiState {...agencyResource} />
      <ApiState {...memberResource} />

      <section className="admin-agency-members-content admin-dashboard-welcome relative z-[1] mx-auto w-full max-w-6xl">
        {/* Back Link */}
        <div className="admin-dashboard-reveal flex items-center justify-between gap-4">
          <Link
            to="/admin/agencies"
            className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Agency Management</span>
          </Link>
        </div>

        {/* Page Heading and Selected Agency Card */}
        <div className="admin-dashboard-reveal mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Agency Members</h1>
            <p className="mt-2 text-sm text-white/60">
              Department roster and field duty allocations for{" "}
              <strong className="text-white font-semibold">{selectedAgency.agency_name}</strong>.
            </p>
          </div>

          <div className="admin-glass-card w-full max-w-sm rounded-2xl border border-white/20 px-6 py-4 text-white shadow-xl md:min-w-[18rem]">
            <p className="text-xs uppercase tracking-wider text-white/50">Jurisdiction Agency</p>
            <h2 className="mt-1 text-lg font-bold">{selectedAgency.agency_name}</h2>
            <p className="mt-0.5 text-xs font-medium text-cyan-300">{selectedAgency.department_type}</p>
          </div>
        </div>

        {/* Dynamic Analytical Summary Cards */}
        <div className="admin-dashboard-reveal mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">Active Officers</p>
              <Users size={18} className="text-cyan-200" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold">{members.length}</p>
            <p className="mt-1 text-xs text-white/50">Field team members</p>
          </div>

          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">Facilities in Charge</p>
              <Building2 size={18} className="text-emerald-300" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-300">{totalJurisdictionFacilities}</p>
            <p className="mt-1 text-xs text-emerald-200/70">Under officer jurisdiction</p>
          </div>

          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">Complaints Allotted</p>
              <ClipboardList size={18} className="text-amber-300" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-amber-300">{totalAllottedReports}</p>
            <p className="mt-1 text-xs text-amber-200/70">Assigned investigations</p>
          </div>

          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">Proposals Allotted</p>
              <Sparkles size={18} className="text-cyan-300" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-cyan-200">{totalAllottedRecs}</p>
            <p className="mt-1 text-xs text-cyan-200/70">Feasibility assessments</p>
          </div>
        </div>

        {/* Action bar and Search */}
        <section className="admin-dashboard-reveal admin-glass-card mt-7 rounded-2xl border border-white/20 p-5 text-white shadow-xl">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search member by name, email, or phone number..."
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 pl-11 pr-10 text-white outline-none backdrop-blur-xl placeholder:text-white/40 focus:border-cyan-200/70"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
              <button
                type="button"
                onClick={() =>
                  setSortOrder((current) => {
                    if (current === "name") return "facilities";
                    if (current === "facilities") return "reports";
                    if (current === "reports") return "recs";
                    return "name";
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label="Sort members"
              >
                <ArrowUpDown size={15} aria-hidden="true" />
                <span>
                  {sortOrder === "name"
                    ? "Sort: Name (A-Z)"
                    : sortOrder === "facilities"
                    ? "Sort: Most Facilities"
                    : sortOrder === "reports"
                    ? "Sort: Most Reports"
                    : "Sort: Most Proposals"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/admin/agency-members/add?agencyId=${agencyId}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-400/20 px-4 py-3 text-xs font-bold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-400/30"
              >
                <UserPlus size={15} aria-hidden="true" />
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </section>

        {/* Member Cards List */}
        <section className="admin-dashboard-reveal mt-6 grid gap-4">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="admin-glass-card group flex flex-col justify-between gap-5 rounded-2xl border border-white/20 p-5 text-white shadow-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-950/40 md:flex-row md:items-center md:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Member Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300/15 text-xl font-bold text-cyan-100 shadow-inner">
                  {member.fullName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold tracking-tight text-white">{member.fullName}</h2>
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-200">
                      Officer ID: #{member.agentId}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
                    >
                      <Mail size={13} className="text-cyan-300" aria-hidden="true" />
                      <span>{member.email}</span>
                    </a>

                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
                    >
                      <Phone size={13} className="text-cyan-300" aria-hidden="true" />
                      <span>{member.phone}</span>
                    </a>

                    <span className="inline-flex items-center gap-1.5 text-white/60">
                      <Navigation size={13} className="text-emerald-300" aria-hidden="true" />
                      <span>
                        {member.latitude && member.longitude
                          ? `Coords: ${member.latitude}, ${member.longitude}`
                          : "Coords: Not recorded"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Allotted Duties Badges */}
              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
                <div className="min-w-[100px] rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-300">
                    <Building2 size={15} />
                    <span className="text-lg font-bold">{member.facilitiesCount}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-white/60">Facilities</p>
                </div>

                <div className="min-w-[100px] rounded-xl border border-amber-300/25 bg-amber-400/10 px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-300">
                    <ClipboardList size={15} />
                    <span className="text-lg font-bold">{member.allottedReports}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-white/60">Reports Allotted</p>
                </div>

                <div className="min-w-[100px] rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-cyan-200">
                    <Sparkles size={15} />
                    <span className="text-lg font-bold">{member.allottedRecommendations}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-white/60">Proposals Allotted</p>
                </div>
              </div>
            </article>
          ))}

          {filteredMembers.length === 0 && (
            <div className="admin-glass-card rounded-2xl border border-white/20 p-10 text-center text-white shadow-xl">
              <Users size={30} className="mx-auto text-cyan-200/70" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold">No Members Found</h2>
              <p className="mt-2 text-sm text-white/60">
                This agency has no matching registered field members.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AgencyMembersPage;
