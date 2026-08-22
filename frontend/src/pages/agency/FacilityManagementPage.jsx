import { Link } from "react-router-dom";

function FacilityManagementPage() {
  const facilities = [
    {
      id: 1,
      name: "College Street Public Toilet",
      status: "Open"
    },
    {
      id: 2,
      name: "Salt Lake Water Point",
      status: "Under Repair"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">
            Facility Management
          </h1>

          <Link
            to="/agency/facilities/add"
            className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            Add Facility
          </Link>
        </div>

        <div className="mt-7 grid gap-4">
          {facilities.map((facility) => (
            <article
              key={facility.id}
              className="flex justify-between rounded-2xl bg-white p-6 shadow"
            >
              <div>
                <h2 className="text-xl font-bold">
                  {facility.name}
                </h2>

                <p className="mt-2 text-slate-600">
                  Status: {facility.status}
                </p>
              </div>

              <button className="rounded-xl border border-emerald-700 px-5 py-2 font-bold text-emerald-700">
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default FacilityManagementPage;