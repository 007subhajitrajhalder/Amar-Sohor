import { Link } from "react-router-dom";

function AgencyDashboardPage() {
  const statistics = [
    {
      title: "Pending",
      value: "18",
      color: "text-yellow-600",
      background: "bg-yellow-50"
    },
    {
      title: "Under Investigation",
      value: "9",
      color: "text-blue-600",
      background: "bg-blue-50"
    },
    {
      title: "Resolved",
      value: "126",
      color: "text-green-600",
      background: "bg-green-50"
    },
    {
      title: "Facilities",
      value: "64",
      color: "text-purple-600",
      background: "bg-purple-50"
    }
  ];

  const navigationCards = [
    {
      title: "Assigned Reports",
      description:
        "View complaints assigned to your agency and begin investigating them.",
      icon: "📋",
      route: "/agency/reports",
      buttonText: "View Assigned Reports"
    },
    {
      title: "Previously Resolved",
      description:
        "View complaints that have already been resolved by your agency.",
      icon: "✅",
      route: "/agency/resolved",
      buttonText: "View Resolved Reports"
    },
    {
      title: "Facility Management",
      description:
        "View, add and manage public facilities belonging to your agency.",
      icon: "🏢",
      route: "/agency/facilities",
      buttonText: "Manage Facilities"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        {/* Dashboard heading */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Agency Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Agency Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            View agency complaints and facility
            information.
          </p>
        </div>

        {/* Statistics cards */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Agency Overview
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((statistic) => (
              <article
                key={statistic.title}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <div
                  className={`inline-flex rounded-xl px-3 py-2 ${statistic.background}`}
                >
                  <p
                    className={`text-sm font-bold ${statistic.color}`}
                  >
                    {statistic.title}
                  </p>
                </div>

                <h3 className="mt-4 text-3xl font-bold text-slate-900">
                  {statistic.value}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Total {statistic.title.toLowerCase()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Page navigation cards */}
        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Agency Operations
            </h2>

            <p className="mt-2 text-slate-600">
              Select an operation to continue.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {navigationCards.map((card) => (
              <article
                key={card.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  {card.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {card.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>

                <Link
                  to={card.route}
                  className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-center font-bold text-white transition hover:bg-emerald-800"
                >
                  {card.buttonText}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AgencyDashboardPage;