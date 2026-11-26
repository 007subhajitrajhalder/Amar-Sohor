import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { reportView, getStoredUser } from "../../api/client";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  ArrowRight,
  ShieldCheck,
  Building2,
  X
} from "lucide-react";
import Select from "../../components/Select";
import AgencyHeader from "../../components/layout/AgencyHeader";


const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getFacilityBadge(type, isDarkMode) {
  switch ((type || "").toLowerCase()) {
    case "dustbin":
      return {
        label: "Dustbin",
        className: isDarkMode
          ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
          : "border-amber-600/30 bg-amber-100 text-amber-800",
        iconClass: isDarkMode
          ? "border-amber-400/30 bg-amber-400/15 text-amber-200"
          : "border-amber-600/30 bg-amber-200 text-amber-800"
      };
    case "water":
      return {
        label: "Water Dispenser",
        className: isDarkMode
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
          : "border-cyan-600/30 bg-cyan-100 text-cyan-800",
        iconClass: isDarkMode
          ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
          : "border-cyan-600/30 bg-cyan-200 text-cyan-800"
      };
    case "toilet":
      return {
        label: "Public Toilet",
        className: isDarkMode
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-emerald-600/30 bg-emerald-100 text-emerald-800",
        iconClass: isDarkMode
          ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
          : "border-emerald-600/30 bg-emerald-200 text-emerald-800"
      };
    case "parking":
      return {
        label: "Parking Spot",
        className: isDarkMode
          ? "border-blue-400/30 bg-blue-400/10 text-blue-200"
          : "border-blue-600/30 bg-blue-100 text-blue-800",
        iconClass: isDarkMode
          ? "border-blue-400/30 bg-blue-400/15 text-blue-200"
          : "border-blue-600/30 bg-blue-200 text-blue-800"
      };
    default:
      return {
        label: "Civic Amenity",
        className: isDarkMode
          ? "border-white/20 bg-white/10 text-white"
          : "border-slate-300 bg-slate-100 text-slate-800",
        iconClass: isDarkMode
          ? "border-white/20 bg-white/10 text-white"
          : "border-slate-300 bg-slate-200 text-slate-800"
      };
  }
}

function getStatusBadge(status, isDarkMode) {
  const norm = (status || "").toUpperCase();
  if (norm === "UNDER_INVESTIGATION" || norm === "UNDER INVESTIGATION") {
    return {
      label: "Under Investigation",
      color: isDarkMode
        ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
        : "border-cyan-600/50 bg-cyan-100 text-cyan-800",
      dot: "bg-cyan-400 animate-pulse",
      icon: Clock3
    };
  }
  if (norm === "RESOLVED") {
    return {
      label: "Resolved",
      color: isDarkMode
        ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
        : "border-emerald-600/50 bg-emerald-100 text-emerald-800",
      dot: "bg-emerald-400",
      icon: CheckCircle2
    };
  }
  if (norm === "REJECTED") {
    return {
      label: "Rejected",
      color: isDarkMode
        ? "border-rose-400/50 bg-rose-400/15 text-rose-200"
        : "border-rose-600/50 bg-rose-100 text-rose-800",
      dot: "bg-rose-400",
      icon: XCircle
    };
  }
  return {
    label: "Pending Inspection",
    color: isDarkMode
      ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
      : "border-amber-600/50 bg-amber-100 text-amber-800",
    dot: "bg-amber-400 animate-pulse",
    icon: AlertTriangle
  };
}

function AssignedReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light",
  );

  const profileResource = useApi("/users/me");
  const currentUser = profileResource.data || getStoredUser();

  const resource = useApi("/reports?mine=true");
  const rawReports = (resource.data || []).map(reportView);

  // Sync Theme
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

  // URL Query param status synchronization
  const initialStatus = (searchParams.get("status") || "ALL").toUpperCase();
  const [selectedStatus, setSelectedStatus] = useState(
    ["ALL", "PENDING", "UNDER_INVESTIGATION", "RESOLVED", "REJECTED"].includes(initialStatus)
      ? initialStatus
      : "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("ALL");

  const officers = useMemo(() => {
    const map = new Map();
    rawReports.forEach((r) => {
      if (r.assigned_agent && r.assignedOfficer) {
        map.set(r.assigned_agent, r.assignedOfficer);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rawReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return rawReports.filter((item) => {
      // Officer filter
      if (selectedOfficer !== "ALL") {
        const officerId = Number(selectedOfficer);
        if (item.assigned_agent !== officerId) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "ALL") {
        const itemStatus = (item.rawStatus || item.status || "").toUpperCase();
        if (selectedStatus === "PENDING") {
          if (itemStatus !== "PENDING") return false;
        } else if (selectedStatus === "UNDER_INVESTIGATION") {
          if (!["UNDER_INVESTIGATION", "UNDER INVESTIGATION"].includes(itemStatus)) return false;
        } else if (selectedStatus === "RESOLVED") {
          if (itemStatus !== "RESOLVED") return false;
        } else if (selectedStatus === "REJECTED") {
          if (itemStatus !== "REJECTED") return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (item.title || "").toLowerCase().includes(q);
        const matchesFacility = (item.facility || "").toLowerCase().includes(q);
        const matchesAddress = (item.facilityAddress || "").toLowerCase().includes(q);
        const matchesCitizen = (item.citizen?.name || "").toLowerCase().includes(q);
        const matchesOfficer = (item.assignedOfficer || "").toLowerCase().includes(q);
        const matchesId = String(item.id || "").toLowerCase().includes(q);

        if (!matchesTitle && !matchesFacility && !matchesAddress && !matchesCitizen && !matchesOfficer && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [rawReports, selectedOfficer, selectedStatus, searchQuery]);

  // KPI Metrics
  const pendingCount = rawReports.filter((r) =>
    (r.rawStatus || r.status || "").toUpperCase() === "PENDING"
  ).length;
  const underInvestigationCount = rawReports.filter((r) =>
    ["UNDER_INVESTIGATION", "UNDER INVESTIGATION"].includes((r.rawStatus || r.status || "").toUpperCase())
  ).length;
  const resolvedCount = rawReports.filter((r) =>
    (r.rawStatus || r.status || "").toUpperCase() === "RESOLVED"
  ).length;
  const rejectedCount = rawReports.filter((r) =>
    (r.rawStatus || r.status || "").toUpperCase() === "REJECTED"
  ).length;

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b]" : "bg-slate-100"
      }`}
    >
      {/* Background glow layers in dark mode */}
      {isDarkMode && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(125px)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {/* Sticky Header */}
      <AgencyHeader isDark={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
        <ApiState {...resource} />

        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/agency/dashboard"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                isDarkMode ? "text-cyan-300 hover:text-white" : "text-cyan-700 hover:text-cyan-900"
              }`}
            >
              &larr; Agency Dashboard
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
        </div>

        {/* Page Title */}
        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200" : "border-cyan-600/30 bg-cyan-100 text-cyan-800"
              }`}
            >
              <ShieldCheck size={13} />
              Civic Grievances &amp; Complaints
            </div>
            <h1
              className={`mt-2 text-2xl md:text-3xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Assigned Grievance Reports
            </h1>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Review citizen complaints allocated to your agency, conduct on-site field inspections, upload resolution proof, or restart rejected cases.
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
            <div
              className={`rounded-xl border p-2.5 ${
                isDarkMode ? "border-white/15 bg-white/10 text-cyan-200" : "border-slate-200 bg-slate-100 text-cyan-700"
              }`}
            >
              <Building2 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-60">Total Assigned</p>
            <p className="mt-0.5 text-2xl font-bold">{rawReports.length}</p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-amber-300/20 bg-amber-400/10 text-white"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <div
              className={`rounded-xl border p-2.5 ${
                isDarkMode ? "border-amber-300/30 bg-amber-400/20 text-amber-300" : "border-amber-300 bg-amber-100 text-amber-700"
              }`}
            >
              <AlertTriangle size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Pending Inspection</p>
            <p className={`mt-0.5 text-2xl font-bold ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>
              {pendingCount}
            </p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-cyan-300/20 bg-cyan-400/10 text-white"
                : "border-cyan-200 bg-cyan-50 text-cyan-900"
            }`}
          >
            <div
              className={`rounded-xl border p-2.5 ${
                isDarkMode ? "border-cyan-300/30 bg-cyan-400/20 text-cyan-300" : "border-cyan-300 bg-cyan-100 text-cyan-700"
              }`}
            >
              <Clock3 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Under Investigation</p>
            <p className={`mt-0.5 text-2xl font-bold ${isDarkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {underInvestigationCount}
            </p>
          </div>

          <div
            className={`flex flex-col items-center justify-center text-center rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
              isDarkMode
                ? "border-emerald-300/20 bg-emerald-400/10 text-white"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            <div
              className={`rounded-xl border p-2.5 ${
                isDarkMode ? "border-emerald-300/30 bg-emerald-400/20 text-emerald-300" : "border-emerald-300 bg-emerald-100 text-emerald-700"
              }`}
            >
              <CheckCircle2 size={20} />
            </div>
            <p className="mt-2.5 text-xs font-medium opacity-75">Resolved &amp; Closed</p>
            <p className={`mt-0.5 text-2xl font-bold ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>
              {resolvedCount}
            </p>
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
            <div className="relative flex-1 min-w-[240px]">
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
                placeholder="Search by report title, facility, location, citizen, or #ID..."
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

            {/* Officer Filter Dropdown if admin and multiple officers exist */}
            {currentUser?.role === "ADMIN" && officers.length > 1 && (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>
                  Officer:
                </span>
                <Select
                  size="sm"
                  accent="cyan"
                  light={!isDarkMode}
                  aria-label="Filter by officer"
                  className="min-w-[180px]"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  options={[
                    { value: "ALL", label: `All Officers (${officers.length})` },
                    ...officers.map((off) => ({ value: off.id, label: off.name })),
                  ]}
                />
              </div>
            )}

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { key: "ALL", label: "All Statuses" },
                { key: "PENDING", label: `Pending (${pendingCount})` },
                { key: "UNDER_INVESTIGATION", label: `Under Investigation (${underInvestigationCount})` },
                { key: "RESOLVED", label: `Resolved (${resolvedCount})` },
                { key: "REJECTED", label: `Rejected (${rejectedCount})` }
              ].map((tab) => {
                const isSelected = selectedStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(tab.key);
                      if (tab.key === "ALL") {
                        searchParams.delete("status");
                        setSearchParams(searchParams);
                      } else {
                        setSearchParams({ status: tab.key });
                      }
                    }}
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

        {/* Report Cards List */}
        <div className="mt-6 grid gap-4 pb-16">
          {filteredReports.map((report) => {
            const FacilityIcon = FACILITY_ICONS[report.facilityCategory] || Building2;
            const facilityBadge = getFacilityBadge(report.facilityCategory, isDarkMode);
            const statusBadge = getStatusBadge(report.rawStatus || report.status, isDarkMode);
            const StatusIcon = statusBadge.icon;

            return (
              <article
                key={report.id}
                className={`group relative flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 lg:flex-row lg:items-center ${
                  isDarkMode
                    ? "border-white/15 bg-white/[0.06] hover:border-cyan-300/40 hover:shadow-cyan-950/40"
                    : "border-slate-200 bg-white hover:border-cyan-600/40 hover:shadow-slate-300/60"
                }`}
              >
                {/* Left Section: Icon & Grievance Info */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-2.5 ${facilityBadge.iconClass}`}
                  >
                    <FacilityIcon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>
                        #{report.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${facilityBadge.className}`}
                      >
                        {facilityBadge.label}
                      </span>
                      <span className={`text-xs ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>{report.date}</span>
                    </div>

                    <h2
                      className={`mt-1 break-words text-base font-bold ${
                        isDarkMode ? "text-white group-hover:text-cyan-100" : "text-slate-900 group-hover:text-cyan-800"
                      }`}
                    >
                      {report.title}
                    </h2>

                    <p className={`mt-0.5 flex items-center gap-1.5 text-xs truncate ${isDarkMode ? "text-white/70" : "text-slate-600"}`}>
                      <MapPin size={13} className={`shrink-0 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                      <span className="truncate">{report.facility} &bull; {report.facilityAddress}</span>
                    </p>
                  </div>
                </div>

                {/* Middle Info: Officer & Citizen Complainant - Centrally Aligned */}
                <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-[320px] lg:shrink-0">
                  <div
                    className={`rounded-xl border p-2.5 text-center flex flex-col items-center justify-center min-w-0 ${
                      isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-center">
                      Assigned Officer
                    </p>
                    <p className={`mt-0.5 flex items-center justify-center gap-1 text-xs font-semibold truncate w-full text-center ${isDarkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                      <ShieldCheck size={12} className={`shrink-0 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`} />
                      <span className="truncate">
                        {report.assignedOfficer || "Allocated to You"}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-2.5 text-center flex flex-col items-center justify-center min-w-0 ${
                      isDarkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-center">
                      Citizen Complainant
                    </p>
                    <p className={`mt-0.5 flex items-center justify-center gap-1 text-xs font-semibold truncate w-full text-center ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      <UserRound size={12} className={`shrink-0 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`} />
                      <span className="truncate">{report.citizen?.name || "Not recorded"}</span>
                    </p>
                  </div>
                </div>

                {/* Right Section: Status Badge & Action Buttons */}
                <div className="flex w-full flex-wrap items-center justify-center gap-2.5 border-t border-white/10 pt-3 lg:w-[280px] lg:shrink-0 lg:justify-end lg:border-t-0 lg:pt-0">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusBadge.color}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${statusBadge.dot}`} />
                    <StatusIcon size={12} />
                    <span>{statusBadge.label}</span>
                  </span>

                  {/* Action Button: Investigate */}
                  <Link
                    to={`/agency/reports/${report.id}/investigate`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-md hover:shadow-emerald-700/30"
                  >
                    <span>Investigate</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div
              className={`rounded-2xl border p-12 text-center shadow-xl backdrop-blur-xl ${
                isDarkMode ? "border-white/15 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-800"
              }`}
            >
              <Search size={28} className="mx-auto opacity-50" />
              <h3 className="mt-3 text-base font-bold">No assigned reports found</h3>
              <p className="mt-1 text-xs opacity-60">
                {selectedStatus !== "ALL" || searchQuery.trim()
                  ? "Try switching the status filter or clearing your search term."
                  : "No grievance reports are currently assigned to your agency account."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedOfficer("ALL");
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                  searchParams.delete("status");
                  setSearchParams(searchParams);
                }}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                  isDarkMode ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25" : "border-cyan-600/40 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                }`}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AssignedReportsPage;
