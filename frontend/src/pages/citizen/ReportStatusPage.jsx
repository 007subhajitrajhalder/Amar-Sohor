import { useParams } from "react-router-dom";

function ReportStatusPage() {
  const { reportId } = useParams();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <p className="font-bold text-emerald-700">
          Report #{reportId}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Report Status
        </h1>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Complaint Details
            </h2>

            <p className="mt-4">
              <strong>Title:</strong> Water Not Available
            </p>

            <p className="mt-3">
              <strong>Facility:</strong> College Street Public Toilet
            </p>

            <p className="mt-3">
              <strong>Status:</strong> Under Investigation
            </p>

            <p className="mt-3">
              <strong>Description:</strong> The facility currently has
              no running water.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Resolution Information
            </h2>

            <p className="mt-4 text-slate-600">
              Resolution information will appear after the report has
              been resolved.
            </p>

            <div className="mt-5 flex h-48 items-center justify-center rounded-xl bg-slate-100">
              Resolved photograph will appear here
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ReportStatusPage;