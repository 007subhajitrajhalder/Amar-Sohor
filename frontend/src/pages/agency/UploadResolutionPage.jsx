import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UploadResolutionPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [resolutionDescription, setResolutionDescription] =
    useState("");

  const [completionDate, setCompletionDate] =
    useState("");

  const [resolutionPhoto, setResolutionPhoto] =
    useState(null);

  const handleSubmitResolution = (event) => {
    event.preventDefault();

    if (
      !resolutionDescription ||
      !completionDate ||
      !resolutionPhoto
    ) {
      alert("Please complete every resolution field.");
      return;
    }

    /*
      Later, an Axios request will be sent here.

      The backend will:
      1. Save the resolution description.
      2. Save the after-repair photograph.
      3. Save the completion date.
      4. Change the report status to RESOLVED.
    */

    alert(
      "Resolution uploaded. Report status changed to Resolved."
    );

    navigate("/agency/resolved");
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <p className="font-bold text-emerald-700">
          Report #{reportId}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Upload Report Resolution
        </h1>

        <p className="mt-2 text-slate-600">
          Submit the completed work information and
          after-repair evidence.
        </p>

        <form
          onSubmit={handleSubmitResolution}
          className="mt-7 grid gap-5"
        >
          <label>
            <span className="font-bold">
              Resolution Description
            </span>

            <textarea
              value={resolutionDescription}
              onChange={(event) =>
                setResolutionDescription(
                  event.target.value
                )
              }
              placeholder="Describe the work performed"
              className="mt-2 min-h-36 w-full rounded-xl border p-3"
            />
          </label>

          <label>
            <span className="font-bold">
              After-Repair Photograph
            </span>

            <div className="mt-2 rounded-xl border-2 border-dashed p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setResolutionPhoto(
                    event.target.files[0]
                  )
                }
              />
            </div>
          </label>

          <label>
            <span className="font-bold">
              Completion Date
            </span>

            <input
              type="date"
              value={completionDate}
              onChange={(event) =>
                setCompletionDate(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border p-3"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Submit Resolution and Mark Resolved
          </button>
        </form>
      </section>
    </main>
  );
}

export default UploadResolutionPage;