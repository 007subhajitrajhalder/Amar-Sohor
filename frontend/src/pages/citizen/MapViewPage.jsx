import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { facilityView, suggestLocationsApi } from "../../api/client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Navigation,
  Trash2,
  DoorOpen,
  Car,
  Droplets,
  ChevronRight,
  Star,
  Clock,
  Phone,
  Mail,
  Flag,
} from "lucide-react";
import Select from "../../components/Select";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;


function getFacilityIcon(category) {
  const icons = {
    dustbin: Trash2,
    toilet: DoorOpen,
    parking: Car,
    water: Droplets,
    all: MapPin,
  };

  return icons[category] || MapPin;
}

function facilityIcon(category, props) {
  const Icon = getFacilityIcon(category);
  return <Icon {...props} />;
}

function parseCoords(text) {
  if (!text) return null;
  const match = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

function MapViewPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";
  const urlLocation = searchParams.get("location") || "";
  const urlLat = searchParams.get("lat");
  const urlLng = searchParams.get("lng");

  const [location, setLocation] = useState(urlLocation);
  const [coords, setCoords] = useState(() => {
    if (urlLat && urlLng && !isNaN(parseFloat(urlLat)) && !isNaN(parseFloat(urlLng))) {
      return { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
    }
    return parseCoords(urlLocation);
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  // Sync state if URL search parameters change externally
  useEffect(() => {
    if (urlLocation !== location) {
      setLocation(urlLocation);
    }
    if (urlLat && urlLng && !isNaN(parseFloat(urlLat)) && !isNaN(parseFloat(urlLng))) {
      setCoords({ lat: parseFloat(urlLat), lng: parseFloat(urlLng) });
    } else {
      setCoords(parseCoords(urlLocation));
    }
  }, [urlLocation, urlLat, urlLng]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when typing or opening dropdown
  useEffect(() => {
    if (!showSuggestions) return;
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const data = await suggestLocationsApi(location);
        if (active) setSuggestions(data || []);
      } catch (err) {
        if (active) console.error("Failed to load suggestions:", err);
      } finally {
        if (active) setIsLoadingSuggestions(false);
      }
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [location, showSuggestions]);

  // Construct API endpoint: Haversine SQL query triggered when coords are present
  const apiPath = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (coords && coords.lat != null && coords.lng != null) {
      params.set("latitude", coords.lat);
      params.set("longitude", coords.lng);
      params.set("radius_km", "1.0");
    }
    const qs = params.toString();
    return "/facilities" + (qs ? "?" + qs : "");
  }, [selectedCategory, coords]);

  const resource = useApi(apiPath);
  const facilityList = (resource.data || []).map(facilityView);

  const categoryLabel = {
    all: "All Categories",
    dustbin: "Dustbin",
    toilet: "Public Toilet",
    water: "Drinking Water",
    parking: "Parking",
  };

  const currentCategoryLabel =
    categoryLabel[selectedCategory] || "Facilities";

  const mapQuery = coords
    ? `${coords.lat},${coords.lng}`
    : selectedCategory === "all"
    ? "public facilities Kolkata India"
    : `${currentCategoryLabel} Kolkata India`;

  // CATEGORY DROPDOWN
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    const nextParams = {};
    if (newCategory !== "all") nextParams.category = newCategory;
    if (location) nextParams.location = location;
    if (coords) {
      nextParams.lat = String(coords.lat);
      nextParams.lng = String(coords.lng);
    }
    setSearchParams(nextParams);
  };

  // SELECT SUGGESTION
  const handleSelectSuggestion = (suggestion) => {
    const newCoords = { lat: suggestion.latitude, lng: suggestion.longitude };
    setLocation(suggestion.label);
    setCoords(newCoords);
    setShowSuggestions(false);
    const nextParams = {};
    if (selectedCategory !== "all") nextParams.category = selectedCategory;
    nextParams.location = suggestion.label;
    nextParams.lat = String(suggestion.latitude);
    nextParams.lng = String(suggestion.longitude);
    setSearchParams(nextParams);
  };

  // CURRENT LOCATION
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(5));
        const longitude = Number(position.coords.longitude.toFixed(5));
        const locStr = `${latitude}, ${longitude}`;

        setLocation(locStr);
        setCoords({ lat: latitude, lng: longitude });
        setShowSuggestions(false);
        const nextParams = {};
        if (selectedCategory !== "all") nextParams.category = selectedCategory;
        nextParams.location = locStr;
        nextParams.lat = String(latitude);
        nextParams.lng = String(longitude);
        setSearchParams(nextParams);
      },
      () => {
        alert("Unable to access your current location.");
      }
    );
  };

  // SEARCH SUBMIT
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const trimmed = location.trim();
    if (!trimmed) {
      setCoords(null);
      setSearchParams(selectedCategory !== "all" ? { category: selectedCategory } : {});
      return;
    }

    const parsed = parseCoords(trimmed);
    if (parsed) {
      setCoords(parsed);
      const nextParams = {};
      if (selectedCategory !== "all") nextParams.category = selectedCategory;
      nextParams.location = trimmed;
      nextParams.lat = String(parsed.lat);
      nextParams.lng = String(parsed.lng);
      setSearchParams(nextParams);
      return;
    }

    try {
      const fetched = await suggestLocationsApi(trimmed);
      const match = fetched.find(s => s.label.toLowerCase() === trimmed.toLowerCase()) || fetched[0];
      if (match) handleSelectSuggestion(match);
    } catch (err) {
      console.error(err);
    }
  };

  // CLEAR LOCATION
  const handleClearLocation = () => {
    setLocation("");
    setCoords(null);
    setSearchParams(selectedCategory !== "all" ? { category: selectedCategory } : {});
  };

  // REPORT ISSUE
  const handleReportIssue = (facility) => {
    navigate(`/citizen/report-issue/${facility.id}`);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-[100] border-b border-white/10 bg-[#07101f]/75 px-4 py-4 backdrop-blur-2xl md:px-8">
        <div className="flex items-center justify-between px-2 py-1">

          {/* LOGO */}

          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-lime-300/20 bg-white/[0.06] shadow-lg shadow-lime-300/10 transition duration-300 group-hover:scale-105">
              <img
                src={logo}
                alt="Amar Sohor Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="m-0 text-xl font-bold leading-none tracking-wide md:text-2xl">
                Amar <span className="text-lime-300">Sohor</span>
              </h1>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-lime-300/30 hover:bg-lime-300 hover:text-black"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">
              Back to Previous Page
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-30">
        <ApiState {...resource} />

        {/* =====================================================
            SEARCH / HERO
        ====================================================== */}

        <section className="relative z-40 overflow-visible px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">

            {/* Breadcrumb */}

            <div className="mb-4 flex items-center gap-2 text-xs text-white/35">
              <Link to="/" className="transition hover:text-lime-300">
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white/65">
                {currentCategoryLabel}
              </span>
            </div>

            {/* HERO */}

            <div className="max-w-4xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.08] px-3.5 py-1.5 backdrop-blur-md">
                {facilityIcon(selectedCategory, {
                  size: 14,
                  className: "text-lime-300",
                })}

                <span className="text-[11px] font-medium tracking-[2px] text-lime-200">
                  SMART CITY FACILITIES
                </span>
              </div>

              <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Find{" "}
                <span className="text-lime-300">
                  {selectedCategory === "all" ? "Facilities" : currentCategoryLabel}
                </span>
                <br />
                Near You.
              </h2>

              <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50">
                {coords
                  ? "Locate registered public facilities around your current location. Showing nearest facilities within 1 km, arranged in order of proximity."
                  : "Locate registered public facilities around Kolkata. Enter or choose your location to view facilities within 1 km, or explore all available facilities below."}
              </p>
            </div>

            {/* SEARCH BOX */}

            <div className="relative z-50 mt-6 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-xl shadow-black/30 backdrop-blur-2xl">
              <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 md:flex-row">

                {/* LOCATION INPUT WITH AUTOCOMPLETE SUGGESTIONS */}

                <div ref={searchBoxRef} className="relative flex min-h-[52px] flex-1 items-center gap-3 rounded-xl bg-white/[0.045] px-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-lime-300">
                    <MapPin size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      Your Location
                    </p>

                    <input
                      type="text"
                      value={location}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setShowSuggestions(false);
                      }}
                      placeholder="Enter location (e.g. Park Street, Esplanade)"
                      className="mt-0.5 w-full bg-transparent text-xs text-white outline-none placeholder:text-white/25 sm:text-sm"
                    />
                  </div>

                  {location && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="text-xs text-white/40 hover:text-white"
                      title="Clear location"
                    >
                      ✕
                    </button>
                  )}

                  {/* AUTOCOMPLETE SUGGESTIONS DROPDOWN */}
                  {showSuggestions && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[1000] max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-[#07101f] p-2 shadow-2xl backdrop-blur-2xl">
                      {isLoadingSuggestions && suggestions.length === 0 ? (
                        <div className="p-3 text-center text-xs text-white/40">
                          Finding locations...
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((item, idx) => (
                          <button
                            key={item.label + idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/10"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-300/15 text-lime-300">
                              <MapPin size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                {item.label}
                              </p>
                              <p className="truncate text-[10px] text-white/45 sm:text-xs">
                                {item.address}
                              </p>
                            </div>
                            <span className="shrink-0 text-[10px] font-medium text-lime-300/80">
                              Select
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-white/40">
                          No locations found matching &quot;{location}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CURRENT LOCATION */}

                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-medium text-white/60 transition duration-300 hover:border-lime-300/20 hover:bg-white/[0.06] hover:text-lime-300 sm:text-sm"
                >
                  <Navigation size={15} />
                  Use Current Location
                </button>

                {/* CATEGORY SELECT */}
                <div className="w-full md:w-[220px]">
                  <Select
                    id="facility-category"
                    aria-label="Facility category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    options={[
                      { value: "all", label: "All Categories" },
                      { value: "toilet", label: "Public Toilet" },
                      { value: "dustbin", label: "Dustbin" },
                      { value: "water", label: "Drinking Water" },
                      { value: "parking", label: "Parking" },
                    ]}
                  />
                </div>

                {/* SEARCH */}

                <button
                  type="submit"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 text-xs sm:text-sm font-bold text-black shadow-md shadow-lime-300/10 transition duration-300 hover:bg-lime-200"
                >
                  <Search size={16} />
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAP — SECOND SECTION
        ====================================================== */}

        <section id="map" className="relative z-10 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-[11px] font-bold tracking-[3px] text-lime-300">
                  LOCATION MAP
                </p>

                <h2 className="mt-1.5 text-xl font-bold md:text-2xl">
                  {currentCategoryLabel}{" "}
                  <span className="text-white/45">
                    {coords ? "near your location" : "near Kolkata"}
                  </span>
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  {coords
                    ? `Centered on ${location || "selected location"} within 1 km radius.`
                    : `Explore nearby ${currentCategoryLabel.toLowerCase()} locations across Kolkata.`}
                </p>
              </div>

            </div>

            {/* MAP GLASS BOX */}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-2 shadow-xl backdrop-blur-2xl">
              <div className="relative h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl">

                <iframe
                  title={`${currentCategoryLabel} locations in Kolkata`}
                  src={
                    coords
                      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
                      : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
                  }
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* MAP LABEL */}

                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/10 bg-[#070b18]/80 px-3.5 py-2.5 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-2.5">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-300 text-black">
                      {facilityIcon(selectedCategory, {
                        size: 17,
                      })}
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {currentCategoryLabel} Facilities
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/40">
                        {coords ? (location || "Within 1 km") : "Kolkata"}
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FACILITIES
        ====================================================== */}

        <section id="facilities" className="px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">

            {/* TITLE */}

            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>
                <p className="text-[11px] font-bold tracking-[3px] text-lime-300">
                  {coords ? "NEAREST FACILITIES (WITHIN 1 KM)" : "ALL REGISTERED FACILITIES"}
                </p>

                <h2 className="mt-1.5 text-xl font-bold md:text-2xl">
                  {currentCategoryLabel} {coords ? "near you" : "in Kolkata"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  {coords
                    ? `Showing ${facilityList.length} facilities within 1 km radius sorted by nearest distance.`
                    : "Showing all available facilities in the project. Enter your location to view nearest within 1 km."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {coords && (
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="rounded-xl border border-lime-300/30 bg-lime-300/10 px-3 py-1.5 text-xs font-semibold text-lime-300 transition hover:bg-lime-300 hover:text-black"
                  >
                    View All Facilities
                  </button>
                )}
                <div className="rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-xs text-white/50 backdrop-blur-xl">
                  {facilityList.length} facilities found
                </div>
              </div>
            </div>

            {/* EMPTY STATE IF WITHIN 1KM AND NO FACILITIES */}
            {facilityList.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
                <MapPin size={36} className="mx-auto text-lime-300/50" />
                <h3 className="mt-3 text-lg font-bold">No facilities found within 1 km</h3>
                <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-white/45">
                  We could not find any {currentCategoryLabel.toLowerCase()} within a 1 km radius of this location.
                </p>
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-lime-200"
                >
                  Show All Available Facilities
                </button>
              </div>
            )}

            {/* FACILITY CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {facilityList.map((facility) => {
                const CardIcon = getFacilityIcon(facility.category);

                return (
                  <div
                    key={facility.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-5 shadow-lg backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-lime-300/25 hover:bg-white/[0.07]"
                  >

                    {/* CARD TOP */}

                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/10 bg-lime-300/[0.08] text-lime-300 transition duration-300 group-hover:bg-lime-300 group-hover:text-black">
                        <CardIcon size={20} />
                      </div>

                      <div className="flex items-center gap-2">
                        {facility.distance && (
                          <span className="rounded-full bg-lime-300/15 border border-lime-300/30 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                            {facility.distance}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            facility.rawStatus === "OPEN"
                              ? "bg-lime-300/10 text-lime-300"
                              : facility.rawStatus === "UNDER_REPAIR"
                                ? "bg-amber-400/10 text-amber-300"
                                : "bg-rose-400/10 text-rose-300"
                          }`}
                        >
                          ● {facility.status}
                        </span>
                      </div>
                    </div>

                    {/* NAME */}

                    <h3 className="mt-3.5 text-base font-bold">
                      {facility.name}
                    </h3>

                    {/* ADDRESS */}

                    <div className="mt-1.5 flex items-start gap-2 text-xs sm:text-sm text-white/45">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-lime-300/70"
                      />

                      <span>{facility.address}</span>
                    </div>

                    {/* INFO */}

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">

                      <div className="flex items-center gap-1.5 text-white/50">
                        <Navigation
                          size={13}
                          className="text-lime-300"
                        />
                        <span className={facility.distance ? "font-semibold text-lime-300" : ""}>
                          {facility.distance || "Kolkata"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-white/50">
                        <Star
                          size={13}
                          className="text-lime-300"
                        />
                        {facility.rating ?? "Not rated"}
                      </div>

                      <div className="flex items-center gap-1.5 text-white/40">
                        <Clock size={13} />
                        Open
                      </div>

                    </div>

                    {/* VIEW DETAILS */}

                    <Link
                      to={`/facilities/${facility.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs sm:text-sm font-medium transition duration-300 hover:border-lime-300/30 hover:bg-lime-300 hover:text-black"
                    >
                      View Details
                      <ChevronRight size={15} />
                    </Link>

                    {/* REPORT ISSUE */}

                    <button
                      type="button"
                      onClick={() => handleReportIssue(facility)}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] py-2.5 text-xs sm:text-sm font-medium text-red-300 transition duration-300 hover:border-red-400/40 hover:bg-red-400 hover:text-white"
                    >
                      <Flag size={15} />
                      Report Issue
                    </button>

                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex ">
              <Link
                to="/citizen/recommendation"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-3 text-sm font-bold text-black shadow-md shadow-lime-300/10 transition duration-300 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
              >
                Any new recommendations?
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        id="contact"
        className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10"
      >
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
                <a href="mailto:amarsohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amarsohor@gmail.com
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

export default MapViewPage;
