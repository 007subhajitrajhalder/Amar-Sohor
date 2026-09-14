import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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

function UploadResolutionPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(true);

  const [resolutionDescription, setResolutionDescription] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState(null);

  const handleSubmitResolution = (event) => {
    event.preventDefault();

    if (!resolutionDescription || !completionDate || !resolutionPhoto) {
      alert("Please complete every resolution field.");
      return;
    }

    alert("Resolution uploaded. Report status changed to Resolved.");
    navigate("/agency/resolved");
  };

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
        className={`relative z-10 mx-auto max-w-4xl ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to={`/agency/reports/${reportId}/investigate`}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-800"
            }`}
          >
            <span>&larr;</span> Back to Investigation
          </Link>
        </div>

        {/* Header and Theme Toggle */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
              Report #{reportId}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Upload Report Resolution
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Submit the completed work information and after-repair evidence.
            </p>
          </div>

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

        {/* Form Container */}
        <div
          className={`mt-8 overflow-hidden rounded-3xl border p-6 shadow-xl backdrop-blur-xl md:p-8 transition-colors duration-300 ${
            isDarkMode
              ? "border-white/20 bg-white/5 shadow-cyan-950/20"
              : "border-slate-200 bg-white/80 shadow-slate-300/40"
          }`}
        >
          <form onSubmit={handleSubmitResolution} className="grid gap-7">
            <label className="flex flex-col gap-2">
              <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                Resolution Description
              </span>
              <textarea
                value={resolutionDescription}
                onChange={(event) => setResolutionDescription(event.target.value)}
                placeholder="Describe the work performed..."
                className={`min-h-36 w-full rounded-xl border p-4 outline-none transition-all duration-300 focus:ring-2 ${
                  isDarkMode
                    ? "border-white/10 bg-black/20 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                    : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                After-Repair Photograph
              </span>
              <div
                className={`flex justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300 ${
                  isDarkMode
                    ? "border-white/20 bg-white/5 hover:bg-white/10"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setResolutionPhoto(event.target.files[0])}
                  className={`block w-full max-w-sm text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold transition-all ${
                    isDarkMode
                      ? "text-white/70 file:bg-white/10 file:text-white hover:file:bg-white/20"
                      : "text-slate-600 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                  }`}
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                Completion Date
              </span>
              <input
                type="date"
                value={completionDate}
                onChange={(event) => setCompletionDate(event.target.value)}
                className={`w-full rounded-xl border p-4 outline-none transition-all duration-300 focus:ring-2 ${
                  isDarkMode
                    ? "border-white/10 bg-black/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20 [color-scheme:dark]"
                    : "border-slate-300 bg-white text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
              />
            </label>

            <button
              type="submit"
              className={`mt-4 rounded-xl border px-5 py-4 text-center text-sm font-bold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                isDarkMode
                  ? "border-emerald-200/30 bg-emerald-500/20 text-emerald-100 shadow-emerald-950/20 hover:bg-emerald-500/30 hover:text-white"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-200/40 hover:bg-emerald-100 hover:text-emerald-800"
              }`}
            >
              Submit Resolution and Mark Resolved
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default UploadResolutionPage;