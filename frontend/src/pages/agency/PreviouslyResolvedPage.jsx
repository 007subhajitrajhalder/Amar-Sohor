function PreviouslyResolvedPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Previously Resolved Reports
        </h1>

        <div className="mt-7 overflow-x-auto rounded-2xl bg-white p-6 shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Report</th>
                <th className="p-3">Facility</th>
                <th className="p-3">Completion Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">#1001</td>
                <td className="p-3">Gariahat Dustbin</td>
                <td className="p-3">15 August 2026</td>
                <td className="p-3">Resolved</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default PreviouslyResolvedPage;