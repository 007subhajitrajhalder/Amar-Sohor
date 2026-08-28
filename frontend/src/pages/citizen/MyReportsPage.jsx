import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  ClipboardList,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const logo = new URL("../../assets/logo.png", import.meta.url).href;
const reports = [
  {
    id: 1,
    title: "Dustbin Overflowing",
    facility: "Gariahat Community Dustbin",
    status: "Pending",
  },
  {
    id: 2,
    title: "Water Not Available",
    facility: "Salt Lake Water Point",
    status: "Under Investigation",
  },
  {
    id: 3,
    title: "Parking Closed",
    facility: "New Market Parking",
    status: "Resolved",
  },
];
const statusStyle = {
  Pending: "bg-amber-400/10 text-amber-300",
  "Under Investigation": "bg-blue-400/10 text-blue-300",
  Resolved: "bg-lime-300/10 text-lime-300",
};

function MyReportsPage() {
  const navigate = useNavigate();
  const count = (status) => reports.filter((r) => r.status === status).length;
  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      icon: ClipboardList,
      color: "text-white",
    },
    {
      label: "Pending",
      value: count("Pending"),
      icon: CircleDashed,
      color: "text-amber-300",
    },
    {
      label: "In Progress",
      value: count("Under Investigation"),
      icon: Search,
      color: "text-blue-300",
    },
    {
      label: "Resolved",
      value: count("Resolved"),
      icon: CheckCircle2,
      color: "text-lime-300",
    },
  ];
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
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[3px] text-lime-300">
            REPORT CENTRE
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">My Reports</h1>
          <p className="mt-3 text-white/45">
            Track every issue you have submitted and its current resolution
            status.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/40">{label}</p>
                  <Icon size={21} className={color} />
                </div>
                <p className={`mt-4 text-4xl font-bold ${color}`}>{value}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4">
            {reports.map((report) => (
              <article
                key={report.id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl hover:border-lime-300/20 md:flex-row md:items-center"
              >
                <div>
                  <p className="text-xs font-bold tracking-wider text-lime-300">
                    REPORT #{String(report.id).padStart(3, "0")}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{report.title}</h2>
                  <p className="mt-1 text-sm text-white/40">
                    {report.facility}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${statusStyle[report.status]}`}
                  >
                    ● {report.status}
                  </span>
                  <Link
                    to={`/citizen/reports/${report.id}`}
                    className="flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 font-bold text-black hover:bg-lime-200"
                  >
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
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
            <Link to="/map" className="hover:text-lime-300">
              Facility Map
            </Link>
            <Link to="/citizen/dashboard" className="hover:text-lime-300">
              Dashboard
            </Link>
          </div>
          <p>© 2026 Amar Sohor.</p>
        </div>
      </footer>
    </div>
  );
}
export default MyReportsPage;
