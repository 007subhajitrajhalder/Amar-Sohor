import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  UserRound,
  Trash2,
  Droplets,
  DoorOpen,
  Car,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  X,
  PlusCircle
} from "lucide-react";
import {
  getAdminRecommendations,
  AGENCY_MEMBERS
} from "../admin/adminRecommendationsData";

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getFacilityBadge(type) {
  switch ((type || "").toLowerCase()) {
    case "dustbin":
      return {
        label: "Dustbin",
        className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        iconClass: "border-amber-400/30 bg-amber-400/15 text-amber-200"
      };
    case "water":
      return {
        label: "Water Dispenser",
        className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
        iconClass: "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
      };
    case "toilet":
      return {
        label: "Public Toilet",
        className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
        iconClass: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
      };
    case "parking":
      return {
        label: "Parking Spot",
        className: "border-blue-400/30 bg-blue-400/10 text-blue-200",
        iconClass: "border-blue-400/30 bg-blue-400/15 text-blue-200"
      };
    default:
      return {
        label: "Civic Amenity",
        className: "border-white/20 bg-white/10 text-white",
        iconClass: "border-white/20 bg-white/10 text-white"
      };
  }
}

function getStatusBadge(status) {
  const norm = (status || "").toUpperCase();
  if (norm === "UNDER_INVESTIGATION") {
    return {
      label: "Under Investigation",
      color: "border-cyan-400/50 bg-cyan-400/15 text-cyan-200",
      dot: "bg-cyan-400 animate-pulse",
      icon: Clock3
    };
  }
  if (norm === "APPROVED") {
    return {
      label: "Approved",
      color: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200",
      dot: "bg-emerald-400",
      icon: CheckCircle2
    };
  }
  if (norm === "REJECTED") {
    return {
      label: "Rejected",
      color: "border-rose-400/50 bg-rose-400/15 text-rose-200",
      dot: "bg-rose-400",
      icon: XCircle
    };
  }
  if (norm === "INSTALLED") {
    return {
      label: "Installed & Active",
      color: "border-emerald-400/50 bg-emerald-400/20 text-emerald-200",
      dot: "bg-emerald-300",
      icon: Sparkles
    };
  }
  return {
    label: "Pending Investigation",
    color: "border-amber-400/50 bg-amber-400/15 text-amber-200",
    dot: "bg-amber-400 animate-pulse",
    icon: AlertTriangle
  };
}

