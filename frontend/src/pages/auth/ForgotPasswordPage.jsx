import { ArrowLeft, Mail, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function ForgotPasswordPage() {
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
      <section className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-black/35 p-5 text-center shadow-xl backdrop-blur-2xl sm:p-7 md:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-lime-300/25 bg-lime-300/10 text-lime-300"><ShieldCheck size={24} /></div>
        <div className="mt-3">
          <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-lime-300">Account recovery</span>
        </div>
        <h1 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">Reset your password</h1>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-white/50 sm:text-sm">Enter the email connected to your account and we will send you a secure reset link.</p>
        <form className="mt-5 grid gap-3.5 text-left">
          <label htmlFor="email" className="grid gap-1.5 text-xs font-medium text-white/75">Email address
            <span className="flex min-h-[46px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
              <Mail size={17} className="shrink-0 text-lime-300" /><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm" />
            </span>
          </label>
          <button type="submit" className="min-h-[46px] rounded-xl bg-lime-300 px-5 text-sm font-bold text-black shadow-md shadow-lime-300/10 transition hover:bg-lime-200">Send reset link</button>
        </form>
        <Link to="/login" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-lime-300 hover:text-lime-200 sm:text-sm"><ArrowLeft size={15} />Back to sign in</Link>
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

export default ForgotPasswordPage;
