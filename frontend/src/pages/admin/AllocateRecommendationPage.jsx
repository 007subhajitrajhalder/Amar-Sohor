import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { recommendationView } from "../../api/client";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Compass,
  DoorOpen,
  Droplets,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  UserCheck,
  UserRound,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";
import { allocateRecommendationApi } from "../../api/client";

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
  water: Droplets,
  toilet: DoorOpen,
  parking: Car
};

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const numLat1 = Number(lat1);
  const numLon1 = Number(lon1);
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const R = 6371; // Earth radius in km
  const dLat = (numLat2 - numLat1) * (Math.PI / 180);
  const dLon = (numLon2 - numLon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(numLat1 * (Math.PI / 180)) *
      Math.cos(numLat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function AllocateRecommendationPage() {
  const { recommendationId } = useParams();
  const cleanId = String(recommendationId || "").replace(/^REC-/i, "").replace(/^0+/, "") || "0";
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  const resource = useApi("/recommendations/" + cleanId);
  const recommendation = resource.data ? recommendationView(resource.data) : null;
  const memberResource = useApi(
    recommendation?.assigned_agency
      ? "/admin/agency-members?agency_id=" + recommendation.assigned_agency
      : null
  );
  const category = recommendation?.facilityType || "";
  const agency = recommendation?.assignedAgency || {};

  const recLat = recommendation?.latitude ?? recommendation?.coordinates?.lat;
  const recLng = recommendation?.longitude ?? recommendation?.coordinates?.lng;

  const membersWithDistance = useMemo(() => {
    return (memberResource.data || []).map((m) => {
      const dist = calculateDistanceKm(recLat, recLng, m.latitude, m.longitude);
      return {
        ...m,
        id: m.agent_id,
        fullName: m.full_name,
        designation: m.role,
        latitude: m.latitude,
        longitude: m.longitude,
        distanceKm: dist,
        activeCases: "Active Member"
      };
    });
  }, [memberResource.data, recLat, recLng]);

  const [allocatingMemberId, setAllocatingMemberId] = useState(null);
  const [error, setError] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter members by search query
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return membersWithDistance;
    const q = memberSearch.trim().toLowerCase();
    return membersWithDistance.filter(
      (member) =>
        [member.fullName, member.email, member.designation, member.phone]
          .some((value) => String(value ?? "").toLowerCase().includes(q))
    );
  }, [membersWithDistance, memberSearch]);

  // Sort members based on the shortest distance they are away from the recommendation location
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      const distA = a.distanceKm !== null && a.distanceKm !== undefined ? a.distanceKm : Infinity;
      const distB = b.distanceKm !== null && b.distanceKm !== undefined ? b.distanceKm : Infinity;
      return distA - distB;
    });
  }, [filteredMembers]);

  if (!recommendation) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <ApiState {...resource} />
      </main>
    );
  }

  const FacilityIcon = FACILITY_ICONS[category];

  const handleAllocate = async (member) => {
    if (isSubmitting || !member) return;
    setAllocatingMemberId(member.id);
    setIsSubmitting(true);
    setError("");

    try {
      await allocateRecommendationApi(Number(cleanId), {
        agentId: member.id
      });
      setSuccessMessage(`Recommendation successfully allocated to ${member.fullName}.`);
      navigate(`/admin/recommendations/${cleanId}/progress`);
    } catch (err) {
      setError(err.message || "Failed to allocate recommendation.");
    } finally {
      setIsSubmitting(false);
      setAllocatingMemberId(null);
    }
  };

  return (
    <main
      className={`admin-themed-page admin-allocation-page relative min-h-screen overflow-x-hidden p-6 transition-colors duration-500 ${
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

      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <ApiState error={error || memberResource.error} />

      <section className={`relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : "text-white"}`}>
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/recommendations"
            className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to all recommendations
          </Link>
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
              Agency members are sorted by shortest distance to the proposed facility location.
            </p>
          </div>

          <div className="admin-glass-card flex items-center justify-center text-center gap-3 rounded-2xl border border-white/20 px-5 py-3 text-white">
            <Building2 size={20} className="text-emerald-300 shrink-0" aria-hidden="true" />
            <div className="text-left sm:text-center">
              <p className="text-xs text-white/50">Handling Agency</p>
              <p className="mt-0.5 text-sm font-bold truncate max-w-[200px]">{agency.name || "Civic Agency"}</p>
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

        {/* Two Columns: Left = Recommendation Details, Right = Member Selection Sorted by Shortest Distance */}
        <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-[1fr_1.3fr]">
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

                {FacilityIcon && (
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-cyan-200">
                    <FacilityIcon size={24} />
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs text-white/50">Proposed Location</p>
                    <p className="font-semibold text-white">{recommendation.location}</p>
                    {recLat !== undefined && recLng !== undefined && (
                      <p className="mt-0.5 font-mono text-xs text-lime-300/80 flex items-center gap-1">
                        <Compass size={12} />
                        Lat: {recLat}, Long: {recLng}
                      </p>
                    )}
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
                      {recommendation.citizen?.name || "Not recorded"}
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

          {/* Right Column: Facility Category Members (Sorted by Distance) */}
          <div className="space-y-6 min-w-0">
            <div className="admin-glass-card rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold">Select & Allocate Agency Member</h3>
                  <p className="text-xs text-white/55">
                    Showing officers sorted by shortest distance away from recommendation spot.
                  </p>
                </div>

                {/* Search */}
                <div className="relative sm:w-60">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search by name, email, role, or phone..."
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-300"
                  />
                </div>
              </div>

              {/* Member Cards Grid */}
              <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2">
                {sortedMembers.map((member, idx) => {
                  const isCurrentAssigned =
                    recommendation.assignedMember?.id === member.id;
                  const isAllocatingThis =
                    isSubmitting && allocatingMemberId === member.id;
                  const isNearest = idx === 0 && member.distanceKm !== null;

                  return (
                    <div
                      key={member.id}
                      className={`group relative flex flex-col justify-between rounded-xl border p-4 text-center transition-all duration-200 min-w-0 ${
                        isCurrentAssigned
                          ? "border-emerald-400 bg-emerald-400/15 ring-2 ring-emerald-400/40"
                          : isNearest
                          ? "border-cyan-300/80 bg-cyan-400/10 shadow-lg shadow-cyan-950/40"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center text-center w-full min-w-0">
                        {/* Top Badge: Distance & Nearest Tag */}
                        <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 w-full">
                          {member.distanceKm !== null && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isNearest
                                  ? "border border-cyan-300/40 bg-cyan-300/20 text-cyan-200"
                                  : "border border-white/10 bg-white/10 text-white/70"
                              }`}
                            >
                              <Navigation size={10} className={isNearest ? "text-cyan-300" : ""} />
                              {member.distanceKm} km away
                            </span>
                          )}
                          {isNearest && (
                            <span className="rounded-full border border-lime-300/40 bg-lime-300/20 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                              ⭐ Nearest
                            </span>
                          )}
                          {isCurrentAssigned && (
                            <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                              Current Lead
                            </span>
                          )}
                        </div>

                        {/* Officer Avatar */}
                        <div className="relative mb-2">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white group-hover:border-cyan-300 group-hover:text-cyan-200 transition">
                            {member.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 3)}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-100 truncate w-full text-center">
                          {member.fullName}
                        </h4>
                        <p className="text-[11px] text-white/55 truncate w-full text-center">
                          {member.designation || "Field Member"}
                        </p>

                        {/* Contact details */}
                        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-white/65 w-full">
                          <p className="inline-flex items-center justify-center gap-1.5 truncate max-w-full">
                            <Mail size={12} className="text-cyan-200 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </p>
                          <p className="inline-flex items-center justify-center gap-1.5 truncate max-w-full">
                            <Phone size={12} className="text-emerald-300 shrink-0" />
                            <span className="truncate">{member.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Action Button: Allocate Button Inside Member Card */}
                      <div className="mt-4 border-t border-white/10 pt-3 w-full">
                        <button
                          type="button"
                          onClick={() => handleAllocate(member)}
                          disabled={isSubmitting}
                          className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold uppercase tracking-wider shadow-md transition duration-200 ${
                            isAllocatingThis
                              ? "border-cyan-300 bg-cyan-300 text-slate-950 animate-pulse"
                              : isCurrentAssigned
                              ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/30"
                              : "border-cyan-300/50 bg-cyan-400/20 text-cyan-200 hover:bg-cyan-300 hover:text-slate-950"
                          } disabled:opacity-50`}
                        >
                          <UserCheck size={14} />
                          <span>
                            {isAllocatingThis
                              ? "Allocating..."
                              : isCurrentAssigned
                              ? "Re-allocate"
                              : "Allocate Member"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {sortedMembers.length === 0 && (
                  <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-xs text-white/50">
                    No agency members found matching your search query.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AllocateRecommendationPage;
