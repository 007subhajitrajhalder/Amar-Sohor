import { useState } from "react";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  DoorOpen,
  Droplets,
  Filter,
  Lightbulb,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEED_RECOMMENDATIONS } from "./recommendationsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

const statusStyle = {
  Submitted: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  "Pending Review": "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  "Under Review": "bg-blue-400/10 text-blue-300 border border-blue-400/20",
  "Site Survey Completed": "bg-blue-400/10 text-blue-300 border border-blue-400/20",
  Allotted: "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
  "Under Investigation": "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
  Approved: "bg-purple-400/10 text-purple-300 border border-purple-400/20",
  Installed: "bg-lime-300/10 text-lime-300 border border-lime-300/20",
};

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car,
};

function getStoredRecommendations() {
  try {
    const stored = JSON.parse(
      localStorage.getItem("citizen_recommendations") || "[]"
    );
    const formattedStored = stored.map((item) => ({
      ...item,
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently",
      stage: item.stage || 1,
      reviewDepartment:
        item.reviewDepartment || "Municipal Civic Works Evaluation Wing",
      reviewNotes:
        item.reviewNotes ||
        "Your recommendation has been registered. Initial review by the urban planning officer is pending.",
    }));

    const existingIds = new Set(formattedStored.map((r) => r.id));
    return [
      ...formattedStored,
      ...SEED_RECOMMENDATIONS.filter((seed) => !existingIds.has(seed.id)),
    ];
  } catch {
    return SEED_RECOMMENDATIONS;
  }
}

function MyRecommendationsPage() {
  const navigate = useNavigate();
  const [recommendations] = useState(getStoredRecommendations);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter recommendations
  const filtered = recommendations.filter((r) => {
    // Status filter
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "submitted" &&
        (r.status === "Submitted" || r.status === "Pending Review" || !r.status)) ||
      (selectedFilter === "under-review" &&
        (r.status === "Under Review" || r.status === "Site Survey Completed" || r.status === "Allotted" || r.status === "Under Investigation")) ||
      (selectedFilter === "approved" && r.status === "Approved") ||
      (selectedFilter === "installed" && r.status === "Installed");

    // Search query
    const matchesSearch =
      !searchQuery.trim() ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facilityLabel?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const countStatus = (stageFilter) => {
    if (stageFilter === "submitted") {
      return recommendations.filter(
        (r) => r.status === "Submitted" || r.status === "Pending Review" || !r.status
      ).length;
    }
    if (stageFilter === "under-review") {
      return recommendations.filter(
        (r) => r.status === "Under Review" || r.status === "Site Survey Completed" || r.status === "Allotted" || r.status === "Under Investigation"
      ).length;
    }
    if (stageFilter === "approved") {
      return recommendations.filter((r) => r.status === "Approved").length;
    }
    if (stageFilter === "installed") {
      return recommendations.filter((r) => r.status === "Installed").length;
    }
    return recommendations.length;
  };

  const stats = [
    {
      label: "Total Proposals",
      value: recommendations.length,
      icon: Lightbulb,
      color: "text-white",
    },
    {
      label: "Awaiting Review",
      value: countStatus("submitted"),
      icon: CircleDashed,
      color: "text-amber-300",
    },
    {
      label: "Under Review / Survey",
      value: countStatus("under-review"),
      icon: CircleDashed,
      color: "text-blue-300",
    },
    {
      label: "Installed & Live",
      value: countStatus("installed"),
      icon: CheckCircle2,
      color: "text-lime-300",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070b18] text-white">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-lime-300/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />

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
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-7xl">
          {/* Header Title */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                RECOMMENDATION TRACKER
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                My Recommendations
              </h1>
              <p className="mt-3 text-white/45 max-w-2xl">
                Monitor the status of your civic proposals for new dustbins, water dispensers, toilets, and parking spaces as municipal authorities inspect and commission them.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/citizen/my-reports"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
              >
                Switch to My Reports
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl transition duration-300 hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/40">{label}</p>
                  <Icon size={21} className={color} />
                </div>
                <p className={`mt-4 text-4xl font-bold ${color}`}>{value}</p>
              </article>
            ))}
          </div>

          {/* Controls Bar: Filters & Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Proposals" },
                { id: "submitted", label: "Awaiting Review" },
                { id: "under-review", label: "In Review / Survey" },
                { id: "approved", label: "Approved" },
                { id: "installed", label: "Installed & Live" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    selectedFilter === tab.id
                      ? "bg-lime-300 text-black shadow-lg shadow-lime-300/10"
                      : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-lime-300/40"
              />
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          </div>

          {/* Recommendations List */}
          <div className="mt-6 grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-2xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40">
                  <Filter size={24} />
                </div>
                <h3 className="mt-4 text-xl font-bold">No recommendations found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
                  {searchQuery
                    ? "Try adjusting your search query or filter."
                    : "You haven't recommended any facilities in this category yet."}
                </p>
                <Link
                  to="/citizen/recommendation"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 text-sm font-bold text-black hover:bg-lime-200 transition"
                >
                  <Plus size={16} /> Recommend a Facility
                </Link>
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = facilityIcons[item.facilityType] || Lightbulb;
                return (
                  <article
                    key={item.id}
                    className="group flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl transition duration-300 hover:border-lime-300/30 hover:bg-white/[0.06] md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-300">
                        <Icon size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tracking-wider text-lime-300">
                            {item.id}
                          </span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs text-white/40">{item.date}</span>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
                            {item.facilityLabel}
                          </span>
                        </div>

                        <h2 className="mt-1.5 text-lg font-bold text-white group-hover:text-lime-200 transition">
                          {item.title}
                        </h2>

                        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
                          <MapPin size={14} className="text-lime-300 shrink-0" />
                          <span>{item.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                      <span
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                          statusStyle[item.status] ||
                          "bg-white/10 text-white/70 border border-white/15"
                        }`}
                      >
                        ● {item.status}
                      </span>

                      <Link
                        to={`/citizen/recommendations/${item.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition"
                      >
                        <span>View Status</span>
                        <ChevronRight size={16} />
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
      <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 px-5 py-9 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            <b className="text-white">
              Amar <span className="text-lime-300">Sohor</span>
            </b>
            <br />
            My City. My Responsibility.
          </p>
          <div className="flex gap-5">
            <Link to="/citizen/recommendation" className="hover:text-lime-300">
              Recommend Facility
            </Link>
            <Link to="/citizen/my-reports" className="hover:text-lime-300">
              My Reports
            </Link>
            <Link to="/map" className="hover:text-lime-300">
              Facility Map
            </Link>
            <Link to="/citizen/dashboard" className="hover:text-lime-300">
              Dashboard
            </Link>
          </div>
          <p>© 2026 Amar Sohor.</p>
        </div>
      </footer>
    </div>
  );
}

export default MyRecommendationsPage;
