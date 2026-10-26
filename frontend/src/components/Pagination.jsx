export default function Pagination({ total = 0, offset, limit = 50, onChange, disabled, showCount = true }) {
  return <nav aria-label="Pagination" className={`my-5 flex items-center gap-3 text-sm ${showCount ? "justify-between" : "justify-end"}`}>
    <button type="button" disabled={disabled || offset === 0} className="rounded-xl border px-4 py-2 disabled:opacity-40"
      onClick={() => onChange(Math.max(0, offset - limit))}>Previous</button>
    {showCount && <span>{total ? offset + 1 : 0}-{Math.min(offset + limit, total)} of {total}</span>}
    <button type="button" disabled={disabled || offset + limit >= total} className="rounded-xl border px-4 py-2 disabled:opacity-40"
      onClick={() => onChange(offset + limit)}>Next</button>
  </nav>;
}
