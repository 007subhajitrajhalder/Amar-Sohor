import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

function AllComplaintsPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  // Temporary complaint data.
  // Later, it will come from the backend.
  const complaints = [
    {
      id: 101,
      title: "Dustbin Overflowing",
      facility: "Gariahat Community Dustbin",
      citizen: "Ananya Sen",
      agency: "KMC SWM Department",
      status: "PENDING",
      submittedDate: "21 August 2026"
    },
    {
      id: 102,
      title: "Water Not Available",
      facility: "Salt Lake Water Point",
      citizen: "Rahul Das",
      agency: "KMC Water Department",
      status: "UNDER_INVESTIGATION",
      submittedDate: "20 August 2026"
    },
    {
      id: 103,
      title: "Parking Area Closed",
      facility: "New Market Parking",
      citizen: "Priya Ghosh",
      agency: "Kolkata Police",
      status: "RESOLVED",
      submittedDate: "18 August 2026"
    },
    {
      id: 104,
      title: "Public Toilet Is Dirty",
      facility: "College Street Public Toilet",
      citizen: "Arjun Roy",
      agency: "KMC Sanitation Department",
      status: "PENDING",
      submittedDate: "17 August 2026"
    }
  ];

  const filteredComplaints =
    complaints.filter((complaint) => {
      const searchValue =
        searchText.toLowerCase();

      const matchesSearch =
        complaint.title
          .toLowerCase()
          .includes(searchValue) ||
        complaint.facility
          .toLowerCase()
          .includes(searchValue) ||
        complaint.citizen
          .toLowerCase()
          .includes(searchValue) ||
        complaint.agency
          .toLowerCase()
          .includes(searchValue) ||
        complaint.id
          .toString()
          .includes(searchValue);

      const matchesStatus =
        selectedStatus === "ALL" ||
        complaint.status === selectedStatus;

      return (
        matchesSearch && matchesStatus
      );
    });

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

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
          className="font-bold text-emerald-700"
        >
          ← Back to Admin Dashboard
        </button>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Admin Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              All Complaints
            </h1>

            <p className="mt-2 text-slate-600">
              View complaints submitted for
              every registered facility.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow">
            <p className="text-sm text-slate-500">
              Total Complaints
            </p>

            <p className="text-2xl font-bold">
              {complaints.length}
            </p>
          </div>
        </div>

        {/* Search and filter */}
        <section className="mt-7 rounded-2xl bg-white p-5 shadow">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search by report, facility, citizen or agency"
              className="rounded-xl border p-3"
            />

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              className="rounded-xl border p-3"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="UNDER_INVESTIGATION">
                Under Investigation
              </option>

              <option value="RESOLVED">
                Resolved
              </option>
            </select>
          </div>
        </section>

        {/* Complaint table */}
        <section className="mt-6 overflow-x-auto rounded-2xl bg-white p-6 shadow">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="p-3">
                  Report
                </th>

                <th className="p-3">
                  Complaint
                </th>

                <th className="p-3">
                  Citizen
                </th>

                <th className="p-3">
                  Agency
                </th>

                <th className="p-3">
                  Status
                </th>

                <th className="p-3">
                  Submitted
                </th>

                <th className="p-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map(
                (complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b last:border-0"
                  >
                    <td className="p-3 font-bold text-emerald-700">
                      #{complaint.id}
                    </td>

                    <td className="p-3">
                      <p className="font-bold">
                        {complaint.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {complaint.facility}
                      </p>
                    </td>

                    <td className="p-3">
                      {complaint.citizen}
                    </td>

                    <td className="p-3">
                      {complaint.agency}
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-bold ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {formatStatus(
                          complaint.status
                        )}
                      </span>
                    </td>

                    <td className="p-3">
                      {complaint.submittedDate}
                    </td>

                    <td className="p-3">
                      <Link
                        to={`/admin/complaints/${complaint.id}`}
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {filteredComplaints.length ===
            0 && (
            <p className="py-10 text-center text-slate-500">
              No matching complaints found.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

export default AllComplaintsPage;