import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest, statusLabel, mediaUrl, displayDate } from "../../api/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { XCircle, RotateCcw, CheckCircle2, Camera } from "lucide-react";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

function ReportInvestigationPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const resource = useApi("/reports/" + reportId);
  const rawStatus = (resource.data?.status || "").toUpperCase();
  const status = statusLabel(resource.data?.status);
  const isRejected = rawStatus === "REJECTED" || status === "Rejected" || status === "REJECTED";
  const isResolved = rawStatus === "RESOLVED" || status === "Resolved" || status === "RESOLVED";
  const isPending = rawStatus === "PENDING" || status === "Pending" || status === "PENDING";
  const isUnderInvestigation = ["UNDER_INVESTIGATION", "UNDER INVESTIGATION"].includes(rawStatus) || status === "Under Investigation";
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectPhoto, setRejectPhoto] = useState(null);
  const [rejectPhotoPreview, setRejectPhotoPreview] = useState(null);
  const [restarting, setRestarting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const aiConf = resource.data?.ai_confidence != null ? resource.data.ai_confidence : null;
  const aiPred = (resource.data?.ai_prediction || "").toLowerCase();
  const isGoodFacility =
    aiPred.includes("clean") ||
    aiPred.includes("normal") ||
    aiPred.includes("functional") ||
    aiPred.includes("valid") ||
    [
      "normal_bin",
      "clean_public_toilet",
      "clean_public_urinal",
      "functional_drinking_water",
      "valid_public_parking",
    ].includes(aiPred);
  const isHighConfBadFacility = aiConf !== null && aiConf >= 0.50 && !isGoodFacility;

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

  const handleStartInvestigation = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await apiRequest("/reports/" + reportId, {
        method: "PATCH",
        body: { status: "UNDER_INVESTIGATION" },
      });
      navigate("/agency/reports/" + reportId + "/resolution");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGoToResolution = () => {
    navigate("/agency/reports/" + reportId + "/resolution");
  };

  const handleRejectReport = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejecting this report.");
      return;
    }
    if (isHighConfBadFacility && !rejectPhoto) {
      setError("An on-site inspection proof photograph is required to reject a report with an AI-verified defect (AI score >= 50%).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("reason", rejectReason.trim());
      if (rejectPhoto) {
        formData.append("photo", rejectPhoto);
      }
      await apiRequest("/reports/" + reportId + "/reject", {
        method: "POST",
        body: formData,
      });
      navigate("/agency/reports", {
        state: { message: `Report #${reportId} has been rejected.` },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRestartInvestigation = async () => {
    setRestarting(true);
    setError("");
    setSuccessMessage("");
    try {
      await apiRequest(`/reports/${reportId}/reopen`, { method: "POST" });
      setSuccessMessage("Investigation restarted successfully. The report is now active under investigation.");
      resource.refresh();
    } catch (err) {
      setError(err.message || "Failed to restart investigation.");
    } finally {
      setRestarting(false);
    }
  };
  if (!resource.data) return <main className="min-h-screen bg-slate-950 p-8 text-white">
        <ApiState error={error} /><ApiState {...resource} /><Link to="/agency/reports">Assigned Reports</Link></main>;

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Ambient dashboard-style background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
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

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 border-b px-5 py-4 backdrop-blur-2xl md:px-10 ${
          isDark
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
                isDark ? "border-lime-300/20 bg-transparent" : "border-slate-300 bg-white"
              }`}
            />
            <h1 className="text-xl font-bold md:text-2xl">
              <span className={isDark ? "text-white" : "text-slate-900"}>Amar </span>
              <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`group inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isDark
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
              <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
              <span
                className={`relative h-6 w-11 rounded-full p-1 transition-colors ${
                  isDark ? "bg-cyan-500/70" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    isDark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        <div className="mb-5 flex items-center justify-between">
          <Link
            to="/agency/reports"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-800"
            }`}
          >
            <span>&larr;</span> Back to Assigned Reports
          </Link>
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
                isPending
                  ? isDark
                    ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/20"
                    : "bg-amber-100 text-amber-800"
                  : isResolved
                    ? isDark
                      ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20"
                      : "bg-emerald-100 text-emerald-800"
                    : isRejected
                      ? isDark
                        ? "bg-rose-400/15 text-rose-300 ring-1 ring-rose-300/20"
                        : "bg-rose-100 text-rose-800"
                      : isDark
                        ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20"
                        : "bg-cyan-100 text-cyan-800"
              }`}
            >
              {isRejected ? "Rejected" : isResolved ? "Resolved" : isPending ? "Pending" : "Under Investigation"}
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

                  <p className="font-bold">{resource.data.title}</p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Facility
                  </p>

                  <p className="font-bold">{resource.data.facility_name}</p>
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
                    {resource.data.description}
                  </p>
                </div>

                {resource.data.agency_notes && (
                  <div className={`rounded-xl border p-3.5 ${
                    isDark ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-900"
                  }`}>
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      AI Validation Score & Investigation Notes
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {resource.data.agency_notes}
                    </p>
                  </div>
                )}

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
                    {resource.data.photo_url ? <img className="max-h-48" src={mediaUrl(resource.data.photo_url)} alt="Complaint photograph" /> : "No photograph recorded"}
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

              <ApiState error={error} />
              {successMessage && (
                <div className="my-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  {successMessage}
                </div>
              )}

              {/* Resolved State Details */}
              {isResolved && (
                <div className="mt-4 space-y-4">
                  <div
                    className={`rounded-2xl border p-5 ${
                      isDark
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-base">
                      <CheckCircle2 size={20} className="text-emerald-400" />
                      <span>Grievance Successfully Resolved</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed opacity-90">
                      <strong>Resolution Details:</strong>{" "}
                      {resource.data.resolution?.description || "Work completed and verified on-site."}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs opacity-75">
                      <span>
                        <strong>Completed:</strong>{" "}
                        {displayDate(resource.data.resolution?.completion_date || resource.data.resolved_at)}
                      </span>
                      <span>
                        <strong>Status:</strong> Approved
                      </span>
                    </div>
                  </div>

                  {resource.data.resolution?.photo_url && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        <Camera size={13} /> After-Repair Resolution Evidence
                      </p>
                      <div className={`overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-100"}`}>
                        <img
                          src={mediaUrl(resource.data.resolution.photo_url)}
                          alt="Resolution evidence"
                          className="max-h-64 w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rejected State Details & Restart Investigation */}
              {isRejected && (
                <div className="mt-4 space-y-4">
                  <div
                    className={`rounded-2xl border p-5 ${
                      isDark
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-base">
                      <XCircle size={20} className="text-rose-400" />
                      <span>Report Rejected</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed opacity-90">
                      <strong>Rejection Reason / Notes:</strong>{" "}
                      {resource.data.resolution?.description || resource.data.agency_notes || "Report was marked as rejected during inspection."}
                    </p>
                    {resource.data.resolved_at && (
                      <p className="mt-1 text-xs opacity-75">
                        <strong>Recorded:</strong> {displayDate(resource.data.resolved_at)}
                      </p>
                    )}

                    {/* Restart Investigation Button */}
                    <button
                      type="button"
                      disabled={restarting}
                      onClick={handleRestartInvestigation}
                      className={`mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-lg disabled:opacity-50 ${
                        isDark
                          ? "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-cyan-500/20"
                          : "bg-cyan-700 text-white hover:bg-cyan-600 hover:shadow-cyan-700/20"
                      }`}
                    >
                      <RotateCcw size={14} className={restarting ? "animate-spin" : ""} />
                      <span>{restarting ? "Restarting Investigation..." : "Restart Investigation"}</span>
                    </button>
                  </div>

                  {resource.data.resolution?.photo_url && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        <Camera size={13} /> On-Site Inspection Record Photograph
                      </p>
                      <div className={`overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-100"}`}>
                        <img
                          src={mediaUrl(resource.data.resolution.photo_url)}
                          alt="Inspection evidence"
                          className="max-h-64 w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Active Investigation Controls (Pending / Under Investigation) */}
              {(isPending || isUnderInvestigation) && (
                <div className="mt-5 grid gap-5">
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {isPending && "Click below to begin the investigation. The report status will update to Under Investigation and you can upload the resolution evidence."}
                    {isUnderInvestigation && "This complaint is currently under investigation. Once work is completed on-site, upload the resolution evidence."}
                  </p>

                  {isPending && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleStartInvestigation}
                      className={`rounded-xl p-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                        isDark
                          ? "bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/20"
                          : "bg-blue-700 hover:bg-blue-600 hover:shadow-blue-500/20"
                      }`}
                    >
                      {saving ? "Starting..." : "Start Investigation"}
                    </button>
                  )}

                  {isUnderInvestigation && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleGoToResolution}
                      className="rounded-xl bg-emerald-700 p-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20"
                    >
                      Upload Resolution
                    </button>
                  )}

                {/* Defect verified with high confidence: Photo Proof Required notice */}
                {isHighConfBadFacility && (isPending || isUnderInvestigation) && (
                  <div className={`rounded-xl border p-3 text-xs ${
                    isDark ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}>
                    <span className="font-bold uppercase tracking-wider block mb-1">
                      ⚠️ Rejection Requires On-Site Photo Proof (AI Score: {(aiConf * 100).toFixed(1)}% ≥ 50%)
                    </span>
                    The AI validated a facility defect ({resource.data?.ai_prediction?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}) with high confidence. To reject this complaint, you must provide on-site photographic evidence demonstrating the actual condition, which will be verified and scored by AI.
                  </div>
                )}

                {/* Good facility or low confidence AI notes */}
                {isGoodFacility && (isPending || isUnderInvestigation) && (
                  <div className={`rounded-xl border p-2.5 text-xs ${
                    isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-900"
                  }`}>
                    <span className="font-bold block mb-0.5">✅ Facility Classified in Good Condition</span>
                    The AI pre-screened this facility as {resource.data?.ai_prediction?.replace(/_/g, " ")}. You may reject this report if field inspection confirms no repair is necessary.
                  </div>
                )}

                {!isGoodFacility && aiConf !== null && aiConf < 0.50 && (isPending || isUnderInvestigation) && (
                  <div className={`rounded-xl border p-2.5 text-xs ${
                    isDark ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}>
                    <span className="font-bold block mb-0.5">⚠️ Low AI Confidence ({(aiConf * 100).toFixed(1)}% &lt; 50%)</span>
                    AI confidence is below the 50% borderline threshold. You may reject this report if on-site inspection shows no defect.
                  </div>
                )}

                {(isPending || isUnderInvestigation) && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setRejectModalOpen(true)}
                    className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 font-bold text-rose-300 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20"
                  >
                    Reject Report
                  </button>
                )}

                {rejectModalOpen && (
                  <div className={`mt-3 rounded-2xl border p-4 space-y-3 ${
                    isDark ? "border-rose-500/30 bg-rose-950/20" : "border-rose-200 bg-rose-50"
                  }`}>
                    <p className="text-sm font-bold text-rose-400">
                      Confirm Report Rejection
                    </p>
                    <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {isHighConfBadFacility
                        ? "This report has an AI-verified facility defect. An on-site photographic proof is required to document why this report is being rejected. The image will be validated and scored by the AI validation module."
                        : "The original complaint photo will be documented in the resolution records alongside your rejection reason. Please provide a clear explanation for rejecting this report."}
                    </p>

                    {/* Inspection Proof Photo Upload for Verified Defects */}
                    {isHighConfBadFacility && (
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Inspection Proof Photograph <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setRejectPhoto(file);
                              setRejectPhotoPreview(URL.createObjectURL(file));
                            }
                          }}
                          className={`w-full rounded-xl border p-2 text-xs ${
                            isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-300 bg-white text-slate-900"
                          }`}
                        />
                        {rejectPhotoPreview && (
                          <div className="mt-2 flex items-center gap-3">
                            <img src={rejectPhotoPreview} alt="Rejection proof preview" className="max-h-28 rounded-lg border border-white/10" />
                            <button
                              type="button"
                              onClick={() => { setRejectPhoto(null); setRejectPhotoPreview(null); }}
                              className="text-xs text-rose-400 hover:underline"
                            >
                              Remove photo
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <textarea
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Facility inspected on-site; equipment found intact and clean. False complaint / duplicate."
                      className={`w-full rounded-xl border p-2.5 text-xs outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-black/40 text-white placeholder-white/30 focus:ring-rose-500/40"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-rose-500/40"
                      }`}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setRejectModalOpen(false);
                          setRejectReason("");
                          setRejectPhoto(null);
                          setRejectPhotoPreview(null);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-white/10 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={saving || !rejectReason.trim() || (isHighConfBadFacility && !rejectPhoto)}
                        onClick={handleRejectReport}
                        className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
                      >
                        {saving ? "Rejecting & Validating..." : "Confirm & Reject"}
                      </button>
                    </div>
                  </div>
                )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportInvestigationPage;