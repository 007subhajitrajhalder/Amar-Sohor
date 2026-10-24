import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest } from "../../api/client";
import { displayDate, mediaUrl } from "../../api/client";
import { useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useAdminTheme } from "./useAdminTheme";
import AdminHeader from "./AdminHeader";

function AdminComplaintDetailsPage() {
  const { reportId } = useParams();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  const resource = useApi("/reports/" + reportId);
  const record = resource.data;
  const complaint = record ? {
    id: record.report_id, title: record.title, description: record.description, status: record.status,
    submittedDate: displayDate(record.created_at), citizen: { name: record.citizen_name, email: "Not recorded", phone: "Not recorded" },
    facility: { id: record.facility_id, name: record.facility_name, category: record.facility_category, address: record.facility_address },
    agency: { id: record.assigned_agency, name: record.agency_name, assignedMember: record.assigned_officer || "Unassigned" },
    complaintPhoto: mediaUrl(record.photo_url), resolutionDescription: record.resolution?.description,
    resolutionPhoto: mediaUrl(record.resolution?.photo_url), completionDate: displayDate(record.resolved_at)
  } : null;
  const currentStatus = record?.status || "";
  const selectedMember = record?.assigned_officer || "Unassigned";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  if (!record) return <main className="min-h-screen bg-slate-950 p-8 text-white"><ApiState {...resource} /><Link to="/admin/complaints">Back to complaints</Link></main>;

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusStyle = (status) => {
    if (status === "PENDING") {
      return "border-amber-200/30 bg-amber-300/15 text-amber-200";
    }

    if (status === "UNDER_INVESTIGATION") {
      return "border-cyan-200/30 bg-cyan-300/15 text-cyan-200";
    }

    if (status === "RESOLVED") {
      return "border-emerald-200/30 bg-emerald-300/15 text-emerald-200";
    }

    return "border-white/20 bg-white/10 text-white/70";
  };

  const confirmAction = async () => {
    if (!pendingAction || saving) return;
    setSaving(true); setError("");
    try {
      await apiRequest("/reports/" + reportId, { method: "PATCH", body: { status: pendingAction.value } });
      setActionMessage("Resolution approved. Report is now resolved.");
      setPendingAction(null); resource.refresh();
    } catch (error) { setError(error.message); }
    finally { setSaving(false); }
  };

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode" : ""
      }`}
    >
      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <ApiState {...resource} /><ApiState error={error} />
      <section className="relative z-[1] mx-auto max-w-6xl text-white">
        <div className="flex items-center justify-between gap-4">
          <Link
              to="/admin/complaints"
              className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all complaints
          </Link>

        </div>

        <div
          className="admin-glass-card mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl md:flex-row md:items-center"
        >
          <div>
            <p className="font-bold text-cyan-200/70">
              Complaint #{complaint.id}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {complaint.title}
            </h1>

            <p className="mt-2 text-white/60">
              Submitted on{" "}
              {complaint.submittedDate}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-bold ${getStatusStyle(
              currentStatus
            )}`}
          >
            <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
            {formatStatus(
              currentStatus
            )}
          </span>
        </div>

        <div className="admin-dashboard-reveal mt-5 grid gap-3 sm:grid-cols-3" style={{ "--dashboard-delay": "280ms" }}>
          <SummaryItem icon={MapPin} label="Facility" value={complaint.facility.name} />
          <SummaryItem icon={Building2} label="Assigned agency" value={complaint.agency.name} />
          <SummaryItem
            icon={ExternalLink}
            label="Assigned member"
            value={selectedMember}
            href={`/admin/agencies/${complaint.agency.id}/members`}
          />
        </div>

        {actionMessage && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100" role="status">
            <Check size={17} aria-hidden="true" />
            {actionMessage}
          </div>
        )}

        
        <div className="admin-dashboard-reveal mt-6 grid gap-6 lg:grid-cols-2" style={{ "--dashboard-delay": "440ms" }}>
          {/* Complaint information */}
          <section className="admin-glass-card rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-bold">
              Complaint Information
            </h2>

            <div className="mt-5 grid gap-5">
              <Information
                label="Description"
                value={complaint.description}
              />

              <Information
                label="Citizen"
                value={complaint.citizen.name}
              />

              <Information
                label="Citizen Email"
                value={complaint.citizen.email}
              />

              <Information
                label="Citizen Phone"
                value={complaint.citizen.phone}
              />

              <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                <a
                  href={`mailto:${complaint.citizen.email}`}
                  className="admin-navigable-card inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200 transition"
                >
                  <Mail size={15} aria-hidden="true" />
                  Email citizen
                </a>
                <a
                  href={`tel:${complaint.citizen.phone}`}
                  className="admin-navigable-card inline-flex items-center gap-2 rounded-xl border border-emerald-200/30 bg-white/5 px-4 py-2 text-sm font-semibold text-emerald-200 transition"
                >
                  <Phone size={15} aria-hidden="true" />
                  Call citizen
                </a>
              </div>

              <div>
                <p className="text-sm text-white/50">
                  Complaint Photograph
                </p>

                <div
                  className="admin-secondary-panel mt-2 flex h-56 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50"
                >
                  Complaint image will appear here
                </div>
              </div>
            </div>
          </section>

          {/* Assignment information */}
          <section className="admin-glass-card rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-bold">
              Facility and Assignment
            </h2>

            <div className="mt-5 grid gap-5">
              <Information
                label="Facility"
                value={complaint.facility.name}
              />

              <Information
                label="Category"
                value={complaint.facility.category}
              />

              <Information
                label="Address"
                value={complaint.facility.address}
              />

              <Information
                label="Assigned Agency"
                value={complaint.agency.name}
              />

              <Information
                label="Assigned Member"
                value={
                  <Link
                    to={`/admin/agencies/${complaint.agency.id}/members`}
                    className="font-semibold text-cyan-200 transition hover:text-white hover:underline"
                  >
                    {selectedMember}
                  </Link>
                }
              />

              <Link
                to={`/facilities/${complaint.facility.id}`}
                className="admin-outline-button inline-block rounded-xl border border-cyan-200/40 px-5 py-3 text-center font-bold text-cyan-200 transition hover:bg-white/10"
              >
                View Facility
              </Link>
            </div>
          </section>
        </div>

        {/* Status history */}
        <section className="admin-glass-card mt-6 rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-bold">
            Complaint Status
          </h2>

          <div className="mt-6 border-l-2 border-cyan-200/40 pl-6">
            <StatusHistoryItem
              title="Complaint Submitted"
              date="20 August 2026, 10:30 AM"
              description="The citizen submitted the complaint."
            />

            <StatusHistoryItem
              title="Assigned to KMC Water Department"
              date="20 August 2026, 10:35 AM"
              description="The system assigned the complaint to the responsible agency."
            />

            <StatusHistoryItem
              title="Under Investigation"
              date="21 August 2026, 9:15 AM"
              description="The agency member started investigating the complaint."
            />
          </div>
        </section>

        {record.resolution?.verification_status === "PENDING" && record.status !== "RESOLVED" &&
          <button type="button" className="my-5 rounded-xl border bg-emerald-700 px-5 py-3 text-white"
            onClick={() => setPendingAction({ type: "status", value: "RESOLVED" })}>Approve resolution</button>}
        {/* Resolution information */}
        <section className="admin-glass-card mt-6 rounded-2xl border border-white/20 p-7 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-bold">
            Resolution Information
          </h2>

          {currentStatus ===
          "RESOLVED" ? (
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <Information
                  label="Resolution Description"
                  value={
                    complaint.resolutionDescription
                  }
                />

                <div className="mt-5">
                  <Information
                    label="Completion Date"
                    value={
                      complaint.completionDate
                    }
                  />
                </div>
              </div>

              <div
                className="admin-secondary-panel flex h-56 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50"
              >
                Resolution photograph
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 text-amber-200">
              Resolution information will be
              available after the agency
              resolves the complaint.
            </div>
          )}
        </section>
      </section>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm">
          <div className="admin-glass-card w-full max-w-md rounded-2xl border border-white/30 p-6 text-white shadow-2xl shadow-black/40" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-300/15 p-3 text-amber-200">
                <AlertCircle size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 id="confirm-action-title" className="text-lg font-bold">Confirm workflow change</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {pendingAction.type === "status"
                    ? `Change the complaint status to ${formatStatus(pendingAction.value)}?`
                    : `Assign this complaint to ${pendingAction.value}?`}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingAction(null)} className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10">
                Cancel
              </button>
              <button type="button" disabled={saving} onClick={confirmAction} className="rounded-xl border border-cyan-200/40 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25">
                Confirm change
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Information({
  label,
  value
}) {
  return (
    <div>
      <p className="text-sm text-white/50">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white/90">
        {value || "Not available"}
      </p>
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
          <Link to={href} className="mt-1 block truncate text-sm font-semibold text-cyan-200 transition hover:text-white hover:underline">
            {value}
          </Link>
        ) : (
          <p className="mt-1 truncate text-sm font-semibold text-white/85">{value}</p>
        )}
      </div>
    </div>
  );
}



function StatusHistoryItem({
  title,
  date,
  description
}) {
  return (
    <div className="relative mb-7">
      <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-cyan-300" />

      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-white/50">
        {date}
      </p>

      <p className="mt-2 text-sm text-white/60">
        {description}
      </p>
    </div>
  );
}

export default AdminComplaintDetailsPage;
