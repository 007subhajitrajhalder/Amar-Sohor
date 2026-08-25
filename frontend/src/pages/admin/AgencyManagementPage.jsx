import { Link } from "react-router-dom";

function AgencyManagementPage() {
  const agencies = [
    {
      id: 1,
      name: "KMC SWM Department",
      department:
        "Solid Waste Management",
      memberCount: 18,
      icon: "🗑️"
    },
    {
      id: 2,
      name: "KMC Sanitation Department",
      department:
        "Public Sanitation",
      memberCount: 12,
      icon: "🚻"
    },
    {
      id: 3,
      name: "KMC Water Department",
      department:
        "Water Services",
      memberCount: 15,
      icon: "💧"
    },
    {
      id: 4,
      name: "Kolkata Police",
      department:
        "Parking Management",
      memberCount: 21,
      icon: "🅿️"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Admin Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Agency Management
            </h1>

            <p className="mt-2 text-slate-600">
              Select an agency to view and
              manage its registered members.
            </p>
          </div>

          <Link
            to="/admin/agency-members/add"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-center font-bold text-white"
          >
            Add New Agency Member
          </Link>
        </div>

        {/* Agency cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {agencies.map((agency) => (
            <article
              key={agency.id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  {agency.icon}
                </div>

                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    Agency #{agency.id}
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {agency.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {agency.department}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Registered Members
                  </p>

                  <p className="text-2xl font-bold">
                    {agency.memberCount}
                  </p>
                </div>

                <Link
                  to={`/admin/agencies/${agency.id}/members`}
                  className="rounded-xl border border-emerald-700 px-5 py-3 font-bold text-emerald-700 transition hover:bg-emerald-700 hover:text-white"
                >
                  View Members
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AgencyManagementPage;