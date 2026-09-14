import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Droplets,
  DoorOpen,
  Car,
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { getStoredFacilities } from "./facilitiesData";

const categoryConfig = {
  dustbin: {
    label: "Dustbin",
    icon: Trash2,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30"
  },
  water: {
    label: "Drinking Water",
    icon: Droplets,
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
  },
  toilet: {
    label: "Public Toilet",
    icon: DoorOpen,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
  },
  parking: {
    label: "Civic Parking",
    icon: Car,
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30"
  }
};

function FacilityManagementPage() {
  const [facilities, setFacilities] = useState(getStoredFacilities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  useEffect(() => {
    const syncThemeAndFacilities = () => {
      setIsDarkMode(localStorage.getItem("agencyTheme") !== "light");
      setFacilities(getStoredFacilities());
    };

    window.addEventListener("storage", syncThemeAndFacilities);
    window.addEventListener("agencyThemeChange", syncThemeAndFacilities);

    return () => {
      window.removeEventListener("storage", syncThemeAndFacilities);
      window.removeEventListener("agencyThemeChange", syncThemeAndFacilities);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("agencyTheme", nextTheme);
    setIsDarkMode(nextTheme === "dark");
    window.dispatchEvent(new Event("agencyThemeChange"));
  };

  const filtered = facilities.filter((facility) => {
    const matchesCategory =
      selectedCategory === "all" ||
      facility.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      facility.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.facilityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(facility.id).includes(searchQuery.trim());

    return matchesCategory && matchesSearch;
  });

  const totalCount = facilities.length;
  const openCount = facilities.filter(
    (f) => (f.status || "").toLowerCase() === "open"
  ).length;
  const repairCount = facilities.filter(
    (f) =>
      (f.status || "").toLowerCase().includes("repair") ||
      (f.status || "").toLowerCase().includes("suspend")
  ).length;

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Background ambient glow layers */}
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

      <section className="relative z-10 mx-auto max-w-6xl">
        {/* Navigation & Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/agency/dashboard"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                isDarkMode
                  ? "text-cyan-300 hover:text-white"
                  : "text-cyan-700 hover:text-cyan-900"
              }`}
            >
              <ArrowLeft size={14} />
              Back to Agency Dashboard
            </Link>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Facility Management
            </h1>
            <p className="mt-0.5 text-xs opacity-60">
              View, inspect, edit, and commission municipal amenities across Kolkata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-xl transition ${
                isDarkMode
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isDarkMode ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>

            <Link
              to="/agency/facilities/add"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              <Plus size={15} />
              <span>Add Facility</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className={`rounded-2xl border p-4 shadow-md backdrop-blur-xl ${
              isDarkMode
                ? "border-white/10 bg-white/[0.05]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium opacity-60">Total Registered Facilities</span>
              <Building2 size={16} className="text-cyan-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalCount}</p>
            <p className="text-[11px] opacity-50 mt-0.5">Municipal infrastructure inventory</p>
          </div>

          <div
            className={`rounded-2xl border p-4 shadow-md backdrop-blur-xl ${
              isDarkMode
                ? "border-emerald-400/20 bg-emerald-400/10"
                : "border-emerald-200 bg-emerald-50/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Operational & Open</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{openCount}</p>
            <p className="text-[11px] opacity-70 mt-0.5">Accessible for public use</p>
          </div>

          <div
            className={`rounded-2xl border p-4 shadow-md backdrop-blur-xl ${
              isDarkMode
                ? "border-amber-400/20 bg-amber-400/10"
                : "border-amber-200 bg-amber-50/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">Maintenance & Repair</span>
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-400">{repairCount}</p>
            <p className="text-[11px] opacity-70 mt-0.5">Under restoration or scheduled repair</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Facilities" },
              { id: "dustbin", label: "Dustbins" },
              { id: "toilet", label: "Public Toilets" },
              { id: "water", label: "Drinking Water" },
              { id: "parking", label: "Civic Parking" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === tab.id
                    ? isDarkMode
                      ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20"
                      : "bg-cyan-700 text-white shadow-md"
                    : isDarkMode
                    ? "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facility name or location..."
              className={`w-full rounded-xl border py-2 pl-9 pr-4 text-xs outline-none transition focus:ring-2 ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                  : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
              }`}
            />
          </div>
        </div>

        {/* Facilities List Grid */}
        <div className="mt-6 grid gap-4">
          {filtered.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center shadow-md backdrop-blur-xl ${
                isDarkMode
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Building2 size={36} className="mx-auto opacity-30" />
              <h3 className="mt-3 text-lg font-bold">No Facilities Found</h3>
              <p className="mt-1 text-xs opacity-50">
                {searchQuery
                  ? "Try changing your search keywords or category filter."
                  : "No facilities currently registered in this category."}
              </p>
              <Link
                to="/agency/facilities/add"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-600"
              >
                <Plus size={14} /> Add First Facility
              </Link>
            </div>
          ) : (
            filtered.map((facility) => {
              const catKey = (facility.category || "dustbin").toLowerCase();
              const catInfo = categoryConfig[catKey] || categoryConfig.dustbin;
              const CatIcon = catInfo.icon;
              const photo = facility.imageUrl || facility.image;
              const statusLower = (facility.status || "").toLowerCase();
              const isStatusOpen = statusLower === "open" || statusLower === "available";

              return (
                <article
                  key={facility.id}
                  className={`group rounded-2xl border p-4 sm:p-5 shadow-lg backdrop-blur-xl transition hover:border-cyan-400/40 hover:shadow-xl ${
                    isDarkMode
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Thumbnail Photo or Category Icon */}
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                        {photo ? (
                          <img
                            src={photo}
                            alt={facility.name || facility.facilityName}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <CatIcon size={28} className="opacity-60" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1 py-0.5 font-mono text-[9px] text-white">
                          #{facility.id}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catInfo.color}`}
                          >
                            <CatIcon size={10} />
                            {catInfo.label}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                              isStatusOpen
                                ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-400"
                                : "border-amber-400/40 bg-amber-400/15 text-amber-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isStatusOpen ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            {facility.status || "Active"}
                          </span>
                        </div>

                        <h2 className="mt-1.5 text-base sm:text-lg font-bold truncate">
                          {facility.name || facility.facilityName}
                        </h2>

                        <p className="mt-1 flex items-center gap-1.5 text-xs opacity-70 truncate">
                          <MapPin size={13} className="shrink-0 text-amber-400" />
                          <span className="truncate">{facility.address}</span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] opacity-50">
                          <span className="inline-flex items-center gap-1">
                            <Compass size={11} />
                            {facility.latitude}, {facility.longitude}
                          </span>
                          {facility.sourceRecommendationId && (
                            <span className="text-cyan-400">
                              Linked to Rec #{facility.sourceRecommendationId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Direct Link to Edit Facility Page */}
                    <div className="flex shrink-0 items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                      <Link
                        to={`/agency/facilities/${facility.id}/edit`}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                          isDarkMode
                            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25"
                            : "border-emerald-700 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        <Pencil size={13} />
                        <span>Edit Facility</span>
                      </Link>

                      <Link
                        to={`/citizen/map?category=${catKey}`}
                        title="View on Map"
                        className={`rounded-xl border p-2 text-xs transition ${
                          isDarkMode
                            ? "border-white/10 hover:bg-white/10 text-white/70"
                            : "border-slate-300 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

export default FacilityManagementPage;
