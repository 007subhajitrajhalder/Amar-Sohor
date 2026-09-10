import { useState } from "react";
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
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      buttonText: "Manage Facilities",
      addFacilityRoute: "/agency/facilities/add"
    },
    {
      title: "Assigned Recommendations",
      description:
        "Review citizen facility proposals allocated to you, conduct field investigations, and approve or reject them.",
      icon: "💡",
      route: "/agency/recommendations",
      buttonText: "View Recommendations"
    }
  ];

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#100e0b] text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
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

      <section
        className={`relative z-10 mx-auto max-w-6xl ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {/* Dashboard heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-100/60">
            Agency Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Agency Dashboard
          </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              View agency complaints and facility information.
            </p>
          </div>

          {/* Light / dark mode toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode((current) => !current)}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            className={`group inline-flex items-center gap-3 self-start rounded-full border px-3 py-2 text-sm font-semibold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
              isDarkMode
                ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="text-base">{isDarkMode ? "☀️" : "🌙"}</span>
            <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
            <span
              className={`relative h-6 w-11 rounded-full p-1 transition-colors ${
                isDarkMode ? "bg-cyan-500/70" : "bg-slate-300"
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  isDarkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
          </button>
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
                className={`group relative h-full overflow-hidden rounded-2xl border p-6 shadow-xl ring-1 ring-inset backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${
                  isDarkMode
                    ? "border-white/30 bg-white/5 shadow-cyan-950/25 ring-white/15 hover:border-cyan-200/40 hover:bg-white/10 hover:shadow-cyan-900/40"
                    : "border-slate-200 bg-white/80 shadow-slate-300/50 ring-white hover:border-cyan-300 hover:bg-white hover:shadow-cyan-200/50"
                }`}
              >
                <div
                  className={`inline-flex rounded-xl border border-white/10 px-3 py-2 ${statistic.background}`}
                >
                  <p className={`text-sm font-bold ${
                      isDarkMode
                        ? statistic.color
                        : statistic.title === "Pending"
                          ? "text-amber-700"
                          : statistic.title === "Under Investigation"
                            ? "text-cyan-700"
                            : statistic.title === "Resolved"
                              ? "text-emerald-700"
                              : "text-purple-700"
                    }`}>
                    {statistic.title}
                  </p>
                </div>

                <h3
                  className={`mt-4 text-4xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {statistic.value}
                </h3>

                <p
                  className={`mt-2 text-xs font-medium ${
                    isDarkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Total {statistic.title.toLowerCase()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Page navigation cards */}
        <section className="mt-10">
          <div>
            <h2
              className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Agency Operations
            </h2>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Select an operation to continue.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {navigationCards.map((card) => (
              <article
                key={card.title}
                className={`group flex h-full min-h-64 flex-col rounded-2xl border p-6 shadow-xl ring-1 ring-inset backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isDarkMode
                    ? "border-white/30 bg-white/5 text-white shadow-cyan-950/20 ring-white/15 hover:border-cyan-200/40 hover:bg-white/10 hover:shadow-cyan-900/30"
                    : "border-slate-200 bg-white/85 text-slate-900 shadow-slate-300/40 ring-white hover:border-cyan-300 hover:bg-white hover:shadow-cyan-200/50"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl shadow-lg shadow-cyan-950/20">
                  {card.icon}
                </div>

                <h3
                  className={`mt-5 text-xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {card.title}
                </h3>

                <p
                  className={`mt-3 flex-1 text-sm leading-6 ${
                    isDarkMode ? "text-white/60" : "text-slate-600"
                  }`}
                >
                  {card.description}
                </p>

                <Link
                  to={card.route}
                  className={`mt-6 rounded-xl border px-5 py-3 text-center text-sm font-bold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDarkMode
                      ? "border-cyan-200/30 bg-cyan-300/10 text-cyan-100 shadow-cyan-950/20 hover:bg-cyan-300/20 hover:text-white"
                      : "border-cyan-300 bg-cyan-50 text-cyan-700 shadow-cyan-200/40 hover:bg-cyan-100 hover:text-cyan-800"
                  }`}
                >
                  {card.buttonText}
                </Link>

                {card.addFacilityRoute && (
                  <Link
                    to={card.addFacilityRoute}
                    className={`mt-3 rounded-xl border px-5 py-3 text-center text-sm font-bold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                      isDarkMode
                        ? "border-lime-300/30 bg-lime-300/10 text-lime-200 shadow-lime-950/20 hover:bg-lime-300/20 hover:text-white"
                        : "border-lime-300 bg-lime-50 text-lime-700 shadow-lime-200/40 hover:bg-lime-100 hover:text-lime-800"
                    }`}
                  >
                    Add New Facility
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Status analysis */}
        <section className="mt-12 pb-4">
          <div>
            <h2
              className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Report Status Analysis
            </h2>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Current distribution of agency reports by workflow status.
            </p>
          </div>

          <div
            className={`mt-6 overflow-hidden rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-colors ${
              isDarkMode
                ? "border-white/20 bg-white/5 shadow-cyan-950/20"
                : "border-slate-200 bg-white/80 shadow-slate-300/40"
            }`}
          >
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              {[
                { title: "Pending", value: 18, icon: "⏳", color: "amber" },
                {
                  title: "Under Investigation",
                  value: 9,
                  icon: "🔎",
                  color: "cyan"
                },
                { title: "Resolved", value: 126, icon: "✓", color: "emerald" }
              ].map((status, index, items) => (
                <div key={status.title} className="flex flex-1 items-center">
                  <div
                    className={`w-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                      isDarkMode
                        ? "border-white/10 bg-black/10 hover:bg-white/10"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                          status.color === "amber"
                            ? "bg-amber-300/15 text-amber-500"
                            : status.color === "cyan"
                              ? "bg-cyan-300/15 text-cyan-500"
                              : "bg-emerald-300/15 text-emerald-500"
                        }`}
                      >
                        {status.icon}
                      </span>
                      <span
                        className={`text-3xl font-black ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {status.value}
                      </span>
                    </div>
                    <p
                      className={`mt-4 text-sm font-bold ${
                        isDarkMode ? "text-white/80" : "text-slate-700"
                      }`}
                    >
                      {status.title}
                    </p>
                  </div>

                  {index < items.length - 1 && (
                    <div
                      aria-hidden="true"
                      className={`mx-3 hidden h-px w-8 shrink-0 md:block ${
                        isDarkMode ? "bg-white/20" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-7">
              <div
                className={`mb-2 flex justify-between text-xs font-semibold ${
                  isDarkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                <span>Workflow distribution</span>
                <span>153 total reports</span>
              </div>
              <div
                className={`flex h-3 overflow-hidden rounded-full ${
                  isDarkMode ? "bg-white/10" : "bg-slate-200"
                }`}
              >
                <div className="w-[12%] bg-amber-400 transition-all duration-500" />
                <div className="w-[6%] bg-cyan-400 transition-all duration-500" />
                <div className="w-[82%] bg-emerald-400 transition-all duration-500" />
              </div>
              <div
                className={`mt-3 flex flex-wrap gap-5 text-xs font-medium ${
                  isDarkMode ? "text-white/60" : "text-slate-600"
                }`}
              >
                <span>● Pending — 12%</span>
                <span>● Under Investigation — 6%</span>
                <span>● Resolved — 82%</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AgencyDashboardPage;
