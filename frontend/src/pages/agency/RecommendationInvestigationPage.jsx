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
  AlertCircle
} from "lucide-react";
import {
  getAdminRecommendations,
  updateRecommendationByAgency
} from "../admin/adminRecommendationsData";

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function getFacilityBadge(type) {
  switch ((type || "").toLowerCase()) {
    case "dustbin":
      return {
        label: "Dustbin",
        className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        iconClass: "border-amber-400/30 bg-amber-400/15 text-amber-200"
      };
    case "water":
      return {
        label: "Water Dispenser",
        className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
        iconClass: "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
      };
    case "toilet":
      return {
        label: "Public Toilet",
        className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
        iconClass: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
      };
    case "parking":
      return {
        label: "Parking Spot",
        className: "border-blue-400/30 bg-blue-400/10 text-blue-200",
        iconClass: "border-blue-400/30 bg-blue-400/15 text-blue-200"
      };
    default:
      return {
        label: "Civic Amenity",
        className: "border-white/20 bg-white/10 text-white",
        iconClass: "border-white/20 bg-white/10 text-white"
      };
  }
}

function RecommendationInvestigationPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  const [recommendation, setRecommendation] = useState(() => {
    const all = getAdminRecommendations();
    return (
      all.find(
        (r) => String(r.id).toLowerCase() === String(recommendationId).toLowerCase()
      ) || null
    );
  });
  const [investigationNotes, setInvestigationNotes] = useState(() => {
    const all = getAdminRecommendations();
    const found = all.find(
      (r) => String(r.id).toLowerCase() === String(recommendationId).toLowerCase()
    );
    return found?.inspectionNotes || "";
  });
  const [actionNotification, setActionNotification] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(() => {
    const all = getAdminRecommendations();
    const found = all.find(
      (r) => String(r.id).toLowerCase() === String(recommendationId).toLowerCase()
    );
    return found?.rejectionReason || "";
  });

  // Feasibility inspection checklists
  const [checklist, setChecklist] = useState({
    siteAccessible: true,
    utilityClearance: true,
    pedestrianSafety: true,
    citizenVerified: true
  });

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

  useEffect(() => {
    const handleStorage = () => {
      const all = getAdminRecommendations();
      const found = all.find(
        (r) => String(r.id).toLowerCase() === String(recommendationId).toLowerCase()
      );
      if (found) {
        setRecommendation(found);
        if (found.inspectionNotes !== undefined) {
          setInvestigationNotes(found.inspectionNotes);
        }
        if (found.rejectionReason) {
          setRejectionReason(found.rejectionReason);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("recommendationsUpdated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("recommendationsUpdated", handleStorage);
    };
  }, [recommendationId]);

  if (!recommendation) {
    return (
      <main
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
      </main>
    );
  }

  const facilityBadge = getFacilityBadge(recommendation.facilityType);
  const FacilityIcon = FACILITY_ICONS[recommendation.facilityType] || Trash2;
  const currentStatus = (recommendation.status || "").toUpperCase();
  const isPendingInvestigation = currentStatus === "ALLOTTED" || currentStatus === "PENDING_ALLOCATION";
  const isUnderInvestigation = currentStatus === "UNDER_INVESTIGATION";
  const isApproved = currentStatus === "APPROVED";
  const isRejected = currentStatus === "REJECTED";
  const isInstalled = currentStatus === "INSTALLED";

  // Action 1: Put under investigation
  const handleStartInvestigation = () => {
    const updatedNotes =
      investigationNotes.trim() ||
      `On-site investigation initiated by ${recommendation.assignedMember?.fullName || "Agency Staff"}.`;

    const updated = updateRecommendationByAgency(recommendation.id, {
      status: "UNDER_INVESTIGATION",
      stage: 2,
      notes: updatedNotes,
      actorName: recommendation.assignedMember?.fullName
    });

    setRecommendation((prev) => ({ ...prev, ...updated, status: "UNDER_INVESTIGATION", stage: 2 }));
    setActionNotification("Recommendation status successfully updated to Under Investigation.");
    setTimeout(() => setActionNotification(""), 4000);
  };

  // Action 2: Approve & Carry Forward to Add Facility Page
  const handleApproveAndAddFacility = () => {
    const finalNotes =
      investigationNotes.trim() ||
      "On-site feasibility verified and approved for civic facility commissioning.";

    const updated = updateRecommendationByAgency(recommendation.id, {
      status: "APPROVED",
      stage: 3,
      notes: finalNotes,
      actorName: recommendation.assignedMember?.fullName
    });

    const fullRecommendation = {
      ...recommendation,
      ...updated,
      status: "APPROVED",
      stage: 3,
      inspectionNotes: finalNotes
    };

    // Carry forward details to Add Facility page
    navigate("/agency/facilities/add", {
      state: { recommendation: fullRecommendation }
    });
  };

  // Action 3: Reject Recommendation
  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejecting this facility proposal.");
      return;
    }

    const updated = updateRecommendationByAgency(recommendation.id, {
      status: "REJECTED",
      stage: 2,
      notes: investigationNotes,
      rejectionReason: rejectionReason.trim(),
      actorName: recommendation.assignedMember?.fullName
    });

    setRecommendation((prev) => ({ ...prev, ...updated, status: "REJECTED", rejectionReason: rejectionReason.trim() }));
    setIsRejectModalOpen(false);
    setActionNotification("Recommendation has been marked as Rejected with recorded rationale.");
    setTimeout(() => setActionNotification(""), 4500);
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-4 transition-colors duration-500 sm:p-6 ${
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

      <section className="relative z-10 mx-auto max-w-5xl">
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

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-xl transition ${
              isDark
                ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>

        {/* Action toast */}
        {actionNotification && (
          <div
            className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-400/20 p-4 text-xs font-bold text-emerald-200 shadow-xl backdrop-blur-xl"
            role="status"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-300" />
            <span>{actionNotification}</span>
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
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
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
                <MapPin size={13} className="shrink-0 text-amber-400" />
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
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                    : isApproved
                    ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200"
                    : isRejected
                    ? "border-rose-400/50 bg-rose-400/20 text-rose-200"
                    : isInstalled
                    ? "border-emerald-400/50 bg-emerald-400/25 text-emerald-200"
                    : "border-amber-400/50 bg-amber-400/15 text-amber-200"
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
              <FileText size={18} className="text-cyan-300" />
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
                  <span className="text-[11px] text-emerald-400 font-medium">Verified Citizen</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                  <UserRound size={15} className="text-cyan-300" />
                  <span>{recommendation.citizen?.name || "Verified Citizen"}</span>
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
              <ShieldCheck size={18} className="text-emerald-300" />
              Agency Field Investigation
            </h2>

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
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Awaiting Field Investigation</h4>
                      <p className="mt-1 leading-relaxed opacity-85">
                        This civic recommendation has been assigned to you. Click <strong>&quot;Start Investigation&quot;</strong> to begin on-site technical inspection and update the citizen tracker.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartInvestigation}
                    className="mt-4 w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 p-3 text-xs font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5"
                  >
                    Start Investigation Now
                  </button>
                </div>
              )}

              {/* When Status is Under Investigation: Active investigation form */}
              {isUnderInvestigation && (
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
                    Verify site feasibility, foot traffic clearance, and utility connections. Enter your inspection notes below and choose to <strong>Approve & Add Facility</strong> or <strong>Reject</strong>.
                  </p>
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
                    Reason: <strong>{recommendation.rejectionReason || "Site deemed unsuitable during inspection."}</strong>
                  </p>

                  <button
                    type="button"
                    onClick={handleStartInvestigation}
                    className="mt-3 text-xs underline font-semibold opacity-70 hover:opacity-100"
                  >
                    Reopen Investigation
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
                    This proposal has been converted into an active municipal facility.
                  </p>
                </div>
              )}

              

             

              {/* Two Decision Action Buttons when Under Investigation */}
              {isUnderInvestigation && (
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApproveAndAddFacility}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 p-3 text-xs font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve & Add Facility</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 p-3 text-xs font-bold text-rose-300 transition duration-200 hover:-translate-y-0.5"
                  >
                    <XCircle size={16} />
                    <span>Reject Proposal</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl ${
              isDark ? "border-white/20 bg-[#16130f] text-white" : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-rose-400/30 bg-rose-400/15 p-2.5 text-rose-300">
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
                className="rounded-xl border border-white/20 px-4 py-2 font-semibold opacity-70 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 font-bold text-white shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RecommendationInvestigationPage;
