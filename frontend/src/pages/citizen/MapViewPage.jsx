import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Navigation,
  Trash2,
  ChevronRight,
  Star,
  Clock,
} from "lucide-react";

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

function MapViewPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const filteredFacilities =
    selectedCategory === "all"
      ? facilityList
      : facilityList.filter((facility) => facility.category === selectedCategory);

  const categoryLabel = {
    all: "All categories",
    dustbin: "Dustbin",
    toilet: "Public Toilet",
    water: "Drinking Water",
    parking: "Parking",
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full shadow-lg shadow-lime-300/20 transition duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center bg-lime-300 text-sm font-bold text-black">
                AS
              </div>
            </div>

            <h1 className="text-xl font-bold tracking-wide md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link to="/" className="text-sm text-white/60 transition hover:text-white">
              Home
            </Link>
            <a href="#facilities" className="text-sm text-lime-300">
              Facilities
            </a>
            <a href="#map" className="text-sm text-white/60 transition hover:text-white">
              Map
            </a>
            <a href="#contact" className="text-sm text-white/60 transition hover:text-white">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-xl border border-white/15 px-5 py-2.5 text-sm transition hover:bg-white/10 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-lime-200"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-20 md:px-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-8 flex items-center gap-2 text-xs text-white/40">
              <Link to="/" className="transition hover:text-lime-300">
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white/70">
                {categoryLabel[selectedCategory]}
              </span>
            </div>

            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2">
                <Trash2 size={15} className="text-lime-300" />
                <span className="text-xs font-medium tracking-[2px] text-lime-200">
                  PUBLIC WASTE FACILITIES
                </span>
              </div>

              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Find a <span className="text-lime-300">{categoryLabel[selectedCategory]}</span> Near You.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
                Locate registered public facilities around your current location and find the nearest available service point within 10 km.
              </p>
            </div>

            <div className="mt-10 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex min-h-[62px] flex-1 items-center gap-3 rounded-2xl bg-white/5 px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-lime-300">
                    <MapPin size={20} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      Your Location
                    </p>

                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30 md:text-base"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="flex min-h-[62px] items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm text-white/60 transition hover:bg-white/10 hover:text-lime-300"
                >
                  <Navigation size={17} />
                  Use Current Location
                </button>

                <button
                  type="button"
                  className="flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-lime-300 px-7 font-bold text-black transition hover:bg-lime-200"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="facilities" className="px-5 py-12 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[3px] text-lime-300">
                  NEARBY FACILITIES
                </p>

                <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                  {categoryLabel[selectedCategory]} around you
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Showing registered facilities within 10 km.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
                {filteredFacilities.length} facilities found
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300 transition group-hover:bg-lime-300 group-hover:text-black">
                      <Trash2 size={22} />
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

                  <h3 className="mt-5 text-lg font-bold">{facility.name}</h3>

                  <div className="mt-2 flex items-start gap-2 text-sm text-white/45">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    <span>{facility.address}</span>
                  </div>

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

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:border-lime-300/30 hover:bg-lime-300 hover:text-black"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="map" className="px-5 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                LOCATION MAP
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                {categoryLabel[selectedCategory]} near Kolkata
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Explore the selected facility locations on the map.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <div className="relative h-[420px] w-full">
                <iframe
                  title="Facility locations in Kolkata"
                  src="https://www.google.com/maps?q=Kolkata,India&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 text-black">
                      <Trash2 size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-bold">
                        {categoryLabel[selectedCategory]} Facilities
                      </p>
                      <p className="text-[10px] text-white/40">Kolkata</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-lime-300/10 bg-lime-300/5 p-8 md:p-12">
              <div className="max-w-3xl">
                <p className="text-xs font-bold tracking-[3px] text-lime-300">
                  KEEP YOUR CITY CLEAN
                </p>

                <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                  Use the nearest facility.
                  <br />
                  Keep Amar Sohor cleaner.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Help maintain a cleaner city by disposing of waste responsibly. If you notice an overflowing or damaged facility, you can report the issue through Amar Sohor.
                </p>

                <button
                  type="button"
                  className="mt-6 rounded-xl bg-lime-300 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-200"
                >
                  Report a Problem
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 px-5 py-12 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-300 text-xs font-bold text-black">
                  AS
                </div>

                <span className="text-lg font-bold">
                  Amar <span className="text-lime-300">Sohor</span>
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-white/35">
                Making everyday city life easier by connecting citizens with essential public facilities.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold">Contact Us</h3>

              <div className="mt-4 space-y-3 text-sm text-white/40">
                <p>📞 +91 98765 43210</p>
                <p>✉️ contact@amarsohor.com</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Connect With Us</h3>

              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-lime-300 hover:text-black"
                >
                  f
                </a>

                <a
                  href="mailto:contact@amarsohor.com"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-lime-300 hover:text-black"
                >
                  @
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/25">
            My City. My Responsibility. © 2026 Amar Sohor
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MapViewPage;