function AssignedRecommendationsPage() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );
  const [recommendations, setRecommendations] = useState(() => {
    return getAdminRecommendations().filter((item) => Boolean(item.assignedMember));
  });
  const [selectedOfficer, setSelectedOfficer] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync theme
  useEffect(() => {
    const syncTheme = () => {
      setIsDarkMode(localStorage.getItem("agencyTheme") !== "light");
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("agencyThemeChange", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("agencyThemeChange", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("agencyTheme", nextTheme);
    setIsDarkMode(nextTheme === "dark");
    window.dispatchEvent(new Event("agencyThemeChange"));
  };

  useEffect(() => {
    const handleStorage = () => {
      const all = getAdminRecommendations();
      setRecommendations(all.filter((item) => Boolean(item.assignedMember)));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("recommendationsUpdated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("recommendationsUpdated", handleStorage);
    };
  }, []);

  // Filter recommendations
  const filtered = useMemo(() => {
    return recommendations.filter((item) => {
      // Officer filter
      if (selectedOfficer !== "ALL") {
        const officerId = Number(selectedOfficer);
        if (item.assignedMember?.id !== officerId) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "ALL") {
        const itemStatus = (item.status || "").toUpperCase();
        if (selectedStatus === "ALLOTTED") {
          if (itemStatus !== "ALLOTTED" && itemStatus !== "PENDING_ALLOCATION") return false;
        } else if (itemStatus !== selectedStatus) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (item.title || "").toLowerCase().includes(q);
        const matchesLocation = (item.location || "").toLowerCase().includes(q);
        const matchesCitizen = (item.citizen?.name || "").toLowerCase().includes(q);
        const matchesOfficer = (item.assignedMember?.fullName || "").toLowerCase().includes(q);
        const matchesId = (item.id || "").toLowerCase().includes(q);

        if (!matchesTitle && !matchesLocation && !matchesCitizen && !matchesOfficer && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [recommendations, selectedOfficer, selectedStatus, searchQuery]);

  // Statistics
  const pendingCount = recommendations.filter(
    (r) => r.status === "ALLOTTED" || r.status === "PENDING_ALLOCATION"
  ).length;
  const underInvestigationCount = recommendations.filter(
    (r) => r.status === "UNDER_INVESTIGATION"
  ).length;
  const approvedCount = recommendations.filter(
    (r) => r.status === "APPROVED" || r.status === "INSTALLED"
  ).length;

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b]" : "bg-slate-100"
      }`}
    >
      {/* Glowing atmospheric layers in dark mode */}
      {isDarkMode && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(125px)"
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
              filter: "blur(50px)"
            }}
          />
        </>
      )}

      <section
        className={`relative z-10 mx-auto max-w-6xl ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/agency/dashboard"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                isDarkMode ? "text-cyan-300 hover:text-white" : "text-cyan-700 hover:text-cyan-900"
              }`}
            >
              ← Agency Dashboard
            </Link>
            <span className={isDarkMode ? "text-white/20" : "text-slate-300"}>|</span>
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${
                isDarkMode ? "text-cyan-100/60" : "text-cyan-700"
              }`}
            >
              Field Works Portal
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            className={`group inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
              isDarkMode
                ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>{isDarkMode ? "☀️ Light mode" : "🌙 Dark mode"}</span>
          </button>
        </div>

        {/* Page Title & Officer Filter */}
        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
              <ShieldCheck size={13} />
              Civic Infrastructure Proposals
            </div>
            <h1
              className={`mt-2 text-2xl md:text-3xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Allocated Recommendations
            </h1>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Review citizen facility proposals allocated to your agency, conduct on-site feasibility investigations, and sanction new civic installations.
            </p>
          </div>

          
        </div>

        {/* 4 Metric KPI Cards - Centrally Aligned */}
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-white/15 bg-white/5 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-cyan-200">
              <Building2 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-60">Total Allocated</p>
            <p className="mt-0.5 text-2xl font-bold">{recommendations.length}</p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-amber-300/20 bg-amber-400/10 text-white"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <div className="rounded-xl border border-amber-300/30 bg-amber-400/20 p-2.5 text-amber-300">
              <AlertTriangle size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Pending Survey</p>
            <p className="mt-0.5 text-2xl font-bold text-amber-300">{pendingCount}</p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-cyan-300/20 bg-cyan-400/10 text-white"
                : "border-cyan-200 bg-cyan-50 text-cyan-900"
            }`}
          >
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/20 p-2.5 text-cyan-300">
              <Clock3 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Under Investigation</p>
            <p className="mt-0.5 text-2xl font-bold text-cyan-300">{underInvestigationCount}</p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-emerald-300/20 bg-emerald-400/10 text-white"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/20 p-2.5 text-emerald-300">
              <CheckCircle2 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Approved / Installed</p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-300">{approvedCount}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className={`mt-6 space-y-4 rounded-2xl border p-5 shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "border-white/15 bg-white/5 text-white"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? "text-white/40" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by proposal title, location, citizen name, or ID..."
                className={`w-full rounded-xl border py-2 pl-9 pr-8 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { key: "ALL", label: "All Statuses" },
                { key: "ALLOTTED", label: "Pending Investigation" },
                { key: "UNDER_INVESTIGATION", label: "Under Investigation" },
                { key: "APPROVED", label: "Approved" },
                { key: "REJECTED", label: "Rejected" }
              ].map((tab) => {
                const isSelected = selectedStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedStatus(tab.key)}
                    className={`rounded-xl border px-3 py-1.5 font-semibold transition ${
                      isSelected
                        ? isDarkMode
                          ? "border-cyan-300 bg-cyan-400/20 text-cyan-100 shadow-sm"
                          : "border-cyan-700 bg-cyan-700 text-white shadow-sm"
                        : isDarkMode
                        ? "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendation Cards List */}
        <div className="mt-6 grid gap-4 pb-16">
          {filtered.map((rec) => {
            const FacilityIcon = FACILITY_ICONS[rec.facilityType] || Trash2;
            const facilityBadge = getFacilityBadge(rec.facilityType);
            const statusBadge = getStatusBadge(rec.status);
            const StatusIcon = statusBadge.icon;

            return (
              <article
                key={rec.id}
                className={`group relative flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 md:flex-row md:items-center ${
                  isDarkMode
                    ? "border-white/15 bg-white/[0.06] hover:border-cyan-300/40 hover:shadow-cyan-950/40"
                    : "border-slate-200 bg-white hover:border-cyan-600/40 hover:shadow-slate-300/60"
                }`}
              >
                {/* Left Section: Icon & Proposal Info */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-2.5 ${facilityBadge.iconClass}`}
                  >
                    <FacilityIcon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        #{rec.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${facilityBadge.className}`}
                      >
                        {facilityBadge.label}
                      </span>
                      <span className="text-xs opacity-50">{rec.date}</span>
                    </div>

                    <h2
                      className={`mt-1 truncate text-base font-bold ${
                        isDarkMode ? "text-white group-hover:text-cyan-100" : "text-slate-900 group-hover:text-cyan-800"
                      }`}
                    >
                      {rec.title}
                    </h2>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-70 truncate">
                      <MapPin size={13} className="shrink-0 text-amber-400" />
                      <span className="truncate">{rec.location}</span>
                    </p>
                  </div>
                </div>

                {/* Middle Info: Officer & Citizen Proposer - Centrally Aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full md:w-[320px] shrink-0">
                  <div
                    className={`rounded-xl border p-2.5 text-center flex flex-col items-center justify-center min-w-0 ${
                      isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-center">
                      Assigned Officer
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-xs font-semibold truncate w-full text-center">
                      <ShieldCheck size={12} className="shrink-0 text-cyan-300" />
                      <span className="truncate">{rec.assignedMember?.fullName || "Unassigned"}</span>
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-2.5 text-center flex flex-col items-center justify-center min-w-0 ${
                      isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-center">
                      Citizen Proposer
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-xs font-semibold truncate w-full text-center">
                      <UserRound size={12} className="shrink-0 text-emerald-300" />
                      <span className="truncate">{rec.citizen?.name || "Verified Citizen"}</span>
                    </p>
                  </div>
                </div>

                {/* Right Section: Status Badge & Action Button */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-[280px] shrink-0 pt-3 border-t border-white/10 md:border-t-0 md:pt-0">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusBadge.color}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${statusBadge.dot}`} />
                    <StatusIcon size={12} />
                    <span>{statusBadge.label}</span>
                  </span>

                  {/* Investigate Action Button */}
                  <Link
                    to={`/agency/recommendations/${rec.id}/investigate`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-md hover:shadow-emerald-700/30"
                  >
                    <span>Investigate</span>
                    <ArrowRight size={13} />
                  </Link>

                  {rec.status === "APPROVED" && (
                    <Link
                      to="/agency/facilities/add"
                      state={{ recommendation: rec }}
                      title="Carry-forward to Add Facility page"
                      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-400/20 transition"
                    >
                      <PlusCircle size={12} />
                      <span>Add the Facility</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div
              className={`rounded-2xl border p-12 text-center shadow-xl backdrop-blur-xl ${
                isDarkMode ? "border-white/15 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-800"
              }`}
            >
              <Search size={28} className="mx-auto opacity-50" />
              <h3 className="mt-3 text-base font-bold">No allocated recommendations found</h3>
              <p className="mt-1 text-xs opacity-60">
                Try switching the officer filter or clearing your search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedOfficer("ALL");
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-400/15 px-3.5 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-400/25 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AssignedRecommendationsPage;
