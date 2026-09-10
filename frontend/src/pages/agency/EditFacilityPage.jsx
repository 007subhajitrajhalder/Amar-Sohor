import { useState, useEffect, useMemo } from "react";
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
import { findFacilityById, saveFacilityUpdate } from "./facilitiesData";

function EditFacilityPage() {
  const navigate = useNavigate();
  const { facilityId } = useParams();

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

  const initialFacility = useMemo(
    () => findFacilityById(facilityId),
    [facilityId]
  );

  const [formData, setFormData] = useState(() => {
    const f = findFacilityById(facilityId);
    return {
      facilityName: f?.name || f?.facilityName || "",
      category: f?.category
        ? f.category.toUpperCase().replace("-", "_")
        : "DUSTBIN",
      address: f?.address || "",
      latitude: f?.latitude ? String(f.latitude) : "22.5726",
      longitude: f?.longitude ? String(f.longitude) : "88.3639",
      status: (f?.status || "Open").toUpperCase().replace(" ", "_")
    };
  });

  const [imagePreview, setImagePreview] = useState(() => {
    const f = findFacilityById(facilityId);
    return f?.imageUrl || f?.image || "";
  });
  const [imageName, setImageName] = useState(() => {
    const f = findFacilityById(facilityId);
    return f?.imageUrl || f?.image ? "Current Facility Image" : "";
  });
  const [imageInputMode, setImageInputMode] = useState("upload");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size should be less than 10MB.");
      return;
    }

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
    setImagePreview(customImageUrl.trim());
    setImageName("Web Image URL");
  };

  const handleRemoveImage = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.facilityName.trim() ||
      !formData.category ||
      !formData.address.trim() ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.status
    ) {
      setError("Please complete every facility field.");
      return;
    }

    setIsSubmitting(true);

    const updated = saveFacilityUpdate(facilityId, {
      name: formData.facilityName.trim(),
      facilityName: formData.facilityName.trim(),
      category: formData.category.toLowerCase(),
      address: formData.address.trim(),
      latitude: parseFloat(formData.latitude) || 22.5726,
      longitude: parseFloat(formData.longitude) || 88.3639,
      status:
        formData.status === "OPEN"
          ? "Open"
          : formData.status === "UNDER_REPAIR"
          ? "Under Repair"
          : "Suspended",
      imageUrl: imagePreview || "",
      image: imagePreview || ""
    });

    if (!updated) {
      setError("Failed to save facility changes. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Facility updated successfully! Redirecting to facility registry...");
    setTimeout(() => {
      navigate("/agency/facilities");
    }, 1200);
  };

  if (!initialFacility) {
    return (
      <main
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
      </main>
    );
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-6 transition-colors duration-500 ${
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

      <section className="relative z-10 mx-auto max-w-3xl">
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

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-xl transition ${
              isDarkMode
                ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isDarkMode ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Facility ID #{facilityId}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Edit Facility Details</h1>
              <p className="text-xs opacity-60">
                Update municipal infrastructure attributes, coordinates, image, and operational state.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-300">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            {/* Facility Name */}
            <div>
              <label htmlFor="facilityName" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Facility Name *
              </label>
              <input
                id="facilityName"
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
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-[#16130f] text-white focus:border-cyan-300"
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-700"
                }`}
              >
                <option value="DUSTBIN">Dustbin (Solid Waste Management)</option>
                <option value="DRINKING_WATER">Drinking Water (Water Supply)</option>
                <option value="PUBLIC_TOILET">Public Toilet (Sanitation)</option>
                <option value="PARKING">Parking Area (Traffic & Parking)</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                <MapPin size={12} className="inline mr-1 text-amber-400" />
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
                  <Compass size={12} className="inline mr-1 text-cyan-300" />
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
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
                  <Compass size={12} className="inline mr-1 text-cyan-300" />
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
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
                  <Camera size={13} className="inline mr-1.5 text-cyan-400" />
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
                    accept="image/*"
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
                <div className="mt-3 relative overflow-hidden rounded-xl border border-white/20 bg-black/40 p-2.5 flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Facility preview"
                    className="h-16 w-24 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <ImageIcon size={12} />
                      <span>Photo Attached</span>
                    </div>
                    <p className="text-[11px] truncate opacity-70 mt-0.5">{imageName || "Facility Image"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/20 transition shrink-0"
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
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default EditFacilityPage;