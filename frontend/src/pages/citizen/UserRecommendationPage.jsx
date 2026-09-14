import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  Car,
  DoorOpen,
  Droplets,
  HelpCircle,
  MapPin,
  Navigation,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

const FACILITY_OPTIONS = [
  {
    id: "dustbin",
    label: "Dustbin / Waste Bin",
    short: "Dustbin",
    icon: Trash2,
    description: "Public trash can, segregation bins or waste disposal spot",
  },
  {
    id: "water",
    label: "Water Dispenser / Drinking Water Point",
    short: "Water Dispenser",
    icon: Droplets,
    description: "Clean drinking water fountain, cooler or RO dispenser",
  },
  {
    id: "toilet",
    label: "Public Toilet / Restroom",
    short: "Public Toilet",
    icon: DoorOpen,
    description: "Sanitary public washroom for men, women, or all-gender/accessible",
  },
  {
    id: "parking",
    label: "Parking Spot / Zone",
    short: "Parking Spot",
    icon: Car,
    description: "Designated two-wheeler or four-wheeler civic parking area",
  },
];

function UserRecommendationPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [facilityType, setFacilityType] = useState("dustbin");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setCoordinates({ lat, lng });

        // If location text is empty or previous coordinates, auto-populate
        if (!location || location.includes("Lat:")) {
          setLocation(`Lat: ${lat}, Long: ${lng}`);
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enter manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable. Please enter manually.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again or enter manually.");
            break;
          default:
            setLocationError("Unable to retrieve location. Please enter manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size should be less than 10MB.");
      return;
    }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName("");
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please provide a title for your recommendation.");
      return;
    }

    if (!location.trim() && !coordinates) {
      alert("Please provide the location or use 'Detect My Location'.");
      return;
    }

    const selectedFacilityMeta = FACILITY_OPTIONS.find((f) => f.id === facilityType);

    const newRecommendation = {
      id: "REC-" + Date.now(),
      title: title.trim(),
      facilityType,
      facilityLabel: selectedFacilityMeta?.short || facilityType,
      location: location.trim(),
      coordinates: coordinates || null,
      landmark: landmark.trim(),
      description: description.trim(),
      photoPreview: photoPreview || null,
      photoName: photoName || null,
      createdAt: new Date().toISOString(),
      status: "Under Review",
    };

    // Store in localStorage for persistence
    try {
      const existing = JSON.parse(
        localStorage.getItem("citizen_recommendations") || "[]"
      );
      existing.unshift(newRecommendation);
      localStorage.setItem("citizen_recommendations", JSON.stringify(existing));
    } catch {
      // ignore storage quota error
    }

    setSubmittedData(newRecommendation);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setTitle("");
    setFacilityType("dustbin");
    setLocation("");
    setCoordinates(null);
    setLandmark("");
    setDescription("");
    setPhotoPreview(null);
    setPhotoName("");
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const selectedFacilityMeta =
    FACILITY_OPTIONS.find((f) => f.id === facilityType) || FACILITY_OPTIONS[0];
  const FacilityIcon = selectedFacilityMeta.icon;

  return (
    <div className="relative min-h-screen bg-[#070b18] text-white">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-lime-300/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-11 w-11 rounded-full border border-lime-300/20 object-cover"
            />
            <h1 className="text-xl font-bold md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/my-recommendations"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
            >
              My Recommendations
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-3xl">
          {/* Header titles */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3.5 py-1 text-xs font-bold tracking-[3px] text-lime-300 uppercase">
              <Sparkles size={13} />
              Citizen Voice & Urban Planning
            </div>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              Recommend a <span className="text-lime-300">Facility</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/50 max-w-2xl">
              Spot an area that needs a dustbin, drinking water point, public toilet, or parking spot? Propose a new location to help municipal authorities improve city infrastructure.
            </p>
          </div>

          {/* Submitted State */}
          {isSubmitted && submittedData ? (
            <div className="mt-8 rounded-[28px] border border-lime-300/30 bg-white/[0.045] p-6 text-center shadow-2xl backdrop-blur-2xl md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-300/20 text-lime-300">
                <CheckCircle2 size={36} />
              </div>

              <span className="mt-5 inline-block rounded-full bg-lime-300/15 px-3.5 py-1 text-xs font-semibold text-lime-300">
                Recommendation Submitted • {submittedData.id}
              </span>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Thank you for your civic contribution!
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm text-white/60">
                Your recommendation for a new{" "}
                <strong className="text-lime-300 font-semibold">
                  {submittedData.facilityLabel}
                </strong>{" "}
                has been logged. Civic planning officers will review the area feasibility and inspect the spot.
              </p>

              {/* Summary card */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-left text-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Title</p>
                    <p className="mt-0.5 font-semibold text-white">{submittedData.title}</p>
                  </div>
                  <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-lime-300">
                    {submittedData.facilityLabel}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Location</p>
                  <p className="mt-0.5 text-white/80 flex items-center gap-1.5">
                    <MapPin size={15} className="text-lime-300 shrink-0" />
                    {submittedData.location}
                  </p>
                </div>

                {submittedData.landmark && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Landmark</p>
                    <p className="mt-0.5 text-white/70">{submittedData.landmark}</p>
                  </div>
                )}

                {submittedData.description && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Reason / Details</p>
                    <p className="mt-0.5 text-white/70">{submittedData.description}</p>
                  </div>
                )}

                {submittedData.photoPreview && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1.5">Uploaded Photo</p>
                    <img
                      src={submittedData.photoPreview}
                      alt="Location preview"
                      className="h-36 w-full rounded-xl border border-white/10 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/citizen/recommendations/${submittedData.id}`}
                  className="w-full sm:w-auto rounded-xl bg-lime-300 px-6 py-3 font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/15"
                >
                  Track Recommendation Status
                </Link>
                
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 font-semibold text-white/80 hover:bg-white/15 hover:text-white transition"
                >
                  Recommend Another Facility
                </button>
                
              </div>
            </div>
          ) : (
            /* Recommendation Form */
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-6 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8"
            >
              {/* Facility Type Selector (Dropdown / Select) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="facility-type" className="text-sm font-medium text-white/70">
                    Type of Facility Recommendation <span className="text-lime-300">*</span>
                  </label>
                  <span className="text-xs text-white/40">Choose from categories</span>
                </div>

                <div className="relative">
                  <select
                    id="facility-type"
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1427] px-4 py-3.5 pl-12 text-sm text-white outline-none transition focus:border-lime-300/50 focus:ring-1 focus:ring-lime-300/30"
                  >
                    {FACILITY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#0c1427] text-white py-2">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lime-300">
                    <FacilityIcon size={20} />
                  </div>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Facility quick preview pill */}
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.025] px-3 py-2 text-xs text-white/50 border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shrink-0" />
                  <span>{selectedFacilityMeta.description}</span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="recommendation-title" className="text-sm font-medium text-white/70">
                  Recommendation Title <span className="text-lime-300">*</span>
                </label>
                <input
                  id="recommendation-title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Install twin dustbins near Sector V bus terminus"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
                <p className="text-xs text-white/35">
                  Provide a concise name or summary for the proposed spot.
                </p>
              </div>

              {/* Current Location Input & GPS Auto-Detection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="facility-location" className="text-sm font-medium text-white/70">
                    Current Location of the User / Spot <span className="text-lime-300">*</span>
                  </label>
                  {coordinates && (
                    <span className="inline-flex items-center gap-1 text-xs text-lime-300 font-mono">
                      <MapPin size={12} />
                      {coordinates.lat}, {coordinates.lng}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      id="facility-location"
                      required
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Near Gate 2, Deshapriya Park, Rashbehari Ave"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3.5 pl-11 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                    />
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lime-300"
                    />
                  </div>

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-3.5 text-sm font-semibold text-lime-300 transition duration-200 hover:bg-lime-300 hover:text-black disabled:opacity-50"
                  >
                    <Navigation size={16} className={isLocating ? "animate-spin" : ""} />
                    <span>{isLocating ? "Detecting GPS..." : "Detect My Location"}</span>
                  </button>
                </div>

                {locationError && (
                  <p className="text-xs text-amber-300/90">{locationError}</p>
                )}

                <p className="text-xs text-white/35">
                  Click &ldquo;Detect My Location&rdquo; to use your current GPS position or enter the street address manually.
                </p>
              </div>

              {/* Nearby Landmark */}
              <div className="space-y-2">
                <label htmlFor="landmark" className="text-sm font-medium text-white/70">
                  Nearby Landmark or Area (Optional)
                </label>
                <input
                  id="landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Metro station exit, beside the tea stall"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Description & Justification */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-white/70">
                  Why is this facility needed here? (Description / Context)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the local requirement (e.g. high morning commuter rush, nearest trash bin is over 700m away, visitors lack drinking water...)"
                  className="min-h-[100px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Photo of the Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">
                  Photo of the Location
                </label>

                {photoPreview ? (
                  /* Preview with clear button */
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-3">
                    <img
                      src={photoPreview}
                      alt="Location snapshot preview"
                      className="max-h-64 w-full rounded-xl object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between px-2 text-xs">
                      <span className="truncate max-w-xs text-white/60 font-mono">
                        {photoName || "Uploaded image"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-red-300 hover:bg-red-500 hover:text-white transition"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload placeholder */
                  <label
                    htmlFor="location-photo"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.025] p-8 text-center transition duration-200 hover:border-lime-300/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-300/10 text-lime-300 transition duration-300 group-hover:scale-110 group-hover:bg-lime-300 group-hover:text-black">
                      <Camera size={22} />
                    </div>
                    <span className="mt-3 block text-sm font-bold text-white">
                      Upload Location Photograph
                    </span>
                    <span className="mt-1 block text-xs text-white/40">
                      Snap or upload a photo of the sidewalk, corner, or spot (PNG, JPG up to 10 MB)
                    </span>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/70">
                      <Upload size={13} /> Select Image File
                    </div>
                    <input
                      id="location-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-4 font-bold text-black shadow-lg shadow-lime-300/10 transition duration-200 hover:bg-lime-200 hover:scale-[1.01]"
              >
                <span>Submit Facility Recommendation</span>
                <Send size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <HelpCircle size={14} />
                <span>
                  Recommendations are routed to the relevant municipal civic works department.
                </span>
              </div>
            </form>
          )}

          {/* Quick Facility Guide Cards */}
          <div className="mt-12">
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-white/40 mb-4">
              What facilities can you recommend?
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {FACILITY_OPTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                      <Icon size={18} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-white">{item.short}</h4>
                    <p className="mt-1 text-xs text-white/40 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 px-5 py-9 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            <b className="text-white">
              Amar <span className="text-lime-300">Sohor</span>
            </b>
            <br />
            My City. My Responsibility.
          </p>
          <p>© 2026 Amar Sohor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default UserRecommendationPage;

