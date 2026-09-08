import { Link } from "react-router-dom";

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

function AgencyDashboardPage() {
  const statistics = [
    {
      title: "Pending",
      value: "18",
      color: "text-amber-200",
      background: "bg-amber-300/15"
    },
    {
      title: "Under Investigation",
      value: "9",
      color: "text-cyan-200",
      background: "bg-cyan-300/15"
    },
    {
      title: "Resolved",
      value: "126",
      color: "text-emerald-200",
      background: "bg-emerald-300/15"
    },
    {
      title: "Facilities",
      value: "64",
      color: "text-purple-200",
      background: "bg-purple-300/15"
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
      title: "Previously Resolved Cases",
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
    <main className="relative min-h-screen overflow-hidden bg-[#100e0b] p-6">
      {auraLayers.map((layer, index) => (
        <div
          key={`dark-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)"
          }}
        />
      ))}

      <section className="relative z-10 mx-auto max-w-6xl text-white">
        {/* Dashboard heading */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-100/60">
            Agency Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Agency Dashboard
          </h1>

          <p className="mt-2 text-sm text-white/60">
            View agencies complaints and facility information.
          </p>
        </div>

        {/* Statistics cards */}
        <section className="mt-8">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Agency Overview
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((statistic) => (
              <article
                key={statistic.title}
                className="relative h-full overflow-hidden rounded-2xl border border-white/30 bg-white/5 p-6 shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl transition"
              >
                <div
                  className={`inline-flex rounded-xl border border-white/10 px-3 py-2 ${statistic.background}`}
                >
                  <p className={`text-sm font-bold ${statistic.color}`}>
                    {statistic.title}
                  </p>
                </div>

                <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
                  {statistic.value}
                </h3>

                <p className="mt-2 text-xs font-medium text-white/50">
                  Total {statistic.title.toLowerCase()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Page navigation cards */}
        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Agency Operations
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Select an operation to continue.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {navigationCards.map((card) => (
              <article
                key={card.title}
                className="group flex h-full min-h-64 flex-col rounded-2xl border border-white/30 bg-white/5 p-6 text-white shadow-xl shadow-cyan-950/20 ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl shadow-lg shadow-cyan-950/20">
                  {card.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                  {card.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-white/60">
                  {card.description}
                </p>

                <Link
                  to={card.route}
                  className="mt-6 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-5 py-3 text-center text-sm font-bold text-cyan-100 shadow-lg shadow-cyan-950/20 backdrop-blur-xl transition hover:bg-cyan-300/20 hover:text-white"
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
