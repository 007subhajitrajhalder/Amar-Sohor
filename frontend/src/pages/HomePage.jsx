import { useEffect, useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // Stores the currently logged-in user.
  const [currentUser, setCurrentUser] =
    useState(null);

  // Stores the selected facility category.
  const [selectedCategory, setSelectedCategory] =
    useState("");

  // Stores the search text.
  const [searchText, setSearchText] =
    useState("");

  // Temporary facility categories.
  const facilityCategories = [
    {
      id: 1,
      name: "Dustbin",
      value: "dustbin",
      icon: "🗑️",
      description:
        "Find nearby public dustbins."
    },
    {
      id: 2,
      name: "Public Toilet",
      value: "toilet",
      icon: "🚻",
      description:
        "Find nearby public toilets and urinals."
    },
    {
      id: 3,
      name: "Drinking Water",
      value: "water",
      icon: "💧",
      description:
        "Find public drinking-water points."
    },
    {
      id: 4,
      name: "Parking",
      value: "parking",
      icon: "🅿️",
      description:
        "Find nearby public parking areas."
    }
  ];

  /*
    This runs once when the Home Page opens.

    It retrieves the logged-in user from
    sessionStorage.
  */
  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(
        JSON.parse(storedUser)
      );
    }
  }, []);

  /*
    Runs when a facility category card
    is selected.
  */
  const handleCategorySelection = (
    category
  ) => {
    setSelectedCategory(category.value);

    navigate(
      `/map?category=${category.value}`
    );
  };

  /*
    Runs when the search form is submitted.
  */
  const handleFacilitySearch = (event) => {
    event.preventDefault();

    if (
      !selectedCategory &&
      !searchText.trim()
    ) {
      alert(
        "Please select a facility category or enter a facility name."
      );

      return;
    }

    const queryParameters =
      new URLSearchParams();

    if (selectedCategory) {
      queryParameters.set(
        "category",
        selectedCategory
      );
    }

    if (searchText.trim()) {
      queryParameters.set(
        "search",
        searchText.trim()
      );
    }

    navigate(
      `/map?${queryParameters.toString()}`
    );
  };

  /*
    This returns the correct dashboard route
    according to the logged-in user's role.
  */
  const getDashboardRoute = () => {
    if (!currentUser) {
      return "/login";
    }

    if (currentUser.role === "CITIZEN") {
      return "/citizen/dashboard";
    }

    if (
      currentUser.role ===
      "AGENCY_MEMBER"
    ) {
      return "/agency/dashboard";
    }

    if (currentUser.role === "ADMIN") {
      return "/admin/dashboard";
    }

    return "/";
  };

  /*
    Temporary logout function.

    Later it will also call the backend
    logout API.
  */
  const handleLogout = () => {
    sessionStorage.removeItem(
      "currentUser"
    );

    setCurrentUser(null);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-xl font-bold text-white">
              🙏
            </div>

            <div>
              <h1 className="text-xl font-bold text-emerald-800">
                Amar Sohor
              </h1>

              <p className="text-xs text-slate-500">
                Public Facility Portal
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-emerald-700 px-4 py-2 font-bold text-emerald-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardRoute()}
                  className="rounded-xl border border-emerald-700 px-4 py-2 font-bold text-emerald-700"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* ============================== */}
        {/* HERO SECTION */}
        {/* ============================== */}

        <section className="bg-emerald-950 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Smart Public Facility System
              </p>

              <h2 className="mt-5 text-5xl font-bold leading-tight">
                Find essential facilities
                around you.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-100">
                Locate nearby dustbins,
                public toilets, drinking-water
                points and parking areas within
                approximately 10 km.
              </p>

              <form
                onSubmit={handleFacilitySearch}
                className="mt-8 rounded-2xl bg-white p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_190px_auto]">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(
                        event.target.value
                      )
                    }
                    placeholder="Search facility or area"
                    className="rounded-xl border border-slate-300 p-3 text-slate-900 outline-none focus:border-emerald-600"
                  />

                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-slate-300 p-3 text-slate-900 outline-none focus:border-emerald-600"
                  >
                    <option value="">
                      Select category
                    </option>

                    {facilityCategories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.value}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-emerald-950"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Temporary map design */}
            <div className="relative hidden h-80 overflow-hidden rounded-3xl bg-emerald-100 lg:block">
              <div className="absolute left-[20%] top-[25%] rounded-full bg-white p-4 text-3xl shadow-lg">
                🚻
              </div>

              <div className="absolute right-[20%] top-[20%] rounded-full bg-white p-4 text-3xl shadow-lg">
                💧
              </div>

              <div className="absolute bottom-[20%] left-[45%] rounded-full bg-white p-4 text-3xl shadow-lg">
                🗑️
              </div>

              <div className="absolute bottom-5 left-5 rounded-xl bg-white px-4 py-3 font-bold text-emerald-900 shadow">
                📍 Nearby facilities
              </div>
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* FACILITY CATEGORIES */}
        {/* ============================== */}

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Facility Search
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              What are you looking for?
            </h2>

            <p className="mt-3 text-slate-600">
              Select a facility category to
              view matching facilities on the
              map.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facilityCategories.map(
              (category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() =>
                    handleCategorySelection(
                      category
                    )
                  }
                  className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
                >
                  <span className="text-4xl">
                    {category.icon}
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>

                  <p className="mt-5 font-bold text-emerald-700">
                    View on map →
                  </p>
                </button>
              )
            )}
          </div>
        </section>

        {/* ============================== */}
        {/* ROLE-BASED NAVIGATION */}
        {/* ============================== */}

        {currentUser && (
          <section className="bg-emerald-50">
            <div className="mx-auto max-w-7xl px-5 py-16">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                Your Account
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Welcome, {currentUser.name}
              </h2>

              {/* Citizen links */}
              {currentUser.role ===
                "CITIZEN" && (
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <NavigationCard
                    title="Citizen Dashboard"
                    description="View and update your profile."
                    route="/citizen/dashboard"
                    icon="👤"
                  />

                  <NavigationCard
                    title="Find Facilities"
                    description="Search nearby public facilities."
                    route="/map"
                    icon="🗺️"
                  />

                  <NavigationCard
                    title="My Reports"
                    description="View submitted complaints."
                    route="/citizen/my-reports"
                    icon="📋"
                  />
                </div>
              )}

              {/* Agency links */}
              {currentUser.role ===
                "AGENCY_MEMBER" && (
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <NavigationCard
                    title="Agency Dashboard"
                    description="View agency statistics."
                    route="/agency/dashboard"
                    icon="🏢"
                  />

                  <NavigationCard
                    title="Assigned Reports"
                    description="Investigate assigned complaints."
                    route="/agency/reports"
                    icon="📋"
                  />

                  <NavigationCard
                    title="Facilities"
                    description="Add and manage facilities."
                    route="/agency/facilities"
                    icon="📍"
                  />

                  <NavigationCard
                    title="Resolved Reports"
                    description="View previously resolved reports."
                    route="/agency/resolved"
                    icon="✅"
                  />
                </div>
              )}

              {/* Admin links */}
              {currentUser.role === "ADMIN" && (
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <NavigationCard
                    title="Admin Dashboard"
                    description="View system information."
                    route="/admin/dashboard"
                    icon="⚙️"
                  />

                  <NavigationCard
                    title="User Management"
                    description="View and remove users."
                    route="/admin/users"
                    icon="👥"
                  />

                  <NavigationCard
                    title="Agency Management"
                    description="Add or remove agency members."
                    route="/admin/agencies"
                    icon="🏢"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================== */}
        {/* HOW THE SYSTEM WORKS */}
        {/* ============================== */}

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              How Amar Kolkata Works
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ProcessCard
              number="01"
              title="Select a Facility"
              description="Select a category or search for a facility from the Home Page."
            />

            <ProcessCard
              number="02"
              title="View Nearby Facilities"
              description="The Map Page displays matching registered facilities near your location."
            />

            <ProcessCard
              number="03"
              title="Report an Issue"
              description="Open a facility, describe the problem and upload complaint evidence."
            />
          </div>
        </section>
      </main>

      {/* ============================== */}
      {/* FOOTER */}
      {/* ============================== */}

      <footer className="bg-emerald-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold">
              Amar Kolkata
            </h2>

            <p className="mt-3 text-sm leading-6 text-emerald-100">
              A smart public facility and
              complaint-management platform.
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Quick Links
            </h2>

            <div className="mt-3 grid gap-2 text-sm text-emerald-100">
              <Link to="/">Home</Link>
              <Link to="/map">
                Find Facilities
              </Link>

              {!currentUser && (
                <>
                  <Link to="/login">
                    Login
                  </Link>

                  <Link to="/register">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-6 text-emerald-100">
              Kolkata, West Bengal
              <br />
              support@amarkolkata.com
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-sm text-emerald-200">
          © 2026-27 Amar Kolkata
        </div>
      </footer>
    </div>
  );
}

/*
  Reusable navigation card.

  Using this avoids repeating the same
  card HTML for every role.
*/
function NavigationCard({
  title,
  description,
  route,
  icon
}) {
  return (
    <Link
      to={route}
      className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
    >
      <span className="text-4xl">
        {icon}
      </span>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <p className="mt-5 font-bold text-emerald-700">
        Open page →
      </p>
    </Link>
  );
}

/*
  Reusable process card for the
  How It Works section.
*/
function ProcessCard({
  number,
  title,
  description
}) {
  return (
    <article className="rounded-2xl border bg-white p-6">
      <span className="text-3xl font-bold text-emerald-200">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>
    </article>
  );
}

export default HomePage;