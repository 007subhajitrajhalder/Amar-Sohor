import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "./SocialIcons";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

const QUICK_LINKS = [
  { label: "Explore facilities", to: "/map" },
  { label: "Report an issue", to: "/citizen/report-issue" },
  { label: "Recommend a facility", to: "/citizen/recommendation" },
  { label: "My reports", to: "/citizen/my-reports" },
];

const CONTACT = [
  { icon: Mail, label: "Email", value: "amarsohor@gmail.com", href: "mailto:amarsohor@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "City", value: "Kolkata, West Bengal" },
];

function Brand() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-1 ring-lime-300/30 ring-offset-2 ring-offset-[#0b1220] transition group-hover:ring-lime-300/60">
        <img src={logo} alt="" className="h-full w-full object-cover" />
      </span>
      <span>
        <span className="block font-display text-lg font-bold leading-none tracking-wide text-white">
          Amar <span className="text-lime-300">Sohor</span>
        </span>
        <span className="mt-1 block text-[11px] tracking-wide text-white/40">My City. My Responsibility.</span>
      </span>
    </Link>
  );
}

/** Shared site footer. `compact` renders a slim single row for auth pages. */
export default function SiteFooter({ compact = false }) {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="relative z-30 border-t border-white/10 bg-[#0b1220]/70 px-5 py-5 text-white backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Brand />
          <SocialLinks />
          <p className="text-xs text-white/35">© {year} Amar Sohor</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-30 overflow-hidden border-t border-white/10 bg-[#0b1220]/80 text-white backdrop-blur-2xl">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-sky-400/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
              A citizen-centric smart city platform to discover public facilities, report problems, and help shape a cleaner, better-connected city.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-lime-300">Quick links</h2>
            <ul className="mt-4 grid gap-2.5">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                    {label}
                    <ArrowUpRight size={14} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-lime-300">Contact</h2>
            <ul className="mt-4 grid gap-3">
              {CONTACT.map(({ icon: Icon, label, value, href }) => {
                const body = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lime-300 transition group-hover:border-lime-300/40 group-hover:bg-lime-300 group-hover:text-[#0b1220]">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[10px] uppercase tracking-wider text-white/35">{label}</span>
                      <span className="block text-sm text-white/75 transition group-hover:text-lime-300">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="group flex items-center gap-3">{body}</a>
                    ) : (
                      <div className="group flex items-center gap-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-center text-xs text-white/40 md:flex-row md:text-left">
          <p>© {year} Amar Sohor. All rights reserved.</p>
          <p>Making cities smarter, cleaner and more connected.</p>
        </div>
      </div>
    </footer>
  );
}
