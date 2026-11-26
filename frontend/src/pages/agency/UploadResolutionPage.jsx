import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest, mediaUrl } from "../../api/client";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";
import AgencyHeader from "../../components/layout/AgencyHeader";

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


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

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  const [resolutionDescription, setResolutionDescription] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState(null);
  const [resolutionPhotoPreview, setResolutionPhotoPreview] = useState(null);

  // AI Resolution Validation States
  const [aiValidating, setAiValidating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

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

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const resource = useApi("/reports/" + reportId);

  const report = resource.data;
  const facilityLat = report?.facility_latitude ?? report?.facilityLatitude ?? report?.facility?.latitude;
  const facilityLng = report?.facility_longitude ?? report?.facilityLongitude ?? report?.facility?.longitude;
  const facilityCategory = report?.facility_category || "";
  const isToilet = /toilet|washroom|restroom|urinal/i.test(facilityCategory);
  const isDustbin = /bin|dustbin|waste|garbage/i.test(facilityCategory);
  const isWater = /water|tap|drinking|dispenser|fountain/i.test(facilityCategory);
  const isParking = /parking|carpark|garage/i.test(facilityCategory);
  const requiresAiValidation = isToilet || isDustbin || isWater || isParking;
  const originalPhotoUrl = report?.photo_url ? mediaUrl(report.photo_url) : null;

  // Proximity Verification (Officer must be within 100m of facility to submit resolution)
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("IDLE"); // 'IDLE' | 'CHECKING' | 'VERIFIED' | 'FAR' | 'DENIED' | 'UNSUPPORTED'
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [locationError, setLocationError] = useState("");

  const checkProximity = (overrideCoords = null) => {
    if (!facilityLat || !facilityLng) {
      setLocationStatus("VERIFIED");
      return;
    }

    if (overrideCoords) {
      const dist = getDistanceFromLatLonInMeters(
        overrideCoords.latitude,
        overrideCoords.longitude,
        Number(facilityLat),
        Number(facilityLng)
      );
      setUserLocation(overrideCoords);
      const rounded = Math.round(dist);
      setDistanceMeters(rounded);
      if (dist <= 100) {
        setLocationStatus("VERIFIED");
        setLocationError("");
      } else {
        setLocationStatus("FAR");
        setLocationError(`You are ~${rounded}m away from the facility. Resolution can only be submitted on-site (within 100m).`);
      }
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("UNSUPPORTED");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("CHECKING");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserLocation(coords);
        const dist = getDistanceFromLatLonInMeters(
          coords.latitude,
          coords.longitude,
          Number(facilityLat),
          Number(facilityLng)
        );
        const rounded = Math.round(dist);
        setDistanceMeters(rounded);

        if (dist <= 100) {
          setLocationStatus("VERIFIED");
          setLocationError("");
        } else {
          setLocationStatus("FAR");
          setLocationError(`You are ~${rounded}m away from the facility. Resolution can only be submitted on-site (within 100m).`);
        }
      },
      (err) => {
        setLocationStatus("DENIED");
        setLocationError(
          err.code === 1
            ? "Location access denied. Please enable GPS permissions to verify your on-site presence at the facility."
            : "Could not obtain GPS coordinates. Please check your device location settings."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (facilityLat && facilityLng) {
      checkProximity();
    }
  }, [facilityLat, facilityLng]);

  const handleSimulateOnSite = () => {
    if (!facilityLat || !facilityLng) return;
    checkProximity({
      latitude: Number(facilityLat) + 0.00008,
      longitude: Number(facilityLng) + 0.00008,
    });
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResolutionPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setResolutionPhotoPreview(previewUrl);
    setError("");

    // Trigger AI Resolution Verification if facility is toilet or dustbin
    if (requiresAiValidation) {
      setAiValidating(true);
      setAiResult(null);
      try {
        const body = new FormData();
        body.append("photo", file);
        const res = await apiRequest(`/reports/${reportId}/validate-resolution`, {
          method: "POST",
          body,
        });
        setAiResult(res);
      } catch (err) {
        setAiResult({
          status: "REJECTED",
          message: err.message || "Failed to validate resolution photograph with AI.",
        });
      } finally {
        setAiValidating(false);
      }
    }
  };

  const handleSubmitResolution = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!resolutionDescription.trim()) {
      setError("Please describe the work performed.");
      return;
    }
    if (!resolutionPhoto) {
      setError("Please select an after-repair photograph.");
      return;
    }
    if (!completionDate) {
      setError("Please select a completion date.");
      return;
    }

    if (requiresAiValidation && aiResult?.status === "REJECTED") {
      setError(aiResult.message || "Cannot submit resolution: The uploaded photograph was rejected by AI verification.");
      return;
    }

    if (aiValidating) {
      setError("Please wait for AI image verification to finish before submitting.");
      return;
    }

    if (facilityLat && facilityLng) {
      if (locationStatus !== "VERIFIED" || (distanceMeters !== null && distanceMeters > 100)) {
        setError(
          locationError ||
          "On-site verification failed: You must be physically within 100m of the facility site to submit a resolution."
        );
        return;
      }
    }

    setSubmitting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("description", resolutionDescription.trim());
      body.append("completion_date", completionDate);
      body.append("photo", resolutionPhoto);
      if (userLocation?.latitude != null && userLocation?.longitude != null) {
        body.append("user_latitude", userLocation.latitude.toString());
        body.append("user_longitude", userLocation.longitude.toString());
      }
      await apiRequest("/reports/" + reportId + "/resolutions", { method: "POST", body });
      navigate("/agency/reports", {
        state: { message: "Resolution submitted successfully. Report has been marked as resolved." }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
          className="pointer-events-none fixed inset-0"
          style={{
            background: layer.background,
            mixBlendMode: layer.mixBlendMode,
            filter: layer.filter,
            transform: "translateZ(0)"
          }}
        />
      ))}

      {/* Sticky Header */}
      <AgencyHeader isDark={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="relative z-10 mx-auto max-w-4xl px-5 py-8 md:px-10 md:py-12">
        <ApiState {...resource} />
        {error && <ApiState error={error} />}

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

        {/* Header Title */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
                Report #{reportId}
              </p>
              {requiresAiValidation && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                  <Sparkles size={12} /> AI Verified Facility
                </span>
              )}
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Upload Report Resolution
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              Submit the completed work details and photographic evidence.
              {requiresAiValidation && " The after-repair photograph will be checked by AI for cleanliness and site consistency."}
            </p>
          </div>
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
            {/* On-Site Proximity Verification (100m Physical Inspection Rule) */}
            {facilityLat && facilityLng && (
              <div
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  locationStatus === "VERIFIED"
                    ? isDarkMode
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : locationStatus === "FAR"
                    ? isDarkMode
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                      : "border-amber-400 bg-amber-50 text-amber-900"
                    : locationStatus === "CHECKING"
                    ? isDarkMode
                      ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
                      : "border-cyan-300 bg-cyan-50 text-cyan-800"
                    : isDarkMode
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                    : "border-rose-300 bg-rose-50 text-rose-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {locationStatus === "VERIFIED" ? (
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    ) : locationStatus === "CHECKING" ? (
                      <Loader2 size={20} className="text-cyan-500 shrink-0 mt-0.5 animate-spin" />
                    ) : (
                      <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">
                        {locationStatus === "VERIFIED"
                          ? "On-Site Physical Inspection Verified"
                          : locationStatus === "CHECKING"
                          ? "Verifying Field Officer Proximity..."
                          : locationStatus === "FAR"
                          ? "Proximity Alert: Outside 100m Site Boundary"
                          : "Officer GPS Location Required"}
                      </p>
                      <p className={`mt-1 text-xs leading-relaxed ${isDarkMode ? "text-white/80" : "text-slate-700"}`}>
                        {locationStatus === "VERIFIED"
                          ? `Field presence verified (~${distanceMeters ?? 0}m from reported facility). Resolution submission unlocked.`
                          : locationStatus === "CHECKING"
                          ? "Acquiring high-precision GPS to verify physical presence at the facility..."
                          : locationStatus === "FAR"
                          ? `You are currently ~${distanceMeters}m away from the facility. Officers must be within 100m of the site to record resolution.`
                          : (locationError || "Location access is required to ensure field inspections are conducted at the facility.")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => checkProximity()}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        isDarkMode
                          ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <Navigation size={13} /> Re-check GPS
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulateOnSite}
                      title="Simulate officer presence within 15m of the facility for dev desktop testing"
                      className="flex items-center gap-1.5 rounded-lg border border-lime-500/40 bg-lime-500/10 px-3 py-1.5 text-xs font-semibold text-lime-400 hover:bg-lime-500/20 transition"
                    >
                      Simulate On-Site (Dev)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resolution Description */}
            <label className="flex flex-col gap-2">
              <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                Resolution Description
              </span>
              <textarea
                value={resolutionDescription}
                onChange={(event) => setResolutionDescription(event.target.value)}
                placeholder="Describe the action taken (e.g. Cleared waste overflow, sanitized public urinal, repaired broken toilet plumbing)..."
                className={`min-h-32 w-full rounded-xl border p-4 outline-none transition-all duration-300 focus:ring-2 ${
                  isDarkMode
                    ? "border-white/10 bg-black/20 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                    : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
              />
            </label>

            {/* Before vs After Visual Evidence Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                  Photographic Evidence (Before & After)
                </span>
                {requiresAiValidation && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1">
                    <ShieldCheck size={14} /> AI Cleanliness & Site Verification
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before: Citizen Grievance Photo */}
                <div
                  className={`rounded-2xl border p-4 flex flex-col justify-between ${
                    isDarkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ImageIcon size={13} /> Citizen Complaint Photo (Before)
                    </span>
                    <p className={`text-xs mt-1 mb-3 ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>
                      {report?.title || "Reported Civic Problem"}
                    </p>
                  </div>
                  {originalPhotoUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <img
                        src={originalPhotoUrl}
                        alt="Citizen Grievance"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-white/40">
                      No citizen photo attached
                    </div>
                  )}
                </div>

                {/* After: Agency Resolution Photo */}
                <div
                  className={`rounded-2xl border p-4 flex flex-col justify-between ${
                    isDarkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <ImageIcon size={13} /> After-Repair Photo (Resolution)
                    </span>
                    <p className={`text-xs mt-1 mb-3 ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>
                      Proof of restored, cleaned, or repaired facility
                    </p>
                  </div>

                  {resolutionPhotoPreview ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <img
                          src={resolutionPhotoPreview}
                          alt="Resolution Evidence Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex justify-end">
                        <label className="cursor-pointer text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                          Change Photo
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
                        isDarkMode
                          ? "border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10"
                          : "border-slate-300 bg-white hover:border-cyan-500/50 hover:bg-slate-100"
                      }`}
                    >
                      <ImageIcon className="h-8 w-8 text-cyan-400 mb-2 opacity-80" />
                      <span className="text-xs font-semibold">Click to select after-repair photo</span>
                      <span className={`text-[10px] mt-1 ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>
                        PNG, JPG or WEBP (Max 10 MB)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Real-time AI Resolution Verification Feedback Card */}
              {requiresAiValidation && resolutionPhoto && (
                <div className="mt-2">
                  {aiValidating && (
                    <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 text-xs text-cyan-200 animate-pulse">
                      <Loader2 size={16} className="animate-spin text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-cyan-100">
                          AI Verification in progress...
                        </p>
                        <p className="text-[11px] text-cyan-300/80 mt-0.5">
                          Checking facility cleanliness and comparing deep scene geometry with the citizen complaint photo.
                        </p>
                      </div>
                    </div>
                  )}

                  {!aiValidating && aiResult?.status === "ACCEPTED" && (
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-100">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-emerald-300 uppercase tracking-wide">
                            AI Resolution Verification: Accepted
                          </span>
                          <div className="flex items-center gap-2">
                            {aiResult.cleanliness_confidence && (
                              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-semibold">
                                Cleanliness: {(aiResult.cleanliness_confidence * 100).toFixed(1)}%
                              </span>
                            )}
                            {aiResult.scene_similarity != null && (
                              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-semibold">
                                Site Match: {(aiResult.scene_similarity * 100).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-medium text-emerald-50">
                          {aiResult.message}
                        </p>
                        <p className="text-[11px] text-emerald-300/70">
                          Facility restoration confirmed. Evidence verified for administrative closure.
                        </p>
                      </div>
                    </div>
                  )}

                  {!aiValidating && aiResult?.status === "REJECTED" && (
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-100">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 mt-0.5">
                        <AlertTriangle size={16} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-rose-300 uppercase tracking-wide">
                            AI Resolution Verification: Rejected
                          </span>
                          {aiResult.is_duplicate && (
                            <span className="rounded bg-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-200">
                              Duplicate Image
                            </span>
                          )}
                          {aiResult.cleanliness_confidence && !aiResult.is_duplicate && (
                            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300 font-semibold">
                              Confidence: {(aiResult.cleanliness_confidence * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-rose-50">
                          {aiResult.message}
                        </p>
                        <p className="text-[11px] text-rose-300/80">
                          Please take a clear photograph of the cleaned or repaired facility at the reported site and upload it again.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Completion Date */}
            <label className="flex flex-col gap-2">
              <span className={`text-sm font-bold ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                Completion Date
              </span>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={completionDate}
                onChange={(event) => setCompletionDate(event.target.value)}
                className={`w-full rounded-xl border p-4 outline-none transition-all duration-300 focus:ring-2 ${
                  isDarkMode
                    ? "border-white/10 bg-black/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20 [color-scheme:dark]"
                    : "border-slate-300 bg-white text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                submitting ||
                aiValidating ||
                (requiresAiValidation && aiResult?.status === "REJECTED") ||
                resource.data?.status !== "UNDER_INVESTIGATION" ||
                (facilityLat && facilityLng && (locationStatus === "CHECKING" || locationStatus === "FAR" || locationStatus === "DENIED"))
              }
              className={`mt-4 rounded-xl border px-5 py-4 text-center text-sm font-bold shadow-lg backdrop-blur-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "border-emerald-200/30 bg-emerald-500/20 text-emerald-100 shadow-emerald-950/20 hover:bg-emerald-500/30 hover:text-white"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-200/40 hover:bg-emerald-100 hover:text-emerald-800"
              }`}
            >
              {submitting
                ? "Submitting Resolution..."
                : aiValidating
                ? "Validating Resolution Evidence..."
                : facilityLat && facilityLng && locationStatus === "CHECKING"
                ? "Verifying Officer Location..."
                : facilityLat && facilityLng && locationStatus === "FAR"
                ? `Officer Too Far from Facility (~${distanceMeters}m > 100m)`
                : facilityLat && facilityLng && locationStatus === "DENIED"
                ? "GPS Location Required (<100m)"
                : "Submit Resolution"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UploadResolutionPage;
