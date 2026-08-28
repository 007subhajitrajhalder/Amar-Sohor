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
  Moon,
  RefreshCw,
  Search,
  Sun,
  UserRound,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";



import { useAdminTheme } from "./useAdminTheme";

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
  { value: "submittedDate", label: "Sort by date", icon: Calendar },
  { value: "facility", label: "Sort by area", icon: MapPin },
  { value: "status", label: "Sort by status", icon: Activity },
  { value: "id", label: "Sort by report", icon: ClipboardList }
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
      const isTyping = activeElement?.tagName === "INPUT" || activeElement?.tagName === "TEXTAREA" || activeElement?.tagName === "SELECT";
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentSortOption = SORT_OPTIONS.find((option) => option.value === sortKey) ?? SORT_OPTIONS[0];

  // Temporary complaint data.
  // Later, it will come from the backend.
  const complaints = [
    {
      id: 101,
      title: "Dustbin Overflowing",
      facility: "Gariahat Community Dustbin",
      citizen: "Ananya Sen",
      agency: "KMC SWM Department",
      status: "PENDING",
      submittedDate: "21 August 2026"
    },
    {
      id: 102,
      title: "Water Not Available",
      facility: "Salt Lake Water Point",
      citizen: "Rahul Das",
      agency: "KMC Water Department",
      status: "UNDER_INVESTIGATION",
      submittedDate: "20 August 2026"
    },
    {
      id: 103,
      title: "Parking Area Closed",
      facility: "New Market Parking",
      citizen: "Priya Ghosh",
      agency: "Kolkata Police",
      status: "RESOLVED",
      submittedDate: "18 August 2026"
    },
    {
      id: 104,
      title: "Public Toilet Is Dirty",
      facility: "College Street Public Toilet",
      citizen: "Arjun Roy",
      agency: "KMC Sanitation Department",
      status: "PENDING",
      submittedDate: "17 August 2026"
    }
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const searchValue = searchText.toLowerCase();

    const matchesSearch =
      complaint.title.toLowerCase().includes(searchValue) ||
      complaint.facility.toLowerCase().includes(searchValue) ||
      complaint.citizen.toLowerCase().includes(searchValue) ||
      complaint.agency.toLowerCase().includes(searchValue) ||
      complaint.id.toString().includes(searchValue);

    const matchesStatus =
      selectedStatus === "ALL" ||
      complaint.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const parseDate = (dateString) => new Date(dateString);

  const sortedComplaints = [...filteredComplaints].sort((first, second) => {
    let comparison;

    if (sortKey === "facility") {
      comparison = first.facility.localeCompare(second.facility);
    } else if (sortKey === "status") {
      comparison = first.status.localeCompare(second.status);
    } else if (sortKey === "id") {
      comparison = first.id - second.id;
    } else {
      comparison = parseDate(first.submittedDate) - parseDate(second.submittedDate);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatStatus = (status) => {
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

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "PENDING"
  ).length;

  const investigationCount = complaints.filter(
    (complaint) => complaint.status === "UNDER_INVESTIGATION"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  const clearFilters = () => {
    setSearchText("");
    setSelectedStatus("ALL");
  };

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

      <section className={`relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : ""}`}>
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
          
        <div className="mt-6 flex items-center justify-between">
          <div>
 
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              All Complaints
            </h1>
            <p className="mt-2 text-sm text-white/55">
              View complaints submitted for every registered facility.
            </p>
          </div>

          <div className="admin-glass-card admin-user-glass-card flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 text-white">
            <ClipboardList size={19} className="text-cyan-200" aria-hidden="true" />
            <div>
              <p className="text-xs text-white/50">Total complaints</p>
              <p className="mt-0.5 text-lg font-bold">{complaints.length}</p>
            </div>
          </div>
        </div>

        <div className="admin-glass-card mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-white/30 p-5 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Complaint monitoring active</p>
              <p className="mt-1 text-xs text-white/55">
                {filteredComplaints.length} of {complaints.length} complaints shown.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-white/60">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" aria-hidden="true" />
              Live updates
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <Clock3 size={16} className="text-cyan-200" aria-hidden="true" />
              Sorted {currentSortOption.label.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article
            className="admin-glass-card admin-stat-card admin-agency-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
            style={{ "--agency-card-delay": "0ms" }}
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-amber-100">
                <Clock3 size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Queue
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Pending</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">{pendingCount}</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Awaiting assignment</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-amber-200">
              <Activity size={14} aria-hidden="true" />
              Needs review
            </div>
          </article>

          <article
            className="admin-glass-card admin-stat-card admin-agency-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
            style={{ "--agency-card-delay": "80ms" }}
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-cyan-100">
                <Activity size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                In progress
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Under investigation</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">{investigationCount}</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Currently being worked on</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan-200/70">
              <Activity size={14} aria-hidden="true" />
              Active tickets
            </div>
          </article>

          <article
            className="admin-glass-card admin-stat-card admin-agency-glass-card relative h-full overflow-hidden rounded-2xl border border-white/30 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl"
            style={{ "--agency-card-delay": "160ms" }}
          >
            <div className="flex items-start justify-between">
              <div className="dashboard-icon-box rounded-xl border border-white/30 bg-white/5 p-3 text-emerald-100">
                <CheckCircle2 size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Completed
              </span>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Resolved</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-white">{resolvedCount}</h2>
            <p className="mt-2 text-xs font-medium text-white/50">Completed reports</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-200/70">
              <CheckCircle2 size={14} aria-hidden="true" />
              All resolved
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Complaint reports</h2>
            <p className="mt-1 text-sm text-white/50">
              {filteredComplaints.length} of {complaints.length} complaints shown
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full xl:w-72">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search reports or facilities"
                aria-label="Search complaints"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-10 pr-12 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
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

            <div className="flex flex-wrap items-center gap-2" aria-label="Filter complaints by status">
              <button
                type="button"
                onClick={() => setSelectedStatus("ALL")}
                className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selectedStatus === "ALL" ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={selectedStatus === "ALL"}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("PENDING")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${selectedStatus === "PENDING" ? "border-amber-200/60 bg-amber-300/15 text-amber-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={selectedStatus === "PENDING"}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("UNDER_INVESTIGATION")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${selectedStatus === "UNDER_INVESTIGATION" ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={selectedStatus === "UNDER_INVESTIGATION"}
              >
                Investigating
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("RESOLVED")}
                className={`whitespace-nowrap rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${selectedStatus === "RESOLVED" ? "border-emerald-200/60 bg-emerald-300/15 text-emerald-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={selectedStatus === "RESOLVED"}
              >
                Resolved
              </button>
            </div>

            <div className="relative flex flex-wrap items-center gap-2" aria-label="Sort complaints">
              

              <button
                type="button"
                onClick={() => setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"))}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label={`Toggle sort direction, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
                aria-pressed={sortDirection === "asc"}
              >
                <ArrowUpDown size={16} aria-hidden="true" />
                {sortDirection === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 pb-8">
          {sortedComplaints.map((complaint, index) => {
            const statusInfo = getStatusInfo(complaint.status);
            const StatusIcon = statusInfo.icon;

            return (
              <article
                key={complaint.id}
                className="admin-glass-card admin-complaint-card admin-agency-glass-card group flex flex-col justify-between gap-5 rounded-2xl border border-white/20 p-5 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40 sm:flex-row sm:items-center sm:p-6"
                style={{ "--agency-card-delay": `${index * 60}ms` }}
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="dashboard-icon-box flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/25 bg-amber-300/15 text-amber-200">
                    <ClipboardList size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">
                      #{complaint.id}
                    </span>
                    <h3 className="mt-1 truncate text-lg font-bold">
                      {complaint.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-white/55">
                      <MapPin size={14} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{complaint.facility}</span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:w-[400px]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white">
                      Citizen
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold">
                      <UserRound size={14} className="shrink-0 text-cyan-200" aria-hidden="true" />
                      {complaint.citizen}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white">
                      Agency
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold">
                      <Building2 size={14} className="shrink-0 text-emerald-200" aria-hidden="true" />
                      {complaint.agency}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:w-[380px] lg:flex-nowrap lg:justify-end">
                  <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${statusInfo.badge}`}>
                    <StatusIcon size={13} aria-hidden="true" />
                    {formatStatus(complaint.status)}
                  </span>
                  <span className="text-xs text-white/40">
                    {complaint.submittedDate}
                  </span>
                  <Link
                    to={`/admin/complaints/${complaint.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/20 hover:text-white"
                  >
                    View
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}

          {filteredComplaints.length === 0 && (
            <div className="admin-glass-card rounded-2xl border border-white/20 px-6 py-14 text-center text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
              <Search size={24} className="mx-auto text-cyan-200/70" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold">No complaints found</h2>
              <p className="mt-2 text-sm text-white/55">
                Try a different search or status filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/20 hover:text-white"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AllComplaintsPage;
