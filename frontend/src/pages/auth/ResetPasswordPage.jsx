import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";

const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp || "123456";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the user has not inputted their email address at the forgot password page,
  // do not open this page and redirect back to /forgot-password immediately.
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: {
          email: email.trim(),
          new_password: newPassword,
          otp: otp || "123456",
        },
        auth: false,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: response.message || "Password updated successfully! Please sign in with your new password.",
        },
      });
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <LockKeyhole size={28} />
          </div>

          <div className="mt-4">
            <span className="inline-flex rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-lime-300">
              Create New Password
            </span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">Set New Password</h1>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/60 sm:text-sm">
            Updating password for <span className="font-semibold text-lime-300">{email}</span>
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-left text-xs text-rose-300 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 text-left">
            <label htmlFor="newPassword" className="grid gap-1.5 text-xs font-medium text-white/80">
              New Password
              <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <LockKeyhole size={18} className="shrink-0 text-lime-300" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  autoFocus
                  className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="shrink-0 text-white/40 transition hover:text-white"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label htmlFor="confirmPassword" className="grid gap-1.5 text-xs font-medium text-white/80">
              Confirm Password
              <span className="flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <LockKeyhole size={18} className="shrink-0 text-lime-300" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="shrink-0 text-white/40 transition hover:text-white"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-black shadow-lg shadow-lime-300/20 transition hover:bg-lime-200 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-xs font-semibold text-lime-300 hover:text-lime-200 transition sm:text-sm"
            >
              <ArrowLeft size={16} />
              Back to Verification
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ResetPasswordPage;
