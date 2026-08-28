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
  const complaint = {
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
      name: "KMC Water Department",
      assignedMember: "Amit Kumar"
    },
    complaintPhoto: null,
    resolutionDescription: null,
    resolutionPhoto: null,
    completionDate: null
  };

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
      return "bg-yellow-100 text-yellow-800";
    }

    if (
      status === "UNDER_INVESTIGATION"
    ) {
      return "bg-blue-100 text-blue-800";
    }

    if (status === "RESOLVED") {
      return "bg-green-100 text-green-800";
    }

    return "bg-slate-100 text-slate-800";
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
          ← Back to All Complaints
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
            className={`self-start rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
              complaint.status
            )}`}
          >
            {formatStatus(
              complaint.status
            )}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                  complaint.agency
                    .assignedMember
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

          {complaint.status ===
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

      <p className="mt-1 font-bold">
        {value || "Not available"}
      </p>
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
