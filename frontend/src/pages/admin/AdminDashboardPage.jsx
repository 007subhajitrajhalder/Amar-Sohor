import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Registered Users</p>
            <h2 className="mt-2 text-3xl font-bold">2480</h2>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Agency Members</p>
            <h2 className="mt-2 text-3xl font-bold">128</h2>
          </article>
p
          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Agencies</p>
            <h2 className="mt-2 text-3xl font-bold">4</h2>
          </article>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            to="/admin/users"
            className="rounded-2xl bg-white p-6 text-xl font-bold shadow"
          >
            Manage Users →
          </Link>

          <Link
            to="/admin/agencies"
            className="rounded-2xl bg-white p-6 text-xl font-bold shadow"
          >
            Manage Agencies →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;