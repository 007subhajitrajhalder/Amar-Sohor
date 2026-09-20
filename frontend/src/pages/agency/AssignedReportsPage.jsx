import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

function AssignedReportsPage() {
  const navigate = useNavigate();
  
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
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b]" : "bg-slate-100"
      }`}
    >
      {isDarkMode && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(125px)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 border-b px-5 py-4 backdrop-blur-2xl md:px-10 ${
          isDarkMode
            ? "border-white/10 bg-[#100e0b]/80"
            : "border-slate-300 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className={`h-11 w-11 rounded-full border object-cover ${
                isDarkMode ? "border-lime-300/20 bg-transparent" : "border-slate-300 bg-white"
              }`}
            />
            <h1 className="text-xl font-bold md:text-2xl">
              <span className={isDarkMode ? "text-white" : "text-slate-900"}>Amar </span>
              <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              className={`group inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isDarkMode
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{isDarkMode ? "☀️" : "🌙"}</span>
              <span className="hidden sm:inline">{isDarkMode ? "Light mode" : "Dark mode"}</span>
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
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate("/agency/dashboard")}
            type="button"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-800"
            }`}
          >
            <span>&larr;</span> Back to Dashboard
          </button>
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
        </div>
        
          <section className="mt-4 pb-4">
            

            <div
              className={`mt-0 overflow-hidden rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-colors ${
                isDarkMode
                  ? "border-white/20 bg-white/5 shadow-cyan-950/20"
                  : "border-slate-200 bg-white/80 shadow-slate-300/40"
              }`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
      </main>
    </div>
  );
}

export default AssignedReportsPage;