import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Map,
  Save,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;

function UserDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-[#070b18] text-white">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
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
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Previous Page</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                CITIZEN PROFILE
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Citizen Dashboard
              </h1>
              <p className="mt-3 text-white/45">
                Manage your profile and stay up to date with your civic reports.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/map"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 font-bold text-white/70 hover:border-lime-300/30"
              >
                <Map size={18} />
                Explore Map
              </Link>
              <Link
                to="/citizen/my-reports"
                className="flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 font-bold text-black hover:bg-lime-200"
              >
                <ClipboardList size={18} />
                View My Reports
              </Link>
            </div>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ["Reports Submitted", 6, ClipboardList, "text-white"],
              ["Reports Resolved", 4, CheckCircle2, "text-lime-300"],
              ["Active Reports", 2, UserRound, "text-blue-300"],
            ].map(([label, value, Icon, color]) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white/40">{label}</p>
                  <Icon className={color} />
                </div>
                <h2 className={`mt-4 text-4xl font-bold ${color}`}>{value}</h2>
              </article>
            ))}
          </div>
          <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <h2 className="text-2xl font-bold">Profile Details</h2>
            <p className="mt-2 text-sm text-white/40">
              Keep your contact information current.
            </p>
            <form className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                ["Full name", "text", "Sample Citizen"],
                ["Email address", "email", "citizen@example.com"],
                ["Phone number", "tel", "9876543210"],
              ].map(([label, type, value]) => (
                <label key={label} className="text-sm text-white/50">
                  {label}
                  <input
                    type={type}
                    defaultValue={value}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-white outline-none focus:border-lime-300/40"
                  />
                </label>
              ))}
              <button
                type="submit"
                className="flex self-end items-center justify-center gap-2 rounded-xl bg-lime-300 p-3 font-bold text-black hover:bg-lime-200"
              >
                <Save size={18} />
                Update Profile
              </button>
            </form>
          </section>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 px-5 py-9 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            <b className="text-white">
              Amar <span className="text-lime-300">Sohor</span>
            </b>
            <br />
            My City. My Responsibility.
          </p>
          <div className="flex gap-5">
            <Link to="/map" className="hover:text-lime-300">
              Facility Map
            </Link>
            <Link to="/citizen/my-reports" className="hover:text-lime-300">
              My Reports
            </Link>
          </div>
          <p>© 2026 Amar Sohor.</p>
        </div>
      </footer>
    </div>
  );
}
export default UserDashboardPage;
