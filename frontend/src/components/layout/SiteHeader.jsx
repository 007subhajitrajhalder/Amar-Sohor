import { Link } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

/**
 * Shared sticky header for citizen, auth and public pages.
 * Page-specific actions (back, report, etc.) are passed as children.
 */
export default function SiteHeader({ children, subtitle }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0b1220]/55">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-300/40 to-transparent" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="Amar Sohor home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-lime-300/30 ring-offset-2 ring-offset-[#0b1220] transition group-hover:ring-lime-300/70 md:h-11 md:w-11">
            <img src={logo} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold leading-tight tracking-wide text-white md:text-xl">
              Amar <span className="text-lime-300">Sohor</span>
            </span>
            {subtitle && (
              <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[2.5px] text-white/40 sm:block">
                {subtitle}
              </span>
            )}
          </span>
        </Link>
        {children && <nav className="flex shrink-0 items-center gap-2 sm:gap-3">{children}</nav>}
      </div>
    </header>
  );
}
