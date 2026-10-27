import {
  ArrowLeft,
  Camera,
  Car,
  Check,
  CircleDashed,
  Clock3,
  DoorOpen,
  Droplets,
  History,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  XCircle
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { displayDateTime, recommendationView } from "../../api/client";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function RecommendationStatusPage() {
  const { recommendationId } = useParams();
  const cleanId = String(recommendationId || "").replace(/^REC-/i, "").replace(/^0+/, "") || "0";
  const navigate = useNavigate();

  // Fetch recommendation details from the backend server
  const resource = useApi("/recommendations/" + cleanId);

  if (resource.loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${kolkataBg})` }}
        />
        <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
        <main className="relative z-30 flex min-h-screen items-center justify-center p-6">
          <ApiState {...resource} />
        </main>
      </div>
    );
  }

  if (!resource.data) {
    return (
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${kolkataBg})` }}
        />
        <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
        <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

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
            <button
              onClick={() => navigate("/citizen/my-recommendations")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span>Back to My Recommendations</span>
            </button>
          </div>
        </header>

        <main className="relative z-30 flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.045] p-8 text-center backdrop-blur-2xl">
            <ApiState {...resource} />
            <div className="mt-6">
              <Link
                to="/citizen/my-recommendations"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition"
              >
                <ArrowLeft size={16} />
                Back to My Recommendations
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Dynamic backend record transformed with data validation
  const data = recommendationView(resource.data, true);
  const FacilityIcon = facilityIcons[data.facilityType] || Sparkles;
  const rawStatus = data.rawStatus || "PENDING";
  const isRejected = rawStatus === "REJECTED";
  const isApproved = ["APPROVED", "INSTALLED"].includes(rawStatus);
  const isInstalled = rawStatus === "INSTALLED";
  const isAllocated = rawStatus === "ALLOCATED";
  const isInvestigating = rawStatus === "UNDER_INVESTIGATION";
  const investigationEvent = data.history.find((entry) => entry.status === "PENDING");
  const decisionEvent = data.history.find((entry) =>
    ["APPROVED", "REJECTED"].includes(entry.status)
  );

  // Exact step-by-step progress validated against database lifecycle status
  const implementationSteps = [
    {
      step: 1,
      title: "Proposal Submitted",
      date: displayDateTime(data.created_at),
      description: `Civic proposal registered in municipal registry for ${data.facilityLabel || "facility"} installation.`,
      statusText: "Submitted & Logged",
      state: "completed"
    },
    {
      step: 2,
      title: "Site Feasibility & Survey",
      date: investigationEvent
        ? investigationEvent.formattedDate
        : "Date not recorded",
      description:
        rawStatus === "PENDING"
          ? `Dispatched to ${data.assignedAgency?.name || "designated civic agency"}. Awaiting specialist allocation.`
          : isAllocated
          ? `${data.assignedMember ? `${data.assignedMember.fullName} is assigned` : "A field specialist is assigned"} from ${data.assignedAgency?.name || "the managing agency"}. The feasibility investigation has not yet started.`
          : isInvestigating
          ? `Allocated to ${data.assignedMember ? data.assignedMember.fullName : "field specialist"} (${data.assignedAgency?.name || "Managing Agency"}) for on-ground feasibility study.${data.reviewNotes ? ` Notes: "${data.reviewNotes}"` : ""}`
          : isRejected
          ? `Survey concluded: ${data.reviewNotes || "Does not meet site feasibility requirements."}`
          : `Feasibility inspection completed by ${data.assignedMember ? data.assignedMember.fullName : "field officer"} and passed technical review.`,
      statusText:
        rawStatus === "PENDING"
          ? "Pending Allocation"
          : isAllocated
          ? "Officer Assigned"
          : isInvestigating
          ? "Survey Active"
          : isRejected
          ? "Survey Rejected"
          : "Survey Approved",
      state: isApproved ? "completed" : isRejected ? "rejected" : rawStatus === "PENDING" ? "upcoming" : "current"
    },
    {
      step: 3,
      title: "Agency Feasibility Decision",
      date: decisionEvent ? decisionEvent.formattedDate : "Date not recorded",
      description: isApproved
        ? "The agency approved the site as feasible for facility installation."
        : isRejected
        ? `Proposal was not approved: ${data.rejectionReason || data.reviewNotes || "Feasibility requirements not satisfied."}`
        : "The agency decision is pending completion of the field survey.",
      statusText: isApproved ? "Sanction Granted" : isRejected ? "Rejected" : "Awaiting Board",
      state: isApproved ? "completed" : isRejected ? "rejected" : "upcoming"
    },
    {
      step: 4,
      title: "Facility Commissioned",
      date: data.installed_at
        ? displayDateTime(data.installed_at)
        : "Date not recorded",
      description: isInstalled
        ? "Facility installed on site, verified by managing agency, and live on the Amar Sohor public city map."
        : isApproved
        ? `Approved for installation. Scheduled for commissioning by ${data.assignedAgency?.name || "managing agency"}.`
        : isRejected
        ? "Proposal was not approved for commissioning."
        : "Commissioning follows board approval and technical clearance.",
      statusText: isInstalled ? "Operational & Live" : isApproved ? "Scheduled" : isRejected ? "Cancelled" : "Pending",
      state: isInstalled ? "completed" : isApproved ? "current" : isRejected ? "rejected" : "upcoming"
    }
  ];

  const getTimelineStatusBadge = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "border-cyan-300/30 bg-cyan-400/15 text-cyan-200";
      case "APPROVED":
        return "border-emerald-300/30 bg-emerald-400/15 text-emerald-200";
      case "REJECTED":
        return "border-rose-300/30 bg-rose-400/15 text-rose-200";
      case "INSTALLED":
        return "border-lime-300/30 bg-lime-400/15 text-lime-200";
      default:
        return "border-amber-300/30 bg-amber-400/15 text-amber-200";
    }
  };

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
            <button
              onClick={() => navigate("/citizen/my-recommendations")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span>Back to My Recommendations</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-6xl">
          {/* Top Title & Status */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                PROPOSAL #{String(data.id)}
              </p>
              <h1 className="mt-1.5 text-2xl font-bold md:text-4xl">
                Recommendation Status
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold ${
                  data.status === "Installed"
                    ? "bg-lime-300/15 text-lime-300 border border-lime-300/30"
                    : data.status === "Approved"
                    ? "bg-purple-400/15 text-purple-300 border border-purple-400/30"
                    : isRejected
                    ? "bg-rose-400/15 text-rose-300 border border-rose-400/30"
                    : data.status === "Submitted" || data.status === "Pending Review"
                    ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                    : "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                }`}
              >
                ● {data.status}
              </span>
            </div>
          </div>

          {/* Rejection Notification if Rejected */}
          {isRejected && (
            <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-200 backdrop-blur-xl">
              <XCircle size={22} className="shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Proposal Status: Rejected</p>
                <p className="mt-1 text-xs leading-relaxed text-rose-200/90">
                  {data.rejectionReason || data.reviewNotes || "The civic evaluation committee determined this proposal does not meet installation or feasibility criteria at this time."}
                </p>
              </div>
            </div>
          )}

          {/* Implementation Progress Lifecycle Stepper (Validated from Backend) */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">Implementation Progress</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Synchronized with municipal service records and field surveys
                </p>
              </div>
              <span className="text-xs font-semibold text-lime-300">
                Database Lifecycle Status: {data.status}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {implementationSteps.map((stepItem) => {
                const isCompleted = stepItem.state === "completed";
                const isCurrent = stepItem.state === "current";
                const isStepRejected = stepItem.state === "rejected";

                let iconClasses = "bg-white/10 text-white/40";
                let cardBorder = "border-white/5 bg-white/[0.02]";

                if (isCompleted) {
                  iconClasses = "bg-lime-300 text-black";
                  cardBorder = "border-lime-300/20 bg-lime-400/[0.04]";
                } else if (isCurrent) {
                  iconClasses = "bg-lime-300/20 text-lime-300 ring-2 ring-lime-300";
                  cardBorder = "border-lime-300/40 bg-lime-400/[0.08] shadow-lg shadow-lime-950/30";
                } else if (isStepRejected) {
                  iconClasses = "bg-rose-400/20 text-rose-300 ring-2 ring-rose-400";
                  cardBorder = "border-rose-400/30 bg-rose-500/[0.05]";
                }

                return (
                  <div
                    key={stepItem.step}
                    className={`relative flex flex-col justify-between gap-2 rounded-xl border p-4 transition ${cardBorder}`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-xs transition ${iconClasses}`}
                        >
                          {isCompleted ? (
                            <Check size={16} strokeWidth={2.5} />
                          ) : isCurrent ? (
                            <CircleDashed size={16} className="animate-spin" />
                          ) : isStepRejected ? (
                            <XCircle size={16} />
                          ) : (
                            <span>{stepItem.step}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isCurrent
                                ? "text-lime-300"
                                : isCompleted
                                ? "text-white"
                                : isStepRejected
                                ? "text-rose-300"
                                : "text-white/40"
                            }`}
                          >
                            {stepItem.title}
                          </p>
                          <p className="text-[10px] text-white/45">{stepItem.date}</p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-white/60">
                        {stepItem.description}
                      </p>
                    </div>

                    <div className="mt-3 border-t border-white/5 pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Step {stepItem.step} of 4</span>
                      <span
                        className={`font-semibold ${
                          isCompleted
                            ? "text-lime-300"
                            : isCurrent
                            ? "text-amber-300"
                            : isStepRejected
                            ? "text-rose-300"
                            : "text-white/40"
                        }`}
                      >
                        {stepItem.statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid: Left = Proposal Details, Right = Municipal Review & Activity Timeline */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Column 1: Citizen Proposal Details Card */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Proposal Details</h2>
                <span className="flex items-center gap-1.5 rounded-lg border border-lime-300/20 bg-lime-300/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  <FacilityIcon size={13} />
                  {data.facilityLabel}
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Proposal Title
                  </p>
                  <p className="mt-0.5 text-sm sm:text-base font-semibold text-white">
                    {data.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Proposed Location & Area
                  </p>
                  <p className="mt-0.5 flex items-start gap-1.5 font-medium text-white/85">
                    <MapPin size={15} className="mt-0.5 text-lime-300 shrink-0" />
                    <span>{data.location}</span>
                  </p>
                  {data.coordinates && (
                    <p className="mt-1 font-mono text-[11px] text-lime-300/80 pl-5">
                      Coordinates: {Number(data.coordinates.lat).toFixed(6)}, {Number(data.coordinates.lng).toFixed(6)}
                    </p>
                  )}
                </div>

                {data.landmark && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Nearby Landmark
                    </p>
                    <p className="mt-0.5 text-white/70">{data.landmark}</p>
                  </div>
                )}

                {data.description && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Citizen Justification & Need
                    </p>
                    <p className="mt-0.5 leading-relaxed text-white/70 rounded-xl border border-white/10 bg-white/5 p-3">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Submitted Photo */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35 mb-1.5">
                    Location Photograph Evidence
                  </p>
                  {data.photoUrl ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <img
                        src={data.photoUrl}
                        alt={data.title}
                        className="max-h-56 w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/15 text-xs text-white/30">
                      <Camera size={16} className="mr-2 opacity-50" />
                      No photograph attached to this proposal
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Column 2: Municipal Review Card & Activity Timeline */}
            <div className="space-y-6">
              {/* Municipal Review Card */}
              <section className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Municipal Review & Survey</h2>
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <ShieldCheck size={15} className="text-lime-300" />
                      Verified Civic Authority
                    </span>
                  </div>

                  <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/35">
                        Reviewing Civic Agency
                      </p>
                      <p className="mt-0.5 font-semibold text-white/90">
                        {data.assignedAgency?.name || data.reviewDepartment || "Kolkata Municipal Corporation"}
                      </p>
                    </div>

                    {data.assignedMember ? (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/35">
                          Assigned Field Specialist
                        </p>
                        <p className="mt-0.5 font-semibold text-white/90 flex items-center gap-1.5">
                          <UserCheck size={14} className="text-lime-300 shrink-0" />
                          <span>{data.assignedMember.fullName} {data.assignedMember.designation ? `(${data.assignedMember.designation})` : ""}</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/35">
                          Assigned Field Specialist
                        </p>
                        <p className="mt-0.5 text-xs text-amber-200/80">
                          Pending individual specialist allocation by {data.assignedAgency?.name || "agency"}.
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/35">
                        Official Inspection Remarks & Next Steps
                      </p>
                      <div className="mt-1.5 rounded-xl border border-white/10 bg-black/25 p-3.5 text-xs leading-relaxed text-white/70">
                        {data.reviewNotes || "This recommendation is currently under municipal review. Field officers will inspect the location for feasibility and civic necessity."}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                      <div>
                        <p className="text-white/35 uppercase text-[10px]">Submission Date</p>
                        <p className="mt-0.5 font-semibold text-white/80">{data.date}</p>
                      </div>
                      <div>
                        <p className="text-white/35 uppercase text-[10px]">Current Status</p>
                        <p className="mt-0.5 font-semibold text-lime-300">
                          {data.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-3 border-t border-white/10">
                  <Link
                    to="/citizen/recommendation"
                    className="flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-2.5 text-xs sm:text-sm font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/10"
                  >
                    <Sparkles size={14} />
                    <span>Submit Another Recommendation</span>
                  </Link>
                </div>
              </section>

              {/* Activity & Evaluation Timeline (100% Validated from Backend Database) */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <History size={17} className="text-lime-300" />
                    Activity & Evaluation Timeline
                  </h3>
                  <span className="text-[11px] text-white/40">
                    {(data.history || []).length} Recorded Event{(data.history || []).length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {(data.history || []).length > 0 ? (
                    data.history.map((entry, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-start gap-3.5 border-l-2 border-lime-300/30 pl-4 py-1 text-xs"
                      >
                        <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_8px_#bef264]" />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {entry.action}
                            </span>
                            {entry.status && (
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${getTimelineStatusBadge(
                                  entry.status
                                )}`}
                              >
                                {entry.status}
                              </span>
                            )}
                          </div>

                          {entry.description && entry.description !== entry.action && (
                            <p className="mt-1 text-xs leading-relaxed text-white/70 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                              {entry.description}
                            </p>
                          )}

                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
                            {entry.actor && (
                              <span className="text-lime-300/90 font-medium">
                                By: {entry.actor} {entry.actor_role ? `(${entry.actor_role})` : ""}
                              </span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock3 size={11} />
                              {entry.formattedDate || entry.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative flex items-start gap-3.5 border-l-2 border-lime-300/30 pl-4 py-1 text-xs">
                      <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-lime-300" />
                      <div>
                        <p className="font-bold text-white text-sm">Proposal Registered</p>
                        <p className="mt-1 text-xs text-white/70">
                          Proposal logged in civic database. Awaiting administrative evaluation.
                        </p>
                        <p className="mt-1 text-[11px] text-white/45 flex items-center gap-1">
                          <Clock3 size={11} />
                          {data.date}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
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

export default RecommendationStatusPage;
