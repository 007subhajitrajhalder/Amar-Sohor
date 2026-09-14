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
  Mail,
  Map,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Car,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredReports } from "./reportsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const statusStyle = {
  Pending: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  "Under Investigation": "bg-blue-400/10 text-blue-300 border border-blue-400/20",
  Resolved: "bg-lime-300/10 text-lime-300 border border-lime-300/20",
};

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car,
};

function MyReportsPage() {
  const navigate = useNavigate();
  const [reports] = useState(getStoredReports);
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
  ];

  const filtered = reports.filter((report) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pending" && report.status === "Pending") ||
      (selectedFilter === "investigating" && report.status === "Under Investigation") ||
      (selectedFilter === "resolved" && report.status === "Resolved");

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
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-11 w-11 rounded-full border border-lime-300/20 object-cover"
            />
            <h1 className="text-xl font-bold md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tracking-wider text-lime-300">
                            {reportCode}
                          </span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs text-white/40">{report.date}</span>
                          {report.issueCategory && (
                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
                              {report.issueCategory}
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
      <footer className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-lime-300/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-lime-300/30 bg-white/[0.08] shadow-lg shadow-lime-300/10 backdrop-blur-md transition duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Amar Sohor Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-wide text-white">
                    Amar <span className="text-lime-300">Sohor</span>
                  </h3>
                  <p className="mt-1 text-[11px] tracking-wide text-white/40">
                    My City. My Responsibility.
                  </p>
                </div>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
                A citizen-centric smart city platform designed to help people discover public facilities and stay connected with their city.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                <span className="h-px w-12 bg-lime-300/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
                  Smart City Platform
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Contact Us
              </h4>

              <div className="mt-4 flex flex-col gap-4">
                <a href="mailto:amersohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amersohor@gmail.com
                    </p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Phone size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Phone</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Follow Us
              </h4>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Stay connected with Amar Sohor and follow our latest updates across social platforms.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">f</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">◎</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </a>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-white/35">
              © 2026 Amar Sohor. All rights reserved.
            </p>

            <p className="text-xs text-white/35">
              Making cities smarter, cleaner and more connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyReportsPage;
