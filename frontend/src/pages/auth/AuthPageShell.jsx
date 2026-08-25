import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function AuthPageShell({ activePage, children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#07101f] text-white">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${kolkataBg})` }} />
      <div className="fixed inset-0 bg-[#030712]/75" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/35 via-[#07101f]/70 to-[#07101f]" />

      <header className="relative z-50 border-b border-white/10 bg-[#07101f]/70 px-4 py-4 backdrop-blur-2xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full shadow-lg shadow-lime-300/20 transition group-hover:scale-105">
              <img src={logo} alt="Amar Sohor Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-xl font-bold tracking-wide md:text-2xl">Amar <span className="text-lime-300">Sohor</span></h1>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className={`rounded-xl px-4 py-2.5 text-sm transition sm:px-5 ${activePage === "home" ? "bg-lime-300 font-bold text-black" : "border border-white/20 hover:bg-white/10"}`}>Back To Home</Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-78px)] items-center px-5 py-16 md:px-10">{children}</main>

      <footer className="relative z-10 border-t border-white/10 bg-[#050b16]/90 px-5 py-12 backdrop-blur-2xl md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex w-fit items-center gap-3">
              <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <p className="text-xl font-bold">Amar <span className="text-lime-300">Sohor</span></p>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">Helping citizens find facilities, report civic issues, and build a cleaner, smarter Kolkata.</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">Quick Links</h2>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/55">
              <Link to="/" className="transition hover:text-lime-300">Home</Link>
              <Link to="/map" className="transition hover:text-lime-300">Find Facilities</Link>
              <Link to="/login" className="transition hover:text-lime-300">Sign in</Link>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">Contact Us</h2>
            <div className="mt-5 space-y-4 text-sm text-white/55">
              <p className="flex items-center gap-3"><MapPin size={17} className="text-lime-300" />Kolkata, West Bengal</p>
              <a href="mailto:contact@amarsohor.com" className="flex items-center gap-3 transition hover:text-lime-300"><Mail size={17} className="text-lime-300" />contact@amarsohor.com</a>
              <a href="tel:+919876543210" className="flex items-center gap-3 transition hover:text-lime-300"><Phone size={17} className="text-lime-300" />+91 98765 43210</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row">
          <p>© 2026 Amar Sohor. All rights reserved.</p>
          <p>Making cities smarter, cleaner and more connected.</p>
        </div>
      </footer>
    </div>
  );
}

export default AuthPageShell;
