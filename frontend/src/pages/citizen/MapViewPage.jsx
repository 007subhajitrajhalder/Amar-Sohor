import { useState } from "react";
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

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const facilityList = [
  {
    id: 1,
    name: "College Street Public Toilet",
    category: "toilet",
    distance: "1.2 km away",
    address: "College Street, Kolkata",
    status: "Available",
    rating: "4.5",
  },
  {
    id: 2,
    name: "Gariahat Community Dustbin",
    category: "dustbin",
    distance: "2.4 km away",
    address: "Gariahat, Kolkata",
    status: "Available",
    rating: "4.2",
  },
  {
    id: 3,
    name: "Sealdah Drinking Water Point",
    category: "water",
    distance: "3.1 km away",
    address: "Sealdah, Kolkata",
    status: "Available",
    rating: "4.4",
  },
  {
    id: 4,
    name: "New Market Parking Area",
    category: "parking",
    distance: "1.8 km away",
    address: "New Market, Kolkata",
    status: "Available",
    rating: "4.1",
  },
  {
    id: 5,
    name: "Park Street Dustbin",
    category: "dustbin",
    distance: "0.8 km away",
    address: "Park Street, Kolkata",
    status: "Available",
    rating: "4.5",
  },
  {
    id: 6,
    name: "Howrah Parking Zone",
    category: "parking",
    distance: "5.1 km away",
    address: "Howrah Station Area",
    status: "Under Repair",
    rating: "3.9",
  },
];

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

function MapViewPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const [location, setLocation] = useState("");

  const categoryLabel = {
    all: "All Categories",
    dustbin: "Dustbin",
    toilet: "Public Toilet",
    water: "Drinking Water",
    parking: "Parking",
  };

  const currentCategoryLabel =
    categoryLabel[selectedCategory] || "Facilities";

  const filteredFacilities =
    selectedCategory === "all"
      ? facilityList
      : facilityList.filter(
          (facility) => facility.category === selectedCategory
        );

  const mapQuery =
    selectedCategory === "all"
      ? "public facilities Kolkata India"
      : `${currentCategoryLabel} Kolkata India`;

  // CATEGORY DROPDOWN
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;

    setSearchParams(
      newCategory === "all"
        ? {}
        : { category: newCategory }
    );
  };

  // CURRENT LOCATION
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);

        setLocation(`${latitude}, ${longitude}`);
      },
      () => {
        alert("Unable to access your current location.");
      }
    );
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

        {/* =====================================================
            SEARCH / HERO
        ====================================================== */}

        <section className="relative overflow-hidden px-4 py-6 md:px-8 md:py-8">
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
                Find a{" "}
                <span className="text-lime-300">
                  {currentCategoryLabel}
                </span>
                <br />
                Near You.
              </h2>

              <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50">
                Locate registered public facilities around your current
                location and find the nearest available service point
                within 10 km.
              </p>
            </div>

            {/* SEARCH BOX */}

            <div className="relative z-20 mt-6 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-xl shadow-black/30 backdrop-blur-2xl">
              <div className="flex flex-col gap-2 md:flex-row">

                {/* LOCATION */}

                <div className="flex min-h-[52px] flex-1 items-center gap-3 rounded-xl bg-white/[0.045] px-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-lime-300">
                    <MapPin size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      Your Location
                    </p>

                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter your current location"
                      className="mt-0.5 w-full bg-transparent text-xs text-white outline-none placeholder:text-white/25 sm:text-sm"
                    />
                  </div>
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

                {/* CATEGORY SELECT (between Use Current Location and Search) */}
                <div className="w-full md:w-[220px]">
                  <div className="relative">
                    <select
                      id="facility-category"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="w-full appearance-none rounded-xl border border-lime-300/20 bg-[#07101f]/60 text-white px-3.5 py-2.5 pr-9 min-h-[52px] text-xs sm:text-sm font-medium outline-none backdrop-blur-sm transition duration-300 hover:border-lime-300/40 focus:border-lime-300/50"
                    >
                      <option value="all" style={{backgroundColor: '#07101f', color: '#d6ffd6'}}>All Categories</option>
                      <option value="toilet" style={{backgroundColor: '#07101f', color: '#d6ffd6'}}>Public Toilet</option>
                      <option value="dustbin" style={{backgroundColor: '#07101f', color: '#d6ffd6'}}>Dustbin</option>
                      <option value="water" style={{backgroundColor: '#07101f', color: '#d6ffd6'}}>Drinking Water</option>
                      <option value="parking" style={{backgroundColor: '#07101f', color: '#d6ffd6'}}>Parking</option>
                    </select>

                    <ChevronRight
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-lime-300"
                    />
                  </div>
                </div>

                {/* SEARCH */}

                <button
                  type="button"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 text-xs sm:text-sm font-bold text-black shadow-md shadow-lime-300/10 transition duration-300 hover:bg-lime-200"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAP — SECOND SECTION
        ====================================================== */}

        <section id="map" className="px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-[11px] font-bold tracking-[3px] text-lime-300">
                  LOCATION MAP
                </p>

                <h2 className="mt-1.5 text-xl font-bold md:text-2xl">
                  {currentCategoryLabel}{" "}
                  <span className="text-white/45">
                    near Kolkata
                  </span>
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Explore nearby{" "}
                  {currentCategoryLabel.toLowerCase()} locations.
                </p>
              </div>

              
            </div>

            {/* MAP GLASS BOX */}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-2 shadow-xl backdrop-blur-2xl">
              <div className="relative h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl">

                <iframe
                  title={`${currentCategoryLabel} locations in Kolkata`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
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
                        Kolkata
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
                  NEARBY FACILITIES
                </p>

                <h2 className="mt-1.5 text-xl font-bold md:text-2xl">
                  {currentCategoryLabel} around you
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Showing registered facilities within 10 km.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-xs text-white/50 backdrop-blur-xl">
                {filteredFacilities.length} facilities found
              </div>
            </div>

            {/* FACILITY CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFacilities.map((facility) => {
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

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                          facility.status === "Available"
                            ? "bg-lime-300/10 text-lime-300"
                            : "bg-orange-400/10 text-orange-300"
                        }`}
                      >
                        ● {facility.status}
                      </span>
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
                        {facility.distance}
                      </div>

                      <div className="flex items-center gap-1.5 text-white/50">
                        <Star
                          size={13}
                          className="text-lime-300"
                        />
                        {facility.rating}
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

export default MapViewPage;
