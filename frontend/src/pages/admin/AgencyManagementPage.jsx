import { Link } from "react-router-dom";
function AgencyManagementPage() {
  const agencies = [
    "KMC SWM Department",
    "KMC Sanitation Department",
    "KMC Water Department",
    "Kolkata Police"
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold">
              Agency Management
            </h1>

            <p className="mt-2 text-slate-600">
              Add or remove agency members.
            </p>
          </div>

          <Link
            to="/admin/agency-members/add"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-center font-bold text-white"
          >
            Add Agency Member
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {agencies.map((agency) => (
            <article
              key={agency}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold">
                {agency}
              </h2>

              <p className="mt-2 text-slate-600">
                View and manage registered agency members.
              </p>

              <button className="mt-5 rounded-xl border border-emerald-700 px-5 py-2 font-bold text-emerald-700">
                Manage Members
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AgencyManagementPage;