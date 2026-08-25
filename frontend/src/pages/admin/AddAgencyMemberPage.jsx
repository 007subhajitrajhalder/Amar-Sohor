import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAgencyMemberPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    agencyId: "",
    role: "AGENT"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Temporary agency data.
  // Later, this will come from the backend.
  const agencies = [
    {
      id: 1,
      name: "KMC SWM Department"
    },
    {
      id: 2,
      name: "KMC Sanitation Department"
    },
    {
      id: 3,
      name: "KMC Water Department"
    },
    {
      id: 4,
      name: "Kolkata Police"
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.agencyId
    ) {
      setError("Please complete every field.");
      return;
    }

    /*
      The Axios request will be added here later.

      Example:

      await api.post(
        "/admin/agency-members",
        formData
      );
    */

    console.log(
      "New agency member:",
      formData
    );

    setSuccess(
      "Agency member added successfully."
    );

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      agencyId: "",
      role: "AGENCT"
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/agencies")
          }
          className="font-bold text-emerald-700"
        >
          ← Back to Agency Management
        </button>

        <div className="mt-5 rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Admin Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Add New Agency Member
          </h1>

          <p className="mt-2 text-slate-600">
            Create an account and assign the
            member to a government agency.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-green-100 p-4 text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-5"
          >
            <label>
              <span className="font-bold">
                Full Name
              </span>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter member's full name"
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="font-bold">
                Email Address
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="font-bold">
                Phone Number
              </span>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="font-bold">
                Temporary Password
              </span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter temporary password"
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="font-bold">
                Government Agency
              </span>

              <select
                name="agencyId"
                value={formData.agencyId}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="">
                  Select an agency
                </option>

                {agencies.map((agency) => (
                  <option
                    key={agency.id}
                    value={agency.id}
                  >
                    {agency.name}
                  </option>
                ))}
              </select>
            </label>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
              >
                Add Agency Member
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/agencies")
                }
                className="rounded-xl border border-slate-300 px-5 py-3 font-bold"
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

export default AddAgencyMemberPage;