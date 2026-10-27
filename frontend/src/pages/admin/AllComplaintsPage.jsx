import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { reportView } from "../../api/client";
import {
  Activity,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
  X,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";

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

const SORT_OPTIONS = [
  { value: "submittedDate", label: "Date (Newest)" },
  { value: "facility", label: "Facility / Area" },
  { value: "status", label: "Status" },
  { value: "id", label: "Complaint ID" }
];

function AllComplaintsPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortKey, setSortKey] = useState("submittedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "SELECT";
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch complaints directly from the backend server
  const resource = useApi("/reports");
  const rawList = resource.data || [];

  const complaints = useMemo(() => {
    return rawList.map((r) => {
      const view = reportView(r);
      return {
        id: view.id,
        title: view.title || "Complaint #" + view.id,
        description: view.description || "",
        facility: view.facility || "Facility #" + view.facility_id,
        facilityAddress: view.facilityAddress || "",
        facilityCategory: view.facilityCategoryLabel || view.facilityCategory || "Civic Facility",
        citizen: view.citizen?.name || "Not recorded",
        agency: view.assignedAgency || "Designated Agency",
        assignedOfficer: view.assignedOfficer || "Unassigned Specialist",
        status: r.status, // raw enum: PENDING, UNDER_INVESTIGATION, RESOLVED
        statusLabel: view.status,
        submittedDate: view.date,
        rawDate: r.created_at
      };
    });
  }, [rawList]);

  // Dynamic analytical calculations from backend data
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const investigationCount = complaints.filter((c) => c.status === "UNDER_INVESTIGATION").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Filter complaints based on search query and status filter
  const filteredComplaints = useMemo(() => {
    const q = searchText.toLowerCase().trim();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !q ||
        complaint.title.toLowerCase().includes(q) ||
        complaint.facility.toLowerCase().includes(q) ||
        complaint.facilityAddress.toLowerCase().includes(q) ||
        complaint.citizen.toLowerCase().includes(q) ||
        complaint.agency.toLowerCase().includes(q) ||
        complaint.assignedOfficer.toLowerCase().includes(q) ||
        complaint.id.toString().includes(q);

      const matchesStatus =
        selectedStatus === "ALL" || complaint.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchText, selectedStatus]);

  // Sort complaints dynamically
  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => {
      let comparison = 0;

      if (sortKey === "facility") {
        comparison = (a.facility || "").localeCompare(b.facility || "");
      } else if (sortKey === "status") {
        comparison = (a.status || "").localeCompare(b.status || "");
      } else if (sortKey === "id") {
        comparison = Number(a.id) - Number(b.id);
      } else {
        // submittedDate
        const dateA = new Date(a.rawDate || 0).getTime();
        const dateB = new Date(b.rawDate || 0).getTime();
        comparison = dateA - dateB;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredComplaints, sortKey, sortDirection]);

  const formatStatus = (status) => {
    if (!status) return "";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusInfo = (status) => {
    if (status === "PENDING") {
      return {
        icon: Clock3,
        badge: "border-amber-200/30 bg-amber-300/15 text-amber-200"
      };
    }

    if (status === "UNDER_INVESTIGATION") {
      return {
        icon: Activity,
        badge: "border-cyan-200/30 bg-cyan-300/15 text-cyan-200"
      };
    }

    if (status === "RESOLVED") {
      return {
        icon: CheckCircle2,
        badge: "border-emerald-200/30 bg-emerald-300/15 text-emerald-200"
      };
    }

    return {
      icon: ClipboardList,
      badge: "border-white/20 bg-white/10 text-white/70"
    };
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedStatus("ALL");
  };

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-x-hidden p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : "bg-[#100e0b]"
      }`}
    >
      {/* Background glowing aura layers */}
      {(isLightMode ? lightAuraLayers : auraLayers).map((layer, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)"
          }}
        />
      ))}

      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <ApiState {...resource} />

      <section className={`relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : "text-white"}`}>
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/dashboard"
            className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to dashboard
          </Link>
        </div>

        {/* Top Header & Counter Card */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              All Complaints
            </h1>
            <p className="mt-1.5 text-sm text-white/55">
              Live civic grievance registry across Kolkata Municipal wards and facilities.
            </p>
          </div>

          <div className="admin-glass-card flex items-center gap-3.5 rounded-2xl border border-white/20 px-5 py-3 text-white self-start sm:self-auto">
            <ClipboardList size={22} className="text-cyan-200" aria-hidden="true" />
            <div>
              <p className="text-xs text-white/50">Total Complaints</p>
              <p className="mt-0.5 text-xl font-bold text-white">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="admin-glass-card mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/30 p-5 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Live Complaint Monitoring Active</p>
              <p className="mt-0.5 text-xs text-white/55">
                Showing {filteredComplaints.length} of {totalCount} registered complaints from database.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-300" aria-hidden="true" />
              Backend Connected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp size={15} className="text-cyan-200" aria-hidden="true" />
              {resolutionRate}% Resolution Rate
            </span>
          </div>
        </div>

        {/* 4 Analytical Cards Derived from Live Backend Data */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total */}
          <article className="admin-glass-card relative overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/15 p-2.5 text-cyan-200">
                <ClipboardList size={20} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Total
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-white/60">Registered</p>
            <h2 className="mt-0.5 text-3xl font-bold tracking-tight text-white">{totalCount}</h2>
            <p className="mt-1 text-xs text-white/45">All civic grievances</p>
          </article>

          {/* Card 2: Pending */}
          <article className="admin-glass-card relative overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border border-amber-300/30 bg-amber-400/15 p-2.5 text-amber-200">
                <Clock3 size={20} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">
                Queue
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-white/60">Pending Review</p>
            <h2 className="mt-0.5 text-3xl font-bold tracking-tight text-amber-300">{pendingCount}</h2>
            <p className="mt-1 text-xs text-white/45">Awaiting investigation</p>
          </article>

          {/* Card 3: Under Investigation */}
          <article className="admin-glass-card relative overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/15 p-2.5 text-cyan-200">
                <Activity size={20} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300/80">
                Active
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-white/60">In Investigation</p>
            <h2 className="mt-0.5 text-3xl font-bold tracking-tight text-cyan-300">{investigationCount}</h2>
            <p className="mt-1 text-xs text-white/45">Field officers assigned</p>
          </article>

          {/* Card 4: Resolved */}
          <article className="admin-glass-card relative overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 p-2.5 text-emerald-200">
                <CheckCircle2 size={20} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/80">
                Resolved
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-white/60">Fully Resolved</p>
            <h2 className="mt-0.5 text-3xl font-bold tracking-tight text-emerald-300">{resolvedCount}</h2>
            <p className="mt-1 text-xs text-white/45">{resolutionRate}% resolution success</p>
          </article>
        </div>

        {/* Controls Bar: Search, Status Filter & Sorting */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Complaint Reports</h2>
            <p className="mt-0.5 text-xs text-white/50">
              Showing {filteredComplaints.length} of {totalCount} records
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search reports or areas..."
                aria-label="Search complaints"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-2 pl-9 pr-10 text-xs sm:text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/20"
              />
              {searchText ? (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              ) : (
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/40"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5" aria-label="Filter complaints by status">
              {[
                { id: "ALL", label: "All" },
                { id: "PENDING", label: "Pending" },
                { id: "UNDER_INVESTIGATION", label: "Investigating" },
                { id: "RESOLVED", label: "Resolved" }
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  type="button"
                  onClick={() => setSelectedStatus(filterTab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    selectedStatus === filterTab.id
                      ? "border border-cyan-200/60 bg-cyan-300/20 text-cyan-100 shadow-md shadow-cyan-950/20"
                      : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-pressed={selectedStatus === filterTab.id}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown & Asc/Desc Toggle */}
            <div className="flex items-center gap-2">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                aria-label="Sort complaints by"
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white outline-none backdrop-blur-xl transition hover:border-white/40 focus:border-cyan-200"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label={`Toggle sort direction, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
                aria-pressed={sortDirection === "asc"}
              >
                <ArrowUpDown size={14} aria-hidden="true" />
                {sortDirection === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Grid List */}
        <div className="mt-6 grid gap-4 pb-12">
          {sortedComplaints.map((complaint, index) => {
            const statusInfo = getStatusInfo(complaint.status);
            const StatusIcon = statusInfo.icon;

            return (
              <article
                key={complaint.id}
                className="admin-glass-card group flex flex-col justify-between gap-4 rounded-2xl border border-white/20 p-5 text-white shadow-xl backdrop-blur-xl transition duration-300 hover:border-cyan-300/40 hover:bg-white/[0.08] lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="dashboard-icon-box flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-400/15 text-cyan-200">
                    <ClipboardList size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        #{complaint.id}
                      </span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {complaint.facilityCategory}
                      </span>
                    </div>

                    <h3 className="mt-1 truncate text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition">
                      {complaint.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin size={13} className="shrink-0 text-amber-300" aria-hidden="true" />
                      <span className="truncate">{complaint.facility}</span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      Citizen
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
                      <UserRound size={13} className="shrink-0 text-cyan-200" aria-hidden="true" />
                      <span className="truncate">{complaint.citizen}</span>
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      Assigned Agency
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
                      <Building2 size={13} className="shrink-0 text-emerald-200" aria-hidden="true" />
                      <span className="truncate">{complaint.agency}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:w-[300px] lg:flex-nowrap lg:justify-end">
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.badge}`}
                  >
                    <StatusIcon size={12} aria-hidden="true" />
                    {formatStatus(complaint.status)}
                  </span>

                  <span className="text-xs text-white/50 whitespace-nowrap">
                    {complaint.submittedDate}
                  </span>

                  <Link
                    to={`/admin/complaints/${complaint.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/40 bg-cyan-400/15 px-3.5 py-1.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-900"
                  >
                    View Details
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}

          {filteredComplaints.length === 0 && (
            <div className="admin-glass-card rounded-2xl border border-white/20 px-6 py-14 text-center text-white shadow-xl backdrop-blur-xl">
              <Search size={28} className="mx-auto text-cyan-200/70" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold">No complaints match your criteria</h2>
              <p className="mt-1.5 text-xs text-white/55">
                {searchText
                  ? "Try adjusting your search keywords or clear filters."
                  : "No complaints found under the selected status filter."}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AllComplaintsPage;
