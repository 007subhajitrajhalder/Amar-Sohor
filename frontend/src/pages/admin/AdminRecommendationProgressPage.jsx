import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Car,
  Check,
  DoorOpen,
  Droplets,
  History,
  Mail,
  MapPin,
  Moon,
  Phone,
  RefreshCw,
  Save,
  Sun,
  Trash2,
  UserCheck,
  UserRound,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdminTheme } from "./useAdminTheme";
import {
  FACILITY_AGENCIES,
  getRecommendationForAdmin,
  updateRecommendationProgress
} from "./adminRecommendationsData";

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

const STAGES = [
  { stage: 1, label: "Submitted", desc: "Citizen proposal registered" },
  { stage: 2, label: "Site Survey", desc: "Field officer feasibility inspection" },
  { stage: 3, label: "Approved", desc: "Municipal works budget clearance" },
  { stage: 4, label: "Civil Works", desc: "Procurement & ground installation" },
  { stage: 5, label: "Commissioned", desc: "Operational and verified" }
];

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function AdminRecommendationProgressPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  const [recommendation, setRecommendation] = useState(() =>
    getRecommendationForAdmin(recommendationId)
  );

  const [currentStage, setCurrentStage] = useState(() => recommendation?.stage || 1);
  const [currentStatus, setCurrentStatus] = useState(() => recommendation?.status || "PENDING_ALLOCATION");
  const [inspectionNotes, setInspectionNotes] = useState(
    () => recommendation?.inspectionNotes || ""
  );
  const [actionMessage, setActionMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!recommendation) {
    return (
      <main
        className={`admin-themed-page relative flex min-h-screen items-center justify-center p-6 ${
          isLightMode ? "admin-light-mode" : "bg-[#100e0b]"
        }`}
      >
        <div className="admin-glass-card max-w-md rounded-2xl border border-white/20 p-8 text-center text-white backdrop-blur-xl">
          <AlertCircle size={40} className="mx-auto text-amber-300" />
          <h2 className="mt-4 text-xl font-bold">Recommendation Not Found</h2>
          <p className="mt-2 text-sm text-white/60">
            The requested recommendation #{recommendationId} could not be found.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/recommendations")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/20"
          >
            <ArrowLeft size={16} />
            Back to Recommendations
          </button>
        </div>
      </main>
    );
  }

  const category = (recommendation.facilityType || "dustbin").toLowerCase();
  const agency = recommendation.assignedAgency || FACILITY_AGENCIES[category] || FACILITY_AGENCIES.dustbin;
  const member = recommendation.assignedMember;
  const FacilityIcon = FACILITY_ICONS[category] || Trash2;

  const handleSaveProgress = (e) => {
    e.preventDefault();
    setIsSaving(true);

    let calculatedStatus = currentStatus;
    if (currentStage === 5) calculatedStatus = "INSTALLED";
    else if (currentStage === 3) calculatedStatus = "APPROVED";
    else if (currentStage >= 2 && !member) calculatedStatus = "PENDING_ALLOCATION";
    else if (currentStage >= 2) calculatedStatus = "UNDER_INVESTIGATION";

    const noteLog = `Admin updated stage to "${STAGES[currentStage - 1].label}" with note: "${inspectionNotes.trim()}"`;

    const updated = updateRecommendationProgress(recommendation.id, {
      stage: currentStage,
      status: calculatedStatus,
      inspectionNotes: inspectionNotes.trim(),
      historyNote: noteLog
    });

    setRecommendation((prev) => ({
      ...prev,
      ...updated
    }));
    setCurrentStatus(calculatedStatus);
    setIsSaving(false);
    setActionMessage("Progress and field inspection updates saved successfully.");

    setTimeout(() => setActionMessage(""), 4000);
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
            to="/admin/recommendations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to all recommendations
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

        {/* Warning if not allotted */}
        {!member && (
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300/40 bg-amber-400/15 p-5 text-amber-100 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <AlertTriangle size={24} className="shrink-0 text-amber-300" />
              <div>
                <p className="font-bold text-white">Responsibility Not Yet Allotted</p>
                <p className="text-xs text-white/70">
                  This recommendation is awaiting assignment to a specialist from {agency.name}.
                </p>
              </div>
            </div>
            <Link
              to={`/admin/recommendations/${recommendation.id}/allocate`}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/70 bg-amber-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-300"
            >
              <Users size={15} />
              Allocate Member Now
            </Link>
          </div>
        )}

        {/* Header card */}
        <div className="admin-glass-card mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                Facility Recommendation #{recommendation.id}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                {recommendation.facilityLabel || category}
              </span>
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white break-words">
              {recommendation.title}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <MapPin size={14} className="text-amber-300 shrink-0" />
              <span className="truncate">{recommendation.location}</span>
              <span className="text-white/30">•</span>
              <span>Submitted on {recommendation.date}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold ${
                !member
                  ? "border-amber-300/40 bg-amber-400/15 text-amber-200"
                  : currentStage === 5
                  ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
                  : "border-cyan-300/40 bg-cyan-400/15 text-cyan-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              {currentStage === 5
                ? "Installed & Operational"
                : currentStage === 3
                ? "Approved"
                : member
                ? `Allotted (${member.fullName})`
                : "Pending Allocation"}
            </span>

            
          </div>
        </div>

        {/* 3 Summary Item Badges - Centrally Aligned */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="admin-glass-card flex flex-col items-center justify-center text-center gap-2.5 rounded-xl border border-white/15 p-5 text-white shadow-lg shadow-cyan-950/10">
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-300/15 p-2.5 text-cyan-200">
              <FacilityIcon size={22} />
            </div>
            <div className="min-w-0 w-full text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Facility Category
              </p>
              <p className="mt-0.5 font-bold capitalize text-white truncate">
                {recommendation.facilityLabel || category}
              </p>
            </div>
          </div>

          <div className="admin-glass-card flex flex-col items-center justify-center text-center gap-2.5 rounded-xl border border-white/15 p-5 text-white shadow-lg shadow-cyan-950/10">
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/15 p-2.5 text-emerald-200">
              <Building2 size={22} />
            </div>
            <div className="min-w-0 w-full text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Responsible Agency
              </p>
              <p className="mt-0.5 truncate font-bold text-white">
                {agency.name}
              </p>
            </div>
          </div>

          <div className="admin-glass-card flex flex-col items-center justify-center text-center gap-2.5 rounded-xl border border-white/15 p-5 text-white shadow-lg shadow-cyan-950/10">
            <div className="rounded-xl border border-amber-300/30 bg-amber-300/15 p-2.5 text-amber-200">
              <UserCheck size={22} />
            </div>
            <div className="min-w-0 w-full text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Assigned Officer
              </p>
              <p className="mt-0.5 truncate font-bold text-white">
                {member ? member.fullName : "Unassigned"}
              </p>
            </div>
            <Link
              to={`/admin/recommendations/${recommendation.id}/allocate`}
              className="mt-0.5 inline-flex items-center justify-center text-xs font-semibold text-cyan-200 hover:text-white hover:underline shrink-0"
            >
              Change Officer
            </Link>
          </div>
        </div>

        {/* Success Action Notification */}
        {actionMessage && (
          <div className="mt-5 flex items-center justify-center text-center gap-3 rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">
            <Check size={17} aria-hidden="true" />
            {actionMessage}
          </div>
        )}

        {/* 5-Stage Visual Progress Stepper - Centrally Aligned Cards */}
        <div className="admin-glass-card mt-6 rounded-2xl border border-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <h2 className="text-base font-bold">Recommendation Lifecycle Progress</h2>
              <p className="text-xs text-white/55">
                Current stage: Step {currentStage} of 5 ({STAGES[currentStage - 1].label})
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-200">
              Click any step below to update stage
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
            {STAGES.map((s) => {
              const isPast = s.stage < currentStage;
              const isCurrent = s.stage === currentStage;

              return (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => setCurrentStage(s.stage)}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                    isCurrent
                      ? "border-cyan-300 bg-cyan-400/20 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-300/50"
                      : isPast
                      ? "border-emerald-300/40 bg-emerald-400/10 hover:border-emerald-300/60"
                      : "border-white/10 bg-white/5 opacity-70 hover:opacity-100 hover:border-white/20"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-cyan-300 text-slate-900 ring-2 ring-cyan-200/60"
                          : isPast
                          ? "bg-emerald-300 text-slate-900"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {isPast ? <Check size={13} strokeWidth={3} /> : s.stage}
                    </span>
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse" />
                    )}
                  </div>

                  <div className="mt-3 text-center w-full">
                    <p
                      className={`text-xs font-bold text-center ${
                        isCurrent ? "text-cyan-100" : isPast ? "text-emerald-200" : "text-white/60"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="mt-1 text-[10px] text-white/45 text-center leading-tight">
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Columns: Left = Citizen Details, Right = Progress & Inspection Controls */}
        <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2 pb-12">
          {/* Column 1: Citizen Proposal Details */}
          <section className="admin-glass-card space-y-6 rounded-2xl border border-white/20 p-5 sm:p-7 text-white shadow-xl backdrop-blur-xl min-w-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserRound size={20} className="text-cyan-200" />
              Citizen Proposal Details
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Proposal Description
                </p>
                <p className="mt-1.5 leading-relaxed text-white/80 rounded-xl border border-white/10 bg-white/5 p-3.5 break-words">
                  {recommendation.description}
                </p>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Proposed Area
                  </p>
                  <p className="mt-1 font-semibold text-white truncate">
                    {recommendation.location}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Nearby Landmark
                  </p>
                  <p className="mt-1 font-semibold text-white truncate">
                    {recommendation.landmark || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 text-center">
                  Citizen Contact Information
                </p>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 text-xs text-center">
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Name:</span>
                    <span className="font-semibold text-white truncate block">{recommendation.citizen?.name || "Verified Citizen"}</span>
                  </div>
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Phone:</span>
                    <span className="font-semibold text-white truncate block">{recommendation.citizen?.phone || "9876543210"}</span>
                  </div>
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Email:</span>
                    <span className="font-semibold text-white truncate block">{recommendation.citizen?.email || "citizen@kolkata.gov.in"}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  {recommendation.citizen?.email && (
                    <a
                      href={`mailto:${recommendation.citizen.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-white/10"
                    >
                      <Mail size={13} />
                      Email Proposer
                    </a>
                  )}
                  {recommendation.citizen?.phone && (
                    <a
                      href={`tel:${recommendation.citizen.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-white/10"
                    >
                      <Phone size={13} />
                      Call Proposer
                    </a>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Uploaded Location Photograph
                </p>
                {recommendation.photoUrl ? (
                  <div className="overflow-hidden rounded-xl border border-white/20">
                    <img
                      src={recommendation.photoUrl}
                      alt={recommendation.title}
                      className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-white/40">
                    No image submitted by citizen
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Column 2: Assigned Officer, Field Notes & Update Controls */}
          <div className="space-y-6 min-w-0">
            {/* Responsible Officer Card */}
            <section className="admin-glass-card rounded-2xl border border-white/20 p-5 sm:p-7 text-white shadow-xl backdrop-blur-xl min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase size={20} className="text-emerald-300" />
                  Assigned Responsibility
                </h2>

                
              </div>

              {member ? (
                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/15 text-sm font-bold text-cyan-200">
                      {member.fullName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{member.fullName}</h3>
                        <span className="rounded bg-cyan-400/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">{member.designation}</p>

                      <div className="mt-3 grid gap-1.5 text-xs text-white/70">
                        <p className="flex items-center gap-2">
                          <Building2 size={13} className="text-emerald-300" />
                          <span>{agency.name} ({agency.department})</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail size={13} className="text-cyan-200" />
                          <span>{member.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={13} className="text-amber-300" />
                          <span>{member.phone}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-amber-300/30 bg-amber-400/5 p-5 text-center text-xs text-amber-200">
                  <AlertTriangle size={20} className="mx-auto mb-1 text-amber-300" />
                  No officer assigned yet. Click &ldquo;Assign Officer&rdquo; above to select a member from {agency.name}.
                </div>
              )}

             
            </section>

            {/* Audit History Timeline */}
            <section className="admin-glass-card rounded-2xl border border-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
              <h2 className="text-base font-bold flex items-center gap-2">
                <History size={17} className="text-cyan-200" />
                Audit & Activity Timeline
              </h2>

              <div className="mt-4 space-y-3">
                {(recommendation.history || []).map((entry, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3 border-l-2 border-cyan-300/30 pl-3.5 py-1 text-xs"
                  >
                    <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-cyan-300" />
                    <div>
                      <p className="font-semibold text-white">{entry.action}</p>
                      <p className="mt-0.5 text-[11px] text-white/50">
                        {entry.actor && <span className="text-cyan-200">{entry.actor} • </span>}
                        {entry.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminRecommendationProgressPage;
