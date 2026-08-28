import { ArrowLeft, ArrowUpDown, Mail, Moon, Phone, Search, ShieldAlert, ShieldCheck, Sun, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";

import { useAdminTheme } from "./useAdminTheme";

import {
  useNavigate,
  useParams
} from "react-router-dom";

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
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [sortOrder, setSortOrder] = useState("name");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const selectedAgency = agencies.find(
    (agency) => agency.id === Number(agencyId)
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
        matchesSearch &&
        (roleFilter === "all" || member.role === roleFilter)
      );
    }
  ).sort((firstMember, secondMember) => {
    if (sortOrder === "role") return firstMember.role.localeCompare(secondMember.role);
    return firstMember.fullName.localeCompare(secondMember.fullName);
  });

  const agencyMembers = members.filter((member) => member.agencyId === Number(agencyId));
  const agencyAdmins = agencyMembers.filter((member) => member.role === "AGENCY_ADMIN").length;

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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100e0b] px-5">
        <div className="pointer-events-none absolute inset-0 blur-[125px]" style={{ background: "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8), transparent 75%)", mixBlendMode: "screen" }} />
        <section className="admin-glass-card relative z-[1] rounded-2xl border border-white/20 p-8 text-center text-white shadow-2xl">
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
            className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white"
          >
            Return to Agency Management
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
      {auraLayers.map((layer, index) => (
        <div
          key={`dark-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)",
            opacity: isLightMode ? 0 : 1
          }}
        />
      ))}

      {lightAuraLayers.map((layer, index) => (
        <div
          key={`light-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)",
            opacity: isLightMode ? 1 : 0
          }}
        />
      ))}
      <section className="admin-dashboard-welcome relative z-[1] mx-auto w-full max-w-6xl">
        {/* Back button */}
        <div className="admin-dashboard-reveal flex items-center justify-between gap-4" style={{ "--dashboard-delay": "80ms" }}>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/agencies")
          }
          className="inline-flex items-center gap-2 font-bold text-cyan-200 transition hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Agency Management
        </button>
        <button
          type="button"
          onClick={() => setIsLightMode((currentMode) => !currentMode)}
          aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
          className={`relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${isLightMode ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"}`}
        >
          <Sun size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-0 scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"}`} aria-hidden="true" />
          <Moon size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-90 scale-75 opacity-50" : "rotate-0 scale-110 opacity-100"}`} aria-hidden="true" />
          <span className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${isLightMode ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60" : "translate-x-0 bg-cyan-200 shadow-lg shadow-cyan-200/50"}`}>
            <span className="absolute inset-0 rounded-full bg-white/30 transition-opacity duration-700 group-hover:opacity-80" />
          </span>
        </button>
        </div>

        {/* Page heading */}
        <div className="admin-dashboard-reveal mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end" style={{ "--dashboard-delay": "180ms" }}>
          <div>
            

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Agency Members
            </h1>

            <p className="mt-3 text-white/60">
              View or remove members belonging
              to the selected agency.
            </p>
          </div>

          <div className="admin-glass-card w-full max-w-sm rounded-2xl border border-white/20 px-6 py-4 text-white shadow-xl md:min-w-[18rem]">
            <p className="text-sm text-white/50">
              Selected Agency
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {selectedAgency.name}
            </h2>

            <p className="mt-1 text-sm text-cyan-200">
              {selectedAgency.department}
            </p>
          </div>
        </div>

        <div className="admin-dashboard-reveal mt-8 grid gap-4 sm:grid-cols-3" style={{ "--dashboard-delay": "280ms" }}>
          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between"><p className="text-sm text-white/60">Total members</p><Users size={18} className="text-cyan-200" aria-hidden="true" /></div>
            <p className="mt-3 text-3xl font-bold">{agencyMembers.length}</p>
            <p className="mt-1 text-xs text-white/50">Assigned to this agency</p>
          </div>
          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between"><p className="text-sm text-white/60">Agency admins</p><ShieldCheck size={18} className="text-amber-200" aria-hidden="true" /></div>
            <p className="mt-3 text-3xl font-bold">{agencyAdmins}</p>
            <p className="mt-1 text-xs text-white/50">With management access</p>
          </div>
          <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
            <div className="flex items-center justify-between"><p className="text-sm text-white/60">Showing now</p><Search size={18} className="text-emerald-300" aria-hidden="true" /></div>
            <p className="mt-3 text-3xl font-bold">{filteredMembers.length}</p>
            <p className="mt-1 text-xs text-white/50">Matches your search</p>
          </div>
        </div>

        <div className="admin-dashboard-reveal mt-8 flex items-center justify-between gap-4" style={{ "--dashboard-delay": "380ms" }}>
          <h2 className="text-xl font-bold text-white">Member directory</h2>
          <button type="button" onClick={() => navigate("/admin/agency-members/add")} className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/20 hover:text-white">
            <UserPlus size={16} aria-hidden="true" />
            Add member
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 font-bold text-emerald-200">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-300/20 bg-red-300/10 p-4 font-bold text-red-200">
            {error}
          </div>
        )}

        {/* Search and count */}
        <section className="admin-dashboard-reveal admin-glass-card mt-7 rounded-2xl border border-white/20 p-5 text-white shadow-xl" style={{ "--dashboard-delay": "460ms" }}>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search member by name, email or phone"
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 pl-11 text-white outline-none backdrop-blur-xl placeholder:text-white/40 focus:border-cyan-200/70"
            />
            {searchText && (
              <button type="button" onClick={() => setSearchText("")} aria-label="Clear member search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white">
                <X size={16} aria-hidden="true" />
              </button>
            )}
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
              <div className="member-count-badge flex items-center justify-center gap-2 rounded-xl px-4 py-3 sm:justify-start">
                <Users size={16} aria-hidden="true" />
                <span className="text-sm font-semibold">
                  Members
                </span>
                <strong className="member-count-value">{filteredMembers.length}</strong>
              </div>
              <button type="button" onClick={() => setSortOrder((currentOrder) => currentOrder === "name" ? "role" : "name")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/15 hover:text-white sm:justify-start" aria-label="Change member sort order">
                <ArrowUpDown size={16} aria-hidden="true" />
                {sortOrder === "name" ? "A-Z" : "Role"}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/45">Filter role</span>
            {[["all", "All members"], ["AGENCY_MEMBER", "Agency members"], ["AGENCY_ADMIN", "Agency admins"]].map(([value, label]) => (
              <button key={value} type="button" onClick={() => setRoleFilter(value)} aria-pressed={roleFilter === value} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${roleFilter === value ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Member list */}
        <section className="admin-dashboard-reveal mt-6 grid gap-4" style={{ "--dashboard-delay": "540ms" }}>
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="admin-glass-card group flex flex-col justify-between gap-5 rounded-2xl border border-white/20 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                {/* Member profile icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/15 text-xl font-bold text-cyan-100">
                  {member.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {member.fullName}
                  </h2>

                  <a href={`mailto:${member.email}`} className="mt-1 block text-sm text-white/60 transition hover:text-cyan-200">
                    <Mail size={14} className="mr-1.5 inline text-cyan-200/70" aria-hidden="true" />
                    {member.email}
                  </a>

                  <a href={`tel:${member.phone}`} className="mt-1 block text-sm text-white/60 transition hover:text-cyan-200">
                    <Phone size={14} className="mr-1.5 inline text-cyan-200/70" aria-hidden="true" />
                    {member.phone}
                  </a>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      member.role ===
                      "AGENCY_ADMIN"
                        ? "bg-violet-300/15 text-violet-200"
                        : "bg-cyan-300/15 text-cyan-200"
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
                className="admin-danger-action inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-500/15 px-5 py-3 font-bold text-red-100 transition hover:border-red-200/60 hover:bg-red-500/30"
              >
                <UserMinus size={16} aria-hidden="true" />
                Delete Member
              </button>
            </article>
          ))}

          {filteredMembers.length === 0 && (
            <div className="admin-glass-card rounded-2xl border border-white/20 p-10 text-center text-white shadow-xl">
              <Users size={30} className="mx-auto text-cyan-200/70" aria-hidden="true" />

              <h2 className="mt-4 text-xl font-bold">
                No Members Found
              </h2>

              <p className="mt-2 text-white/60">
                This agency has no matching
                registered members.
              </p>
            </div>
          )}
        </section>
      </section>

      {/* Delete confirmation popup */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm">
          <section className="admin-glass-card w-full max-w-md rounded-2xl border border-white/25 p-7 text-white shadow-2xl shadow-black/40" role="dialog" aria-modal="true" aria-labelledby="delete-member-title">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-200">
              <ShieldAlert size={24} aria-hidden="true" />
            </div>

            <h2 id="delete-member-title" className="mt-5 text-2xl font-bold">
              Delete Agency Member?
            </h2>

            <p className="mt-3 leading-7 text-white/60">
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
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="admin-danger-action admin-confirm-remove inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-bold text-white"
              >
                <UserMinus size={16} aria-hidden="true" />
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
