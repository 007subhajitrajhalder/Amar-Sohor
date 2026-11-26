import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

/** Shared header for agency pages, with the light/dark theme switch. */
export default function AgencyHeader({ isDark, onToggleTheme }) {
  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-2xl ${
        isDark ? "border-white/10 bg-[#100e0b]/70" : "border-slate-200 bg-white/75"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          isDark ? "via-cyan-300/40" : "via-cyan-600/30"
        }`}
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="Amar Sohor home">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-offset-2 transition md:h-11 md:w-11 ${
              isDark
                ? "ring-lime-300/30 ring-offset-[#100e0b] group-hover:ring-lime-300/70"
                : "bg-white ring-slate-300 ring-offset-white group-hover:ring-cyan-600/60"
            }`}
          >
            <img src={logo} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className={`block truncate font-display text-lg font-bold leading-tight tracking-wide md:text-xl ${isDark ? "text-white" : "text-slate-900"}`}>
              Amar <span className={isDark ? "text-lime-300" : "text-lime-600"}>Sohor</span>
            </span>
            <span className={`hidden text-[10px] font-semibold uppercase tracking-[2.5px] sm:block ${isDark ? "text-cyan-200/50" : "text-cyan-700/70"}`}>
              Agency Console
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onToggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label="Dark mode"
          className={`inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-3 pr-1.5 text-xs font-semibold ${
            isDark
              ? "border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/10"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
          <span className={`relative flex h-7 w-12 items-center rounded-full p-0.5 transition-colors ${isDark ? "bg-cyan-500/30" : "bg-slate-200"}`}>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full shadow transition-transform duration-300 ${
                isDark ? "translate-x-5 bg-[#0b1220] text-cyan-200" : "translate-x-0 bg-white text-amber-500"
              }`}
            >
              {isDark ? <Moon size={13} aria-hidden="true" /> : <Sun size={13} aria-hidden="true" />}
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}
