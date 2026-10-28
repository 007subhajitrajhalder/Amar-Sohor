import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { ArrowLeft, ArrowUpDown, ArrowUpRight, Building2, Search, Users, X, MapPin, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";

function AgencyManagementPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  const resource = useApi("/admin/agencies");
  const agencies = useMemo(() => {
    return (resource.data || []).map((a) => ({
      id: a.agency_id,
      name: a.agency_name,
      department: a.department_type,
      memberCount: a.member_count || 0,
      totalFacilities: a.total_facilities || 0,
      totalReports: a.total_reports || 0,
      totalRecommendations: a.total_recommendations || 0,
      icon: Building2,
    }));
  }, [resource.data]);

  const totalMembers = useMemo(
    () => agencies.reduce((total, agency) => total + agency.memberCount, 0),
    [agencies]
  );
  const totalFacilities = useMemo(
    () => agencies.reduce((total, agency) => total + agency.totalFacilities, 0),
    [agencies]
  );
  const filteredAgencies = useMemo(() => {
    return agencies
      .filter((agency) =>
        `${agency.name} ${agency.department}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((firstAgency, secondAgency) => {
        if (sortOrder === "members") return secondAgency.memberCount - firstAgency.memberCount;
        return firstAgency.name.localeCompare(secondAgency.name);
      });
  }, [agencies, searchTerm, sortOrder]);

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""
      }`}
    >
      <div
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
        className="pointer-events-none absolute inset-0 blur-[90px] transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.09) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
          mixBlendMode: "multiply",
          opacity: isLightMode ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div className="relative z-[1]">
        <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
        <ApiState {...resource} />

        <section className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/admin/dashboard"
              className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
            <div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Agency Management</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Coordinate municipal service agencies, review their assigned jurisdictions, and inspect registered field members.
              </p>
            </div>
            <Link
              to="/admin/agency-members/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-400/15 px-5 py-3 text-center font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/25"
            >
              <Users size={17} aria-hidden="true" />
              Add agency member
            </Link>
          </div>

          {/* Top Analytical Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Active Agencies</p>
                <Building2 size={18} className="text-cyan-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{agencies.length}</p>
              <p className="mt-1 text-xs text-cyan-100">All departments connected</p>
            </div>

            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Registered Field Members</p>
                <Users size={18} className="text-cyan-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{totalMembers}</p>
              <p className="mt-1 text-xs text-white/50">Across all service agencies</p>
            </div>

            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Facilities Managed</p>
                <MapPin size={18} className="text-emerald-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{totalFacilities}</p>
              <p className="mt-1 text-xs text-emerald-200">Civic assets under agency care</p>
            </div>
          </div>

          {/* Search and Sort Filter Header */}
          <div className="mt-10 flex flex-col gap-4 border-b border-white/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Service Agencies</h2>
              <p className="mt-1 text-sm text-white/50">
                {filteredAgencies.length} of {agencies.length} agencies shown
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-72">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search agencies..."
                  aria-label="Search agencies"
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-10 pr-9 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear agency search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSortOrder((currentOrder) => (currentOrder === "name" ? "members" : "name"))
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label={`Sort agencies by ${sortOrder === "name" ? "member count" : "name"}`}
              >
                <ArrowUpDown size={16} aria-hidden="true" />
                {sortOrder === "name" ? "A-Z" : "Largest teams"}
              </button>
            </div>
          </div>

          {/* Agency Cards Grid */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {filteredAgencies.map((agency, index) => (
              <article
                key={agency.id}
                className="admin-glass-card admin-agency-glass-card flex flex-col justify-between rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-cyan-950/25 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40"
                style={{ "--agency-card-delay": `${index * 80}ms` }}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-300/15 text-cyan-200 shadow-inner shadow-cyan-100/10">
                        <agency.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                      </div>

                      <div>
                        <h2 className="mt-1 text-xl font-bold tracking-tight">{agency.name}</h2>
                        <p className="mt-1 text-sm text-cyan-200/80 font-medium">{agency.department}</p>
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Connected
                    </span>
                  </div>

                  {/* Dynamic Agency Statistics Grid */}
                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-white/50 text-[11px] font-semibold uppercase">
                        <Users size={12} />
                        <span>Staff</span>
                      </div>
                      <p className="mt-1 text-lg font-bold text-white">{agency.memberCount}</p>
                    </div>

                    <div className="border-x border-white/10">
                      <div className="flex items-center justify-center gap-1 text-white/50 text-[11px] font-semibold uppercase">
                        <MapPin size={12} />
                        <span>Facilities</span>
                      </div>
                      <p className="mt-1 text-lg font-bold text-cyan-200">{agency.totalFacilities}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-white/50 text-[11px] font-semibold uppercase">
                        <ClipboardList size={12} />
                        <span>Reports</span>
                      </div>
                      <p className="mt-1 text-lg font-bold text-amber-300">{agency.totalReports}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                  <div className="text-xs text-white/60">
                    <span className="font-semibold text-white">{agency.memberCount}</span> registered officers
                  </div>

                  <Link
                    to={`/admin/agencies/${agency.id}/members`}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/20 hover:text-white"
                  >
                    View Members
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}

            {filteredAgencies.length === 0 && (
              <div className="admin-glass-card col-span-full rounded-2xl border border-white/20 px-6 py-14 text-center text-white">
                <Search size={24} className="mx-auto text-cyan-200/70" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-bold">No agencies found</h2>
                <p className="mt-2 text-sm text-white/55">Try searching by agency name or department.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AgencyManagementPage;
