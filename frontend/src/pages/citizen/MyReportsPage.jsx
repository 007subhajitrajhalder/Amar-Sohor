import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  ClipboardList,
  DoorOpen,
  Droplets,
  Filter,
  Map,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Car,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { reportView } from "../../api/client";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";

const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const statusStyle = {
  Pending: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  "Under Investigation": "bg-blue-400/10 text-blue-300 border border-blue-400/20",
  Resolved: "bg-lime-300/10 text-lime-300 border border-lime-300/20",
  Rejected: "bg-rose-400/10 text-rose-300 border border-rose-400/20",
};

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car,
};

function MyReportsPage() {
  const navigate = useNavigate();
  const resource = useApi("/reports?submitted_by_me=true");
  const reports = (resource.data || []).map(reportView);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const count = (status) =>
    reports.filter((r) => r.status?.toLowerCase() === status.toLowerCase()).length;

  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      icon: ClipboardList,
      color: "text-white",
    },
    {
      label: "Pending",
      value: count("Pending"),
      icon: CircleDashed,
      color: "text-amber-300",
    },
    {
      label: "Under Investigation",
      value: count("Under Investigation"),
      icon: Search,
      color: "text-blue-300",
    },
    {
      label: "Resolved",
      value: count("Resolved"),
      icon: CheckCircle2,
      color: "text-lime-300",
    },
    {
      label: "Rejected",
      value: count("Rejected"),
      icon: XCircle,
      color: "text-rose-300",
    },
  ];

  const filtered = reports.filter((report) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pending" && report.status === "Pending") ||
      (selectedFilter === "investigating" && report.status === "Under Investigation") ||
      (selectedFilter === "resolved" && report.status === "Resolved") ||
      (selectedFilter === "rejected" && report.status === "Rejected");

    const matchesSearch =
      !searchQuery.trim() ||
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.facility?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.facilityAddress?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="page-bg pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      {/* Header */}
      <SiteHeader>
        <div className="flex items-center gap-3">
            {/* User Request: Button to report a new issue redirects to Map view page where user can choose facility */}
            <Link
              to="/map"
              className="flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/10"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Report a New Issue</span>
              <span className="sm:hidden">Report</span>
            </Link>

            <button
            onClick={() => navigate("/citizen/dashboard")}              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
      </SiteHeader>

      {/* Main Content */}
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <ApiState {...resource} />
        <section className="mx-auto max-w-7xl">
          {/* Header titles */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                GRIEVANCE TRACKER
              </p>
              <h1 className="mt-2 text-2xl font-bold md:text-4xl">My Reports</h1>
              <p className="mt-1.5 text-xs md:text-sm text-white/50 max-w-2xl">
                Track every issue you have submitted and follow real-time progress from agency investigation to field resolution.
              </p>
            </div>

            <div className="flex gap-2.5">
              <Link
                to="/citizen/my-recommendations"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
              >
                Switch to My Recommendations
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-5 backdrop-blur-2xl transition duration-300 hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40">{label}</p>
                  <Icon size={19} className={color} />
                </div>
                <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
              </article>
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Reports" },
                { id: "pending", label: "Pending" },
                { id: "investigating", label: "Under Investigation" },
                { id: "resolved", label: "Resolved" },
                { id: "rejected", label: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedFilter === tab.id
                      ? "bg-lime-300 text-black shadow-lg shadow-lime-300/10"
                      : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports or facilities..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2 pl-9 pr-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 focus:border-lime-300/40"
              />
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          </div>

          {/* Reports List */}
          <div className="mt-6 grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-2xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
                  <Filter size={20} />
                </div>
                <h3 className="mt-3 text-lg font-bold">No reports found</h3>
                <p className="mx-auto mt-1.5 max-w-md text-xs text-white/40">
                  {searchQuery
                    ? "Try adjusting your search query or filter."
                    : "No civic issue reports currently match this filter."}
                </p>
                {/* Redirects to map view to choose facility */}
                <Link
                  to="/map"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-200 transition"
                >
                  <Map size={15} /> Choose Facility to Report on Map
                </Link>
              </div>
            ) : (
              filtered.map((report) => {
                const Icon = facilityIcons[report.facilityCategory] || ClipboardList;
                const reportCode = String(report.id).startsWith("REP-")
                  ? report.id
                  : `REPORT #${String(report.id).padStart(3, "0")}`;

                return (
                  <article
                    key={report.id}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-5 shadow-xl backdrop-blur-2xl transition duration-300 hover:border-lime-300/30 hover:bg-white/[0.06] md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-300">
                        <Icon size={20} />
                      </div>
                      {report.photoUrl && (
                        <img
                          src={report.photoUrl}
                          alt={`Evidence for ${report.title}`}
                          className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover"
                        />
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tracking-wider text-lime-300">
                            {reportCode}
                          </span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs text-white/40">{report.date}</span>
                          {report.facilityCategoryLabel && (
                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
                              {report.facilityCategoryLabel}
                            </span>
                          )}
                          {(report.aiValidated || report.agencyNotes?.includes("[AI Validation:")) && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                              <Sparkles size={11} /> AI Validated
                            </span>
                          )}
                        </div>

                        <h2 className="mt-1 text-base sm:text-lg font-bold text-white group-hover:text-lime-200 transition">
                          {report.title}
                        </h2>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/50">
                          <MapPin size={13} className="text-lime-300 shrink-0" />
                          <span>{report.facility}</span>
                          {report.facilityAddress && (
                            <span className="text-white/30 text-xs">
                              ({report.facilityAddress})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyle[report.status] ||
                          "bg-white/10 text-white/70 border border-white/15"
                        }`}
                      >
                        ● {report.status}
                      </span>

                      <Link
                        to={`/citizen/reports/${report.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-3.5 py-2 text-xs font-bold text-black hover:bg-lime-200 transition"
                      >
                        <span>View Details</span>
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

export default MyReportsPage;
