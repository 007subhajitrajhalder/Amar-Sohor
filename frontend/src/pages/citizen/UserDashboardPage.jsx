function UserDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Citizen Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          View and update your profile information.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Reports Submitted</p>
            <h2 className="mt-2 text-3xl font-bold">6</h2>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Reports Resolved</p>
            <h2 className="mt-2 text-3xl font-bold">4</h2>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Active Reports</p>
            <h2 className="mt-2 text-3xl font-bold">2</h2>
          </article>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">
            Profile Details
          </h2>

          <form className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              defaultValue="Sample Citizen"
              className="rounded-xl border p-3"
            />

            <input
              type="email"
              defaultValue="citizen@example.com"
              className="rounded-xl border p-3"
            />

            <input
              type="tel"
              defaultValue="9876543210"
              className="rounded-xl border p-3"
            />

            <button
              type="submit"
              className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
            >
              Update Profile
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default UserDashboardPage;