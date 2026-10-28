import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  DoorOpen,
  Droplets,
  Filter,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { recommendationView } from "../../api/client";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const statusStyle = {
  Submitted: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
  "Pending Review": "bg-amber-400/15 text-amber-300 border border-amber-400/30",
  "Under Review": "bg-blue-400/15 text-blue-300 border border-blue-400/30",
  "Site Survey Completed": "bg-blue-400/15 text-blue-300 border border-blue-400/30",
  Allotted: "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30",
  "Under Investigation": "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30",
  Approved: "bg-purple-400/15 text-purple-300 border border-purple-400/30",
  Installed: "bg-lime-300/15 text-lime-300 border border-lime-300/30",
  Rejected: "bg-rose-400/15 text-rose-300 border border-rose-400/30"
};

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function MyRecommendationsPage() {
  const navigate = useNavigate();
  // Fetch user's recommendations from backend server
  const resource = useApi("/recommendations?submitted_by_me=true");
  const rawList = resource.data || [];

  const recommendations = useMemo(() => {
    return rawList.map((r) => recommendationView(r, true));
  }, [rawList]);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest, "asc" = oldest

  // Data analytics calculations directly from live backend records
  const totalCount = recommendations.length;

  const countStatus = (stageFilter) => {
    if (stageFilter === "submitted") {
      return recommendations.filter(
        (r) => r.status === "Submitted" || r.status === "Pending Review" || !r.status
      ).length;
    }
    if (stageFilter === "under-review") {
      return recommendations.filter(
        (r) =>
          r.status === "Under Review" ||
          r.status === "Site Survey Completed" ||
          r.status === "Allotted" ||
          r.status === "Under Investigation"
      ).length;
    }
    if (stageFilter === "approved") {
      return recommendations.filter((r) => r.status === "Approved").length;
    }
    if (stageFilter === "installed") {
      return recommendations.filter((r) => r.status === "Installed").length;
    }
    if (stageFilter === "rejected") {
      return recommendations.filter((r) => r.status === "Rejected").length;
    }
    return recommendations.length;
  };

  const pendingCount = countStatus("submitted");
  const underReviewCount = countStatus("under-review");
  const approvedCount = countStatus("approved");
  const installedCount = countStatus("installed");
  const rejectedCount = countStatus("rejected");

  const successRate = totalCount > 0
    ? Math.round(((approvedCount + installedCount) / totalCount) * 100)
    : 0;

  // Category breakdown analytics from live data
  const categoryCounts = useMemo(() => {
    const counts = { dustbin: 0, water: 0, toilet: 0, parking: 0 };
    recommendations.forEach((r) => {
      const cat = r.facilityType || "dustbin";
      if (counts[cat] !== undefined) counts[cat]++;
    });
    return counts;
  }, [recommendations]);

  // Filter recommendations based on tab and search
  const filtered = useMemo(() => {
    return recommendations.filter((r) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "submitted" &&
          (r.status === "Submitted" || r.status === "Pending Review" || !r.status)) ||
        (selectedFilter === "under-review" &&
          (r.status === "Under Review" ||
            r.status === "Site Survey Completed" ||
            r.status === "Allotted" ||
            r.status === "Under Investigation")) ||
        (selectedFilter === "approved" && r.status === "Approved") ||
        (selectedFilter === "installed" && r.status === "Installed") ||
        (selectedFilter === "rejected" && r.status === "Rejected");

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.facilityLabel?.toLowerCase().includes(q) ||
        String(r.id).includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [recommendations, selectedFilter, searchQuery]);

  // Sort recommendations
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.rawDate || 0).getTime();
      const dateB = new Date(b.rawDate || 0).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [filtered, sortOrder]);

  const stats = [
    {
      label: "Total Proposals",
      value: totalCount,
      icon: Lightbulb,
      color: "text-white",
      desc: "Civic proposals submitted by you"
    },
    {
      label: "Awaiting Review",
      value: pendingCount,
      icon: CircleDashed,
      color: "text-amber-300",
      desc: "Pending municipal triage"
    },
    {
      label: "Under Feasibility Survey",
      value: underReviewCount,
      icon: CircleDashed,
      color: "text-cyan-300",
      desc: "Field officer allocated"
    },
    {
      label: "Commissioned & Live",
      value: installedCount,
      icon: CheckCircle2,
      color: "text-lime-300",
      desc: "Operational on city map"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background Wallpaper */}
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
            <Link
              to="/citizen/recommendation"
              className="flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/10"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Recommend Facility</span>
            </Link>

            <button
              onClick={() => navigate("/citizen/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <ApiState {...resource} />

        <section className="mx-auto max-w-7xl">
          {/* Header Title Bar */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                PROPOSAL ANALYTICS & REGISTRY
              </p>
              <h1 className="mt-2 text-2xl font-bold md:text-4xl">
                My Recommendations
              </h1>
              <p className="mt-1.5 text-xs md:text-sm text-white/50 max-w-2xl">
                Track the complete lifecycle of your civic proposals from citizen submission to field investigation, municipal sanction, and live commissioning.
              </p>
            </div>

            <div className="flex gap-2.5">
              <Link
                to="/citizen/my-reports"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
              >
                Switch to My Reports
              </Link>
            </div>
          </div>

          {/* 4 Data Analytics Cards from Live Backend Data */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color, desc }) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl transition duration-300 hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</p>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-lime-300">
                    <Icon size={18} className={color} />
                  </div>
                </div>
                <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
                <p className="mt-1 text-[11px] text-white/40">{desc}</p>
              </article>
            ))}
          </div>

          {/* Analytics Overview Bar: Category Breakdown & Commission Rate */}
          <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-semibold text-white/60">Category Distribution:</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
                <Trash2 size={13} className="text-lime-300" />
                Waste Bins: {categoryCounts.dustbin}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
                <Droplets size={13} className="text-cyan-300" />
                Water: {categoryCounts.water}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
                <DoorOpen size={13} className="text-amber-300" />
                Toilets: {categoryCounts.toilet}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
                <Car size={13} className="text-purple-300" />
                Parking: {categoryCounts.parking}
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-lime-300">
              <TrendingUp size={15} />
              <span>{successRate}% Approval / Live Rate</span>
            </div>
          </div>

          {/* Controls Bar: Filters, Search & Sort */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `All (${totalCount})` },
                { id: "submitted", label: `Awaiting Review (${pendingCount})` },
                { id: "under-review", label: `In Survey (${underReviewCount})` },
                { id: "approved", label: `Approved (${approvedCount})` },
                { id: "installed", label: `Installed (${installedCount})` },
                ...(rejectedCount > 0 ? [{ id: "rejected", label: `Rejected (${rejectedCount})` }] : [])
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

            {/* Search Box & Sort Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="relative min-w-[240px] flex-1 sm:flex-none">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, location or ID..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2 pl-9 pr-8 text-xs text-white outline-none placeholder:text-white/30 focus:border-lime-300/40"
                />
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition whitespace-nowrap"
                title={`Sort by Date: currently ${sortOrder === "desc" ? "Newest first" : "Oldest first"}`}
              >
                <ArrowUpDown size={13} />
                <span>{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
              </button>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="mt-6 grid gap-4 pb-12">
            {sorted.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-2xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
                  <Filter size={20} />
                </div>
                <h3 className="mt-3 text-lg font-bold">No recommendations found</h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-white/40">
                  {searchQuery
                    ? "Try adjusting your search query or clear the filter."
                    : "You have not submitted any recommendations under this status filter yet."}
                </p>
                <Link
                  to="/citizen/recommendation"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-200 transition"
                >
                  <Plus size={15} /> Recommend a Facility
                </Link>
              </div>
            ) : (
              sorted.map((item) => {
                const Icon = facilityIcons[item.facilityType] || Lightbulb;
                return (
                  <article
                    key={item.id}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl transition duration-300 hover:border-lime-300/30 hover:bg-white/[0.07] md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-300">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tracking-wider text-lime-300">
                            #{item.id}
                          </span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs text-white/40">{item.date}</span>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                            {item.facilityLabel}
                          </span>
                          {item.assignedAgency?.name && (
                            <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                              {item.assignedAgency.name}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-1.5 text-base sm:text-lg font-bold text-white group-hover:text-lime-200 transition truncate">
                          {item.title}
                        </h2>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/50 truncate">
                          <MapPin size={13} className="text-lime-300 shrink-0" />
                          <span className="truncate">{item.location}</span>
                          {item.coordinates && (
                            <span className="hidden sm:inline font-mono text-[10px] text-lime-300/60 pl-1">
                              ({item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto shrink-0">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyle[item.status] ||
                          "bg-white/10 text-white/70 border border-white/15"
                        }`}
                      >
                        ● {item.status}
                      </span>

                      <Link
                        to={`/citizen/recommendations/${item.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-3.5 py-2 text-xs font-bold text-black hover:bg-lime-200 transition shadow-md shadow-lime-300/10"
                      >
                        <span>View Status</span>
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
                <a href="mailto:amarsohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amarsohor@gmail.com
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

export default MyRecommendationsPage;
