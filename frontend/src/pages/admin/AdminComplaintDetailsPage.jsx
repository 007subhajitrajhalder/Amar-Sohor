import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "./useAdminTheme";

function AdminComplaintDetailsPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();

  /*
    Temporary complaint data.

    Later, the page will request the selected
    report from the backend using reportId.
  */
  const complaintData = {
    id: reportId,
    title: "Water Not Available",
    description:
      "The drinking-water dispenser is not supplying water.",
    status: "UNDER_INVESTIGATION",
    submittedDate: "20 August 2026",
    citizen: {
      name: "Rahul Das",
      email: "rahul@example.com",
      phone: "9876543210"
    },
    facility: {
      id: 3,
      name: "Salt Lake Water Point",
      category: "Drinking Water",
      address: "Sector V, Salt Lake, Kolkata"
    },
    agency: {
      id: 3,
      name: "KMC Water Department",
      assignedMember: "Amit Kumar"
    },
    complaintPhoto: null,
    resolutionDescription: null,
    resolutionPhoto: null,
    completionDate: null
  };

  const complaint = {
    ...complaintData,
    ...complaintOverrides[reportId],
    id: reportId
  };

  const isKnownComplaint = ["101", "102", "103", "104"].includes(String(reportId));

  if (!isKnownComplaint) {
    return (
      <main className={`min-h-screen bg-[#100e0b] p-6 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
        <section className="admin-glass-card mx-auto mt-16 max-w-xl rounded-2xl border border-white/30 p-8 text-center text-white shadow-xl shadow-cyan-950/25">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70">Report unavailable</p>
          <h1 className="mt-3 text-2xl font-bold">Complaint not found</h1>
          <p className="mt-2 text-sm text-white/60">No complaint matches report #{reportId}.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/complaints")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to complaints
          </button>
        </section>
      </main>
    );
  }

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

  const copyReportId = async () => {
    try {
      await navigator.clipboard.writeText(String(complaint.id));
      setIsReportIdCopied(true);
      window.setTimeout(() => setIsReportIdCopied(false), 1800);
    } catch {
      setIsReportIdCopied(false);
    }
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "workflow") {
      setCurrentStatus(pendingAction.status);
      setSelectedMember(pendingAction.member);
      setDraftStatus(pendingAction.status);
      setDraftMember(pendingAction.member);
      saveComplaintWorkflow(reportId, {
        status: pendingAction.status,
        member: pendingAction.member
      });
      setActionMessage("Complaint workflow updated successfully.");
    } else if (pendingAction.type === "status") {
      setCurrentStatus(pendingAction.value);
      setActionMessage(`Status updated to ${formatStatus(pendingAction.value)}.`);
    } else {
      setSelectedMember(pendingAction.value);
      setActionMessage(`Complaint reassigned to ${pendingAction.value}.`);
    }

    setPendingAction(null);
    window.setTimeout(() => setActionMessage(""), 3000);
  };

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode" : ""
      }`}
    >
      <section className="relative z-[1] mx-auto max-w-6xl text-white">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/complaints")
          }
          className="font-bold text-cyan-200 transition hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to All Complaints
        </button>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setIsLightMode((mode) => !mode)}
            aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
            className="admin-theme-toggle relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border border-white/30 bg-white/10 px-1.5 text-white shadow-lg backdrop-blur-xl transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <Sun size={13} aria-hidden="true" />
            <Moon size={13} aria-hidden="true" />
            <span
              className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-500 ${
                isLightMode
                  ? "translate-x-6 bg-amber-300"
                  : "bg-cyan-200"
              }`}
            />
          </button>
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

        <section className="admin-dashboard-reveal admin-glass-card relative z-20 mt-6 overflow-visible rounded-2xl border border-white/30 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl" style={{ "--dashboard-delay": "360ms" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100/60">Admin controls</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight">Update complaint workflow</h2>
              <p className="mt-2 text-sm text-white/55">Changes are staged first and applied after confirmation.</p>
            </div>
              <button
                type="button"
                onClick={() => setPendingAction({ type: "workflow", status: draftStatus, member: draftMember })}
                disabled={!hasWorkflowChanges}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={16} aria-hidden="true" />
                Save changes
              </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <WorkflowSelect
              label="Complaint status"
              value={draftStatus}
              onChange={setDraftStatus}
              options={[
                ["PENDING", "Pending"],
                ["UNDER_INVESTIGATION", "Under investigation"],
                ["RESOLVED", "Resolved"]
              ]}
            />
            <WorkflowSelect
              label="Assigned member"
              value={draftMember}
              onChange={setDraftMember}
              options={[
                ["Amit Kumar", "Amit Kumar"],
                ["Neha Sharma", "Neha Sharma"],
                ["Sourav Das", "Sourav Das"]
              ]}
            />
          </div>
        </section>

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
              <button type="button" onClick={confirmAction} className="rounded-xl border border-cyan-200/40 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25">
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

function WorkflowSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{label}</span>
      <AdminDropdown
        id={label.toLowerCase().replaceAll(" ", "-")}
        value={value}
        onChange={onChange}
        options={options.map(([optionValue, optionLabel]) => ({ value: optionValue, label: optionLabel }))}
        className="mt-2"
      />
    </label>
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
