function MapViewPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          Nearby Facilities
        </h1>

        <p className="mt-2 text-slate-600">
          View matching facilities available within approximately 10 km.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[350px_1fr]">
          <aside className="rounded-2xl bg-white p-5 shadow">
            <input
              type="text"
              placeholder="Search facility"
              className="w-full rounded-xl border p-3"
            />

            <select className="mt-4 w-full rounded-xl border p-3">
              <option>All categories</option>
              <option>Dustbin</option>
              <option>Public Toilet</option>
              <option>Drinking Water</option>
              <option>Parking</option>
            </select>

            <button className="mt-4 w-full rounded-xl bg-emerald-700 p-3 font-bold text-white">
              Use Current Location
            </button>

            <div className="mt-6 grid gap-3">
              <article className="rounded-xl border p-4">
                <h2 className="font-bold">
                  College Street Public Toilet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  1.2 km away
                </p>
              </article>

              <article className="rounded-xl border p-4">
                <h2 className="font-bold">
                  Gariahat Community Dustbin
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  2.4 km away
                </p>
              </article>
            </div>
          </aside>

          <section className="flex min-h-[550px] items-center justify-center rounded-2xl bg-emerald-100 shadow">
            <p className="text-xl font-bold text-emerald-800">
              Leaflet Map Will Appear Here
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default MapViewPage;