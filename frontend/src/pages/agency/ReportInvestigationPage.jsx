import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ReportInvestigationPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [investigationNotes, setInvestigationNotes] =
    useState("");

  const [status, setStatus] = useState("Pending");

  const handleStartInvestigation = () => {
    setStatus("Under Investigation");

    alert(
      "Report status changed to Under Investigation"
    );
  };

  const handleGoToResolution = () => {
    navigate(
      `/agency/reports/${reportId}/resolution`
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="font-bold text-emerald-700">
                Report #{reportId}
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Report Investigation
              </h1>
            </div>

            <span className="self-start rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
              {status}
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Complaint information */}
            <section className="rounded-2xl border p-6">
              <h2 className="text-xl font-bold">
                Complaint Details
              </h2>

              <div className="mt-5 grid gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Report Title
                  </p>

                  <p className="font-bold">
                    Water Not Available
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Facility
                  </p>

                  <p className="font-bold">
                    College Street Public Toilet
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Description
                  </p>

                  <p className="text-slate-700">
                    The facility currently has no running
                    water.
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Citizen Evidence
                  </p>

                  <div className="mt-2 flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    Complaint photograph
                  </div>
                </div>
              </div>
            </section>

            {/* Investigation section */}
            <section className="rounded-2xl border p-6">
              <h2 className="text-xl font-bold">
                Investigation
              </h2>

              <form className="mt-5 grid gap-5">
                <label>
                  <span className="font-bold">
                    Investigation Notes
                  </span>

                  <textarea
                    value={investigationNotes}
                    onChange={(event) =>
                      setInvestigationNotes(
                        event.target.value
                      )
                    }
                    placeholder="Enter investigation notes"
                    className="mt-2 min-h-36 w-full rounded-xl border p-3"
                  />
                </label>

                {status === "Pending" && (
                  <button
                    type="button"
                    onClick={handleStartInvestigation}
                    className="rounded-xl bg-blue-700 p-3 font-bold text-white"
                  >
                    Start Investigation
                  </button>
                )}

                {status === "Under Investigation" && (
                  <button
                    type="button"
                    onClick={handleGoToResolution}
                    className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
                  >
                    Upload Resolution
                  </button>
                )}
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ReportInvestigationPage;