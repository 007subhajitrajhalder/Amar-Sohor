import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest, displayDate, mediaUrl } from "../../api/client";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Wrench
} from "lucide-react";

import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";

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

function AdminComplaintDetailsPage() {
  const { reportId } = useParams();
  const cleanId = String(reportId || "").replace(/^REP-/i, "").replace(/^0+/, "") || "0";
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  const resource = useApi("/reports/" + cleanId);
  const record = resource.data;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  if (resource.loading) {
    return (
      <main
        className={`admin-themed-page relative flex min-h-screen items-center justify-center p-6 ${
          isLightMode ? "admin-light-mode" : "bg-[#100e0b]"
        }`}
      >
        <ApiState {...resource} />
      </main>
    );
  }

  if (!record) {
    return (
      <main
        className={`admin-themed-page relative flex min-h-screen items-center justify-center p-6 ${
          isLightMode ? "admin-light-mode" : "bg-[#100e0b]"
        }`}
      >
        <div className="admin-glass-card max-w-md rounded-2xl border border-white/20 p-8 text-center text-white backdrop-blur-xl">
          <AlertCircle size={40} className="mx-auto text-amber-300" />
          <h2 className="mt-4 text-xl font-bold">Complaint Not Found</h2>
          <p className="mt-2 text-sm text-white/60">
            The requested civic grievance #{reportId} could not be located in the system.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/complaints")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/20"
          >
            <ArrowLeft size={16} />
            Back to All Complaints
          </button>
        </div>
      </main>
    );
  }

  // Live mapped data from backend server
  const complaint = {
    id: record.report_id,
    title: record.title || "Civic Complaint",
    description: record.description || "No description provided.",
    status: record.status || "PENDING",
    submittedDate: displayDate(record.created_at),
    citizen: {
      name: record.citizen_name || "Citizen",
      email: record.citizen_email || "Not recorded",
      phone: record.citizen_phone || "Not recorded"
    },
    facility: {
      id: record.facility_id,
      name: record.facility_name || "Civic Facility #" + record.facility_id,
      category: record.facility_category || "Public Utility",
      address: record.facility_address || "Kolkata, West Bengal"
    },
    agency: {
      id: record.assigned_agency,
      name: record.agency_name || "Municipal Authority",
      assignedOfficer: record.assigned_officer || "Unassigned Specialist",
      memberDetails: record.assigned_member
    },
    agencyNotes: record.agency_notes,
    complaintPhoto: mediaUrl(record.photo_url),
    stage: record.stage || (record.status === "RESOLVED" ? 4 : record.status === "UNDER_INVESTIGATION" ? 2 : 1),
    resolution: record.resolution
      ? {
          id: record.resolution.resolution_id,
          description: record.resolution.description,
          photo: mediaUrl(record.resolution.photo_url),
          completionDate: displayDate(record.resolution.completion_date),
          verificationStatus: record.resolution.verification_status,
          submittedAt: displayDate(record.resolution.submitted_at)
        }
      : null,
    resolvedAt: displayDate(record.resolved_at)
  };

  const currentStatus = complaint.status;
  const currentStage = complaint.stage;

  const formatStatus = (status) => {
    if (!status) return "";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusStyle = (status) => {
    if (status === "PENDING") {
      return "border-amber-200/40 bg-amber-400/15 text-amber-200";
    }
    if (status === "UNDER_INVESTIGATION") {
      return "border-cyan-200/40 bg-cyan-400/15 text-cyan-200";
    }
    if (status === "RESOLVED") {
      return "border-emerald-200/40 bg-emerald-400/15 text-emerald-200";
    }
    return "border-white/20 bg-white/10 text-white/70";
  };

  const confirmAction = async () => {
    if (!pendingAction || saving) return;
    setSaving(true);
    setError("");
    try {
      await apiRequest("/reports/" + cleanId, {
        method: "PATCH",
        body: { status: pendingAction.value }
      });
      setActionMessage("Resolution verified and approved. Complaint status is now RESOLVED.");
      setPendingAction(null);
      resource.refresh();
    } catch (err) {
      setError(err.message || "Failed to update complaint status.");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic progress steps derived from live backend record
  const progressSteps = [
    {
      step: 1,
      title: "Complaint Submitted",
      date: complaint.submittedDate,
      description: `Report registered by citizen ${complaint.citizen.name} and logged in municipal database.`,
      isDone: currentStage > 1
    },
    {
      step: 2,
      title: "Field Investigation",
      date: currentStatus === "PENDING"
        ? complaint.agency.assignedOfficer !== "Unassigned Specialist"
          ? "Officer assigned; awaiting investigation"
          : "Awaiting assignment"
        : currentStage >= 3
          ? "Investigation completed"
          : "Under investigation",
      description: complaint.agencyNotes
        ? `Field inspection remarks: "${complaint.agencyNotes}"`
        : currentStatus === "PENDING"
          ? complaint.agency.assignedOfficer !== "Unassigned Specialist"
            ? `${complaint.agency.assignedOfficer} from ${complaint.agency.name} is assigned and will investigate the complaint.`
            : `Awaiting assignment to ${complaint.agency.name} for field investigation.`
          : `Field investigation by ${complaint.agency.assignedOfficer} for ${complaint.agency.name}.`,
      isDone: currentStage > 2
    },
    {
      step: 3,
      title: "Resolution Evidence Review",
      date: currentStatus === "RESOLVED"
        ? complaint.resolvedAt
        : complaint.resolution?.submittedAt || "Awaiting resolution evidence",
      description: currentStatus === "RESOLVED"
        ? "Agency evidence was approved by an administrator and the complaint was resolved."
        : complaint.resolution
          ? "The agency submitted resolution evidence and it is awaiting administrator review."
          : "The complaint will be reviewed after the agency submits resolution evidence.",
      isDone: currentStage > 3
    },
    {
      step: 4,
      title: "Complaint Resolved",
      date: currentStatus === "RESOLVED"
        ? complaint.resolvedAt || complaint.resolution?.completionDate || "Resolved"
        : "Not resolved",
      description: currentStatus === "RESOLVED"
        ? complaint.resolution?.description || "Repair verified and grievance successfully closed."
        : "The complaint is closed after an administrator approves the agency's resolution evidence.",
      isDone: currentStatus === "RESOLVED"
    }
  ];

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-x-hidden p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : "bg-[#100e0b]"
      }`}
    >
      {/* Background glowing aura layers */}
      {(isLightMode ? lightAuraLayers : auraLayers).map((layer, index) => (
        <div
          key={index}
          aria-hidden="true"
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
      <ApiState error={error || resource.error} />

      <section className={`relative z-10 mx-auto max-w-6xl ${isLightMode ? "text-slate-900" : "text-white"}`}>
        {/* Top Back Link */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/complaints"
            className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to all complaints
          </Link>
        </div>

        {/* Header Card */}
        <div className="admin-glass-card mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                Grievance #{complaint.id}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                {complaint.facility.category}
              </span>
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white break-words">
              {complaint.title}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <MapPin size={14} className="text-amber-300 shrink-0" />
              <span className="truncate">{complaint.facility.name} ({complaint.facility.address})</span>
              <span className="text-white/30">•</span>
              <span>Submitted on {complaint.submittedDate}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold ${getStatusStyle(
                currentStatus
              )}`}
            >
              <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              {formatStatus(currentStatus)}
            </span>
          </div>
        </div>

        {/* 3 Summary Item Badges */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SummaryItem icon={MapPin} label="Facility" value={complaint.facility.name} />
          <SummaryItem icon={Building2} label="Assigned Agency" value={complaint.agency.name} />
          <SummaryItem
            icon={ExternalLink}
            label="Assigned Specialist"
            value={complaint.agency.assignedOfficer}
            href={`/admin/agencies/${complaint.agency.id}/members`}
          />
        </div>

        {/* Action Message Alert */}
        {actionMessage && (
          <div
            className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200/30 bg-emerald-400/15 p-4 text-sm font-semibold text-emerald-100 shadow-lg backdrop-blur-xl"
            role="status"
          >
            <Check size={18} aria-hidden="true" />
            {actionMessage}
          </div>
        )}

        {/* 4-Step Dynamic Progress Stepper */}
        <div className="admin-glass-card mt-6 rounded-2xl border border-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold">Complaint Lifecycle Progress</h2>
              <p className="text-xs text-white/55">
                Current stage: Step {currentStage} of 4 • {formatStatus(currentStatus)}
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-200/80">
              Synchronized with municipal service records.
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {progressSteps.map((s) => {
              const isCurrent = s.step === currentStage;
              const isPast = s.isDone;

              return (
                <div
                  key={s.step}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 transition ${
                    isCurrent && currentStatus !== "RESOLVED"
                      ? "border-cyan-300 bg-cyan-400/20 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-300/50"
                      : isPast
                      ? "border-emerald-300/40 bg-emerald-400/10"
                      : "border-white/10 bg-white/5 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isPast
                          ? "bg-emerald-300 text-slate-900"
                          : isCurrent
                          ? "bg-cyan-300 text-slate-900 ring-2 ring-cyan-200/60"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {isPast ? <Check size={13} strokeWidth={3} /> : isCurrent ? <CircleDashed size={13} className="animate-spin" /> : s.step}
                    </span>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? "text-cyan-100" : isPast ? "text-emerald-200" : "text-white/60"}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-white/45">{s.date}</p>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] leading-relaxed text-white/60">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Columns: Left = Complaint Information, Right = Facility & Assignment */}
        <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Column 1: Complaint Information */}
          <section className="admin-glass-card space-y-6 rounded-2xl border border-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserRound size={20} className="text-cyan-200" />
              Citizen Grievance Details
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Grievance Description
                </p>
                <p className="mt-1.5 leading-relaxed text-white/80 rounded-xl border border-white/10 bg-white/5 p-3.5 break-words">
                  {complaint.description}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Citizen Contact Information
                </p>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 text-xs">
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Name:</span>
                    <span className="font-semibold text-white truncate block">{complaint.citizen.name}</span>
                  </div>
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Phone:</span>
                    <span className="font-semibold text-white truncate block">{complaint.citizen.phone}</span>
                  </div>
                  <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <span className="text-white/40 block">Email:</span>
                    <span className="font-semibold text-white truncate block">{complaint.citizen.email}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {complaint.citizen.email && complaint.citizen.email !== "Not recorded" && (
                    <a
                      href={`mailto:${complaint.citizen.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-white/10"
                    >
                      <Mail size={13} />
                      Email Citizen
                    </a>
                  )}
                  {complaint.citizen.phone && complaint.citizen.phone !== "Not recorded" && (
                    <a
                      href={`tel:${complaint.citizen.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-white/10"
                    >
                      <Phone size={13} />
                      Call Citizen
                    </a>
                  )}
                </div>
              </div>

              {/* Uploaded Complaint Photo */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Uploaded Complaint Photograph
                </p>
                {complaint.complaintPhoto ? (
                  <div className="overflow-hidden rounded-xl border border-white/20 bg-black/40">
                    <img
                      src={complaint.complaintPhoto}
                      alt={complaint.title}
                      className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-white/40">
                    <Camera size={16} className="mr-2 opacity-50" />
                    No photograph attached to this grievance
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Column 2: Facility and Assignment */}
          <section className="admin-glass-card space-y-6 rounded-2xl border border-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 size={20} className="text-emerald-300" />
              Facility & Assignment
            </h2>

            <div className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <Information label="Facility Name" value={complaint.facility.name} />
                <Information label="Utility Category" value={complaint.facility.category} />
              </div>

              <Information label="Location Address" value={complaint.facility.address} />

              <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Assigned Authority
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-400/15 text-emerald-200">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm">{complaint.agency.name}</p>
                    <p className="text-xs text-white/60">Responsible Civic Agency</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[11px] text-white/50 block">Assigned Specialist:</span>
                    <span className="text-xs font-bold text-cyan-200">{complaint.agency.assignedOfficer}</span>
                  </div>
                  <Link
                    to={`/admin/agencies/${complaint.agency.id}/members`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-200 hover:text-white hover:underline"
                  >
                    View Members
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {complaint.agencyNotes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Agency Field Notes
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/80 rounded-xl border border-white/10 bg-white/5 p-3">
                    {complaint.agencyNotes}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/facilities/${complaint.facility.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-cyan-300/40 bg-cyan-400/10 py-2.5 text-xs font-bold text-cyan-200 transition hover:bg-cyan-300/20"
                >
                  <Eye size={14} />
                  View Facility on Live Map
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Resolution Approval Action for Municipal Admin */}
        {record.resolution?.verification_status === "PENDING" && currentStatus !== "RESOLVED" && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-300/40 bg-emerald-400/15 p-5 text-white shadow-xl backdrop-blur-xl">
            <div>
              <p className="font-bold text-emerald-200 text-base">Resolution Submitted for Verification</p>
              <p className="text-xs text-white/70 mt-0.5">
                The assigned agency has submitted after-repair evidence. Review the evidence and approve resolution to close this ticket.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPendingAction({ type: "status", value: "RESOLVED" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-emerald-300 shrink-0"
            >
              <ShieldCheck size={16} />
              Approve Resolution
            </button>
          </div>
        )}

        {/* Resolution Information Card */}
        <section className="admin-glass-card mt-6 mb-12 rounded-2xl border border-white/20 p-6 sm:p-7 text-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench size={20} className="text-emerald-300" />
              Resolution Information & Verification
            </h2>

            {currentStatus === "RESOLVED" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                <CheckCircle2 size={13} />
                Verified & Resolved
              </span>
            )}
          </div>

          {currentStatus === "RESOLVED" || complaint.resolution ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Resolution Description
                  </p>
                  <p className="mt-1 leading-relaxed text-white/80 rounded-xl border border-white/10 bg-white/5 p-3.5 break-words">
                    {complaint.resolution?.description || "Work completed and verified by civic authorities."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/40 uppercase text-[10px] font-semibold">Completion Date</p>
                    <p className="mt-1 font-bold text-white text-sm">
                      {complaint.resolution?.completionDate || complaint.resolvedAt || "Recorded"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/40 uppercase text-[10px] font-semibold">Verification Status</p>
                    <p className="mt-1 font-bold text-emerald-300 text-sm">
                      {complaint.resolution?.verificationStatus || "APPROVED"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  After-Repair Photographic Evidence
                </p>
                {complaint.resolution?.photo ? (
                  <div className="overflow-hidden rounded-xl border border-white/20 bg-black/40">
                    <img
                      src={complaint.resolution.photo}
                      alt="Resolution evidence"
                      className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-white/40">
                    No resolution photograph submitted
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-300/30 bg-amber-400/10 p-5 text-amber-200 text-xs sm:text-sm">
              <p className="font-semibold text-white">Resolution In Progress</p>
              <p className="mt-1 text-white/70">
                Official repair and resolution details will appear here once the assigned agency team inspects the facility and uploads resolution evidence.
              </p>
            </div>
          )}
        </section>
      </section>

      {/* Confirmation Dialog Modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm">
          <div
            className="admin-glass-card w-full max-w-md rounded-2xl border border-white/30 p-6 text-white shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-action-title"
          >
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                <CheckCircle2 size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 id="confirm-action-title" className="text-lg font-bold">
                  Confirm Resolution Approval
                </h2>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Are you sure you want to approve the uploaded resolution evidence and mark Complaint #{complaint.id} as fully resolved?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={confirmAction}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Approve & Resolve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Information({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-1 font-semibold text-white/90 text-sm truncate">{value || "Not available"}</p>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, href }) {
  return (
    <div className="admin-glass-card flex min-w-0 items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-white shadow-lg shadow-cyan-950/10">
      <div className="rounded-lg border border-white/15 bg-white/5 p-2 text-cyan-200">
        <Icon size={16} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/45">{label}</p>
        {href ? (
          <Link
            to={href}
            className="mt-0.5 block truncate text-sm font-semibold text-cyan-200 transition hover:text-white hover:underline"
          >
            {value}
          </Link>
        ) : (
          <p className="mt-0.5 truncate text-sm font-semibold text-white/85">{value}</p>
        )}
      </div>
    </div>
  );
}

export default AdminComplaintDetailsPage;
