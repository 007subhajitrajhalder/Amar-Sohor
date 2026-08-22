function AddFacilityPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">
          Add Facility
        </h1>

        <form className="mt-7 grid gap-5">
          <input
            type="text"
            placeholder="Facility name"
            className="rounded-xl border p-3"
          />

          <select className="rounded-xl border p-3">
            <option>Select category</option>
            <option>Dustbin</option>
            <option>Public Toilet</option>
            <option>Drinking Water</option>
            <option>Parking</option>
          </select>

          <textarea
            placeholder="Facility address"
            className="rounded-xl border p-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              step="any"
              placeholder="Longitude"
              className="rounded-xl border p-3"
            />
          </div>

          <select className="rounded-xl border p-3">
            <option>Open</option>
            <option>Under Repair</option>
            <option>Suspended</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Add Facility
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddFacilityPage;