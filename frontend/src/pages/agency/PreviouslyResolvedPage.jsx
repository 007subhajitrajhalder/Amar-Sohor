import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { displayDate, mediaUrl, apiRequest } from "../../api/client";

function Pagination({ total = 0, offset, limit = 50, onChange, disabled, showCount = true }) {
  return (
    <nav aria-label="Pagination" className={`my-5 flex items-center gap-3 text-sm ${showCount ? "justify-between" : "justify-end"}`}>
      <button
        type="button"
        disabled={disabled || offset === 0}
        className="rounded-xl border px-4 py-2 disabled:opacity-40"
        onClick={() => onChange(Math.max(0, offset - limit))}
      >
        Previous
      </button>
      {showCount && <span>{total ? offset + 1 : 0}-{Math.min(offset + limit, total)} of {total}</span>}
      <button
        type="button"
        disabled={disabled || offset + limit >= total}
        className="rounded-xl border px-4 py-2 disabled:opacity-40"
        onClick={() => onChange(offset + limit)}
      >
        Next
      </button>
    </nav>
  );
}

function ResolvedReportDetails({ id, onClose, onReopened }) {
  const resource = useApi("/agencies/reports/resolved/" + id);
  const data = resource.data;
  const [reopening, setReopening] = useState(false);
  const [reopenError, setReopenError] = useState("");

  const handleReopen = async () => {
    setReopening(true);
    setReopenError("");
    try {
      await apiRequest("/reports/" + id + "/reopen", { method: "POST" });
      if (onReopened) onReopened();
      onClose();
    } catch (err) {
      setReopenError(err.message);
    } finally {
      setReopening(false);
    }
  };

  return (
    <section aria-label="Resolved report details" className="my-5 rounded-2xl border p-5">
      <button type="button" onClick={onClose} className="float-right underline">Close details</button>
      <ApiState {...resource} />
      {reopenError && <p className="text-xs text-rose-400 mb-2">{reopenError}</p>}
      {data && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">#{data.report_id}: {data.title}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              data.status === "REJECTED" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              {data.status === "REJECTED" ? "Rejected" : "Resolved"}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">{data.facility_name}</p>
          <p className="my-3 text-sm">{data.description}</p>
          <p className="text-xs text-white/50">{data.status === "REJECTED" ? "Rejected: " : "Resolved: "} {displayDate(data.resolved_at)}</p>

          {data.resolution_description && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs">
              <p className="font-bold text-white/80">{data.status === "REJECTED" ? "Agency Rejection Reason:" : "Resolution Details:"}</p>
              <p className="mt-1 whitespace-pre-wrap text-white/70">{data.resolution_description}</p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.photo_url && (
              <div>
                <p className="text-xs font-semibold text-white/60 mb-1">Citizen Complaint Photograph</p>
                <img className="max-h-64 rounded-xl border border-white/10 w-full object-cover" src={mediaUrl(data.photo_url)} alt="Reported issue" />
              </div>
            )}
            {data.resolution_photo_url ? (
              <div>
                <p className="text-xs font-semibold text-white/60 mb-1">
                  {data.status === "REJECTED" ? "Resolution Record Photograph (Complaint Evidence)" : "Resolution Proof Photograph"}
                </p>
                <img className="max-h-64 rounded-xl border border-white/10 w-full object-cover" src={mediaUrl(data.resolution_photo_url)} alt="Resolution evidence" />
              </div>
            ) : data.status !== "REJECTED" ? (
              <div className="flex items-center justify-center p-4 border border-white/10 rounded-xl">
                <p className="text-sm opacity-60">No approved resolution photo recorded.</p>
              </div>
            ) : null}
          </div>

          {data.status === "REJECTED" && (
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                disabled={reopening}
                onClick={handleReopen}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-50"
              >
                {reopening ? "Reopening..." : "Reopen Case for Investigation"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

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

  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const resource = useApi("/agencies/reports/resolved?" + new URLSearchParams({ search, offset: String(offset), limit: "50", mine: "true" }));
  const resolvedReports = (resource.data?.items || []).map(report => ({
    id: report.report_id, title: report.title, facility: report.facility_name,
    date: displayDate(report.resolved_at),
    status: report.status === "REJECTED" ? "Rejected" : "Resolved",
    rawStatus: report.status
  }));

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Fixed Background Layers */}
      {auraLayers.map((layer, index) => (
        <div
          key={`dark-${index}`}
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 ${!isDarkMode && "hidden"}`}
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)"
          }}
        />
      ))}

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
        <ApiState {...resource} />
        <input aria-label="Search resolved reports" maxLength={150} value={search}
          onChange={event => { setSearch(event.target.value); setOffset(0); }} placeholder="Search resolved complaints..."
          className="mb-5 w-full rounded-xl border bg-transparent p-3" />
        {selectedReport && <ResolvedReportDetails id={selectedReport} onClose={() => setSelectedReport(null)} onReopened={() => resource.refresh()} />}
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
              Previously Resolved Reports
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              View complaints that have been resolved by you.
            </p>
          </div>
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
              {!resource.loading && !resource.error && resolvedReports.length === 0 &&
                <tr><td colSpan={4} className="p-8 text-center">No resolved complaints found.</td></tr>}
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
                    <button className="underline" onClick={() => setSelectedReport(report.id)}>#{report.id}: {report.title}</button>
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
                        report.status === "Rejected"
                          ? isDarkMode
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                          : isDarkMode
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
        <Pagination showCount={false} total={resource.data?.total} offset={offset} onChange={setOffset} disabled={resource.loading || Boolean(resource.error)} />
      </main>
    </div>
  );
}

export default PreviouslyResolvedPage;