import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock3,
  DoorOpen,
  Droplets,
  HelpCircle,
  MapPin,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trash2,
  UserCheck,
  UserRound,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAdminTheme } from "./useAdminTheme";
import { getAdminRecommendations } from "./adminRecommendationsData";

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
  { value: "date", label: "Sort by date", icon: Calendar },
  { value: "facilityType", label: "Sort by facility", icon: MapPin },
  { value: "status", label: "Sort by status", icon: Activity },
  { value: "id", label: "Sort by ID", icon: Sparkles }
];

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getFacilityBadge(type) {
  const norm = (type || "").toLowerCase();
  if (norm === "dustbin") {
    return {
      label: "Dustbin",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
      iconClass: "border-amber-300/30 bg-amber-400/15 text-amber-200"
    };
  }
  if (norm === "water") {
    return {
      label: "Water Dispenser",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
      iconClass: "border-cyan-300/30 bg-cyan-400/15 text-cyan-200"
    };
  }
  if (norm === "toilet") {
    return {
      label: "Public Toilet",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
      iconClass: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
    };
  }
  return {
    label: "Parking Spot",
    className: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    iconClass: "border-blue-300/30 bg-blue-400/15 text-blue-200"
  };
}

function formatStatus(status, assignedMember) {
  if (!assignedMember) {
    return "Pending Allocation";
  }
  if (status === "UNDER_INVESTIGATION") {
    return `Allotted: ${assignedMember.fullName || assignedMember}`;
  }
  if (status === "APPROVED") {
    return "Approved (Allotted)";
  }
  if (status === "INSTALLED") {
    return "Installed (Complete)";
  }
  return status
    ? status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Allotted";
}

function getStatusStyle(assignedMember, status) {
  if (!assignedMember) {
    return {
      badge: "border-amber-400/50 bg-amber-400/15 text-amber-200 shadow-amber-950/20 hover:bg-amber-400/25",
      pulse: "bg-amber-400",
      icon: AlertTriangle,
      tag: "Unallotted • Click to Allocate",
      actionLabel: "Allocate Member",
      actionBg: "border-amber-300/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
    };
  }

  if (status === "INSTALLED") {
    return {
      badge: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25",
      pulse: "bg-emerald-400",
      icon: CheckCircle2,
      tag: "Completed • Click for Progress",
      actionLabel: "View Progress",
      actionBg: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
    };
  }

  if (status === "APPROVED") {
    return {
      badge: "border-cyan-400/50 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25",
      pulse: "bg-cyan-400",
      icon: Sparkles,
      tag: "Approved • Click for Progress",
      actionLabel: "View Progress",
      actionBg: "border-cyan-300/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
    };
  }

  return {
    badge: "border-cyan-400/50 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25",
    pulse: "bg-cyan-400",
    icon: UserCheck,
    tag: "Allotted • Click for Progress",
    actionLabel: "View Progress",
    actionBg: "border-cyan-300/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
  };
}

function AllRecommendationsPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState(getAdminRecommendations);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortKey, setSortKey] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const searchInputRef = useRef(null);

  // Keyboard shortcut '/' to focus search
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

  // Listen to storage events to sync data across tabs
  useEffect(() => {
    const handleStorage = () => {
      setRecommendations(getAdminRecommendations());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const currentSortOption =
    SORT_OPTIONS.find((option) => option.value === sortKey) ?? SORT_OPTIONS[0];

  // Counts for KPIs
  const unallottedCount = recommendations.filter((r) => !r.assignedMember).length;
  const inProgressCount = recommendations.filter(
    (r) => r.assignedMember && r.status !== "INSTALLED"
  ).length;
  const installedCount = recommendations.filter((r) => r.status === "INSTALLED").length;

  // Filtered list
  const filtered = useMemo(() => {
    return recommendations.filter((item) => {
      const isUnallotted = !item.assignedMember;

      // Status filter
      if (selectedStatus === "UNALLOTTED" && !isUnallotted) return false;
      if (selectedStatus === "ALLOTTED" && isUnallotted) return false;
      if (selectedStatus === "APPROVED" && item.status !== "APPROVED") return false;
      if (selectedStatus === "INSTALLED" && item.status !== "INSTALLED") return false;

      // Category filter
      if (selectedCategory !== "ALL" && (item.facilityType || "").toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search text
      if (searchText.trim()) {
        const query = searchText.toLowerCase();
        const matchesTitle = (item.title || "").toLowerCase().includes(query);
        const matchesLocation = (item.location || "").toLowerCase().includes(query);
        const matchesId = (item.id || "").toLowerCase().includes(query);
        const matchesCitizen = (item.citizen?.name || "").toLowerCase().includes(query);
        const matchesAgency = (item.assignedAgency?.name || "").toLowerCase().includes(query);
        const matchesMember = (item.assignedMember?.fullName || "").toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesLocation &&
          !matchesId &&
          !matchesCitizen &&
          !matchesAgency &&
          !matchesMember
        ) {
          return false;
        }
      }

      return true;
    });
  }, [recommendations, selectedStatus, selectedCategory, searchText]);

  // Sorted list
  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let valA = a[sortKey] || "";
      let valB = b[sortKey] || "";

      if (sortKey === "date") {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (sortKey === "status") {
        valA = a.assignedMember ? a.status : "UNALLOTTED";
        valB = b.assignedMember ? b.status : "UNALLOTTED";
      }

      const cmp = String(valA).localeCompare(String(valB));
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDirection]);

  // Handler for dual-action status click
  const handleStatusClick = (rec) => {
    if (!rec.assignedMember) {
      // First possibility: Not allotted -> redirect to agency members of the same facility category
      navigate(`/admin/recommendations/${rec.id}/allocate`);
    } else {
      // Second possibility: Allotted -> redirect to progress page
      navigate(`/admin/recommendations/${rec.id}/progress`);
    }
  };

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-x-hidden p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode" : "bg-[#100e0b]"
      }`}
    >
      {/* Background glowing aura layers */}
      {(isLightMode ? lightAuraLayers : auraLayers).map((layer, index) => (
        <div
          key={index}
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)"
          }}
        />
      ))}

      <section className={`relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : "text-white"}`}>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to dashboard
          </Link>

          <button
            type="button"
            onClick={() => setIsLightMode((m) => !m)}
            aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
            className={`relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${
              isLightMode
                ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100"
                : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"
            }`}
          >
            <Sun
              size={13}
              className={`transition-all duration-700 ${
                isLightMode ? "scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"
              }`}
              aria-hidden="true"
            />
            <Moon
              size={13}
              className={`transition-all duration-700 ${
                isLightMode ? "rotate-90 scale-75 opacity-50" : "scale-110 opacity-100"
              }`}
              aria-hidden="true"
            />
            <span
              className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ${
                isLightMode
                  ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60"
                  : "bg-cyan-200 shadow-lg shadow-cyan-200/50"
              }`}
            />
          </button>
        </div>

        {/* Page Title & Counter */}
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
              <Sparkles size={12} />
              Civic Infrastructure Proposals
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Citizen Facility Recommendations
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Review and allocate citizen proposals for new dustbins, drinking water dispensers, public toilets, and parking spots.
            </p>
          </div>

          <div className="admin-glass-card flex items-center gap-3 rounded-2xl border border-white/20 px-5 py-3 text-white">
            <Sparkles size={20} className="text-cyan-200" aria-hidden="true" />
            <div>
              <p className="text-xs text-white/50">Total proposals</p>
              <p className="mt-0.5 text-lg font-bold">{recommendations.length}</p>
            </div>
          </div>
        </div>

        {/* Monitoring banner */}
        <div className="admin-glass-card mt-7 flex flex-col justify-between gap-4 rounded-2xl border border-white/30 p-5 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Facility allocation queue active</p>
              <p className="mt-0.5 text-xs text-white/55">
                Showing {sorted.length} of {recommendations.length} recommendations. Click on status to allocate or track progress.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/60">
            <span className="inline-flex items-center gap-1.5 text-amber-200">
              <AlertTriangle size={15} />
              {unallottedCount} Unallotted
            </span>
            <span className="inline-flex items-center gap-1.5 text-cyan-200">
              <Clock3 size={15} />
              {inProgressCount} Under Review
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <CheckCircle2 size={15} />
              {installedCount} Installed
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex text-white/50 border-l border-white/10 pl-3">
              <Clock3 size={13} className="text-cyan-200" />
              Sorted {currentSortOption.label.toLowerCase()}
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {/* Unallotted Card */}
          <article
            className="admin-glass-card relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="dashboard-icon-box rounded-xl border border-amber-200/30 bg-amber-300/15 p-3 text-amber-200">
                <AlertTriangle size={22} aria-hidden="true" />
              </div>
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                Requires Action
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white/70">Unallotted Proposals</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{unallottedCount}</h2>
            <p className="mt-2 text-xs text-white/50 text-center">
              Awaiting agency member assignment by facility category.
            </p>
          </article>

          {/* Under Review Card */}
          <article
            className="admin-glass-card relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="dashboard-icon-box rounded-xl border border-cyan-200/30 bg-cyan-300/15 p-3 text-cyan-200">
                <UserCheck size={22} aria-hidden="true" />
              </div>
              <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-bold text-cyan-200">
                In Field Work
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white/70">Under Field Review</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{inProgressCount}</h2>
            <p className="mt-2 text-xs text-white/50 text-center">
              Assigned to designated agency members conducting feasibility surveys.
            </p>
          </article>

          {/* Installed / Approved Card */}
          <article
            className="admin-glass-card relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="dashboard-icon-box rounded-xl border border-emerald-200/30 bg-emerald-300/15 p-3 text-emerald-200">
                <CheckCircle2 size={22} aria-hidden="true" />
              </div>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                Sanctioned
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white/70">Approved & Commissioned</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{installedCount}</h2>
            <p className="mt-2 text-xs text-white/50 text-center">
              Civic infrastructure approved or installed for public usage.
            </p>
          </article>
        </div>

        {/* Filter and Search Bar */}
        <div className="admin-glass-card mt-8 space-y-4 rounded-2xl border border-white/20 p-5 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by facility title"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/40 outline-none transition focus:border-cyan-300 focus:bg-white/15 focus:ring-1 focus:ring-cyan-300"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2" aria-label="Filter recommendations by status">
              <button
                type="button"
                onClick={() => setSelectedStatus("ALL")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedStatus === "ALL"
                    ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                All Statuses
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("UNALLOTTED")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedStatus === "UNALLOTTED"
                    ? "border-amber-300/60 bg-amber-400/20 text-amber-200"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Pending Allocation
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("ALLOTTED")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedStatus === "ALLOTTED"
                    ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Allotted
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("APPROVED")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedStatus === "APPROVED"
                    ? "border-emerald-200/60 bg-emerald-300/15 text-emerald-100"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Approved
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("INSTALLED")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedStatus === "INSTALLED"
                    ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-200"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Installed
              </button>
            </div>
          </div>

          {/* Secondary Row: Facility Category Filters & Sorting */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Facility Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="mr-1 text-white/50">Facility:</span>
              {[
                { key: "ALL", label: "All Categories" },
                { key: "dustbin", label: "Dustbin", icon: Trash2 },
                { key: "water", label: "Water Dispenser", icon: Droplets },
                { key: "toilet", label: "Public Toilet", icon: DoorOpen },
                { key: "parking", label: "Parking Spot", icon: Car }
              ].map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-medium transition ${
                      isSelected
                        ? "border-cyan-300/70 bg-cyan-300/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon size={12} />}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort direction and options */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1 text-xs">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSortKey(opt.value)}
                    className={`rounded-lg px-2 py-1 font-medium transition ${
                      sortKey === opt.value
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label="Toggle sort direction"
              >
                <ArrowUpDown size={13} aria-hidden="true" />
                {sortDirection === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="mt-6 grid gap-5 pb-12">
          {sorted.map((rec, index) => {
            const facilityBadge = getFacilityBadge(rec.facilityType);
            const FacilityIcon = FACILITY_ICONS[rec.facilityType] || Trash2;
            const statusConfig = getStatusStyle(rec.assignedMember, rec.status);
            const StatusIcon = statusConfig.icon;
            const isUnallotted = !rec.assignedMember;

            return (
              <article
                key={rec.id}
                className="admin-glass-card admin-complaint-card group relative flex flex-col justify-between gap-4 rounded-2xl border border-white/20 p-4 sm:p-5 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-cyan-950/40 xl:flex-row xl:items-center xl:gap-5"
                style={{ "--agency-card-delay": `${index * 60}ms` }}
              >
                {/* Left side: Icon, ID, Title, Location */}
                <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-2.5 ${facilityBadge.iconClass}`}
                  >
                    <FacilityIcon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
                        #{rec.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${facilityBadge.className}`}
                      >
                        {facilityBadge.label}
                      </span>
                      <span className="text-xs text-white/40">
                        {rec.date}
                      </span>
                    </div>

                    <h3 className="mt-1 truncate text-base sm:text-lg font-bold text-white group-hover:text-cyan-100">
                      {rec.title}
                    </h3>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/60">
                      <MapPin size={13} className="shrink-0 text-amber-300" aria-hidden="true" />
                      <span className="truncate">{rec.location}</span>
                    </p>

                    {rec.landmark && (
                      <p className="mt-0.5 text-xs text-white/45 truncate">
                        Landmark: {rec.landmark}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle Info: Citizen Proposer & Agency Mapping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full xl:w-[320px] shrink-0">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 min-w-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 text-center">
                      Citizen Proposer
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-white text-center w-full">
                      <UserRound size={13} className="shrink-0 text-cyan-200" aria-hidden="true" />
                      <span className="truncate">{rec.citizen?.name || "Verified Citizen"}</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 min-w-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 text-center">
                      Mapped Agency
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-white text-center w-full">
                      <Building2 size={13} className="shrink-0 text-emerald-200" aria-hidden="true" />
                      <span className="truncate">{rec.assignedAgency?.name || "Civic Works"}</span>
                    </p>
                  </div>
                </div>

                {/* Right side: Status Button & Action Redirect */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full xl:w-[280px] shrink-0 pt-3 border-t border-white/10 xl:border-t-0 xl:pt-0">
                  {/* Clickable Status Badge (Dual Possibility Target) */}
                  <button
                    type="button"
                    onClick={() => handleStatusClick(rec)}
                    title={isUnallotted ? "Not allotted. Click to allocate to an agency member" : "Allotted. Click to view progress"}
                    className={`group/btn relative inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition shadow-sm shrink-0 ${statusConfig.badge}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${statusConfig.pulse} shadow-[0_0_8px_currentColor] shrink-0`} />
                    <StatusIcon size={13} aria-hidden="true" className="shrink-0" />
                    <span className="max-w-[120px] truncate">{formatStatus(rec.status, rec.assignedMember)}</span>
                    <ArrowUpRight size={12} className="shrink-0 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition" />
                  </button>

                  {/* Explicit Action Button */}
                  <Link
                    to={
                      isUnallotted
                        ? `/admin/recommendations/${rec.id}/allocate`
                        : `/admin/recommendations/${rec.id}/progress`
                    }
                    className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition ${statusConfig.actionBg}`}
                  >
                    <span>{statusConfig.actionLabel}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Empty State */}
          {sorted.length === 0 && (
            <div className="admin-glass-card rounded-2xl border border-white/20 px-6 py-16 text-center text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
              <Search size={28} className="mx-auto text-cyan-200/70" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">No recommendations match your filters</h3>
              <p className="mt-1 text-sm text-white/55">
                Try adjusting your search query, status filters, or facility categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setSelectedStatus("ALL");
                  setSelectedCategory("ALL");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-300/20 hover:text-white"
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

export default AllRecommendationsPage;
