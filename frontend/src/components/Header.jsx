import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = sessionStorage.getItem("currentUser");

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  const getDashboardRoute = () => {
    if (!currentUser) {
      return "/login";
    }

    if (currentUser.role === "CITIZEN") {
      return "/citizen/dashboard";
    }

    if (currentUser.role === "AGENCY_MEMBER") {
      return "/agency/dashboard";
    }

    if (currentUser.role === "ADMIN") {
      return "/admin/dashboard";
    }

    return "/";
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-xl font-bold text-white">
            🙏
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">Amar Sohor</h1>
            <p className="text-xs text-slate-500">Public Facility Portal</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/map" className="hidden font-semibold text-slate-600 transition hover:text-emerald-700 sm:block">
            Find Facilities
          </Link>
          {!currentUser ? (
            <>
              <Link to="/login" className="rounded-xl border border-emerald-700 px-4 py-2 font-bold text-emerald-700">
                Login
              </Link>
              <Link to="/register" className="rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to={getDashboardRoute()} className="rounded-xl border border-emerald-700 px-4 py-2 font-bold text-emerald-700">
                Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
