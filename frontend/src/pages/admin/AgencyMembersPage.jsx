import { useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

function AgencyMembersPage() {
  const navigate = useNavigate();

  /*
    Receives agencyId from the URL:

    /admin/agencies/2/members
  */
  const { agencyId } = useParams();

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  /*
    Stores the member selected for deletion.

    If this is null, the confirmation box
    will remain hidden.
  */
  const [
    selectedMember,
    setSelectedMember
  ] = useState(null);

  /*
    Temporary agency information.

    Later, this information will come
    from the backend.
  */
  const agencies = [
    {
      id: 1,
      name: "KMC SWM Department",
      department: "Solid Waste Management"
    },
    {
      id: 2,
      name: "KMC Sanitation Department",
      department: "Public Sanitation"
    },
    {
      id: 3,
      name: "KMC Water Department",
      department: "Water Services"
    },
    {
      id: 4,
      name: "Kolkata Police",
      department: "Parking Management"
    }
  ];

  /*
    Temporary agency-member information.

    Every member contains an agencyId,
    which connects the member to an agency.
  */
  const initialMembers = [
    {
      id: 1,
      fullName: "Amit Kumar",
      email: "amit@kmc.example.com",
      phone: "9876543210",
      role: "AGENCY_MEMBER",
      agencyId: 1
    },
    {
      id: 2,
      fullName: "Rohit Das",
      email: "rohit@kmc.example.com",
      phone: "9876543211",
      role: "AGENCY_ADMIN",
      agencyId: 1
    },
    {
      id: 3,
      fullName: "Priya Sen",
      email: "priya@kmc.example.com",
      phone: "9876543212",
      role: "AGENCY_MEMBER",
      agencyId: 2
    },
    {
      id: 4,
      fullName: "Arjun Roy",
      email: "arjun@kmc.example.com",
      phone: "9876543213",
      role: "AGENCY_MEMBER",
      agencyId: 2
    },
    {
      id: 5,
      fullName: "Suman Ghosh",
      email: "suman@water.example.com",
      phone: "9876543214",
      role: "AGENCY_ADMIN",
      agencyId: 3
    },
    {
      id: 6,
      fullName: "Ananya Paul",
      email: "ananya@water.example.com",
      phone: "9876543215",
      role: "AGENCY_MEMBER",
      agencyId: 3
    },
    {
      id: 7,
      fullName: "Rajib Dutta",
      email: "rajib@police.example.com",
      phone: "9876543216",
      role: "AGENCY_MEMBER",
      agencyId: 4
    }
  ];

  /*
    The members are stored in state because
    the displayed list must change after
    a member is deleted.
  */
  const [members, setMembers] =
    useState(initialMembers);

  /*
    Finds the agency selected on the
    Agency Management Page.
  */
  const selectedAgency = agencies.find(
    (agency) =>
      agency.id === Number(agencyId)
  );

  /*
    First selects members belonging to the
    chosen agency and then applies the search.
  */
  const filteredMembers = members.filter(
    (member) => {
      const belongsToSelectedAgency =
        member.agencyId ===
        Number(agencyId);

      const searchValue =
        searchText.toLowerCase();

      const matchesSearch =
        member.fullName
          .toLowerCase()
          .includes(searchValue) ||
        member.email
          .toLowerCase()
          .includes(searchValue) ||
        member.phone.includes(searchValue);

      return (
        belongsToSelectedAgency &&
        matchesSearch
      );
    }
  );

  /*
    Opens the delete confirmation box.
  */
  const handleDeleteClick = (member) => {
    setError("");
    setSuccess("");
    setSelectedMember(member);
  };

  /*
    Closes the confirmation box without
    deleting the member.
  */
  const handleCancelDelete = () => {
    setSelectedMember(null);
  };

  /*
    Deletes the selected member from
    the frontend member list.
  */
  const handleConfirmDelete = () => {
    if (!selectedMember) {
      return;
    }

    /*
      Later, an Axios DELETE request will
      be added here.

      Example:

      await api.delete(
        `/admin/agency-members/${selectedMember.id}`
      );
    */

    setMembers((previousMembers) =>
      previousMembers.filter(
        (member) =>
          member.id !== selectedMember.id
      )
    );

    setSuccess(
      `${selectedMember.fullName} was removed successfully.`
    );

    setSelectedMember(null);
  };

  /*
    If an incorrect agency ID is entered
    in the URL, show this message.
  */
  if (!selectedAgency) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <section className="rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-700">
            Agency Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            No agency was found for ID{" "}
            {agencyId}.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/agencies")
            }
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            Return to Agency Management
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() =>
            navigate("/admin/agencies")
          }
          className="font-bold text-emerald-700"
        >
          ← Back to Agency Management
        </button>

        {/* Page heading */}
        <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Admin Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Agency Members
            </h1>

            <p className="mt-2 text-slate-600">
              View or remove members belonging
              to the selected agency.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-800 px-6 py-4 text-white shadow">
            <p className="text-sm text-emerald-100">
              Selected Agency
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {selectedAgency.name}
            </h2>

            <p className="mt-1 text-sm text-emerald-100">
              {selectedAgency.department}
            </p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mt-6 rounded-xl bg-green-100 p-4 font-bold text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Search and count */}
        <section className="mt-7 rounded-2xl bg-white p-5 shadow">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search member by name, email or phone"
              className="rounded-xl border p-3 outline-none focus:border-emerald-600"
            />

            <div className="rounded-xl bg-slate-100 px-5 py-3">
              <span className="text-sm text-slate-500">
                Members:
              </span>{" "}
              <strong>
                {filteredMembers.length}
              </strong>
            </div>
          </div>
        </section>

        {/* Member list */}
        <section className="mt-6 grid gap-4">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                {/* Member profile icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
                  {member.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {member.fullName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {member.email}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {member.phone}
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      member.role ===
                      "AGENCY_ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {formatRole(member.role)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDeleteClick(member)
                }
                className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
              >
                Delete Member
              </button>
            </article>
          ))}

          {filteredMembers.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <p className="text-4xl">
                👥
              </p>

              <h2 className="mt-4 text-xl font-bold">
                No Members Found
              </h2>

              <p className="mt-2 text-slate-600">
                This agency has no matching
                registered members.
              </p>
            </div>
          )}
        </section>
      </section>

      {/* Delete confirmation popup */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Delete Agency Member?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Are you sure you want to remove{" "}
              <strong>
                {selectedMember.fullName}
              </strong>{" "}
              from{" "}
              <strong>
                {selectedAgency.name}
              </strong>
              ?
            </p>

            <p className="mt-3 text-sm text-red-600">
              The member will no longer be able
              to access the agency portal.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-xl border border-slate-300 px-5 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
              >
                Yes, Delete Member
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

/*
  Converts:

  AGENCY_MEMBER → Agency Member
  AGENCY_ADMIN  → Agency Admin
*/
function formatRole(role) {
  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default AgencyMembersPage;