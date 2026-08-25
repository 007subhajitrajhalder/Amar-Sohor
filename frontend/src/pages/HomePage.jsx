import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronDown,
  Navigation,
  Menu,
  X,
  Trash2,
 DoorOpen,
  Car,
  Droplets,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";

const logo = new URL("../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../assets/kolkata-bg.jpg", import.meta.url).href;

function HomePage() {
  const navigate = useNavigate();
  const [showFacilityMenu, setShowFacilityMenu] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [location, setLocation] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const facilities = [
    {
      name: "Nearest Dustbin",
      icon: Trash2,
    },
    {
      name: "Nearest Toilet",
      icon: DoorOpen,
    },
    {
      name: "Nearest Parking",
      icon: Car,
    },
    {
      name: "Nearest Drinking Water",
      icon: Droplets,
    },
  ];

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility.name);
    setShowFacilityMenu(false);
  };

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

  const getCategoryQuery = (facilityName) => {
    const map = {
      "Nearest Dustbin": "dustbin",
      "Nearest Toilet": "toilet",
      "Nearest Parking": "parking",
      "Nearest Drinking Water": "water",
    };

    return map[facilityName] || "";
  };

  const handleFindNearby = () => {
    if (!location.trim()) {
      alert("Please enter your current location.");
      return;
    }

    if (!selectedFacility) {
      alert("Please select a facility.");
      return;
    }

    const category = getCategoryQuery(selectedFacility);

    if (!category) {
      alert("This facility is not mapped to the map view yet.");
      return;
    }

    navigate(`/map?category=${category}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${kolkataBg})`,
        }}
      />

      <div className="fixed inset-0 z-10 bg-black/60" />
      <div className="fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      <header
        className={`fixed left-0 right-0 top-0 z-[100] px-4 py-4 transition-transform duration-300 ease-in-out md:px-8 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl">
         <div className="flex items-center justify-between px-2 py-3">
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-lg shadow-lime-300/20 transition duration-300 group-hover:scale-105">
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

            <nav className="hidden items-center gap-8 lg:flex">
              <Link to="/" className="relative text-sm font-medium text-lime-300">
                Home
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-lime-300" />
              </Link>

              <a href="#about" className="text-sm text-white/70 transition duration-300 hover:text-white">
                About Us
              </a>

              <a href="#how-it-works" className="text-sm text-white/70 transition duration-300 hover:text-white">
                How It Works
              </a>

              <a href="#report" className="text-sm text-white/70 transition duration-300 hover:text-white">
                Report an Issue
              </a>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              

              <Link
                to="/login"
                className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-medium transition duration-300 hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black transition duration-300 hover:bg-lime-200 hover:shadow-lg hover:shadow-lime-300/20"
              >
                Register
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 lg:hidden"
            >
              {mobileMenu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {mobileMenu && (
            <div className="mt-2 rounded-2xl border border-white/15 bg-black/85 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
              <div className="flex flex-col gap-1">
                <Link to="/" onClick={() => setMobileMenu(false)} className="rounded-xl px-4 py-3 text-lime-300 hover:bg-white/10">
                  Home
                </Link>

                <a href="#about" onClick={() => setMobileMenu(false)} className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10">
                  About Us
                </a>

                <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10">
                  How It Works
                </a>

                <a href="#report" onClick={() => setMobileMenu(false)} className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10">
                  Report an Issue
                </a>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenu(false)} className="rounded-xl border border-white/20 py-3 text-center text-sm">
                  Login
                </Link>

                <Link to="/register" onClick={() => setMobileMenu(false)} className="rounded-xl bg-lime-300 py-3 text-center text-sm font-bold text-black">
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-30">
        <section className="flex min-h-screen items-center px-5 pb-20 pt-32 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
                <span className="text-xs font-medium tracking-[2px] text-lime-200">
                  SMART CITY • SMARTER LIVING
                </span>
              </div>

              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Everything You Need,
                <br />
                <span className="text-lime-300">Around Your City.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                Find essential public facilities around you and make your everyday city experience easier, cleaner and smarter.
              </p>

              <div className="relative z-[300] mx-auto mt-10 max-w-4xl">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex min-h-[64px] flex-1 items-center gap-3 px-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
                        <MapPin size={21} />
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
                          Your Location
                        </p>

                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter your current location"
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="mx-4 h-px bg-white/10 lg:my-3 lg:h-auto lg:w-px" />

                    <div className="relative z-[400] min-w-0 lg:w-[290px]">
                      <button
                        type="button"
                        onClick={() => setShowFacilityMenu(!showFacilityMenu)}
                        className="flex min-h-[64px] w-full items-center gap-3 px-4 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
                          <Search size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
                            Facility
                          </p>

                          <p className="truncate text-sm md:text-base">
                            {selectedFacility || "Select Facility"}
                          </p>
                        </div>

                        <ChevronDown
                          size={19}
                          className={`shrink-0 text-white/60 transition duration-300 ${
                            showFacilityMenu ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showFacilityMenu && (
                        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-[200] origin-top animate-[fadeIn_.2s_ease-out] rounded-2xl border border-white/15 bg-slate-950/95 p-2 text-left shadow-2xl backdrop-blur-2xl">
                          {facilities.map((facility) => {
                            const Icon = facility.icon;
                            const isSelected = selectedFacility === facility.name;

                            return (
                              <button
                                key={facility.name}
                                type="button"
                                onClick={() => handleFacilitySelect(facility)}
                                className={`flex w-full items-center gap-3 rounded-xl p-3 transition duration-200 ${
                                  isSelected ? "bg-lime-300/15" : "hover:bg-white/10"
                                }`}
                              >
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                    isSelected ? "bg-lime-300 text-black" : "bg-white/10 text-lime-300"
                                  }`}
                                >
                                  <Icon size={20} />
                                </div>

                                <div className="flex-1">
                                  <p className="text-sm font-medium">{facility.name}</p>
                                  <p className="mt-0.5 text-[11px] text-white/40">Find nearby</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleFindNearby}
                      className="m-1 flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-lime-300 px-7 font-bold text-black shadow-lg shadow-lime-300/10 transition duration-300 hover:scale-[1.02] hover:bg-lime-200"
                    >
                      <Search size={19} />
                      <span>Find Nearby</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  className="mx-auto mt-4 flex items-center gap-2 text-xs text-white/55 transition hover:text-lime-300"
                >
                  <Navigation size={15} />
                  Use my current location
                </button>
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
  {facilities.map((facility) => {
    const Icon = facility.icon;
    const category = getCategoryQuery(facility.name);

    return (
      <Link
        key={facility.name}
        to={category ? `/map?category=${category}` : "/map"}
        className="group flex aspect-square flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/25 p-6 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-lime-300/30 hover:bg-white/10"
      >
        {/* Large Icon */}
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-lime-300/10 text-lime-300 transition duration-300 group-hover:bg-lime-300 group-hover:text-black md:h-32 md:w-32">
          <Icon
            size={65}
            strokeWidth={1.5}
          />
        </div>

        {/* Label */}
        <p className="mt-6 text-base font-semibold text-white md:text-lg">
          {facility.name.replace("Nearest ", "")}
        </p>

        <p className="mt-1 text-xs text-white/40">
          Find nearby
        </p>
      </Link>
    );
  })}
</div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-5 pt-8 pb-16 md:px-10 md:pt-10 md:pb-16">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl md:grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="text-xs font-bold tracking-[4px] text-lime-300">
                ABOUT AMAR SOHOR
              </p>

              <h2 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight md:text-5xl">
                A smarter way to connect citizens with their city.
              </h2>

              <div className="mt-6 space-y-5 text-left text-sm leading-7 text-white/60 md:text-base">
                <p>
                  Amar Sohor is a citizen-centric smart city platform designed to make essential public facilities easier to find, access, and maintain.
                </p>

                <p>
                  From locating a nearby dustbin, public toilet, drinking water point, or parking area to reporting problems with those facilities, Amar Sohor brings everyday civic services together in one simple platform.
                </p>

                <p>
                  The platform connects citizens, government agencies, and civic services through a centralized system. Citizens can discover nearby facilities, view their details and location, share reviews, and report genuine issues with supporting evidence.
                </p>

                <p>
                  Reported issues are routed to the responsible government agency, allowing them to investigate, take corrective action, and submit resolution details. With location-based facility discovery, structured complaint management, evidence validation, and transparent report tracking, Amar Sohor aims to create a more responsive, accountable, and connected urban environment.
                </p>

                <p className="pt-2 text-lime-200">
                  Find it. Report it. Improve your city.
                </p>
              </div>
            </div>

            <div className="relative min-h-[260px] border-t border-white/10 bg-black/20 md:border-l md:border-t-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-lime-300/10 via-transparent to-black/60" />

              <div className="relative flex h-full items-end p-6 md:p-8">
                <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[3px] text-lime-300">
                    Smart City
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-semibold leading-snug text-white">
                    Cleaner streets, smarter civic service, stronger communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[4px] text-lime-300">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
              Find what you need.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl">
              <span className="text-sm font-bold text-lime-300">01</span>
              <h3 className="mt-4 text-xl font-bold">Enter Location</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Enter your current location manually or use your device location.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl">
              <span className="text-sm font-bold text-lime-300">02</span>
              <h3 className="mt-4 text-xl font-bold">Select Facility</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Choose a nearby dustbin, toilet, parking area or drinking water point.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl">
              <span className="text-sm font-bold text-lime-300">03</span>
              <h3 className="mt-4 text-xl font-bold">Find Nearby</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Get the closest useful facility around your selected location.
              </p>
            </div>
          </div>
        </section>
      </main>

   <footer className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-14 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10">
  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />

    <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />

    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-lime-300/[0.02]" />

  </div>


  <div className="relative mx-auto max-w-7xl">


    {/* ================= MAIN FOOTER ================= */}

    <div className="grid gap-12 md:grid-cols-4">


      {/* ================= BRAND ================= */}

      <div className="md:col-span-1">

        <Link
          to="/"
          className="group inline-flex items-center gap-3"
        >

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


        <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
          A citizen-centric smart city platform designed to help
          people discover public facilities and stay connected
          with their city.
        </p>


        <div className="mt-6 flex items-center gap-2">

          <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />

          <span className="h-px w-12 bg-lime-300/40" />

          <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
            Smart City Platform
          </span>

        </div>

      </div>



      {/* ================= QUICK LINKS ================= */}

      <div>

        <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
          Quick Links
        </h4>


        <div className="mt-6 flex flex-col gap-4">


          <a
  href="/"
  className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
>
  <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />
  Home
</a>


          <a
            href="/#about"
            className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
          >

            <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />

            About Us

          </a>


          <a
            href="/#how-it-works"
            className="group flex w-fit items-center gap-3 text-sm text-white/60 transition duration-300 hover:translate-x-1 hover:text-lime-300"
          >

            <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-lime-300" />

            How It Works

          </a>


        </div>

      </div>



      {/* ================= CONTACT ================= */}

      <div>

        <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
          Contact Us
        </h4>


        <div className="mt-6 flex flex-col gap-5">


          {/* EMAIL */}

          <a
            href="mailto:amersohor@gmail.com"
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">

              <Mail size={17} />

            </div>


            <div>

              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Email
              </p>

              <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                amersohor@gmail.com
              </p>

            </div>

          </a>



          {/* PHONE */}

          <a
            href="tel:+919876543210"
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">

              <Phone size={17} />

            </div>


            <div>

              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Phone
              </p>

              <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                +91 98765 43210
              </p>

            </div>

          </a>


        </div>

      </div>



      {/* ================= SOCIAL ================= */}

      <div>

        <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
          Follow Us
        </h4>


        <p className="mt-6 max-w-xs text-sm leading-6 text-white/45">
          Stay connected with Amar Sohor and follow our latest
          updates across social platforms.
        </p>


        <div className="mt-5 flex flex-wrap gap-3">


          {/* FACEBOOK */}

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
          >

            <span className="text-lg font-bold">
              f
            </span>

          </a>



          {/* INSTAGRAM */}

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
          >

            <span className="text-lg font-bold">
              ◎
            </span>

          </a>



          {/* YOUTUBE */}

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
          >

            <span className="text-xs font-bold">
              ▶
            </span>

          </a>



          {/* X / TWITTER */}

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X / Twitter"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
          >

            <span className="text-sm font-bold">
              𝕏
            </span>

          </a>


        </div>

      </div>

    </div>



    {/* ================= DIVIDER ================= */}

    <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />



    {/* ================= BOTTOM FOOTER ================= */}

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

export default HomePage;