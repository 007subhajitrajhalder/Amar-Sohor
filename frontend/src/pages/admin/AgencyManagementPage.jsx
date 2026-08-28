import { Activity, ArrowLeft, ArrowUpDown, ArrowUpRight, Building2, CarFront, Droplets, Moon, Search, Sun, Toilet, Trash2, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useAdminTheme } from "./useAdminTheme";

function AgencyManagementPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  const agencies = [
    {
      id: 1,
      name: "KMC SWM Department",
      department:
        "Solid Waste Management",
      memberCount: 18,
      icon: Trash2
    },
    {
      id: 2,
      name: "KMC Sanitation Department",
      department:
        "Public Sanitation",
      memberCount: 12,
      icon: Toilet
    },
    {
      id: 3,
      name: "KMC Water Department",
      department:
        "Water Services",
      memberCount: 15,
      icon: Droplets
    },
    {
      id: 4,
      name: "Kolkata Police",
      department:
        "Parking Management",
      memberCount: 21,
      icon: CarFront
    }
  ];

  const totalMembers = agencies.reduce((total, agency) => total + agency.memberCount, 0);
  const connectedAgencies = agencies.length;
  const filteredAgencies = agencies
    .filter((agency) => `${agency.name} ${agency.department}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((firstAgency, secondAgency) => {
      if (sortOrder === "members") return secondAgency.memberCount - firstAgency.memberCount;
      return firstAgency.name.localeCompare(secondAgency.name);
    });

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
      <div
        style={{
          background: "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 blur-[50px] md:blur-[72px]"
        style={{
          background: "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 blur-[90px] transition-opacity duration-700"
        style={{
          background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.09) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
          mixBlendMode: "multiply",
          opacity: isLightMode ? 1 : 0
        }}
        aria-hidden="true"
      />
      <div className="relative z-[1]">
        <section className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>
            <button
              type="button"
              onClick={() => setIsLightMode((currentMode) => !currentMode)}
              aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
              className={`relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${isLightMode ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"}`}
            >
              <Sun size={13} className={`transition-all duration-700 ${isLightMode ? "scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"}`} aria-hidden="true" />
              <Moon size={13} className={`transition-all duration-700 ${isLightMode ? "rotate-90 scale-75 opacity-50" : "scale-110 opacity-100"}`} aria-hidden="true" />
              <span className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ${isLightMode ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60" : "bg-cyan-200 shadow-lg shadow-cyan-200/50"}`} />
            </button>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
            <div>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Agency Management</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Coordinate city service agencies and manage their registered members.</p>
            </div>
            <Link to="/admin/agency-members/add" className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-400/15 px-5 py-3 text-center font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/25">
              <Users size={17} aria-hidden="true" />
              Add agency member
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between"><p className="text-sm text-white/60">Active agencies</p><Building2 size={18} className="text-cyan-200" aria-hidden="true" /></div>
              <p className="mt-3 text-3xl font-bold">{agencies.length}</p>
              <p className="mt-1 text-xs text-cyan-100">All services connected</p>
            </div>
            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between"><p className="text-sm text-white/60">Registered members</p><Users size={18} className="text-cyan-300" aria-hidden="true" /></div>
              <p className="mt-3 text-3xl font-bold">{totalMembers}</p>
              <p className="mt-1 text-xs text-white/50">Across all agencies</p>
            </div>
            <div className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between"><p className="text-sm text-white/60">Service availability</p><Activity size={18} className="text-amber-200" aria-hidden="true" /></div>
              <p className="mt-3 text-3xl font-bold">{connectedAgencies} / {agencies.length}</p>
              <p className="mt-1 text-xs text-amber-200">All agencies connected</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-b border-white/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Service agencies</h2>
              <p className="mt-1 text-sm text-white/50">{filteredAgencies.length} of {agencies.length} agencies shown</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-72">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search agencies"
                  aria-label="Search agencies"
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-10 pr-9 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm("")} aria-label="Clear agency search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white">
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSortOrder((currentOrder) => currentOrder === "name" ? "members" : "name")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label={`Sort agencies by ${sortOrder === "name" ? "member count" : "name"}`}
              >
                <ArrowUpDown size={16} aria-hidden="true" />
                {sortOrder === "name" ? "A-Z" : "Largest teams"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filteredAgencies.map((agency, index) => (
            <article
              key={agency.id}
              className="admin-glass-card admin-agency-glass-card rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-cyan-950/25 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40"
              style={{ "--agency-card-delay": `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-300/15 text-cyan-200 shadow-inner shadow-cyan-100/10">
                    <agency.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="mt-2 text-xl font-bold tracking-tight">
                      {agency.name}
                    </h2>

                    <p className="mt-2 text-sm text-white/60">
                      {agency.department}
                    </p>
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Connected
                </span>
              </div>

              <div className="mt-6 grid gap-5 border-t border-white/15 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Registered Members
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {agency.memberCount}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-cyan-300 transition-all duration-500"
                        style={{ width: `${Math.round((agency.memberCount / totalMembers) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50">{Math.round((agency.memberCount / totalMembers) * 100)}% of all members</span>
                  </div>
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
              <p className="mt-2 text-sm text-white/55">Try searching by agency name or service.</p>
            </div>
          )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AgencyManagementPage;
