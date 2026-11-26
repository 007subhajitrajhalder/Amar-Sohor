import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";

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
        className="page-bg pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      <SiteHeader>
        <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm transition hover:bg-white/10 sm:px-5"
            >
              Sign In
            </Link>
          </div>
      </SiteHeader>

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

      <SiteFooter />
    </div>
  );
}

export default ForgotPasswordPage;
