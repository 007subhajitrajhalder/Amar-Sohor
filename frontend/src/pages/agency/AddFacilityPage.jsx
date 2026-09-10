import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Compass,
  FileText,
  Camera,
  UploadCloud,
  Link2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { updateRecommendationByAgency } from "../admin/adminRecommendationsData";

function AddFacilityPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("agencyTheme") !== "light"
  );

  // Sync theme
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

  // Carry-forwarded recommendation from approved workflow
  const carryForwarded = location.state?.recommendation || null;

  const [facilityName, setFacilityName] = useState(
    carryForwarded ? carryForwarded.title : ""
  );
  const [facilityCategory, setFacilityCategory] = useState(
    carryForwarded ? carryForwarded.facilityType || "dustbin" : "dustbin"
  );
  const [facilityAddress, setFacilityAddress] = useState(
    carryForwarded
      ? `${carryForwarded.location || ""}${
          carryForwarded.landmark ? ` (Landmark: ${carryForwarded.landmark})` : ""
        }`
      : ""
  );
  const [latitude, setLatitude] = useState("22.5726");
  const [longitude, setLongitude] = useState("88.3639");
  const [status, setStatus] = useState("Open");
  const [additionalNotes, setAdditionalNotes] = useState(
    carryForwarded?.description || ""
  );

  // Image input state
  const [imagePreview, setImagePreview] = useState(
    carryForwarded?.photoUrl || carryForwarded?.imageUrl || ""
  );
  const [imageName, setImageName] = useState(
    carryForwarded?.photoUrl ? "Pre-filled from recommendation" : ""
  );
  const [imageInputMode, setImageInputMode] = useState("upload"); // 'upload' | 'url'
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!facilityName.trim() || !facilityAddress.trim()) {
      alert("Please fill in both the facility name and address.");
      return;
    }

    const newFacility = {
      id: Date.now(),
      name: facilityName.trim(),
      category: facilityCategory,
      address: facilityAddress.trim(),
      latitude: parseFloat(latitude) || 22.5726,
      longitude: parseFloat(longitude) || 88.3639,
      status,
      imageUrl: imagePreview || "",
      image: imagePreview || "",
      additionalNotes: additionalNotes.trim(),
      createdAt: new Date().toISOString(),
      sourceRecommendationId: carryForwarded ? carryForwarded.id : null
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("agency_facilities") || "[]");
      existing.push(newFacility);
      localStorage.setItem("agency_facilities", JSON.stringify(existing));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to save facility:", err);
    }

    // If carry-forwarded, transition recommendation to INSTALLED (Stage 5)
    if (carryForwarded?.id) {
      updateRecommendationByAgency(carryForwarded.id, {
        status: "INSTALLED",
        stage: 5,
        notes: `Civic amenity officially commissioned and added to municipal facility index as '${facilityName.trim()}'.`,
        actorName: carryForwarded.assignedMember?.fullName
      });
    }

    setIsSubmitted(true);

    setTimeout(() => {
      navigate("/agency/facilities");
    }, 1200);
  };

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
            to={carryForwarded ? "/agency/recommendations" : "/agency/facilities"}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
              isDarkMode ? "text-cyan-300 hover:text-white" : "text-cyan-700 hover:text-cyan-900"
            }`}
          >
            <ArrowLeft size={14} />
            {carryForwarded ? "Back to Recommendations" : "Back to Facilities"}
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

        {/* Carry-Forward Banner Notification */}
        {carryForwarded && (
          <div
            className={`mt-5 rounded-2xl border p-4 shadow-xl backdrop-blur-xl flex items-start gap-3.5 ${
              isDarkMode
                ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100"
                : "border-emerald-300 bg-emerald-50 text-emerald-950"
            }`}
          >
            <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/20 p-2.5 text-emerald-300 shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Carry-Forward Active
              </span>
              <h3 className="text-sm font-bold mt-0.5">
                Pre-filled from Approved Recommendation #{carryForwarded.id}
              </h3>
              <p className="mt-1 text-xs opacity-85 leading-relaxed">
                Proposal details, address, and category have been automatically populated into this form. Submitting will register the facility and transition Recommendation #{carryForwarded.id} to <strong>Installed & Operational</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {isSubmitted && (
          <div
            className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-300/50 bg-emerald-400/20 p-4 text-xs font-bold text-emerald-200 shadow-xl backdrop-blur-xl"
            role="status"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-300" />
            <span>Facility added successfully! Redirecting to facility registry...</span>
          </div>
        )}

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
                isDarkMode ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-700"
              }`}
            >
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add Civic Facility</h1>
              <p className="text-xs opacity-60">
                Register an approved civic infrastructure installation for public map indexing.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            {/* Facility Name */}
            <div>
              <label htmlFor="facilityName" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Facility Name *
              </label>
              <input
                id="facilityName"
                type="text"
                required
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="E.g., Salt Lake Sector V Segregation Bin Station"
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                }`}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="facilityCategory" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Facility Category *
              </label>
              <select
                id="facilityCategory"
                value={facilityCategory}
                onChange={(e) => setFacilityCategory(e.target.value)}
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-[#16130f] text-white focus:border-cyan-300"
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-700"
                }`}
              >
                <option value="dustbin">Dustbin (Solid Waste Management)</option>
                <option value="water">Drinking Water Dispenser (Water Supply)</option>
                <option value="toilet">Public Toilet Complex (Sanitation)</option>
                <option value="parking">Civic Parking Spot (Traffic & Parking)</option>
              </select>
            </div>

            {/* Facility Address */}
            <div>
              <label htmlFor="facilityAddress" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                <MapPin size={12} className="inline mr-1 text-amber-400" />
                Physical Address & Landmark *
              </label>
              <textarea
                id="facilityAddress"
                rows={2}
                required
                value={facilityAddress}
                onChange={(e) => setFacilityAddress(e.target.value)}
                placeholder="E.g., Sector V Metro Station Gate 2, beside bus stop"
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
                <label htmlFor="latitudeInput" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                  <Compass size={12} className="inline mr-1 text-cyan-300" />
                  Latitude
                </label>
                <input
                  id="latitudeInput"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="22.5726"
                  className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                  }`}
                />
              </div>

              <div>
                <label htmlFor="longitudeInput" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                  <Compass size={12} className="inline mr-1 text-cyan-300" />
                  Longitude
                </label>
                <input
                  id="longitudeInput"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="88.3639"
                  className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                  }`}
                />
              </div>
            </div>

            {/* Facility Image / Photograph Section */}
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
                  Facility Photograph / Site Image (Optional)
                </label>

                {/* Input Mode Toggle */}
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
                    Upload File
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
                    Image URL
                  </button>
                </div>
              </div>

              {/* Mode 1: File Upload */}
              {imageInputMode === "upload" && (
                <div className="space-y-3">
                  <label
                    htmlFor="facilityPhotoUpload"
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition ${
                      isDarkMode
                        ? "border-white/20 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.05]"
                        : "border-slate-300 bg-white hover:border-cyan-600 hover:bg-cyan-50/30"
                    }`}
                  >
                    <UploadCloud size={24} className={isDarkMode ? "text-cyan-300" : "text-cyan-700"} />
                    <div>
                      <span className="font-semibold underline">Click to upload photo</span>
                      <span className="opacity-60"> or drag and drop</span>
                      <p className="text-[10px] opacity-50 mt-0.5">
                        PNG, JPG, JPEG, or WEBP (Max 10MB)
                      </p>
                    </div>
                    <input
                      id="facilityPhotoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Mode 2: Web Image URL */}
              {imageInputMode === "url" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className={`w-full rounded-xl border p-2.5 text-xs outline-none transition focus:ring-2 ${
                        isDarkMode
                          ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                          : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
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
                  <p className="text-[10px] opacity-50">
                    Enter direct link to a public photo of the facility or site.
                  </p>
                </div>
              )}

              {/* Live Preview Card */}
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
                      <span>Image attached</span>
                    </div>
                    <p className="text-[11px] truncate opacity-70 mt-0.5">
                      {imageName || "Custom image set"}
                    </p>
                    <p className="text-[10px] opacity-40">
                      Will be displayed on map and facility management card
                    </p>
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

            {/* Status Selector */}
            <div>
              <label htmlFor="statusSelect" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                Operational Status
              </label>
              <select
                id="statusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-[#16130f] text-white focus:border-cyan-300"
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-700"
                }`}
              >
                <option value="Open">Open (Active for Public Usage)</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notesInput" className="block font-bold uppercase tracking-wider opacity-70 mb-1">
                <FileText size={12} className="inline mr-1 opacity-60" />
                Commissioning & Maintenance Notes (Optional)
              </label>
              <textarea
                id="notesInput"
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="E.g., 200L bins installed; scheduled daily emptying at 07:00 and 19:00."
                className={`w-full rounded-xl border p-3 text-xs outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan-300 focus:ring-cyan-300/20"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-cyan-700 focus:ring-cyan-700/20"
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <Link
                to={carryForwarded ? `/agency/recommendations/${carryForwarded.id}/investigate` : "/agency/facilities"}
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
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                <CheckCircle2 size={15} />
                <span>{carryForwarded ? "Commission Facility & Install" : "Add Facility"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AddFacilityPage;