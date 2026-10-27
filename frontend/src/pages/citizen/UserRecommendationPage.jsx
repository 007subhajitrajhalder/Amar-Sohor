import ApiState from "../../components/ApiState";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  Compass,
  Car,
  DoorOpen,
  Droplets,
  HelpCircle,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { submitRecommendationApi, API_BASE_URL } from "../../api/client";
import { useApi } from "../../api/useApi";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const CATEGORY_META = {
  dustbin: {
    icon: Trash2,
    short: "Dustbin",
    description: "Public trash can, segregation bins or waste disposal spot",
  },
  water_point: {
    icon: Droplets,
    short: "Drinking Water",
    description: "Clean drinking water fountain, cooler or RO dispenser",
  },
  water: {
    icon: Droplets,
    short: "Drinking Water",
    description: "Clean drinking water fountain, cooler or RO dispenser",
  },
  toilet: {
    icon: DoorOpen,
    short: "Public Toilet",
    description: "Sanitary public washroom for men, women, or all-gender/accessible",
  },
  parking: {
    icon: Car,
    short: "Parking Spot",
    description: "Designated two-wheeler or four-wheeler civic parking area",
  },
};

const DEFAULT_META = {
  icon: MapPin,
  short: "Civic Amenity",
  description: "Proposed civic infrastructure or public facility",
};

const FALLBACK_FACILITY_OPTIONS = [
  {
    id: "1",
    categoryId: 1,
    categoryName: "DUSTBIN",
    label: "Dustbin / Waste Bin",
    short: "Dustbin",
    icon: Trash2,
    description: "Public trash can, segregation bins or waste disposal spot",
    agencyName: "KMC SWM Department",
  },
  {
    id: "2",
    categoryId: 2,
    categoryName: "TOILET",
    label: "Public Toilet / Restroom",
    short: "Public Toilet",
    icon: DoorOpen,
    description: "Sanitary public washroom for men, women, or all-gender/accessible",
    agencyName: "KMC Sanitation Department",
  },
  {
    id: "3",
    categoryId: 3,
    categoryName: "WATER_POINT",
    label: "Drinking Water Point",
    short: "Drinking Water",
    icon: Droplets,
    description: "Clean drinking water fountain, cooler or RO dispenser",
    agencyName: "KMC Water Department",
  },
  {
    id: "4",
    categoryId: 4,
    categoryName: "PARKING",
    label: "Parking Spot / Zone",
    short: "Parking Spot",
    icon: Car,
    description: "Designated two-wheeler or four-wheeler civic parking area",
    agencyName: "Kolkata Police",
  },
];

