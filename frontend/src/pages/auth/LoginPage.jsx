import { useEffect, useState } from "react";
import { LockKeyhole, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

const ABOUT_SLIDES = [
  {
    url: "https://5.imimg.com/data5/SELLER/Default/2025/2/486095262/LF/DS/JX/5315025/public-litter-bins.jpeg",
    label: "Dustbins",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfsuwzx9U20OJuaKZltIF1F_ozwHOKTnwb_w2rth42a50PjH53siPP70Y&s=10",
    label: "Water Dispensers",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jNlEfRWHdLN7SKkh0mVNP1f1ALiCHGg2fC-YMwKtPVO9gYq62JKVi8nZ&s=10",
    label: "Public Restrooms",
  },
  {
    url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    label: "Parking Spaces",
  },
];

function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      <header className="relative z-50 border-b border-white/10 bg-[#07101f]/70 px-4 py-4 backdrop-blur-2xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full shadow-lg shadow-lime-300/20 transition group-hover:scale-105">
              <img src={logo} alt="Amar Sohor Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-xl font-bold tracking-wide md:text-2xl">Amar <span className="text-lime-300">Sohor</span></h1>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm transition hover:bg-white/10 sm:px-5">Back To Home</Link>
          </div>
        </div>
      </header>

      <main className="relative z-30 flex min-h-[calc(100vh-78px)] items-center justify-center px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-xl backdrop-blur-2xl lg:grid-cols-[1fr_1.1fr]">
        <div className="relative hidden min-h-[460px] flex-col justify-between overflow-hidden border-r border-white/10 p-6 md:p-8 lg:flex">
          {ABOUT_SLIDES.map((slide, index) => (
            <div
              key={slide.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75)), url('${slide.url}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-lime-300/10 via-black/20 to-black/80" />
            </div>
          ))}

          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-lime-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300 animate-pulse" />
              {ABOUT_SLIDES[currentSlide].label}
            </span>
            <div className="flex gap-1.5">
              {ABOUT_SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-6 bg-lime-300" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[3px] text-lime-300">Smart city access</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight md:text-4xl">Your city,<br /><span className="text-lime-300">within reach.</span></h2>
            <p className="mt-2.5 max-w-md text-xs leading-relaxed text-white/70 sm:text-sm">Track your reports, discover nearby public facilities, and stay connected to your neighbourhood.</p>
          </div>
        </div>
        <div className="p-5 sm:p-7 md:p-8">
          <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-lime-300">Welcome back</span>
          <h1 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">Sign in to your account</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:text-sm">Access your reports, saved facilities, and civic activity in one place.</p>
          <form className="mt-5 grid gap-3.5">
            <label htmlFor="email" className="grid gap-1.5 text-xs font-medium text-white/75">Email address
              <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <Mail size={17} className="text-lime-300 shrink-0" /><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm" />
              </span>
            </label>
            <label htmlFor="password" className="grid gap-1.5 text-xs font-medium text-white/75">Password
              <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <LockKeyhole size={17} className="text-lime-300 shrink-0" /><input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm" />
              </span>
            </label>
            <div className="text-right"><Link to="/forgot-password" className="text-xs font-medium text-lime-300 hover:text-lime-200">Forgot password?</Link></div>
            <button type="submit" className="min-h-[48px] rounded-xl bg-lime-300 px-5 text-sm font-bold text-black shadow-md shadow-lime-300/10 transition hover:bg-lime-200">Login</button>
          </form>
          <p className="mt-4 text-center text-xs text-white/45">New to Amar Sohor? <Link to="/register" className="font-bold text-lime-300 hover:text-lime-200">Create an account</Link></p>
        </div>
      </section>
      </main>

      <footer className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-lime-300/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <Link to="/" className="group inline-flex items-center gap-3">
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

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
                A citizen-centric smart city platform designed to help people discover public facilities and stay connected with their city.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                <span className="h-px w-12 bg-lime-300/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
                  Smart City Platform
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Contact Us
              </h4>

              <div className="mt-4 flex flex-col gap-4">
                <a href="mailto:amersohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amersohor@gmail.com
                    </p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Phone size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Phone</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Follow Us
              </h4>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Stay connected with Amar Sohor and follow our latest updates across social platforms.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">f</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">◎</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </a>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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

export default LoginPage;
