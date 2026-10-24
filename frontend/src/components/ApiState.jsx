export default function ApiState({ loading, error, refresh }) {
  if (loading) return <p role="status" className="my-4 rounded-xl border p-4">Loading...</p>;
  if (!error) return null;
  return <div role="alert" className="my-4 rounded-xl border border-rose-400 bg-rose-500/10 p-4">
    {error} {refresh && <button type="button" className="ml-3 underline" onClick={refresh}>Retry</button>}
  </div>;
}
