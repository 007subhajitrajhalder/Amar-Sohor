import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  MapPin,
  Compass,
  Camera,
  UploadCloud,
  Link2,
  X,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react";
import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
const locationErrors = {
  1: "Location access was denied. Allow location access in your browser settings and try again, or enter coordinates manually.",
  2: "Your current location is unavailable. Check your device's location services and try again, or enter coordinates manually.",
  3: "Getting your location timed out. Try again, or enter coordinates manually."
};

function CurrentLocationButton({ onCoordinates, isDarkMode, disabled = false }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef(null);

  useEffect(() => () => { requestRef.current = null; }, []);

  const getLocation = () => {
    if (disabled || requestRef.current) return;
    setError("");
    if (!window.isSecureContext) {
      setError("Current location requires HTTPS or localhost. Open the secure site, or enter coordinates manually.");
      return;
    }
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation. Enter coordinates manually.");
      return;
    }

    const request = {};
    requestRef.current = request;
    setPending(true);
    const fail = locationError => {
      if (requestRef.current !== request) return;
      requestRef.current = null;
      setPending(false);
      setError(locationErrors[locationError?.code] || "Unable to get your current location. Try again, or enter coordinates manually.");
    };

    try {
      navigator.geolocation.getCurrentPosition(position => {
        if (requestRef.current !== request) return;
        const { latitude, longitude } = position.coords;
        if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 ||
            !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
          fail();
          return;
        }
        onCoordinates({ latitude: latitude.toFixed(7), longitude: longitude.toFixed(7) });
        requestRef.current = null;
        setPending(false);
      }, fail, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch (locationError) {
      fail(locationError);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={getLocation}
        disabled={disabled || pending}
        aria-busy={pending}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode
          ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-200 hover:bg-cyan-300/25"
          : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"}`}
      >
        <MapPin size={14} aria-hidden="true" />
        <span aria-live="polite">{pending ? "Getting location..." : "Use My Current Location"}</span>
      </button>
      {error && <p role="alert" className={`mt-2 text-xs ${isDarkMode ? "text-rose-300" : "text-rose-700"}`}>{error}</p>}
    </div>
  );
}
import { apiRequest, uploadFacilityPhoto, facilityPayload, mediaUrl } from "../../api/client";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

function FacilityEditor({ facilityId }) {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light"
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

  const [initialFacility, setInitialFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const categories = useApi("/agencies/facilities/categories", { poll: 0 });
  const [formData, setFormData] = useState({ facilityName: "", category: "", address: "", latitude: "", longitude: "", status: "OPEN", notes: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/agencies/facilities/" + facilityId, { signal: controller.signal }).then(f => {
      if (controller.signal.aborted) return;
      setInitialFacility(f);
      setFormData({ facilityName: f.facility_name, category: String(f.category_id), address: f.address,
        latitude: String(f.latitude), longitude: String(f.longitude), status: f.status, notes: f.additional_notes || "" });
      setImagePreview(f.photo_url || "");
      setImageName(f.photo_url ? "Current Facility Image" : "");
      setLoadError("");
      setLoading(false);
    }).catch(error => { if (!controller.signal.aborted) { setLoadError(error.message); setLoading(false); } });
    return () => controller.abort();
  }, [facilityId, loadVersion]);
  const [imageInputMode, setImageInputMode] = useState("upload");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size should be less than 10MB.");
      return;
    }

    setPhotoFile(file);
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyImageUrl = (e) => {
    e?.preventDefault?.();
    if (!customImageUrl.trim()) return;
    setPhotoFile(null);
    setImagePreview(customImageUrl.trim());
    setImageName("Web Image URL");
  };

  const handleRemoveImage = () => {
    setPhotoFile(null);
    setImagePreview("");
    setImageName("");
    setCustomImageUrl("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (isSubmitting || success) return;
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const payload = facilityPayload({ name: formData.facilityName, category: formData.category,
        address: formData.address, latitude: formData.latitude, longitude: formData.longitude,
        status: formData.status, photo: photoFile ? null : imagePreview, notes: formData.notes });
      if (photoFile) {
        payload.photo_url = await uploadFacilityPhoto(photoFile);
        setImagePreview(payload.photo_url);
        setPhotoFile(null);
      }
      const updated = await apiRequest("/agencies/facilities/" + facilityId, { method: "PUT", body: payload });
      setSuccess("Facility updated successfully.");
      navigate("/agency/facilities", { state: { message: 'Facility "' + updated.facility_name + '" updated successfully.' } });
    } catch (error) { setError(error.message); }
    finally { setIsSubmitting(false); }
  };

  if (loading || loadError) return <main className="min-h-screen bg-slate-950 p-8 text-white">
    <ApiState loading={loading} error={loadError} refresh={() => setLoadVersion(v => v + 1)} />
    <Link to="/agency/facilities">Return to Facilities</Link>
  </main>;

  if (!initialFacility) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center p-6 ${
          isDarkMode ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
        }`}
      >
        <section
          className={`mx-auto max-w-md rounded-3xl border p-8 text-center shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "border-white/10 bg-white/[0.05]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Facility Not Found</h1>
          <p className="mt-2 text-xs opacity-60">
            No registered civic facility was found for identifier #{facilityId}.
          </p>
          <Link
            to="/agency/facilities"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow transition"
          >
            <ArrowLeft size={14} /> Return to Facilities
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#100e0b] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Background ambient glow layers */}
      {isDarkMode && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(125px)"
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
              filter: "blur(50px)"
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

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/agency/facilities"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
              isDarkMode
                ? "text-cyan-300 hover:text-white"
                : "text-cyan-700 hover:text-cyan-900"
            }`}
          >
            <ArrowLeft size={14} />
            Back to Facility Management
          </Link>
        </div>

        {/* Form Card */}
        <div
          className={`mt-5 rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition ${
            isDarkMode
              ? "border-white/15 bg-white/[0.07] text-white shadow-black/30"
              : "border-slate-200 bg-white text-slate-900 shadow-slate-300/50"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div
              className={`rounded-xl border p-2.5 ${
                isDarkMode
                  ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-200"
                  : "border-cyan-200 bg-cyan-50 text-cyan-700"
              }`}
            >
              <Building2 size={22} />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`}>
                Facility ID #{facilityId}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Edit Facility Details</h1>
              <p className="text-xs opacity-60">
                Update municipal infrastructure attributes, coordinates, image, and operational state.
              </p>
            </div>
          </div>

          {error && (
            <div className={`mt-5 rounded-xl border p-3.5 text-xs font-semibold ${isDarkMode ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
              {error}
            </div>
          )}

          {success && (
            <div className={`mt-5 flex items-center gap-2 rounded-xl border p-3.5 text-xs font-semibold ${isDarkMode ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <ApiState {...categories} />
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            {/* Facility Name */}
            <div>
              <label htmlFor="facilityName" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Facility Name *
              </label>
              <input
                id="facilityName"
                maxLength={150}
                type="text"
                name="facilityName"
                required
                value={formData.facilityName}
                onChange={handleChange}
                placeholder="Enter facility name"
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                }`}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Facility Category *
              </label>
              <select
                id="category"
                required disabled={initialFacility.source_recommendation_id !== null}
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-[#16130f] text-white focus:border-cyan-300"
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-700"
                }`}
              >
                {(categories.data || []).map(category => <option key={category.category_id} value={category.category_id}>{category.category_name}</option>)}
              </select>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                <MapPin size={12} className={`inline mr-1 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                Physical Address & Landmark *
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the full facility address"
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                }`}
              />
            </div>

            {/* Coordinates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                  <Compass size={12} className={`inline mr-1 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`} />
                  Latitude
                </label>
                <input
                  id="latitude"
                  min={-90} max={90}
                  type="number"
                  step="0.0000001"
                  required
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="22.5726"
                  className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                  }`}
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                  <Compass size={12} className={`inline mr-1 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`} />
                  Longitude
                </label>
                <input
                  id="longitude"
                  min={-180} max={180}
                  type="number"
                  step="0.0000001"
                  required
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="88.3639"
                  className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                  }`}
                />
              </div>
            </div>

            <CurrentLocationButton
              isDarkMode={isDarkMode}
              disabled={isSubmitting || Boolean(success)}
              onCoordinates={coordinates => setFormData(previous => ({ ...previous, ...coordinates }))}
            />

            {/* Image Section */}
            <div
              className={`rounded-2xl border p-4 transition ${
                isDarkMode
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <label className="block font-bold uppercase tracking-wider opacity-70">
                  <Camera size={13} className={`inline mr-1.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                  Facility Image / Site Photo
                </label>

                <div className="flex items-center rounded-lg border border-white/15 p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("upload")}
                    className={`rounded-md px-2.5 py-1 transition ${
                      imageInputMode === "upload"
                        ? isDarkMode
                          ? "bg-cyan-500/25 text-cyan-200"
                          : "bg-white text-cyan-800 shadow-sm"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <UploadCloud size={11} className="inline mr-1" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`rounded-md px-2.5 py-1 transition ${
                      imageInputMode === "url"
                        ? isDarkMode
                          ? "bg-cyan-500/25 text-cyan-200"
                          : "bg-white text-cyan-800 shadow-sm"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Link2 size={11} className="inline mr-1" />
                    URL
                  </button>
                </div>
              </div>

              {imageInputMode === "upload" && (
                <label
                  htmlFor="editFacilityPhoto"
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition ${
                    isDarkMode
                      ? "border-white/20 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.05]"
                      : "border-slate-300 bg-white hover:border-cyan-600 hover:bg-cyan-50/30"
                  }`}
                >
                  <UploadCloud size={24} className={isDarkMode ? "text-cyan-300" : "text-cyan-700"} />
                  <div>
                    <span className="font-semibold underline">Click to upload replacement photo</span>
                    <p className="text-[10px] opacity-50 mt-0.5">PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                  </div>
                  <input
                    id="editFacilityPhoto"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}

              {imageInputMode === "url" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://...)"
                      className={`w-full rounded-xl border p-2.5 text-xs outline-none transition focus:ring-2 ${
                        isDarkMode
                          ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-700"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyImageUrl}
                      className="shrink-0 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 font-semibold text-xs transition"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className={`mt-3 relative overflow-hidden rounded-xl border p-2.5 flex items-center gap-3 ${isDarkMode ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-100"}`}>
                  <img
                    src={mediaUrl(imagePreview)}
                    alt="Facility preview"
                    className="h-16 w-24 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`flex items-center gap-1.5 font-semibold text-[11px] ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                      <ImageIcon size={12} />
                      <span>Photo Attached</span>
                    </div>
                    <p className="text-[11px] truncate opacity-70 mt-0.5">{imageName || "Facility Image"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    className={`rounded-lg p-1.5 transition shrink-0 ${isDarkMode ? "text-rose-400 hover:bg-rose-500/20" : "text-rose-600 hover:bg-rose-100"}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Operational Status */}
            <div>
              <label htmlFor="status" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Operational Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-[#16130f] text-white focus:border-cyan-300"
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-700"
                }`}
              >
                <option value="OPEN">Open (Active for Public Usage)</option>
                <option value="UNDER_REPAIR">Under Repair</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <label className="grid gap-2">Additional notes
              <textarea name="notes" value={formData.notes} maxLength={5000} onChange={handleChange}
                className="rounded-xl border bg-transparent p-3" />
            </label>
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <Link
                to="/agency/facilities"
                className={`rounded-xl border px-4 py-2.5 font-semibold transition ${
                  isDarkMode
                    ? "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || Boolean(success) || !categories.data?.length}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditFacilityPage() {
  const { facilityId } = useParams();
  return <FacilityEditor key={facilityId} facilityId={facilityId} />;
}