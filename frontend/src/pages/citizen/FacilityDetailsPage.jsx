import { Link, useParams } from "react-router-dom";

function FacilityDetailsPage() {
  const { facilityId } = useParams();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <p className="font-bold text-emerald-700">
          Facility ID: {facilityId}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          College Street Public Toilet
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
            <div className="flex h-64 items-center justify-center rounded-xl bg-emerald-100 text-7xl">
              🚻
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Facility Information
            </h2>

            <p className="mt-3 text-slate-600">
              Public sanitation facility managed by the KMC
              Sanitation Department.
            </p>

            <p className="mt-4">
              <strong>Status:</strong> Open
            </p>

            <p className="mt-2">
              <strong>Address:</strong> College Street, Kolkata
            </p>

            <Link
              to={`/citizen/report-issue/${facilityId}`}
              className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
            >
              Report an Issue
            </Link>
          </section>

          <aside className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Reviews
            </h2>

            <p className="mt-4 text-yellow-500">
              ★★★★☆
            </p>

            <textarea
              placeholder="Write your review"
              className="mt-5 min-h-28 w-full rounded-xl border p-3"
            />

            <button className="mt-3 w-full rounded-xl border border-emerald-700 p-3 font-bold text-emerald-700">
              Submit Review
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default FacilityDetailsPage;