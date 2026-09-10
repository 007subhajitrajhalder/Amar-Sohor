import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ReportInvestigationPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [investigationNotes, setInvestigationNotes] = useState("");
  const [status, setStatus] = useState("Pending");

  const [isDark, setIsDark] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(localStorage.getItem("agencyTheme") !== "light");
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("agencyThemeChange", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("agencyThemeChange", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    localStorage.setItem("agencyTheme", nextTheme);
    setIsDark(!isDark);
    window.dispatchEvent(new Event("agencyThemeChange"));
  };

  const handleStartInvestigation = () => {
    setStatus("Under Investigation");
    alert("Report status changed to Under Investigation");
  };

  const handleGoToResolution = () => {
    navigate(`/agency/reports/${reportId}/resolution`);
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-4 transition-colors duration-500 sm:p-6 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Ambient dashboard-style background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-400/20"
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl ${
            isDark ? "bg-emerald-500/10" : "bg-emerald-400/20"
          }`}
        />
      </div>

      <section className="relative mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <Link
            to="/agency/reports"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-800"
            }`}
          >
            <span>&larr;</span> Back to Assigned Reports
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${
              isDark
                ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            {isDark ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div
          className={`rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-colors duration-500 sm:p-8 ${
            isDark
              ? "border-white/10 bg-white/[0.07] shadow-black/30"
              : "border-slate-200 bg-white/90 shadow-slate-300/50"
          }`}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p
                className={`font-bold ${
                  isDark ? "text-emerald-300" : "text-emerald-700"
                }`}
              >
                Report #{reportId}
              </p>

              <h1
                className={`mt-2 text-3xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Report Investigation
              </h1>
            </div>

            <span
              className={`self-start rounded-full px-4 py-2 text-sm font-bold ${
                status === "Pending"
                  ? isDark
                    ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/20"
                    : "bg-amber-100 text-amber-800"
                  : isDark
                    ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20"
                    : "bg-cyan-100 text-cyan-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Complaint information */}
            <section
              className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:shadow-cyan-500/10"
                  : "border-slate-200 bg-white/80 hover:bg-white hover:shadow-slate-300/60"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Complaint Details
              </h2>

              <div className="mt-5 grid gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Report Title
                  </p>

                  <p className="font-bold">Water Not Available</p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Facility
                  </p>

                  <p className="font-bold">College Street Public Toilet</p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Description
                  </p>

                  <p
                    className={isDark ? "text-slate-300" : "text-slate-700"}
                  >
                    The facility currently has no running water.
                  </p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Citizen Evidence
                  </p>

                  <div
                    className={`mt-2 flex h-48 items-center justify-center rounded-xl border text-sm ${
                      isDark
                        ? "border-white/10 bg-slate-900/60 text-slate-400"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    Complaint photograph
                  </div>
                </div>
              </div>
            </section>

            {/* Investigation section */}
            <section
              className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:shadow-cyan-500/10"
                  : "border-slate-200 bg-white/80 hover:bg-white hover:shadow-slate-300/60"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Investigation
              </h2>

              <form className="mt-5 grid gap-5">
                <label>
                  <span className="font-bold">Investigation Notes</span>

                  <textarea
                    value={investigationNotes}
                    onChange={(event) => setInvestigationNotes(event.target.value)}
                    placeholder="Enter investigation notes"
                    className={`mt-2 min-h-36 w-full rounded-xl border p-3 outline-none transition-all duration-300 focus:ring-2 ${
                      isDark
                        ? "border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500/40 focus:ring-cyan-500/20"
                    }`}
                  />
                </label>

                {status === "Pending" && (
                  <button
                    type="button"
                    onClick={handleStartInvestigation}
                    className={`rounded-xl p-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                      isDark
                        ? "bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/20"
                        : "bg-blue-700 hover:bg-blue-600 hover:shadow-blue-500/20"
                    }`}
                  >
                    Start Investigation
                  </button>
                )}

                {status === "Under Investigation" && (
                  <button
                    type="button"
                    onClick={handleGoToResolution}
                    className="rounded-xl bg-emerald-700 p-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20"
                  >
                    Upload Resolution
                  </button>
                )}
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ReportInvestigationPage;