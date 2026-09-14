import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AssignedReportsPage() {
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

  const reports = [
    {
      id: 1,
      title: "Public Toilet Needs Cleaning",
      status: "Pending",
    },
    {
      id: 2,
      title: "Water Supply Unavailable",
      status: "Under Investigation",
    },
  ];

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b]" : "bg-slate-100"
      }`}
    >
      {isDarkMode && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(125px)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

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
              Assigned Reports
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              View complaints assigned to your agency and begin investigating
              them.
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
              className={`relative h-6 w-11 rounded-full p-1 ${
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

        <div className="mt-7 grid gap-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className={`group flex items-center justify-between rounded-2xl border p-6 shadow-xl ring-1 ring-inset backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isDarkMode
                  ? "border-white/30 bg-white/5 shadow-cyan-950/20 ring-white/15 hover:border-cyan-200/40 hover:bg-white/10"
                  : "border-slate-200 bg-white/85 shadow-slate-300/40 ring-white hover:border-cyan-300 hover:bg-white"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-cyan-200/60" : "text-cyan-700"
                  }`}
                >
                  Report #{report.id}
                </p>

                <h2
                  className={`mt-1 text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {report.title}
                </h2>

                <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  <span
                    className={`${
                      isDarkMode
                        ? report.status === "Pending"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                          : "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
                        : report.status === "Pending"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-cyan-200 bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              <Link
                to={`/agency/reports/${report.id}/investigate`}
                className={`self-center rounded-xl border px-5 py-3 text-center text-sm font-bold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? "border-emerald-200/30 bg-emerald-500/20 text-emerald-100 shadow-emerald-950/20 hover:bg-emerald-500/30 hover:text-white"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-200/40 hover:bg-emerald-100 hover:text-emerald-800"
                }`}
              >
                Investigate
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AssignedReportsPage;