function UserRecommendationPage() {
  const navigate = useNavigate();

  const categoriesQuery = useApi("/facilities/categories", { poll: 0 });

  const facilityOptions = useMemo(() => {
    if (!categoriesQuery.data || !Array.isArray(categoriesQuery.data) || categoriesQuery.data.length === 0) {
      return FALLBACK_FACILITY_OPTIONS;
    }
    return categoriesQuery.data.map((cat) => {
      const key = (cat.category_name || "").toLowerCase();
      const meta =
        CATEGORY_META[key] ||
        Object.entries(CATEGORY_META).find(([k]) => key.includes(k))?.[1] ||
        DEFAULT_META;
      return {
        id: String(cat.category_id),
        categoryId: cat.category_id,
        categoryName: cat.category_name,
        label: cat.display_name || cat.category_name,
        short: meta.short || cat.display_name,
        icon: meta.icon,
        description: meta.description,
        agencyName: cat.agency_name,
      };
    });
  }, [categoriesQuery.data]);

  const [title, setTitle] = useState("");
  const [facilityType, setFacilityType] = useState("1");

  useEffect(() => {
    if (facilityOptions.length > 0 && !facilityOptions.some((f) => f.id === String(facilityType))) {
      setFacilityType(String(facilityOptions[0].id));
    }
  }, [facilityOptions, facilityType]);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
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

    setPhotoFile(file);
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
    setPhotoFile(null);
  };

  // Form submission
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please provide a title for your recommendation.");
      return;
    }

    if (!location.trim()) {
      alert("Please provide the address or location description.");
      return;
    }

    const latTrimmed = String(latitude).trim();
    const lngTrimmed = String(longitude).trim();

    if (!latTrimmed || isNaN(Number(latTrimmed)) || Number(latTrimmed) < -90 || Number(latTrimmed) > 90) {
      alert("Please enter a valid Latitude between -90 and 90 (or click 'Detect My Location').");
      return;
    }

    if (!lngTrimmed || isNaN(Number(lngTrimmed)) || Number(lngTrimmed) < -180 || Number(lngTrimmed) > 180) {
      alert("Please enter a valid Longitude between -180 and 180 (or click 'Detect My Location').");
      return;
    }

    if (!description.trim()) {
      alert("Please explain why this facility is needed here.");
      return;
    }

    if (!photoPreview) {
      alert("Please upload a photo of the location before submitting.");
      return;
    }

    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    const selectedFacilityMeta =
      facilityOptions.find((f) => String(f.id) === String(facilityType)) || facilityOptions[0];
    let newRecommendation;

    try {
      const latNum = latitude !== "" && !isNaN(Number(latitude))
        ? Number(latitude)
        : (coordinates?.lat !== undefined ? Number(coordinates.lat) : null);
      const lngNum = longitude !== "" && !isNaN(Number(longitude))
        ? Number(longitude)
        : (coordinates?.lng !== undefined ? Number(coordinates.lng) : null);

      const backendData = await submitRecommendationApi({
        title: title.trim(),
        description: description.trim(),
        address: location.trim(),
        categoryId: Number(selectedFacilityMeta.categoryId || selectedFacilityMeta.id),
        facilityType: selectedFacilityMeta.categoryName?.toLowerCase() || "dustbin",
        latitude: latNum,
        longitude: lngNum,
        landmark: landmark.trim(),
        photoFile: photoFile,
        photoUrl: photoPreview,
      });

      const photoUrlResolved = backendData.photo_url?.startsWith("/uploads")
        ? `${API_BASE_URL}${backendData.photo_url}`
        : (backendData.photo_url || photoPreview);

      newRecommendation = {
        id: backendData.recommendation_id,
        backendId: backendData.recommendation_id,
        title: backendData.title,
        facilityType: backendData.facility_type || facilityType,
        facilityLabel: backendData.facility_label || selectedFacilityMeta?.short || facilityType,
        location: location.trim(),
        latitude: backendData.latitude !== undefined && backendData.latitude !== null ? backendData.latitude : (latNum ?? null),
        longitude: backendData.longitude !== undefined && backendData.longitude !== null ? backendData.longitude : (lngNum ?? null),
        coordinates: (latNum !== null && lngNum !== null) ? { lat: latNum, lng: lngNum } : null,
        landmark: landmark.trim(),
        description: backendData.description,
        photoPreview: photoPreview || photoUrlResolved,
        photoName: photoName || "Recommendation photo",
        photoUrl: photoUrlResolved,
        createdAt: backendData.created_at || new Date().toISOString(),
        status: "Pending Admin Review",
        stage: backendData.stage || 1,
        assignedAgency: {
          id: backendData.assigned_agency,
          name: backendData.agency_name || "Responsible Civic Agency"
        },
        assignedMember: null,
        reviewDepartment: backendData.review_department || backendData.agency_name,
        reviewNotes: backendData.review_notes || "Allotted to Municipal Admin for review and allocation to designated agency member.",
      };
    } catch (apiErr) {
      setError(apiErr.message);
      return;
    } finally {
      setIsSubmitting(false);
    }
    setSubmittedData(newRecommendation);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setTitle("");
    setFacilityType(String(facilityOptions[0]?.id || "1"));
    setLocation("");
    setLatitude("");
    setLongitude("");
    setCoordinates(null);
    setLandmark("");
    setDescription("");
    setPhotoPreview(null);
    setPhotoName("");
    setPhotoFile(null);
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const selectedFacilityMeta =
    facilityOptions.find((f) => String(f.id) === String(facilityType)) || facilityOptions[0] || FALLBACK_FACILITY_OPTIONS[0];
  const FacilityIcon = selectedFacilityMeta?.icon || Trash2;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-10 w-10 rounded-full border border-lime-300/30 object-cover shadow-lg shadow-lime-300/10"
            />
            <div className="leading-tight">
              <span className="text-xl font-bold tracking-wide">
                Amar <span className="text-lime-300">Sohor</span>
              </span>
              <p className="text-[10px] tracking-wider text-white/50 uppercase">Civic Intelligence</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/citizen/my-recommendations"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold hover:border-lime-300/50 hover:bg-lime-300/10 hover:text-lime-300 transition"
            >
              My Proposals
            </Link>

            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold hover:border-lime-300/50 hover:bg-lime-300/10 hover:text-lime-300 transition"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 mx-auto max-w-4xl px-4 py-8 md:px-8">
        <section>
          {/* Breadcrumbs / Page Tag */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-300">
            <Sparkles size={14} />
            <span>Civic Proposal Engine</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50">Direct Public Proposal</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl lg:text-4xl">
            Recommend a New Public Facility
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-white/60">
            Citizens can directly suggest locations where new waste bins, drinking water coolers, public toilets, or parking spots are needed. Your proposal will be directly submitted to the Municipal Administrator for allocation to designated field agencies.
          </p>

          <ApiState error={error} />

          {/* Submission Success View */}
          {isSubmitted && submittedData ? (
            <div className="mt-6 rounded-2xl border border-lime-300/30 bg-black/40 p-6 text-center backdrop-blur-2xl md:p-8 animate-fadeIn">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-300/40 bg-lime-300/15 text-lime-300 shadow-lg shadow-lime-300/20">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:text-2xl text-white">
                Recommendation Registered!
              </h2>

              <p className="mt-1 text-sm font-mono text-lime-300/90 font-semibold">
                ID: REC-{String(submittedData.id).padStart(4, "0")}
              </p>

              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/70">
                Your proposal has been logged in the Municipal Administration Registry and assigned to the review pipeline for feasibility survey.
              </p>

              {/* Summary card */}
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Title</p>
                    <p className="mt-0.5 font-semibold text-white">{submittedData.title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-lime-300">
                      {submittedData.facilityLabel}
                    </span>
                    <span className="rounded-lg bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                      ● Allotted to Municipal Admin
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Location</p>
                  <p className="mt-0.5 text-white/80 flex items-center gap-1.5">
                    <MapPin size={15} className="text-lime-300 shrink-0" />
                    {submittedData.location}
                  </p>
                  {(submittedData.latitude !== null && submittedData.latitude !== undefined && submittedData.longitude !== null && submittedData.longitude !== undefined) && (
                    <p className="mt-1 font-mono text-xs text-lime-300/80 flex items-center gap-1">
                      <Compass size={13} className="text-lime-300 shrink-0" />
                      Lat: {submittedData.latitude}, Long: {submittedData.longitude}
                    </p>
                  )}
                </div>

                {submittedData.landmark && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Landmark</p>
                    <p className="mt-0.5 text-white/70">{submittedData.landmark}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Review Authority & Designated Agency</p>
                  <p className="mt-0.5 text-white/90 font-medium">
                    Municipal Administration (Admin Queue)
                    <span className="ml-2 text-lime-300 font-semibold">
                      • {submittedData.assignedAgency?.name || "Civic Agency"}
                    </span>
                  </p>
                </div>

                {submittedData.reviewNotes && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Status & Allocation Plan</p>
                    <p className="mt-0.5 text-xs text-white/70 leading-relaxed bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      {submittedData.reviewNotes}
                    </p>
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
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
                <Link
                  to={`/citizen/recommendations/${submittedData.id}`}
                  className="w-full sm:w-auto rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/15"
                >
                  Track Recommendation Status
                </Link>
                
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/15 hover:text-white transition"
                >
                  Recommend Another Facility
                </button>
              </div>
            </div>
          ) : (
            /* Recommendation Form */
            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6"
            >
              {/* Facility Type Selector (Dropdown / Select) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="facility-type" className="text-xs font-medium text-white/70">
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
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1427] px-4 py-3 pl-11 text-sm text-white outline-none transition focus:border-lime-300/50 focus:ring-1 focus:ring-lime-300/30"
                  >
                    {facilityOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#0c1427] text-white py-2">
                        {opt.label} {opt.agencyName ? `— (${opt.agencyName})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lime-300">
                    <FacilityIcon size={18} />
                  </div>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                </div>
                <p className="text-xs text-white/40">{selectedFacilityMeta.description}</p>
              </div>

              {/* Title / Summary */}
              <div className="space-y-1.5">
                <label htmlFor="facility-title" className="text-xs font-medium text-white/70">
                  Proposal Title / Headline <span className="text-lime-300">*</span>
                </label>
                <input
                  id="facility-title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drinking water point needed near Deshapriya Park Gate 2"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
                <p className="text-xs text-white/35">
                  Provide a concise name or summary for the proposed spot.
                </p>
              </div>

              {/* Current Location Input & GPS Auto-Detection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="facility-location" className="text-xs font-medium text-white/70">
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
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 pl-10 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                    />
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lime-300"
                    />
                  </div>

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/10 px-3.5 py-3 text-xs sm:text-sm font-semibold text-lime-300 transition duration-200 hover:bg-lime-300 hover:text-black disabled:opacity-50"
                  >
                    <Navigation size={15} className={isLocating ? "animate-spin" : ""} />
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

              {/* Latitude and Longitude Input Fields */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="facility-latitude" className="text-xs font-medium text-white/70">
                      Latitude <span className="text-lime-300">*</span>
                    </label>
                    <span className="text-[10px] text-white/40">-90 to 90</span>
                  </div>
                  <div className="relative">
                    <input
                      id="facility-latitude"
                      required
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={latitude}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLatitude(val);
                        if (val !== "" && longitude !== "") {
                          setCoordinates({ lat: val, lng: longitude });
                        }
                      }}
                      placeholder="e.g. 22.572646"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 pl-10 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                    />
                    <Compass
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lime-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="facility-longitude" className="text-xs font-medium text-white/70">
                      Longitude <span className="text-lime-300">*</span>
                    </label>
                    <span className="text-[10px] text-white/40">-180 to 180</span>
                  </div>
                  <div className="relative">
                    <input
                      id="facility-longitude"
                      required
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={longitude}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLongitude(val);
                        if (latitude !== "" && val !== "") {
                          setCoordinates({ lat: latitude, lng: val });
                        }
                      }}
                      placeholder="e.g. 88.363895"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 pl-10 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                    />
                    <Compass
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lime-300"
                    />
                  </div>
                </div>
              </div>

              {/* Nearby Landmark */}
              <div className="space-y-1.5">
                <label htmlFor="landmark" className="text-xs font-medium text-white/70">
                  Nearby Landmark or Area (Optional)
                </label>
                <input
                  id="landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Metro station exit, beside the tea stall"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Description & Justification */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-medium text-white/70">
                  Why is this facility needed here? (Description / Context) <span className="text-lime-300">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the local requirement (e.g. high morning commuter rush, nearest trash bin is over 700m away, visitors lack drinking water...)"
                  className="min-h-[90px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Photo of the Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70">
                  Photo of the Location <span className="text-lime-300">*</span>
                </label>

                {photoPreview ? (
                  /* Preview with clear button */
                  <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/40 p-2.5">
                    <img
                      src={photoPreview}
                      alt="Location snapshot preview"
                      className="max-h-56 w-full rounded-lg object-cover"
                    />
                    <div className="mt-2.5 flex items-center justify-between px-2 text-xs">
                      <span className="truncate max-w-xs text-white/60 font-mono">
                        {photoName || "Uploaded image"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-500/10 px-2 py-1 text-red-300 hover:bg-red-500 hover:text-white transition"
                      >
                        <X size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload placeholder */
                  <label
                    htmlFor="location-photo"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.025] p-5 sm:p-6 text-center transition duration-200 hover:border-lime-300/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300/10 text-lime-300 transition duration-300 group-hover:scale-110 group-hover:bg-lime-300 group-hover:text-black">
                      <Camera size={20} />
                    </div>
                    <span className="mt-2.5 block text-sm font-bold text-white">
                      Upload Location Photograph
                    </span>
                    <span className="mt-0.5 block text-xs text-white/40">
                      Snap or upload a photo of the sidewalk, corner, or spot (PNG, JPG up to 10 MB)
                    </span>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
                      <Upload size={13} /> Select Image File
                    </div>
                    <input
                      id="location-photo"
                      type="file"
                      accept="image/*"
                      required
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-3 text-sm font-bold text-black shadow-lg shadow-lime-300/10 transition duration-200 hover:bg-lime-200 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
              >
                <span>{isSubmitting ? "Routing to Nearest Agency Member..." : "Submit Facility Recommendation"}</span>
                <Send size={16} className={isSubmitting ? "animate-pulse" : ""} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <HelpCircle size={13} />
                <span>
                  Recommendations are routed to the relevant municipal civic works department.
                </span>
              </div>
            </form>
          )}

          {/* Quick Facility Guide Cards */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-white/40 mb-3">
              What facilities can you recommend?
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {facilityOptions.map((item) => {
                const Icon = item.icon || MapPin;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                      <Icon size={17} />
                    </div>
                    <h4 className="mt-2.5 text-sm font-semibold text-white">{item.short}</h4>
                    <p className="mt-1 text-xs text-white/40 line-clamp-2">
                      {item.description}
                    </p>
                    {item.agencyName && (
                      <span className="mt-2 block text-[10px] text-lime-300/75 font-medium truncate">
                        {item.agencyName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex">
              <Link
                to="/map"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-3 text-sm font-bold text-black shadow-md shadow-lime-300/10 transition duration-300 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
              >
                Any reports regarding existing facilities?
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-lime-300/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-lime-300/30 bg-white/[0.08] shadow-lg shadow-lime-300/10 backdrop-blur-md transition duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Amar Sohor Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-wide text-white">
                    Amar <span className="text-lime-300">Sohor</span>
                  </h3>
                  <p className="mt-1 text-[11px] tracking-wide text-white/40">
                    My City. My Responsibility.
                  </p>
                </div>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
                A citizen-centric smart city platform designed to help people discover public facilities and stay connected with their city.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                <span className="h-px w-12 bg-lime-300/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
                  Smart City Platform
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Contact Us
              </h4>

              <div className="mt-4 flex flex-col gap-4">
                <a href="mailto:amersohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amersohor@gmail.com
                    </p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Phone size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Phone</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Follow Us
              </h4>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Stay connected with Amar Sohor and follow our latest updates across social platforms.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">f</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">◎</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </a>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-white/35">
              © 2026 Amar Sohor. All rights reserved.
            </p>

            <p className="text-xs text-white/35">
              Making cities smarter, cleaner and more connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserRecommendationPage;
