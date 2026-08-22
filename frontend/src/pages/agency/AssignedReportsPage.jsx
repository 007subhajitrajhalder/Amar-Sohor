import { Link } from "react-router-dom";

function AssignedReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Public Toilet Needs Cleaning",
      status: "Pending"
    },
    {
      id: 2,
      title: "Water Supply Unavailable",
      status: "Under Investigation"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Assigned Reports
        </h1>

        <div className="mt-7 grid gap-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="flex justify-between rounded-2xl bg-white p-6 shadow"
            >
              <div>
                <p className="text-sm text-slate-500">
                  Report #{report.id}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {report.title}
                </h2>

                <p className="mt-2">{report.status}</p>
              </div>

              <Link
                to={`/agency/reports/${report.id}/investigate`}
                className="self-center rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white"
              >
                Investigate
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AssignedReportsPage;