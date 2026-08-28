import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
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
} from "lucide-react";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

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
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const [location, setLocation] = useState("");

  const filteredFacilities =
    selectedCategory === "all"
      ? facilityList
      : facilityList.filter(
          (facility) => facility.category === selectedCategory,
        );

  const categoryLabel = {
    all: "All Categories",
    dustbin: "Dustbin",
    toilet: "Public Toilet",
    water: "Drinking Water",
    parking: "Parking",
  };

  const currentCategoryLabel = categoryLabel[selectedCategory] || "Facilities";

  const mapQuery =
    selectedCategory === "all"
      ? "public facilities Kolkata India"
      : `${currentCategoryLabel} Kolkata India`;

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
      },
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b18] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-lime-300/[0.07] blur-[140px]" />

        <div className="absolute left-[40%] top-[20%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.08] blur-[150px]" />

        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-purple-500/[0.08] blur-[160px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
      </div>

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
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10">
        {/* =====================================================
            SEARCH / HERO
        ====================================================== */}

        <section className="relative overflow-hidden px-5 pb-14 pt-16 md:px-10 md:pt-20">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}

            <div className="mb-8 flex items-center gap-2 text-xs text-white/35">
              <Link to="/" className="transition hover:text-lime-300">
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white/65">{currentCategoryLabel}</span>
            </div>

            {/* HERO */}

            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.08] px-4 py-2 backdrop-blur-md">
                {facilityIcon(selectedCategory, {
                  size: 15,
                  className: "text-lime-300",
                })}

                <span className="text-xs font-medium tracking-[2px] text-lime-200">
                  SMART CITY FACILITIES
                </span>
              </div>

              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Find a{" "}
                <span className="text-lime-300">{currentCategoryLabel}</span>
                <br />
                Near You.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
                Locate registered public facilities around your current location
                and find the nearest available service point within 10 km.
              </p>
            </div>

            {/* SEARCH BOX */}

            <div className="relative z-20 mt-10 max-w-6xl rounded-3xl border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="flex flex-col gap-2 md:flex-row">
                {/* LOCATION */}

                <div className="flex min-h-[62px] flex-1 items-center gap-3 rounded-2xl bg-white/[0.045] px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-lime-300">
                    <MapPin size={20} />
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
                      className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 md:text-base"
                    />
                  </div>
                </div>

                {/* CURRENT LOCATION */}

                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  className="flex min-h-[62px] items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm text-white/55 transition duration-300 hover:border-lime-300/20 hover:bg-white/[0.06] hover:text-lime-300"
                >
                  <Navigation size={17} />
                  Use Current Location
                </button>

                {/* SEARCH */}

                <button
                  type="button"
                  className="flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-lime-300 px-8 font-bold text-black shadow-lg shadow-lime-300/10 transition duration-300 hover:bg-lime-200 hover:shadow-lime-300/20"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAP — SECOND SECTION
        ====================================================== */}

        <section id="map" className="px-5 py-10 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7">
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                LOCATION MAP
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                {currentCategoryLabel}{" "}
                <span className="text-white/45">near Kolkata</span>
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Explore nearby {currentCategoryLabel.toLowerCase()} locations.
              </p>
            </div>

            {/* MAP GLASS BOX */}

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              <div className="relative h-[420px] w-full overflow-hidden rounded-[22px]">
                <iframe
                  title={`${currentCategoryLabel} locations in Kolkata`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery,
                  )}&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* MAP LABEL */}

                <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-[#070b18]/80 px-4 py-3 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-black">
                      {facilityIcon(selectedCategory, { size: 19 })}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
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

        <section id="facilities" className="px-5 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            {/* TITLE */}

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[3px] text-lime-300">
                  NEARBY FACILITIES
                </p>

                <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                  {currentCategoryLabel} around you
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Showing registered facilities within 10 km.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-xs text-white/50 backdrop-blur-xl">
                {filteredFacilities.length} facilities found
              </div>
            </div>

            {/* FACILITY CARDS */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFacilities.map((facility) => {
                const CardIcon = getFacilityIcon(facility.category);

                return (
                  <div
                    key={facility.id}
                    className="group rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-lime-300/25 hover:bg-white/[0.07]"
                  >
                    {/* CARD TOP */}

                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-300/10 bg-lime-300/[0.08] text-lime-300 transition duration-300 group-hover:bg-lime-300 group-hover:text-black">
                        <CardIcon size={22} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                          facility.status === "Available"
                            ? "bg-lime-300/10 text-lime-300"
                            : "bg-orange-400/10 text-orange-300"
                        }`}
                      >
                        ● {facility.status}
                      </span>
                    </div>

                    {/* NAME */}

                    <h3 className="mt-5 text-lg font-bold">{facility.name}</h3>

                    {/* ADDRESS */}

                    <div className="mt-2 flex items-start gap-2 text-sm text-white/45">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-lime-300/70"
                      />

                      <span>{facility.address}</span>
                    </div>

                    {/* INFO */}

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <Navigation size={14} className="text-lime-300" />

                        {facility.distance}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <Star size={14} className="text-lime-300" />

                        {facility.rating}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Clock size={14} />
                        Open
                      </div>
                    </div>

                    {/* VIEW DETAILS */}

                    <Link
                      to={`/facilities/${facility.id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium transition duration-300 hover:border-lime-300/30 hover:bg-lime-300 hover:text-black"
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        id="contact"
        className="relative overflow-hidden border-t border-white/10 bg-[#07101f]/80 px-5 py-14 text-white backdrop-blur-2xl md:px-10"
      >
        {/* FOOTER GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />

          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-lime-300/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* FOOTER GRID */}

          <div className="grid gap-12 md:grid-cols-4">
            {/* BRAND */}

            <div>
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-lime-300/20 bg-white/[0.06] shadow-lg shadow-lime-300/10 transition duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Amar Sohor Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-wide">
                    Amar <span className="text-lime-300">Sohor</span>
                  </h3>

                  <p className="mt-1 text-[11px] tracking-wide text-white/40">
                    My City. My Responsibility.
                  </p>
                </div>
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
                A citizen-centric smart city platform designed to help people
                discover public facilities and stay connected with their city.
              </p>

              <div className="mt-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />

                <span className="h-px w-12 bg-lime-300/40" />

                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
                  Smart City Platform
                </span>
              </div>
            </div>

            {/* QUICK LINKS */}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Quick Links
              </h4>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  to="/"
                  className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
                >
                  <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />
                  Home
                </Link>

                <Link
                  to="/#about"
                  className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
                >
                  <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />
                  About Us
                </Link>

                <Link
                  to="/#how-it-works"
                  className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
                >
                  <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />
                  How It Works
                </Link>
              </div>
            </div>

            {/* CONTACT */}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Contact Us
              </h4>

              <div className="mt-6 flex flex-col gap-5">
                {/* EMAIL */}

                <a
                  href="mailto:contact@amarsohor.com"
                  className="group flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lime-300 transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#07101f]">
                    <Mail size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-white/65 transition group-hover:text-lime-300">
                      contact@amarsohor.com
                    </p>
                  </div>
                </a>

                {/* PHONE */}

                <a
                  href="tel:+919876543210"
                  className="group flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lime-300 transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#07101f]">
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-white/65 transition group-hover:text-lime-300">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* SOCIAL */}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Follow Us
              </h4>

              <p className="mt-6 max-w-xs text-sm leading-6 text-white/40">
                Stay connected with Amar Sohor and follow our latest updates
                across social platforms.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {/* FACEBOOK */}

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/65 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#07101f]"
                >
                  <span className="text-lg font-bold">f</span>
                </a>

                {/* INSTAGRAM */}

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/65 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#07101f]"
                >
                  <span className="text-lg font-bold">◎</span>
                </a>

                {/* YOUTUBE */}

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/65 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#07101f]"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>

                {/* X / TWITTER */}

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/65 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#07101f]"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </a>
              </div>
            </div>
          </div>

          {/* DIVIDER */}

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* BOTTOM */}

          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-white/30">
              © 2026 Amar Sohor. All rights reserved.
            </p>

            <p className="text-xs text-white/30">
              Making cities smarter, cleaner and more connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MapViewPage;
