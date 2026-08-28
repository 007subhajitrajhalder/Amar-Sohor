import { ArrowLeft, Camera, MapPin, Send } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;

function ReportIssuePage() {
  const { facilityId } = useParams();
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
            <span className="hidden sm:inline">Back to the Facility</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-3xl">
          <p className="text-xs font-bold tracking-[3px] text-lime-300">
            CIVIC REPORTING
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Report an Issue
          </h1>
          <p className="mt-3 text-white/45">
            Help improve your city by describing the problem clearly.
          </p>
          <form className="mt-8 grid gap-5 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <label className="text-sm text-white/55">
              Selected facility
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white/75">
                <MapPin size={18} className="text-lime-300" />
                Facility {facilityId}
              </div>
            </label>
            <label className="text-sm text-white/55">
              Report title
              <input
                required
                type="text"
                placeholder="Briefly name the issue"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-white outline-none placeholder:text-white/25 focus:border-lime-300/40"
              />
            </label>
            <label className="text-sm text-white/55">
              Description
              <textarea
                required
                placeholder="Describe what happened, where, and when"
                className="mt-2 min-h-36 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] p-3 text-white outline-none placeholder:text-white/25 focus:border-lime-300/40"
              />
            </label>
            <label className="cursor-pointer rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.025] p-8 text-center hover:border-lime-300/30">
              <Camera className="mx-auto text-lime-300" />
              <span className="mt-3 block font-bold">
                Upload Complaint Photograph
              </span>
              <span className="mt-1 block text-xs text-white/35">
                PNG or JPG, up to 10 MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="mt-4 text-sm text-white/45"
              />
            </label>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-3.5 font-bold text-black hover:bg-lime-200"
            >
              Submit Report <Send size={18} />
            </button>
          </form>
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
          <p>© 2026 Amar Sohor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
export default ReportIssuePage;
