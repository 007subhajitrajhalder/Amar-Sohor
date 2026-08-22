function AgencyDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Agency Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          View agency complaints and facility information.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Pending", "18"],
            ["Under Investigation", "9"],
            ["Resolved", "126"],
            ["Facilities", "64"]
          ].map(([title, value]) => (
            <article
              key={title}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <p className="text-slate-500">{title}</p>
              <h2 className="mt-2 text-3xl font-bold">{value}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AgencyDashboardPage;