import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  DoorOpen,
  Droplets,
  Mail,
  MapPin,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  Sun,
  Trash2,
  UserCheck,
  UserRound,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdminTheme } from "./useAdminTheme";
import {
  allocateMemberToRecommendation,
  FACILITY_AGENCIES,
  getAgencyMembersForCategory,
  getRecommendationForAdmin
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

const FACILITY_ICONS = {
  dustbin: Trash2,
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function AllocateRecommendationPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  const [recommendation, setRecommendation] = useState(() =>
    getRecommendationForAdmin(recommendationId)
  );

  const category = (recommendation?.facilityType || "dustbin").toLowerCase();
  const agency = FACILITY_AGENCIES[category] || FACILITY_AGENCIES.dustbin;
  const members = useMemo(() => getAgencyMembersForCategory(category), [category]);

  const [selectedMember, setSelectedMember] = useState(() => {
    if (recommendation?.assignedMember) {
      return members.find((m) => m.id === recommendation.assignedMember.id) || null;
    }
    return null;
  });

  const [memberSearch, setMemberSearch] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const q = memberSearch.toLowerCase();
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.phone.includes(q)
    );
  }, [members, memberSearch]);

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
            The requested recommendation #{recommendationId} could not be located in the system.
          </p>
          <Link
            to="/admin/recommendations"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/20 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to All Recommendations
          </Link>
        </div>
      </main>
    );
  }

  const FacilityIcon = FACILITY_ICONS[category] || Trash2;

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    setIsSubmitting(true);
    const updated = allocateMemberToRecommendation(
      recommendation.id,
      selectedMember,
      assignmentNote
    );

    setRecommendation((prev) => ({
      ...prev,
      ...updated
    }));

    setSuccessMessage(
      `Responsibility successfully allocated to ${selectedMember.fullName} (${agency.name}). Redirecting to progress tracker...`
    );

    setTimeout(() => {
      navigate(`/admin/recommendations/${recommendation.id}/progress`);
    }, 1200);
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
        {/* Navigation Bar */}
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

        {/* Page Header */}
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Users size={12} />
              Responsibility Allocation
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Allocate Agency Member
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Assign an agency specialist in <span className="font-semibold text-cyan-200">{agency.department}</span> to lead the on-site feasibility inspection.
            </p>
          </div>

          <div className="admin-glass-card flex items-center justify-center text-center gap-3 rounded-2xl border border-white/20 px-5 py-3 text-white">
            <Building2 size={20} className="text-emerald-300 shrink-0" aria-hidden="true" />
            <div className="text-left sm:text-center">
              <p className="text-xs text-white/50">Designated Agency</p>
              <p className="mt-0.5 text-sm font-bold truncate max-w-[200px]">{agency.name}</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 p-4 text-emerald-100 shadow-lg backdrop-blur-xl"
            role="status"
          >
            <CheckCircle2 size={20} className="shrink-0 text-emerald-300" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Two Columns: Left = Recommendation Details, Right = Member Selection */}
        <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
          {/* Left Column: Recommendation Summary Card */}
          <div className="space-y-6 min-w-0">
            <section className="admin-glass-card rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
                    Proposal #{recommendation.id}
                  </span>
                  <h2 className="mt-1 text-xl font-bold leading-snug">
                    {recommendation.title}
                  </h2>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-cyan-200">
                  <FacilityIcon size={24} />
                </div>
              </div>

              <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs text-white/50">Proposed Location</p>
                    <p className="font-semibold text-white">{recommendation.location}</p>
                    {recommendation.landmark && (
                      <p className="text-xs text-white/60">Landmark: {recommendation.landmark}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-cyan-200" />
                  <div>
                    <p className="text-xs text-white/50">Submission Date</p>
                    <p className="font-semibold text-white">{recommendation.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserRound size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="text-xs text-white/50">Citizen Proposer</p>
                    <p className="font-semibold text-white">
                      {recommendation.citizen?.name || "Verified Citizen"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
                      {recommendation.citizen?.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} />
                          {recommendation.citizen.phone}
                        </span>
                      )}
                      {recommendation.citizen?.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail size={12} />
                          {recommendation.citizen.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposal Description */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Citizen Proposal Description
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {recommendation.description}
                </p>
              </div>

              {/* Location Photograph */}
              {recommendation.photoUrl ? (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                    Location Photograph
                  </p>
                  <div className="overflow-hidden rounded-xl border border-white/20">
                    <img
                      src={recommendation.photoUrl}
                      alt={recommendation.title}
                      className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                    Location Photograph
                  </p>
                  <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-white/40">
                    No image uploaded by citizen
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Facility Category Members & Allocation Form */}
          <div className="space-y-6 min-w-0">
            

            {/* Member Selection Section */}
            <form onSubmit={handleAllocate} className="space-y-6">
              <div className="admin-glass-card rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Select Agency Member</h3>
                    <p className="text-xs text-white/55">
                      Choose the officer who will be responsible for field verification.
                    </p>
                  </div>

                  {/* Search within matching category members */}
                  <div className="relative sm:w-60">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search member..."
                      className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-300"
                    />
                  </div>
                </div>

                {/* Member Cards Grid */}
                <div className="mt-5 grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                  {filteredMembers.map((member) => {
                    const isSelected = selectedMember?.id === member.id;
                    const isCurrentAssigned =
                      recommendation.assignedMember?.id === member.id;

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className={`group relative flex flex-col items-center justify-between rounded-xl border p-4 text-center transition-all duration-200 min-w-0 ${
                          isSelected
                            ? "border-cyan-300 bg-cyan-400/20 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-300/50"
                            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center text-center w-full min-w-0">
                          <div className="relative mb-2">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                                isSelected
                                  ? "border-cyan-200 bg-cyan-300 text-slate-900 shadow-md shadow-cyan-400/30"
                                  : "border-white/20 bg-white/10 text-white"
                              }`}
                            >
                              {member.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            {isSelected && (
                              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-slate-950 ring-2 ring-[#100e0b]">
                                <Check size={10} strokeWidth={3} />
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-100 truncate w-full text-center">
                            {member.fullName}
                          </h4>
                          <p className="text-[11px] text-white/55 truncate w-full text-center">
                            {member.designation}
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/65 w-full">
                            <p className="inline-flex items-center justify-center gap-1.5 min-w-0">
                              <Mail size={12} className="text-cyan-200 shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </p>
                            <p className="inline-flex items-center justify-center gap-1.5 min-w-0">
                              <Phone size={12} className="text-emerald-300 shrink-0" />
                              <span className="truncate">{member.phone}</span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-3.5 flex w-full items-center justify-center flex-wrap gap-2 border-t border-white/10 pt-2.5 text-[11px] text-white/50">
                          <span className="inline-flex items-center gap-1">
                            <Briefcase size={11} />
                            {member.role === "AGENCY_ADMIN" ? "Agency Lead" : "Field Member"}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-cyan-200">
                            {member.activeCases} active cases
                          </span>
                          {isCurrentAssigned && (
                            <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                              Current Lead
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {filteredMembers.length === 0 && (
                    <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-xs text-white/50">
                      No members matched your search query in this department.
                    </div>
                  )}
                </div>

                {/* Assignment Notes */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <label
                    htmlFor="assignmentNote"
                    className="block text-xs font-semibold uppercase tracking-wider text-white/70"
                  >
                    Field Survey Instructions / Assignment Note (Optional)
                  </label>
                  <textarea
                    id="assignmentNote"
                    rows={3}
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                    placeholder="E.g., Conduct pedestrian flow inspection and verify water tapping clearance by next Monday..."
                    className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Link
                    to="/admin/recommendations"
                    className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-center text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={!selectedMember || isSubmitting}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg transition duration-200 ${
                      !selectedMember || isSubmitting
                        ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                        : "border-cyan-300/70 bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-cyan-400/30"
                    }`}
                  >
                    <UserCheck size={16} />
                    {isSubmitting
                      ? "Allocating..."
                      : selectedMember
                      ? `Allocate to ${selectedMember.fullName}`
                      : "Select a Member First"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AllocateRecommendationPage;
