import { useMemo } from "react";
import {
  ArrowLeft,
  Camera,
  Car,
  Check,
  CircleDashed,
  DoorOpen,
  Droplets,
  Map,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEED_RECOMMENDATIONS } from "./recommendationsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

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

  if (foundInSeed) {
    return foundInSeed;
  }

  // Default fallback if arbitrary ID is entered
  return {
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
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-6xl">
          {/* Top Title & Status */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                PROPOSAL #{String(data.id)}
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Recommendation Status
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  data.status === "Installed"
                    ? "bg-lime-300/15 text-lime-300 border border-lime-300/30"
                    : data.status === "Approved"
                    ? "bg-purple-400/15 text-purple-300 border border-purple-400/30"
                    : "bg-blue-400/15 text-blue-300 border border-blue-400/30"
                }`}
              >
                ● {data.status}
              </span>
            </div>
          </div>

          {/* Stepper / Implementation Progress Tracker */}
          <div className="mt-9 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl font-bold">Implementation Progress</h2>
              <span className="text-xs text-white/40">
                Stage {currentStage} of 4 • {data.status}
              </span>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div key={stepItem.step} className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm transition ${iconStyle}`}
                      >
                        {isDone ? (
                          <Check size={18} strokeWidth={2.5} />
                        ) : isCurrent ? (
                          <CircleDashed size={18} className="animate-spin" />
                        ) : (
                          <span>{stepItem.step}</span>
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-sm font-bold ${
                            isCurrent
                              ? "text-lime-300"
                              : isDone
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          {stepItem.title}
                        </p>
                        <p className="text-xs text-white/40">{stepItem.date}</p>
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
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Citizen Proposal Details Card */}
            <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Proposal Details</h2>
                <span className="flex items-center gap-1.5 rounded-lg border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-300">
                  <FacilityIcon size={14} />
                  {data.facilityLabel}
                </span>
              </div>

              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Proposal Title
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {data.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Proposed Location
                  </p>
                  <p className="mt-1 flex items-start gap-2 font-medium text-white/85">
                    <MapPin size={17} className="mt-0.5 text-lime-300 shrink-0" />
                    <span>{data.location}</span>
                  </p>
                  {data.coordinates && (
                    <p className="mt-1 font-mono text-xs text-lime-300/70 pl-6">
                      Coordinates: {data.coordinates.lat}, {data.coordinates.lng}
                    </p>
                  )}
                </div>

                {data.landmark && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Nearby Landmark
                    </p>
                    <p className="mt-1 text-white/70">{data.landmark}</p>
                  </div>
                )}

                {data.description && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Citizen Justification & Need
                    </p>
                    <p className="mt-1 leading-relaxed text-white/60">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Submitted Photo */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35 mb-2">
                    Location Photograph
                  </p>
                  {data.photoPreview || data.photoUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      <img
                        src={data.photoPreview || data.photoUrl}
                        alt="Proposed location snapshot"
                        className="max-h-60 w-full object-cover"
                      />
                      <div className="p-2.5 text-right text-xs text-white/40">
                        {data.photoName || "Location evidence photograph"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/15 text-xs text-white/30">
                      <Camera size={18} className="mr-2 opacity-50" />
                      No photograph attached to this proposal
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Municipal Review Card */}
            <section className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl md:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Municipal Review & Survey</h2>
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <ShieldCheck size={16} className="text-lime-300" />
                    Verified Civic Dept
                  </span>
                </div>

                <div className="mt-6 space-y-5 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Reviewing Authority
                    </p>
                    <p className="mt-1 font-semibold text-white/90">
                      {data.reviewDepartment}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Official Inspection Notes & Next Steps
                    </p>
                    <div className="mt-2 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs leading-relaxed text-white/70">
                      {data.reviewNotes}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
                    <div>
                      <p className="text-white/35 uppercase">Submission Date</p>
                      <p className="mt-1 font-semibold text-white/80">{data.date}</p>
                    </div>
                    <div>
                      <p className="text-white/35 uppercase">Public Priority</p>
                      <p className="mt-1 font-semibold text-lime-300">
                        Active Civic Evaluation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
                

                <Link
                  to="/citizen/recommendation"
                  className="flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-3.5 text-sm font-bold text-black hover:bg-lime-200 transition"
                >
                  <Sparkles size={15} />
                  <span>Submit Another Recommendation</span>
                </Link>
              </div>
            </section>
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
            <Link to="/citizen/my-recommendations" className="hover:text-lime-300">
              My Recommendations
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

export default RecommendationStatusPage;
