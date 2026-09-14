import { Activity, ArrowLeft, Moon, Search, ShieldCheck, Sun, UserCheck, UserMinus, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdminTheme } from "./useAdminTheme";

function UserManagementPage() {
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [removedUser, setRemovedUser] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("amar-sohor-admin-users");
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch {
        localStorage.removeItem("amar-sohor-admin-users");
      }
    }

    return [
    {
      id: 1,
      name: "Ananya Sen",
      email: "ananya@example.com",
      role: "Citizen",
      lastActive: "Active now",
      verified: true
    },
    {
      id: 2,
      name: "Rahul Das",
      email: "rahul@example.com",
      role: "Citizen",
      lastActive: "12 min ago",
      verified: true
    }
    ];
  });

  useEffect(() => {
    localStorage.setItem("amar-sohor-admin-users", JSON.stringify(users));
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "verified" && user.verified);
    return matchesSearch && matchesFilter;
  });

  const removeUser = (user) => {
    setPendingRemoval(user);
  };

  const confirmRemoveUser = () => {
    if (!pendingRemoval) return;
    setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== pendingRemoval.id));
    setRemovedUser(pendingRemoval.name);
    setPendingRemoval(null);
  };

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
      <div
        className="pointer-events-none absolute inset-0 blur-[125px] md:blur-[180px]"
        style={{
          background:
            "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 blur-[50px] md:blur-[72px]"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
          mixBlendMode: "screen",
          opacity: isLightMode ? 0 : 1
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(148,190,194,0.09) 34%, rgb(214,215,209) 66%, rgb(103,159,168) 82%, rgb(65,101,119) 100%)",
          mixBlendMode: "multiply",
          filter: "blur(90px)",
          opacity: isLightMode ? 1 : 0
        }}
        aria-hidden="true"
      />
      <div className="relative z-[1]">
        <section className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>

            <button
              type="button"
              onClick={() => setIsLightMode((currentMode) => !currentMode)}
              aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
              className={`relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${isLightMode ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"}`}
            >
              <Sun size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-0 scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"}`} aria-hidden="true" />
              <Moon size={13} className={`transition-all duration-700 ease-in-out ${isLightMode ? "rotate-90 scale-75 opacity-50" : "rotate-0 scale-110 opacity-100"}`} aria-hidden="true" />
              <span className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${isLightMode ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60" : "translate-x-0 bg-cyan-200 shadow-lg shadow-cyan-200/50"}`} />
            </button>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-end">
            <div>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                User Management
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Review registered citizens and manage access to the city platform.
              </p>
            </div>

            <div className="admin-glass-card admin-user-glass-card flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 text-white">
              <Users size={19} className="text-cyan-200" aria-hidden="true" />
              <div>
                <p className="text-xs text-white/50">Registered users</p>
                <p className="mt-0.5 text-lg font-bold">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Total accounts</p>
                <Users size={18} className="text-cyan-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{users.length}</p>
              <p className="mt-1 text-xs text-emerald-300">+8.4% this month</p>
            </div>
            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Verified citizens</p>
                <UserCheck size={18} className="text-emerald-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">{users.filter((user) => user.verified).length}</p>
              <p className="mt-1 text-xs text-white/50">Identity checks complete</p>
            </div>
            <div className="admin-glass-card rounded-2xl border border-white/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Currently active</p>
                <Activity size={18} className="text-amber-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold">1</p>
              <p className="mt-1 text-xs text-white/50">Across the last 15 minutes</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email"
                aria-label="Search users by name or email"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/40 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>
            <div className="flex items-center gap-2" aria-label="Filter users">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${filter === "all" ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={filter === "all"}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("verified")}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${filter === "verified" ? "border-cyan-200/60 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"}`}
                aria-pressed={filter === "verified"}
              >
                Verified
              </button>
            </div>
          </div>

          {removedUser && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100" role="status">
              <span>{removedUser} was removed from the user list.</span>
              <button type="button" onClick={() => setRemovedUser("")} aria-label="Dismiss notification" className="text-emerald-200 transition hover:text-white">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          {pendingRemoval && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm" role="presentation">
              <div className="admin-glass-card w-full max-w-md rounded-2xl border border-white/25 p-6 text-white shadow-2xl shadow-black/40" role="dialog" aria-modal="true" aria-labelledby="remove-user-title">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-200">
                  <UserMinus size={20} aria-hidden="true" />
                </div>
                <h2 id="remove-user-title" className="mt-5 text-xl font-bold">Remove {pendingRemoval.name}?</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">This will remove the account from the local admin list. This action cannot be undone here.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setPendingRemoval(null)} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRemoveUser}
                    className="admin-danger-action admin-confirm-remove inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <UserMinus size={16} aria-hidden="true" />
                    Confirm remove
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-4">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="admin-glass-card admin-user-glass-card group flex flex-col justify-between gap-5 rounded-2xl border border-white/20 p-5 text-white shadow-xl shadow-cyan-950/25 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40 sm:flex-row sm:items-center sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/15 text-lg font-bold text-cyan-100">
                    {user.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">
                        {user.name}
                      </h2>
                      <ShieldCheck size={16} className="text-emerald-300/80" aria-label="Verified user" />
                    </div>

                    <p className="mt-1 text-sm text-white/60">
                      {user.email}
                    </p>
                    <p className="mt-2 text-xs text-white">{user.role} · {user.lastActive}</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${user.name}`}
                  onClick={() => removeUser(user)}
                  className="admin-danger-action inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-500 px-4 py-2.5 text-sm font-bold text-red-100 transition hover:border-red-200/60 hover:bg-red-500/30"
                >
                  <UserMinus size={16} aria-hidden="true" />
                  Remove
                </button>
              </article>
            ))}
            {filteredUsers.length === 0 && (
              <div className="admin-glass-card rounded-2xl border border-white/20 px-6 py-12 text-center text-white">
                <Search size={24} className="mx-auto text-cyan-200/70" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-bold">No users found</h2>
                <p className="mt-2 text-sm text-white/55">Try a different name, email, or filter.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserManagementPage;
