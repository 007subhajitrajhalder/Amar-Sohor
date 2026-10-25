import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  Map,
  Mail,
  Phone,
  Save,
  Sparkles,
  UserRound,
  ShieldAlert,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../api/useApi";
import { apiRequest } from "../../api/client";
import ApiState from "../../components/ApiState";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function UserDashboardPage() {
  const navigate = useNavigate();
  const { user: authUser, updateProfile } = useAuth();
  const profile = useApi("/users/me");
  const reports = useApi("/reports");

  const currentUser = profile.data || authUser;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Sync state whenever profile data loads or changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser?.full_name, currentUser?.email, currentUser?.phone]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const nameToSave = fullName.trim();
    const emailToSave = email.trim();
    const phoneToSave = phone.trim();

    if (!nameToSave) {
      setFeedback({ type: "error", message: "Full name cannot be blank." });
      return;
    }

    if (!emailToSave) {
      setFeedback({ type: "error", message: "Email address cannot be blank." });
      return;
    }

    if (!phoneToSave) {
      setFeedback({ type: "error", message: "Phone number cannot be blank." });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: {
          full_name: nameToSave,
          email: emailToSave,
          phone: phoneToSave,
        },
      });

      if (updateProfile) {
        await updateProfile({
          fullName: nameToSave,
          email: emailToSave,
          phone: phoneToSave,
        });
      }

      setFeedback({
        type: "success",
        message: "Profile updated.",
      });

      if (profile.refresh) {
        profile.refresh();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile.data && profile.loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <ApiState {...profile} />
      </main>
    );
  }

  const role = currentUser?.role;
  const reportsList = Array.isArray(reports.data) ? reports.data : [];
  const reportsSubmitted = reportsList.length;
  const reportsResolved = reportsList.filter((r) => r.status === "RESOLVED").length;
  const activeReports = reportsSubmitted - reportsResolved;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-11 w-11 rounded-full border border-lime-300/20 object-cover"
            />
            <h1 className="text-xl font-bold md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black mr-28 sm:mr-32"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Previous Page</span>
          </button>
        </div>
      </header>

      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                CITIZEN PROFILE
              </p>
              <h1 className="mt-2 text-2xl font-bold md:text-4xl">
                Citizen Dashboard
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs text-white/50 md:text-sm">
                Manage your profile details and monitor your civic contributions across Amar Sohor.
              </p>
            </div>
            {role && (
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-lime-300">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                Role: {role}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/citizen/report-issue"
              className="flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-black shadow-lg shadow-lime-300/10 transition hover:bg-lime-200"
            >
              <AlertTriangle size={17} />
              Report an Issue
            </Link>
            <Link
              to="/citizen/recommendation"
              className="flex items-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-2.5 text-sm font-bold text-lime-300 transition hover:bg-lime-300 hover:text-black"
            >
              <Sparkles size={17} />
              Recommend Facility
            </Link>
            <Link
              to="/citizen/my-recommendations"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:border-lime-300/30 hover:text-white"
            >
              <Lightbulb size={17} />
              My Recommendations
            </Link>
            <Link
              to="/citizen/my-reports"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:border-lime-300/30 hover:text-white"
            >
              <ClipboardList size={17} />
              View My Reports
            </Link>
            <Link
              to="/map"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/70 hover:border-lime-300/30"
            >
              <Map size={17} />
              Explore Map
            </Link>
          </div>

          {/* Real Citizen Metrics */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Reports Submitted", reportsSubmitted, ClipboardList, "text-white"],
              ["Reports Resolved", reportsResolved, CheckCircle2, "text-lime-300"],
              ["Active Reports", activeReports, UserRound, "text-blue-300"],
            ].map(([label, value, Icon, color]) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/40">{label}</p>
                  <Icon size={20} className={color} />
                </div>
                <h2 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h2>
              </article>
            ))}
          </div>

          {/* Profile Details Section */}
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
            <h2 className="text-xl font-bold">Profile Details</h2>
            <p className="mt-1 text-xs text-white/40">
              Keep your contact information current. All changes are saved directly to your account.
            </p>

            <ApiState error={profile.error || reports.error} />

            {feedback && (
              <div
                role="status"
                className={`mt-4 flex items-center gap-2 rounded-xl border p-3 text-xs ${
                  feedback.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="mt-5 grid gap-4 md:grid-cols-2">
              <label htmlFor="full_name" className="text-xs font-medium text-white/50">
                Full name
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 focus-within:border-lime-300/40">
                  <UserRound size={16} className="text-lime-300 shrink-0" />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your Full Name"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </label>

              <label htmlFor="email" className="text-xs font-medium text-white/50">
                Email address
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 focus-within:border-lime-300/40">
                  <Mail size={16} className="text-lime-300 shrink-0" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </label>

              <label htmlFor="phone" className="text-xs font-medium text-white/50">
                Phone number
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 focus-within:border-lime-300/40">
                  <Phone size={16} className="text-lime-300 shrink-0" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Your Phone Number"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 py-3 text-sm font-bold text-black transition hover:bg-lime-200 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Role-Specific Portal Button (Centered below Phone Number & Update Profile Button) */}
            {role === "ADMIN" && (
              <div className="mt-8 flex flex-col items-center justify-center border-t border-white/10 pt-6 text-center">
                <p className="mb-3 text-xs text-white/50">
                  You are signed in with Municipal Administrator privileges.
                </p>
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-lime-300 px-7 py-3 text-sm font-bold text-black shadow-lg shadow-lime-300/20 transition duration-300 hover:bg-lime-200 hover:scale-[1.02]"
                >
                  <ShieldAlert size={18} />
                  <span>Go to Admin Dashboard</span>
                </Link>
              </div>
            )}

            {(role === "AGENT" || role === "AGENCY") && (
              <div className="mt-8 flex flex-col items-center justify-center border-t border-white/10 pt-6 text-center">
                <p className="mb-3 text-xs text-white/50">
                  You are signed in as an Agency Field Member.
                </p>
                <Link
                  to="/agency/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-lime-300 px-7 py-3 text-sm font-bold text-black shadow-lg shadow-lime-300/20 transition duration-300 hover:bg-lime-200 hover:scale-[1.02]"
                >
                  <Building2 size={18} />
                  <span>Go to Agency Dashboard</span>
                </Link>
              </div>
            )}
          </section>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserDashboardPage;
