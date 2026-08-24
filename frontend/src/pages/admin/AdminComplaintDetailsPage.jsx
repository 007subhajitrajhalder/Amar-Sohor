import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function AdminComplaintDetailsPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

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
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/complaints")
          }
          className="font-bold text-emerald-700"
        >
          ← Back to All Complaints
        </button>

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-white p-7 shadow md:flex-row md:items-center">
          <div>
            <p className="font-bold text-emerald-700">
              Complaint #{complaint.id}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {complaint.title}
            </h1>

            <p className="mt-2 text-slate-500">
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
          <section className="rounded-2xl bg-white p-7 shadow">
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
                <p className="text-sm text-slate-500">
                  Complaint Photograph
                </p>

                <div className="mt-2 flex h-56 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  Complaint image will appear here
                </div>
              </div>
            </div>
          </section>

          {/* Assignment information */}
          <section className="rounded-2xl bg-white p-7 shadow">
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
                className="inline-block rounded-xl border border-emerald-700 px-5 py-3 text-center font-bold text-emerald-700"
              >
                View Facility
              </Link>
            </div>
          </section>
        </div>

        {/* Status history */}
        <section className="mt-6 rounded-2xl bg-white p-7 shadow">
          <h2 className="text-xl font-bold">
            Complaint Status
          </h2>

          <div className="mt-6 border-l-2 border-emerald-200 pl-6">
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
        <section className="mt-6 rounded-2xl bg-white p-7 shadow">
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

              <div className="flex h-56 items-center justify-center rounded-xl bg-slate-100">
                Resolution photograph
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-yellow-50 p-5 text-yellow-800">
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
      <p className="text-sm text-slate-500">
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
      <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-emerald-700" />

      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {date}
      </p>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default AdminComplaintDetailsPage;