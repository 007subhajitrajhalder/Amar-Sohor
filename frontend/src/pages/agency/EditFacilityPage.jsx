import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

function EditFacilityPage() {
  const navigate = useNavigate();

  /*
    Receives facilityId from this URL:

    /agency/facilities/2/edit
  */
  const { facilityId } = useParams();

  const [formData, setFormData] =
    useState({
      facilityName: "",
      category: "",
      address: "",
      latitude: "",
      longitude: "",
      status: ""
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
    Temporary facility data.

    Later, this information will come
    from the backend.
  */
  const facilities = [
    {
      id: 1,
      facilityName:
        "College Street Public Toilet",
      category: "PUBLIC_TOILET",
      address:
        "College Street, Kolkata, West Bengal",
      latitude: "22.5745",
      longitude: "88.3637",
      status: "OPEN"
    },
    {
      id: 2,
      facilityName:
        "Salt Lake Water Point",
      category: "DRINKING_WATER",
      address:
        "Sector V, Salt Lake, Kolkata",
      latitude: "22.5726",
      longitude: "88.4320",
      status: "UNDER_REPAIR"
    },
    {
      id: 3,
      facilityName:
        "Gariahat Community Dustbin",
      category: "DUSTBIN",
      address:
        "Gariahat Road, Kolkata",
      latitude: "22.5197",
      longitude: "88.3655",
      status: "OPEN"
    },
    {
      id: 4,
      facilityName:
        "New Market Parking Area",
      category: "PARKING",
      address:
        "New Market, Kolkata",
      latitude: "22.5598",
      longitude: "88.3530",
      status: "OPEN"
    }
  ];

  /*
    Runs when the page opens or when
    facilityId changes.
  */
  useEffect(() => {
    setLoading(true);
    setError("");

    /*
      find() searches the facilities array
      and returns the facility whose ID
      matches the URL facilityId.
    */
    const existingFacility =
      facilities.find(
        (facility) =>
          facility.id ===
          Number(facilityId)
      );

    if (!existingFacility) {
      setError("Facility not found.");
      setLoading(false);
      return;
    }

    /*
      Copies the existing facility data
      into the form state.
    */
    setFormData({
      facilityName:
        existingFacility.facilityName,

      category:
        existingFacility.category,

      address:
        existingFacility.address,

      latitude:
        existingFacility.latitude,

      longitude:
        existingFacility.longitude,

      status:
        existingFacility.status
    });

    setLoading(false);
  }, [facilityId]);

  /*
    Runs whenever an input value changes.
  */
  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData(
      (previousFormData) => ({
        ...previousFormData,

        [name]: value
      })
    );
  };

  /*
    Runs when the edit form is submitted.
  */
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.facilityName.trim() ||
      !formData.category ||
      !formData.address.trim() ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.status
    ) {
      setError(
        "Please complete every facility field."
      );

      return;
    }

    /*
      Later, this will be replaced with
      an Axios request.

      Example:

      await api.put(
        `/agency/facilities/${facilityId}`,
        formData
      );
    */

    console.log(
      "Updated facility ID:",
      facilityId
    );

    console.log(
      "Updated facility data:",
      formData
    );

    setSuccess(
      "Facility updated successfully."
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-xl font-bold text-slate-600">
          Loading facility...
        </p>
      </main>
    );
  }

  if (error === "Facility not found.") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <section className="rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-700">
            Facility Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            No registered facility was found
            for ID {facilityId}.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/agency/facilities"
              )
            }
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            Return to Facilities
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate("/agency/facilities")
          }
          className="font-bold text-emerald-700"
        >
          ← Back to Facility Management
        </button>

        <div className="mt-5 rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Agency Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Edit Facility
          </h1>

          <p className="mt-2 text-slate-600">
            Update the information for
            facility #{facilityId}.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-100 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-green-100 p-4 font-bold text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-5"
          >
            {/* Facility name */}
            <label>
              <span className="font-bold">
                Facility Name
              </span>

              <input
                type="text"
                name="facilityName"
                value={
                  formData.facilityName
                }
                onChange={handleChange}
                placeholder="Enter facility name"
                className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
              />
            </label>

            {/* Facility category */}
            <label>
              <span className="font-bold">
                Facility Category
              </span>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
              >
                <option value="">
                  Select a category
                </option>

                <option value="DUSTBIN">
                  Dustbin
                </option>

                <option value="PUBLIC_TOILET">
                  Public Toilet
                </option>

                <option value="DRINKING_WATER">
                  Drinking Water
                </option>

                <option value="PARKING">
                  Parking
                </option>
              </select>
            </label>

            {/* Address */}
            <label>
              <span className="font-bold">
                Address
              </span>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the facility address"
                className="mt-2 min-h-28 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
              />
            </label>

            {/* Coordinates */}
            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="font-bold">
                  Latitude
                </span>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={
                    formData.latitude
                  }
                  onChange={handleChange}
                  placeholder="Enter latitude"
                  className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
                />
              </label>

              <label>
                <span className="font-bold">
                  Longitude
                </span>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={
                    formData.longitude
                  }
                  onChange={handleChange}
                  placeholder="Enter longitude"
                  className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
                />
              </label>
            </div>

            {/* Facility status */}
            <label>
              <span className="font-bold">
                Facility Status
              </span>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
              >
                <option value="">
                  Select facility status
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="UNDER_REPAIR">
                  Under Repair
                </option>

                <option value="SUSPENDED">
                  Suspended
                </option>
              </select>
            </label>

            {/* Buttons */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/agency/facilities"
                  )
                }
                className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default EditFacilityPage;