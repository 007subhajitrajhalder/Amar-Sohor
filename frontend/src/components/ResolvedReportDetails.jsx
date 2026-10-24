import { useApi } from "../api/useApi";
import { displayDate, mediaUrl } from "../api/client";
import ApiState from "./ApiState";
export default function ResolvedReportDetails({ id, onClose }) {
  const resource = useApi("/agencies/reports/resolved/" + id);
  const data = resource.data;
  return <section aria-label="Resolved report details" className="my-5 rounded-2xl border p-5">
    <button type="button" onClick={onClose} className="float-right underline">Close details</button>
    <ApiState {...resource} />
    {data && <>
      <h2 className="text-xl font-bold">#{data.report_id}: {data.title}</h2>
      <p>{data.facility_name}</p><p className="my-3">{data.description}</p>
      <p>Resolved: {displayDate(data.resolved_at)}</p>
      {data.photo_url && <img className="mt-3 max-h-64 rounded-xl" src={mediaUrl(data.photo_url)} alt="Reported issue" />}
      {data.resolution_photo_url ? <img className="mt-3 max-h-64 rounded-xl" src={mediaUrl(data.resolution_photo_url)} alt="Approved resolution evidence" />
        : <p>No approved resolution photo recorded.</p>}
    </>}
  </section>;
}
