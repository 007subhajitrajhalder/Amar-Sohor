import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest, recommendationView } from "../../api/client";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  UserRound,
  Trash2,
  Droplets,
  DoorOpen,
  Car,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  History,
  X
} from "lucide-react";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getFacilityBadge(type, isDark) {
  switch ((type || "").toLowerCase()) {
    case "dustbin":
      return {
        label: "Dustbin",
        className: isDark 
          ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
          : "border-amber-600/30 bg-amber-100 text-amber-800",
        iconClass: isDark 
          ? "border-amber-400/30 bg-amber-400/15 text-amber-200"
          : "border-amber-600/30 bg-amber-200 text-amber-800"
      };
    case "water":
      return {
        label: "Water Dispenser",
        className: isDark 
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
          : "border-cyan-600/30 bg-cyan-100 text-cyan-800",
        iconClass: isDark 
          ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
          : "border-cyan-600/30 bg-cyan-200 text-cyan-800"
      };
    case "toilet":
      return {
        label: "Public Toilet",
        className: isDark 
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-emerald-600/30 bg-emerald-100 text-emerald-800",
        iconClass: isDark 
          ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
          : "border-emerald-600/30 bg-emerald-200 text-emerald-800"
      };
    case "parking":
      return {
        label: "Parking Spot",
        className: isDark 
          ? "border-blue-400/30 bg-blue-400/10 text-blue-200"
          : "border-blue-600/30 bg-blue-100 text-blue-800",
        iconClass: isDark 
          ? "border-blue-400/30 bg-blue-400/15 text-blue-200"
          : "border-blue-600/30 bg-blue-200 text-blue-800"
      };
    default:
      return {
        label: "Civic Amenity",
        className: isDark 
          ? "border-white/20 bg-white/10 text-white"
          : "border-slate-300 bg-slate-100 text-slate-800",
        iconClass: isDark 
          ? "border-white/20 bg-white/10 text-white"
          : "border-slate-300 bg-slate-200 text-slate-800"
      };
  }
}

function RecommendationInvestigationPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  const cleanId = String(recommendationId || "").replace(/^REC-/i, "").replace(/^0+/, "") || "0";
  const resource = useApi("/recommendations/" + cleanId);
  const recommendation = resource.data ? recommendationView(resource.data) : null;
  const [investigationNotesDraft, setInvestigationNotesDraft] = useState({
    recommendationId: null,
    value: ""
  });
  const investigationNotes = investigationNotesDraft.recommendationId === recommendation?.id
    ? investigationNotesDraft.value
    : recommendation?.inspectionNotes || recommendation?.reviewNotes || "";
  const [actionNotification, setActionNotification] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync theme
  useEffect(() => {
    const syncTheme = () => {
      setIsDark(localStorage.getItem("agencyTheme") !== "light");
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("agencyThemeChange", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("agencyThemeChange", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    localStorage.setItem("agencyTheme", nextTheme);
    setIsDark(!isDark);
    window.dispatchEvent(new Event("agencyThemeChange"));
  };

  if (resource.loading) {
    return (
      <main className={`min-h-screen p-8 ${isDark ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"}`}>
        <ApiState {...resource} />
      </main>
    );
  }

  if (!recommendation) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center p-6 ${
          isDark ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
        }`}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">Recommendation Not Found</h2>
          <p className="mt-1 text-sm opacity-60">
            No proposal with ID #{recommendationId} was found.
          </p>
          <Link
            to="/agency/recommendations"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
          >
            ← Back to Recommendations
          </Link>
        </div>
      </div>
    );
  }

  const facilityBadge = getFacilityBadge(recommendation.facilityType, isDark);
  const FacilityIcon = FACILITY_ICONS[recommendation.facilityType] || Trash2;
  const currentStatus = (recommendation.rawStatus || recommendation.status || "").toUpperCase();
  const isPendingInvestigation = ["ALLOTTED", "ALLOCATED", "PENDING_ALLOCATION", "PENDING"].includes(currentStatus);
  const isUnderInvestigation = currentStatus === "UNDER_INVESTIGATION";
  const isApproved = currentStatus === "APPROVED";
  const isRejected = currentStatus === "REJECTED";
  const isInstalled = currentStatus === "INSTALLED";

  const update = async (status, notes) => {
    if (saving) return null;
    setSaving(true);
    setError("");
    try {
      const result = await apiRequest("/recommendations/" + cleanId, {
        method: "PATCH",
        body: { status, notes }
      });
      resource.refresh();
      setActionNotification("Recommendation status updated to " + status.replaceAll("_", " ").toLowerCase() + " successfully.");
      return recommendationView(result);
    } catch (err) {
      setError(err.message || "Failed to update recommendation.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleStartInvestigation = () =>
    update("UNDER_INVESTIGATION", investigationNotes.trim() || "Field feasibility inspection commenced by assigned agency specialist.");

  const handleSaveNotes = () => {
    if (!investigationNotes.trim()) {
      setError("Please enter inspection findings before saving.");
      return;
    }
    return update("UNDER_INVESTIGATION", investigationNotes.trim());
  };

  const handleApproveAndAddFacility = async () => {
    const notes = investigationNotes.trim() || "Site feasibility verified and approved for facility installation.";
    const result = isApproved ? recommendation : await update("APPROVED", notes);
    if (result) {
      navigate("/agency/facilities/add", {
        state: { recommendation: result }
      });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection rationale detailing why this proposal cannot be implemented.");
      return;
    }
    const result = await update("REJECTED", rejectionReason.trim());
    if (result) {
      setIsRejectModalOpen(false);
    }
  };

  const handleRestartInvestigation = () =>
    update("UNDER_INVESTIGATION", "Investigation restarted by the assigned agency specialist.");

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Background ambient glows */}
      {isDark && (
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

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 border-b px-5 py-4 backdrop-blur-2xl md:px-10 ${
          isDark
            ? "border-white/10 bg-[#100e0b]/80"
            : "border-slate-300 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className={`h-11 w-11 rounded-full border object-cover ${
                isDark ? "border-lime-300/20 bg-transparent" : "border-slate-300 bg-white"
              }`}
            />
            <h1 className="text-xl font-bold md:text-2xl">
              <span className={isDark ? "text-white" : "text-slate-900"}>Amar </span>
              <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`group inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isDark
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
              <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
              <span
                className={`relative h-6 w-11 rounded-full p-1 transition-colors ${
                  isDark ? "bg-cyan-500/70" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    isDark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/agency/recommendations"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
              isDark ? "text-cyan-300 hover:text-white" : "text-cyan-700 hover:text-cyan-900"
            }`}
          >
            <ArrowLeft size={14} />
            Back to Allocated Recommendations
          </Link>
        </div>

        {/* Action toast */}
        {actionNotification && (
          <div
            className={`mt-4 flex items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-bold shadow-xl backdrop-blur-xl ${
              isDark 
                ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-200" 
                : "border-emerald-400/40 bg-emerald-50 text-emerald-800"
            }`}
            role="status"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className={`shrink-0 ${isDark ? "text-emerald-300" : "text-emerald-600"}`} />
              <span>{actionNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotification("")}
              className="opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div
            className={`mt-4 flex items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-semibold shadow-xl backdrop-blur-xl ${
              isDark
                ? "border-rose-400/40 bg-rose-500/20 text-rose-200"
                : "border-rose-300 bg-rose-50 text-rose-800"
            }`}
            role="alert"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header card */}
        <div
          className={`mt-4 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition duration-300 sm:p-7 ${
            isDark
              ? "border-white/15 bg-white/[0.07] shadow-black/30 text-white"
              : "border-slate-200 bg-white/90 shadow-slate-300/50 text-slate-900"
          }`}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                  Proposal #{recommendation.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${facilityBadge.className}`}
                >
                  <FacilityIcon size={12} />
                  {facilityBadge.label}
                </span>
                <span className="text-xs opacity-50">
                  Submitted {recommendation.date}
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl md:text-3xl font-bold tracking-tight">
                {recommendation.title}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-xs opacity-70">
                <MapPin size={13} className={`shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
                <span>{recommendation.location}</span>
                {recommendation.landmark && (
                  <span className="opacity-80">• Landmark: {recommendation.landmark}</span>
                )}
              </p>
            </div>

            {/* Status Chip */}
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                  isUnderInvestigation
                    ? (isDark ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200" : "border-cyan-600/50 bg-cyan-100 text-cyan-800")
                    : isApproved
                    ? (isDark ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200" : "border-emerald-600/50 bg-emerald-100 text-emerald-800")
                    : isRejected
                    ? (isDark ? "border-rose-400/50 bg-rose-400/20 text-rose-200" : "border-rose-600/50 bg-rose-100 text-rose-800")
                    : isInstalled
                    ? (isDark ? "border-emerald-400/50 bg-emerald-400/25 text-emerald-200" : "border-emerald-600/50 bg-emerald-100 text-emerald-800")
                    : (isDark ? "border-amber-400/50 bg-amber-400/15 text-amber-200" : "border-amber-600/50 bg-amber-100 text-amber-800")
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isUnderInvestigation || isPendingInvestigation ? "animate-pulse" : ""
                  } ${
                    isUnderInvestigation
                      ? "bg-cyan-400"
                      : isApproved || isInstalled
                      ? "bg-emerald-400"
                      : isRejected
                      ? "bg-rose-400"
                      : "bg-amber-400"
                  }`}
                />
                {isUnderInvestigation
                  ? "Under Investigation"
                  : isApproved
                  ? "Approved"
                  : isRejected
                  ? "Rejected"
                  : isInstalled
                  ? "Installed & Active"
                  : "Allocated • Pending Survey"}
              </span>

              <p className="text-[11px] opacity-60">
                Lead: {recommendation.assignedMember?.fullName || "Assigned Officer"}
              </p>
            </div>
          </div>
        </div>

        {/* Two Columns: Left = Proposal Details, Right = Investigation Actions */}
        <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2 pb-16">
          {/* Column 1: Citizen Proposal Details */}
          <section
            className={`rounded-2xl border p-6 shadow-xl backdrop-blur-xl transition ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-white"
                : "border-slate-200 bg-white/80 text-slate-900"
            }`}
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText size={18} className={isDark ? "text-cyan-300" : "text-cyan-600"} />
              Citizen Proposal Details
            </h2>

            <div className="mt-5 space-y-4 text-xs">
              {/* Description */}
              <div>
                <p className="font-semibold uppercase tracking-wider opacity-60">
                  Citizen Proposal Description
                </p>
                <p
                  className={`mt-1.5 leading-relaxed rounded-xl border p-3 text-xs ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white/90"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  {recommendation.description}
                </p>
              </div>

              {/* Location & Landmark */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div
                  className={`rounded-xl border p-3 ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-wider opacity-60">
                    Proposed Area
                  </p>
                  <p className="mt-1 font-semibold truncate">{recommendation.location}</p>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-wider opacity-60">
                    Nearby Landmark
                  </p>
                  <p className="mt-1 font-semibold truncate">
                    {recommendation.landmark || "None specified"}
                  </p>
                </div>
              </div>

              {/* Coordinates display if available */}
              {(recommendation.latitude !== null && recommendation.latitude !== undefined) && (
                <div
                  className={`rounded-xl border p-3 ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                    <MapPin size={12} className={isDark ? "text-amber-400" : "text-amber-600"} />
                    <span>Geographic Coordinates</span>
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold">
                    Latitude: {Number(recommendation.latitude).toFixed(6)}, Longitude: {Number(recommendation.longitude).toFixed(6)}
                  </p>
                </div>
              )}

              {/* Citizen Contact Card */}
              <div
                className={`rounded-xl border p-4 ${
                  isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold uppercase tracking-wider opacity-60">
                    Citizen Proposer
                  </p>
                  <span className={`text-[11px] font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                    Citizen
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                  <UserRound size={15} className={isDark ? "text-cyan-300" : "text-cyan-600"} />
                  <span>{recommendation.citizen?.name || "Not recorded"}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {recommendation.citizen?.phone && (
                    <a
                      href={`tel:${recommendation.citizen.phone}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-medium transition ${
                        isDark
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                          : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      <Phone size={12} />
                      {recommendation.citizen.phone}
                    </a>
                  )}

                  {recommendation.citizen?.email && (
                    <a
                      href={`mailto:${recommendation.citizen.email}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-medium transition ${
                        isDark
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
                          : "border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                      }`}
                    >
                      <Mail size={12} />
                      {recommendation.citizen.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Uploaded Photograph */}
              <div>
                <p className="font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Uploaded Location Photograph
                </p>
                {recommendation.photoUrl ? (
                  <div className="overflow-hidden rounded-xl border border-white/20">
                    <img
                      src={recommendation.photoUrl}
                      alt={recommendation.title}
                      className="h-52 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-36 items-center justify-center rounded-xl border border-dashed text-xs opacity-50 ${
                      isDark ? "border-white/20 bg-white/5" : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    No photograph attached by citizen
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Column 2: Investigation & Decision Controls */}
          <section
            className={`rounded-2xl border p-6 shadow-xl backdrop-blur-xl transition ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-white"
                : "border-slate-200 bg-white/80 text-slate-900"
            }`}
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck size={18} className={isDark ? "text-emerald-300" : "text-emerald-600"} />
              Agency Field Investigation
            </h2>

            {/* Stage Indicator & Instructions */}
            {/* Stage Indicator & Instructions */}
            <div className="mt-5 space-y-4">
              {/* When Status is Pending / Allotted: Button to start investigation */}
              {isPendingInvestigation && (
                <div
                  className={`rounded-xl border p-4 text-xs ${
                    isDark
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <h4 className="font-bold">Awaiting Field Investigation</h4>
                      <p className="mt-1 leading-relaxed opacity-85">
                        This civic recommendation has been assigned to you. Click <strong>&quot;Start Investigation&quot;</strong> to begin on-site technical inspection and update the citizen tracker.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
                      Initial Inspection Note (Optional)
                    </label>
                    <textarea
                      maxLength={1000}
                      rows={2}
                      value={investigationNotes}
                      onChange={(e) => setInvestigationNotesDraft({ recommendationId: recommendation.id, value: e.target.value })}
                      placeholder="E.g., Field site survey commenced to check utility access and road clearance."
                      className={`w-full rounded-xl border p-2.5 text-xs outline-none transition focus:ring-2 ${
                        isDark
                          ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/20"
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleStartInvestigation}
                    className="mt-3 w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 p-3 text-xs font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Start Investigation Now"}
                  </button>
                </div>
              )}

              {/* When Status is Under Investigation: Active investigation form */}
              {isUnderInvestigation && (
                <div className="space-y-4">
                  <div
                    className={`rounded-xl border p-3.5 text-xs ${
                      isDark
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                        : "border-cyan-200 bg-cyan-50 text-cyan-900"
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock3 size={14} className="animate-spin" />
                      Field Investigation Active
                    </p>
                    <p className="mt-1 opacity-80 leading-relaxed">
                      Verify site feasibility, foot traffic clearance, and utility connections. Enter your inspection findings below and choose to <strong>Approve & Add Facility</strong> or <strong>Reject</strong>.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                        Investigation Notes & Findings
                      </label>
                      <span className="text-[11px] opacity-50">
                        {investigationNotes.length}/1000
                      </span>
                    </div>
                    <textarea
                      maxLength={1000}
                      rows={4}
                      value={investigationNotes}
                      onChange={(e) => setInvestigationNotesDraft({ recommendationId: recommendation.id, value: e.target.value })}
                      placeholder="Enter on-site feasibility evaluation findings, ground conditions, utility clearances..."
                      className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                        isDark
                          ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/20"
                      }`}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        disabled={saving || !investigationNotes.trim()}
                        onClick={handleSaveNotes}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isDark
                            ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-40"
                            : "border-cyan-600/40 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 disabled:opacity-40"
                        }`}
                      >
                        {saving ? "Saving..." : "Save Notes"}
                      </button>
                    </div>
                  </div>

                  {/* Two Decision Action Buttons */}
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleApproveAndAddFacility}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 p-3 text-xs font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />
                      <span>{saving ? "Processing..." : "Approve & Add Facility"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setIsRejectModalOpen(true)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 ${
                        isDark
                          ? "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                          : "border-rose-500/40 bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      <XCircle size={16} />
                      <span>Reject Proposal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* When Status is Approved */}
              {isApproved && (
                <div
                  className={`rounded-xl border p-4 text-xs ${
                    isDark
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Recommendation Feasibility Approved</span>
                  </div>
                  <p className="mt-1 leading-relaxed opacity-85">
                    This civic proposal has been approved. The details are ready to be carry-forwarded to the <strong>Add Facility</strong> page to commission the amenity.
                  </p>
                  {recommendation.reviewNotes && (
                    <div className={`mt-2 rounded-lg border p-2 text-xs ${isDark ? "border-white/10 bg-white/5" : "border-emerald-200 bg-white/60"}`}>
                      <strong>Approval Notes:</strong> {recommendation.reviewNotes}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/agency/facilities/add", {
                        state: { recommendation }
                      })
                    }
                    className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow transition"
                  >
                    <span>Proceed to Add Facility</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* When Status is Rejected */}
              {isRejected && (
                <div
                  className={`rounded-xl border p-4 text-xs ${
                    isDark
                      ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <XCircle size={16} />
                    <span>Proposal Rejected</span>
                  </div>
                  <p className="mt-1 leading-relaxed opacity-85">
                    <strong>Rejection Rationale:</strong> {recommendation.rejectionReason || recommendation.reviewNotes || "Site deemed unsuitable during inspection."}
                  </p>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleRestartInvestigation}
                    className={`mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition disabled:opacity-50 ${
                      isDark
                        ? "bg-cyan-600 text-white hover:bg-cyan-500"
                        : "bg-cyan-700 text-white hover:bg-cyan-600"
                    }`}
                  >
                    {saving ? "Restarting..." : "Restart Investigation"}
                  </button>
                </div>
              )}

              {/* When Status is Installed */}
              {isInstalled && (
                <div
                  className={`rounded-xl border p-4 text-xs ${
                    isDark
                      ? "border-emerald-400/30 bg-emerald-400/20 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles size={16} />
                    <span>Facility Commissioned & Installed</span>
                  </div>
                  <p className="mt-1 leading-relaxed opacity-85">
                    This proposal has been successfully converted into an active municipal facility on the public city map.
                  </p>
                </div>
              )}

              {/* Investigation History Timeline */}
              <div className="border-t border-white/10 pt-4 mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-2">
                  <History size={14} className={isDark ? "text-cyan-300" : "text-cyan-700"} />
                  <span>Activity & Investigation Timeline</span>
                </h3>

                <div className="mt-3 space-y-3">
                  {(recommendation.history || []).length > 0 ? (
                    (recommendation.history || []).map((entry, idx) => (
                      <div
                        key={idx}
                        className={`relative flex items-start gap-3 border-l-2 pl-3 py-1 text-xs ${
                          isDark ? "border-cyan-400/30" : "border-cyan-600/30"
                        }`}
                      >
                        <span
                          className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${
                            entry.status === "APPROVED"
                              ? "bg-emerald-400"
                              : entry.status === "REJECTED"
                              ? "bg-rose-400"
                              : isDark
                              ? "bg-cyan-400"
                              : "bg-cyan-600"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">{entry.action}</p>
                          {entry.description && (
                            <p
                              className={`mt-1 rounded-lg border p-2 text-xs leading-relaxed ${
                                isDark
                                  ? "border-white/10 bg-white/5 text-white/80"
                                  : "border-slate-200 bg-slate-50 text-slate-800"
                              }`}
                            >
                              {entry.description}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] opacity-60">
                            {entry.actor && <span>{entry.actor} ({entry.actor_role || "Specialist"}) • </span>}
                            <span>{entry.formattedDate || entry.date}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs opacity-50">No activity events recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl ${
              isDark ? "border-white/20 bg-[#16130f] text-white" : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-xl border p-2.5 ${
                isDark ? "border-rose-400/30 bg-rose-400/15 text-rose-300" : "border-rose-300 bg-rose-100 text-rose-700"
              }`}>
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold">Reject Civic Proposal</h3>
                <p className="mt-1 text-xs opacity-70">
                  Please specify the technical reason why this recommendation cannot be implemented.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="rejectionReasonInput"
                className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1"
              >
                Rejection Rationale
              </label>
              <textarea
                id="rejectionReasonInput"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Site obstructed by underground electrical cables; municipal right-of-way width insufficient."
                className={`w-full rounded-xl border p-2.5 text-xs outline-none focus:ring-2 ${
                  isDark
                    ? "border-white/15 bg-white/10 text-white placeholder-white/40 focus:border-rose-400 focus:ring-rose-400/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-rose-600 focus:ring-rose-600/20"
                }`}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className={`rounded-xl border px-4 py-2 font-semibold opacity-70 hover:opacity-100 ${
                  isDark ? "border-white/20" : "border-slate-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving} onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 font-bold text-white shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationInvestigationPage;