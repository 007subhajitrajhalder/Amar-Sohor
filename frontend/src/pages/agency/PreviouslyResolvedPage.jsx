import { useEffect, useState } from "react";
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

function PreviouslyResolvedPage() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light",
  );

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkMode(localStorage.getItem("agencyTheme") !== "light");
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("agencyThemeChange", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("agencyThemeChange", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("agencyTheme", nextTheme);
    setIsDarkMode(nextTheme === "dark");
    window.dispatchEvent(new Event("agencyThemeChange"));
  };

  const resolvedReports = [
    {
      id: "#1001",
      facility: "Gariahat Dustbin",
      date: "15 August 2026",
      status: "Resolved"
    }
  ];

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {auraLayers.map((layer, index) => (
        <div
          key={`dark-${index}`}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${!isDarkMode && "hidden"}`}
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
        <div className="mb-6">
          <Link
            to="/agency"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-800"
            }`}
          >
            <span>&larr;</span> Back to Dashboard
          </Link>
        </div>
        
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-widest ${
                isDarkMode ? "text-cyan-100/60" : "text-cyan-700"
              }`}
            >
              Agency Portal
            </p>

            <h1
              className={`mt-2 text-3xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Previously Resolved Reports
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              View complaints that have already been resolved by your agency.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
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

        <div
          className={`mt-8 overflow-x-auto rounded-3xl border shadow-xl backdrop-blur-xl transition-colors duration-300 ${
            isDarkMode
              ? "border-white/20 bg-white/5 shadow-cyan-950/20"
              : "border-slate-200 bg-white/80 shadow-slate-300/40"
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b ${
                  isDarkMode ? "border-white/20" : "border-slate-200"
                }`}
              >
                <th
                  className={`p-5 text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Report
                </th>
                <th
                  className={`p-5 text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Facility
                </th>
                <th
                  className={`p-5 text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Completion Date
                </th>
                <th
                  className={`p-5 text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {resolvedReports.map((report) => (
                <tr
                  key={report.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isDarkMode
                      ? "border-white/10 hover:bg-white/5"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td
                    className={`p-5 font-semibold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {report.id}
                  </td>
                  <td
                    className={`p-5 ${
                      isDarkMode ? "text-white/80" : "text-slate-700"
                    }`}
                  >
                    {report.facility}
                  </td>
                  <td
                    className={`p-5 ${
                      isDarkMode ? "text-white/80" : "text-slate-700"
                    }`}
                  >
                    {report.date}
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                        isDarkMode
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default PreviouslyResolvedPage;