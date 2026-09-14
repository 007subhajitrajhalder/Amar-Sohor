import { Home, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

function AdminHeader({ isLightMode, setIsLightMode }) {
  return (
    <header
      className={`admin-page-lift relative z-30 -mx-6 -mt-6 mb-6 border-b px-4 py-3 backdrop-blur-md transition-colors duration-500 md:px-8 ${
        isLightMode
          ? "border-slate-300/50 bg-slate-100/80"
          : "border-white/10 bg-slate-950/75"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-2 py-1">
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-lg transition duration-300 group-hover:scale-105 ${
              isLightMode ? "shadow-teal-700/20" : "shadow-cyan-300/25"
            }`}
          >
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-full w-full scale-[1.3] rounded-full object-contain"
              style={{
                filter: isLightMode
                  ? "hue-rotate(-25deg) saturate(0.85)"
                  : "hue-rotate(-25deg) saturate(1.25) brightness(1.05)"
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1
              className={`m-0 text-lg font-bold leading-none tracking-wide md:text-xl ${
                isLightMode ? "text-slate-900" : "text-white"
              }`}
            >
              Amar <span className={isLightMode ? "text-teal-700" : "text-cyan-200"}>Sohor</span>
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLightMode((currentMode) => !currentMode)}
            aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
            className={`group relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${
              isLightMode
                ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100"
                : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"
            }`}
          >
            <Sun
              size={13}
              className={`transition-all duration-700 ease-in-out ${
                isLightMode ? "rotate-0 scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"
              }`}
              aria-hidden="true"
            />
            <Moon
              size={13}
              className={`transition-all duration-700 ease-in-out ${
                isLightMode ? "rotate-90 scale-75 opacity-50" : "rotate-0 scale-110 opacity-100"
              }`}
              aria-hidden="true"
            />
            <span
              className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${
                isLightMode
                  ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60"
                  : "translate-x-0 bg-cyan-200 shadow-lg shadow-cyan-200/50"
              }`}
            >
              <span className="absolute inset-0 rounded-full bg-white/30 transition-opacity duration-700 group-hover:opacity-80" />
            </span>
          </button>

          <Link
            to="/"
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-xl transition ${
              isLightMode
                ? "border-slate-300 bg-white/70 text-slate-700 shadow-slate-300/30 hover:bg-white"
                : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 hover:bg-white/20"
            }`}
          >
            <Home size={16} aria-hidden="true" />
            Home
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
