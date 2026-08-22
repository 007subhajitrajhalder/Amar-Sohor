import { Link } from "react-router-dom";

function MyReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Dustbin Overflowing",
      facility: "Gariahat Community Dustbin",
      status: "Pending"
    },
    {
      id: 2,
      title: "Water Not Available",
      facility: "Salt Lake Water Point",
      status: "Under Investigation"
    },
    {
      id: 3,
      title: "Parking Closed",
      facility: "New Market Parking",
      status: "Resolved"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          My Reports
        </h1>

        <p className="mt-2 text-slate-600">
          View all the complaints you have submitted.
        </p>

        <div className="mt-7 grid gap-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow md:flex-row md:items-center"
            >
              <div>
                <p className="text-sm text-slate-500">
                  Report #{report.id}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {report.title}
                </h2>

                <p className="mt-1 text-slate-600">
                  {report.facility}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
                  {report.status}
                </span>

                <Link
                  to={`/citizen/reports/${report.id}`}
                  className="rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MyReportsPage;