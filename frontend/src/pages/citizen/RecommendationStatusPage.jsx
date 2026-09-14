import { useMemo } from "react";
import {
  ArrowLeft,
  Camera,
  Car,
  Check,
  CircleDashed,
  DoorOpen,
  Droplets,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEED_RECOMMENDATIONS } from "./recommendationsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const facilityIcons = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car,
};

function getRecommendationById(recommendationId) {
  try {
    const stored = JSON.parse(
      localStorage.getItem("citizen_recommendations") || "[]"
    );
    const foundInStored = stored.find(
      (item) => String(item.id).toLowerCase() === String(recommendationId).toLowerCase()
    );

    if (foundInStored) {
      return {
        ...foundInStored,
        date: foundInStored.createdAt
          ? new Date(foundInStored.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Recently",
        stage: foundInStored.stage || 1,
        reviewDepartment:
          foundInStored.reviewDepartment ||
          "Kolkata Municipal Corporation - Civic Infrastructure Wing",
        reviewNotes:
          foundInStored.reviewNotes ||
          "Proposal received. Municipal field surveyor has been assigned to inspect site accessibility and pedestrian flow within 7 business days.",
      };
    }
  } catch {
    // ignore
  }

  // Check seed recommendations
  const foundInSeed = SEED_RECOMMENDATIONS.find(
    (item) => String(item.id).toLowerCase() === String(recommendationId).toLowerCase()
  );

  let base = foundInSeed || {
    id: recommendationId,
    title: "Proposed Civic Facility Spot",
    facilityType: "dustbin",
    facilityLabel: "Civic Amenity",
    location: "Civic Location, Kolkata",
    landmark: "Nearby Main Road",
    description:
      "Public facility proposed by citizen to enhance local sanitation and convenience.",
    status: "Under Review",
    date: "Recently",
    reviewDepartment:
      "Kolkata Municipal Corporation - Civic Works Division",
    reviewNotes:
      "Your proposal has been registered in the municipal portal. A civic inspector will assess the location shortly.",
    stage: 1,
  };

  try {
    const rawOverrides = localStorage.getItem("admin_recommendation_overrides");
    if (rawOverrides) {
      const overrides = JSON.parse(rawOverrides);
      const match = overrides[base.id] || overrides[String(base.id).toUpperCase()];
      if (match) {
        return {
          ...base,
          stage: match.stage || base.stage,
          status: match.status === "INSTALLED" ? "Installed" : match.status === "APPROVED" ? "Approved" : match.assignedMember ? "Site Survey Scheduled" : base.status,
          reviewDepartment: match.assignedAgency?.name || base.reviewDepartment,
          reviewNotes: match.inspectionNotes || base.reviewNotes
        };
      }
    }
  } catch {
    // ignore
  }

  return base;
}

function RecommendationStatusPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const data = useMemo(
    () => getRecommendationById(recommendationId),
    [recommendationId]
  );

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b18] text-white">
        <CircleDashed className="animate-spin text-lime-300" size={32} />
      </div>
    );
  }

  const FacilityIcon = facilityIcons[data.facilityType] || Sparkles;
  const currentStage = data.stage || 1;

  const timelineSteps = [
    {
      step: 1,
      title: "Proposal Submitted",
      date: data.date || "Registered",
      description: "Citizen submission received and logged in civic registry.",
    },
    {
      step: 2,
      title: "Site Feasibility & Survey",
      date:
        currentStage >= 2
          ? "Inspection Done"
          : "Pending site inspection",
      description:
        currentStage >= 2
          ? "Field officer verified pedestrian traffic and underground utilities."
          : "Awaiting field officer inspection.",
    },
    {
      step: 3,
      title: "Municipal Approval",
      date:
        currentStage >= 3
          ? "Approved & Budget Allocated"
          : "Awaiting civic board sanction",
      description:
        currentStage >= 3
          ? "Work order authorized by the zonal engineering department."
          : "Pending administrative and financial sanction.",
    },
    {
      step: 4,
      title: "Facility Commissioned",
      date:
        currentStage >= 4
          ? "Installed & Active"
          : "Installation to follow",
      description:
        currentStage >= 4
          ? "Facility is installed, maintained, and live on public city map."
          : "Civil works and installation scheduled upon tender award.",
    },
  ];

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
            
            <button
              onClick={() => navigate("/citizen/my-recommendations")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span>Back to all Recommendations List</span>
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
                    : data.status === "Submitted"
                    ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                    : "bg-blue-400/15 text-blue-300 border border-blue-400/30"
                }`}
              >
                ● {data.status}
              </span>
            </div>
          </div>

          {/* Stepper / Implementation Progress Tracker */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg font-bold">Implementation Progress</h2>
              <span className="text-xs text-white/40">
                Stage {currentStage} of 4 • {data.status}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {timelineSteps.map((stepItem) => {
                const isDone = currentStage > stepItem.step;
                const isCurrent = currentStage === stepItem.step;

                let iconStyle = "bg-white/10 text-white/40";
                if (isDone) {
                  iconStyle = "bg-lime-300 text-black";
                } else if (isCurrent) {
                  iconStyle = "bg-lime-300/20 text-lime-300 ring-2 ring-lime-300";
                }

                return (
                  <div key={stepItem.step} className="relative flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs transition ${iconStyle}`}
                      >
                        {isDone ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : isCurrent ? (
                          <CircleDashed size={16} className="animate-spin" />
                        ) : (
                          <span>{stepItem.step}</span>
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-xs sm:text-sm font-bold ${
                            isCurrent
                              ? "text-lime-300"
                              : isDone
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          {stepItem.title}
                        </p>
                        <p className="text-[11px] text-white/40">{stepItem.date}</p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-white/45 pl-1">
                      {stepItem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Citizen Proposal Details Card */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Proposal Details</h2>
                <span className="flex items-center gap-1.5 rounded-lg border border-lime-300/20 bg-lime-300/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  <FacilityIcon size={13} />
                  {data.facilityLabel}
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
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
                    Proposed Location
                  </p>
                  <p className="mt-0.5 flex items-start gap-1.5 font-medium text-white/85">
                    <MapPin size={15} className="mt-0.5 text-lime-300 shrink-0" />
                    <span>{data.location}</span>
                  </p>
                  {data.coordinates && (
                    <p className="mt-0.5 font-mono text-[11px] text-lime-300/70 pl-5">
                      Coordinates: {data.coordinates.lat}, {data.coordinates.lng}
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
                    <p className="mt-0.5 leading-relaxed text-white/60">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Submitted Photo */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35 mb-1.5">
                    Location Photograph
                  </p>
                  {data.photoPreview || data.photoUrl ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <img
                        src={data.photoPreview || data.photoUrl}
                        alt="Proposed location snapshot"
                        className="max-h-56 w-full object-cover"
                      />
                      <div className="p-2 text-right text-xs text-white/40">
                        {data.photoName || "Location evidence photograph"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/15 text-xs text-white/30">
                      <Camera size={16} className="mr-2 opacity-50" />
                      No photograph attached to this proposal
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Municipal Review Card */}
            <section className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Municipal Review & Survey</h2>
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <ShieldCheck size={15} className="text-lime-300" />
                    Verified Civic Dept
                  </span>
                </div>

                <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Reviewing Authority
                    </p>
                    <p className="mt-0.5 font-semibold text-white/90">
                      {data.reviewDepartment}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Official Inspection Notes & Next Steps
                    </p>
                    <div className="mt-1.5 rounded-xl border border-white/10 bg-black/25 p-3.5 text-xs leading-relaxed text-white/70">
                      {data.reviewNotes}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                    <div>
                      <p className="text-white/35 uppercase text-[11px]">Submission Date</p>
                      <p className="mt-0.5 font-semibold text-white/80">{data.date}</p>
                    </div>
                    <div>
                      <p className="text-white/35 uppercase text-[11px]">Public Priority</p>
                      <p className="mt-0.5 font-semibold text-lime-300">
                        Active Civic Evaluation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10">
                <Link
                  to="/citizen/recommendation"
                  className="flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-2.5 text-xs sm:text-sm font-bold text-black hover:bg-lime-200 transition"
                >
                  <Sparkles size={14} />
                  <span>Submit Another Recommendation</span>
                </Link>
              </div>
            </section>
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
