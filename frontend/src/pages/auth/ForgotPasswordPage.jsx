import { useState } from "react";
import { ArrowLeft, Mail, Phone, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleCheckEmail = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await apiRequest("/auth/forgot-password/check-email", {
        method: "POST",
        body: { email: cleanEmail },
        auth: false,
      });

      setEmailVerified(true);
      setVerifiedEmail(cleanEmail);
      setSuccessMsg(response.message || "Email verified successfully! Please enter your 6-digit security code below.");
    } catch (err) {
      setEmailVerified(false);
      setVerifiedEmail("");
      setError(err.message || "No account found with this email address. Please check your email and try again.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleOtpInput = (e) => {
    const val = e.target.value.slice(0, 6);
    setOtp(val);
    setError("");
  };

  const goToResetPassword = (codeToUse) => {
    const code = (codeToUse !== undefined ? codeToUse : otp).trim();

    if (!emailVerified || !verifiedEmail) {
      setError("Please submit and verify your email address first.");
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter a 6-digit security code.");
      return;
    }

    navigate("/reset-password", {
      state: {
        email: verifiedEmail,
        otp: code,
      },
    });
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    goToResetPassword();
  };

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
            <h1 className="text-xl font-bold tracking-wide md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm transition hover:bg-white/10 sm:px-5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-30 flex min-h-[calc(100vh-78px)] items-center justify-center px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-black/40 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-300/30 bg-lime-300/10 text-lime-300 shadow-lg shadow-lime-300/10">
            <ShieldCheck size={28} />
          </div>

          <div className="mt-4">
            <span className="inline-flex rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-lime-300">
              Account Recovery
            </span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">Forgot Password?</h1>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/60 sm:text-sm">
            {!emailVerified
              ? "Enter your registered email address to verify your account."
              : "Email verified. Enter the 6-digit security code below to reset your password."}
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-left text-xs text-rose-300 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-lime-300/30 bg-lime-300/15 p-3 text-left text-xs text-lime-300 animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0 text-lime-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email input form */}
          <form onSubmit={handleCheckEmail} className="mt-5 grid gap-3 text-left">
            <label htmlFor="email" className="grid gap-1.5 text-xs font-medium text-white/80">
              Email address
              <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <Mail size={18} className="shrink-0 text-lime-300" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailVerified) {
                      setEmailVerified(false);
                      setVerifiedEmail("");
                      setSuccessMsg("");
                      setOtp("");
                    }
                  }}
                  disabled={emailVerified}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 disabled:opacity-60 sm:text-sm"
                />
              </span>
            </label>

            {/* Submit button (always present; shows verified status once email is confirmed) */}
            <button
              type="submit"
              disabled={isCheckingEmail || emailVerified}
              className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-lg transition ${
                emailVerified
                  ? "bg-lime-400/20 text-lime-300 border border-lime-300/30 cursor-default"
                  : "bg-lime-300 text-black shadow-lime-300/20 hover:bg-lime-200 disabled:opacity-60"
              }`}
            >
              {isCheckingEmail ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Checking Email...
                </>
              ) : emailVerified ? (
                <>
                  <CheckCircle2 size={18} />
                  Email Verified
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Text box appearing below the submit button once email is verified */}
          {emailVerified && (
            <form onSubmit={handleVerifyOtp} className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-left animate-fadeIn">
              <label htmlFor="otp" className="grid gap-1.5 text-xs font-medium text-white/80">
                Security Code / OTP
                <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                  <KeyRound size={18} className="shrink-0 text-lime-300" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpInput}
                    placeholder="Enter any 6-digit code"
                    required
                    autoFocus
                    className="w-full bg-transparent text-sm font-mono tracking-widest text-white outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-white/30 sm:text-base"
                  />
                </span>
              </label>

              <button
                type="submit"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-black shadow-lg shadow-lime-300/20 transition hover:bg-lime-200"
              >
                Proceed to Reset Password
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailVerified(false);
                  setVerifiedEmail("");
                  setOtp("");
                  setSuccessMsg("");
                  setError("");
                }}
                className="text-center text-xs text-white/40 hover:text-white/70 transition"
              >
                Change email address
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-lime-300 hover:text-lime-200 transition sm:text-sm"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
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
                  <span className="text-lg font-bold">ig</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} Amar Sohor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
