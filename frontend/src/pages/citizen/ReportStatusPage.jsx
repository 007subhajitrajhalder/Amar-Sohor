import { ArrowLeft, Check, CircleDashed, Clock, MapPin } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;

function ReportStatusPage() {
  const { reportId } = useParams();
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
            <span className="hidden sm:inline">Back to Reports</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs font-bold tracking-[3px] text-lime-300">
            REPORT #{String(reportId).padStart(3, "0")}
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold md:text-5xl">Report Status</h1>
            <span className="w-fit rounded-full bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-300">
              ● Under Investigation
            </span>
          </div>
          <div className="mt-9 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl md:p-8">
            <h2 className="text-xl font-bold">Resolution progress</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {[
                [
                  "Report submitted",
                  "18 Aug 2026",
                  Check,
                  "bg-lime-300 text-black",
                ],
                [
                  "Under investigation",
                  "In progress",
                  CircleDashed,
                  "bg-blue-400 text-black",
                ],
                [
                  "Issue resolved",
                  "Awaiting action",
                  Clock,
                  "bg-white/10 text-white/30",
                ],
              ].map(([title, sub, Icon, style], i) => (
                <div key={title} className="relative flex gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style}`}
                  >
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="mt-1 text-sm text-white/35">{sub}</p>
                  </div>
                  {i < 2 && (
                    <div className="absolute left-[22px] top-12 hidden h-px w-[calc(100%-16px)] bg-white/10 md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-bold">Complaint Details</h2>
              <div className="mt-6 grid gap-5 text-sm">
                <div>
                  <p className="text-white/30">Title</p>
                  <p className="mt-1 font-semibold">Water Not Available</p>
                </div>
                <div>
                  <p className="text-white/30">Facility</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold">
                    <MapPin size={16} className="text-lime-300" />
                    College Street Public Toilet
                  </p>
                </div>
                <div>
                  <p className="text-white/30">Description</p>
                  <p className="mt-1 leading-6 text-white/60">
                    The facility currently has no running water.
                  </p>
                </div>
              </div>
            </section>
            <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-bold">Resolution Information</h2>
              <p className="mt-4 text-sm leading-6 text-white/40">
                The assigned agency is investigating this report. Resolution
                details and evidence will appear here when work is complete.
              </p>
              <div className="mt-6 flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center text-sm text-white/30">
                Resolved photograph will appear here
              </div>
            </section>
          </div>
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
            <Link to="/citizen/my-reports" className="hover:text-lime-300">
              My Reports
            </Link>
            <Link to="/map" className="hover:text-lime-300">
              Facility Map
            </Link>
          </div>
          <p>© 2026 Amar Sohor.</p>
        </div>
      </footer>
    </div>
  );
}
export default ReportStatusPage;
