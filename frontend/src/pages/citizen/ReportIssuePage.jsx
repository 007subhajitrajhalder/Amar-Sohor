import { useParams } from "react-router-dom";

function ReportIssuePage() {
  const { facilityId } = useParams();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">
          Report an Issue
        </h1>

        <p className="mt-2 text-slate-600">
          Selected facility ID: {facilityId}
        </p>

        <form className="mt-7 grid gap-5">
          <input
            type="text"
            value={`Facility ${facilityId}`}
            readOnly
            className="rounded-xl border bg-slate-100 p-3"
          />

          <input
            type="text"
            placeholder="Report title"
            className="rounded-xl border p-3"
          />

          <textarea
            placeholder="Describe the problem"
            className="min-h-36 rounded-xl border p-3"
          />

          <label className="rounded-xl border-2 border-dashed p-8 text-center">
            <span className="block font-bold">
              Upload Complaint Photograph
            </span>

            <input type="file" accept="image/*" className="mt-4" />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Submit Report
          </button>
        </form>
      </section>
    </main>
  );
}

export default ReportIssuePage;