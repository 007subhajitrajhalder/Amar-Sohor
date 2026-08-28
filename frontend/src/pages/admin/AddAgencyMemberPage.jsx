import { useState } from "react";
import { ArrowLeft, Building2, ChevronDown, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./useAdminTheme";

const agencies = [
  { id: 1, name: "KMC SWM Department" },
  { id: 2, name: "KMC Sanitation Department" },
  { id: 3, name: "KMC Water Department" },
  { id: 4, name: "Kolkata Police" }
];

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  agencyId: "",
  role: "AGENT"
};

function AddAgencyMemberPage() {
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
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

    console.log("New agency member:", formData);
    setSuccess("Agency member added successfully.");
    setFormData(emptyForm);
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white outline-none placeholder:text-white/45 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20";

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode" : ""
      }`}
    >
      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <section className="relative z-[1] mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/agencies"
            className="admin-back-link inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Agency Management
          </Link>
        </div>
        <div className="admin-glass-card mt-7 rounded-2xl border border-white/20 p-8 text-white shadow-xl backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-300/15 text-cyan-100">
            <UserPlus size={22} />
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-widest text-cyan-200/70">
            Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Add New Agency Member
          </h1>
          <p className="mt-2 text-white/60">
            Create an account and assign the member to a government agency.
          </p>
          {error && (
            <div className="mt-6 rounded-xl border border-red-300/30 bg-red-500/15 p-4 text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 rounded-xl border border-emerald-300/30 bg-emerald-500/15 p-4 text-emerald-200">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
            <label>
              <span className="admin-field-label font-bold text-white">
                Full Name
              </span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter member's full name"
                className={fieldClass}
              />
            </label>

            <label>
              <span className="admin-field-label font-bold text-white">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={fieldClass}
              />
            </label>

            <label>
              <span className="admin-field-label font-bold text-white">
                Phone Number
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={fieldClass}
              />
            </label>

            <label>
              <span className="admin-field-label font-bold text-white">
                Temporary Password
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter temporary password"
                className={fieldClass}
              />
            </label>

            <label>
              <span className="admin-field-label font-bold text-white">
                Government Agency
              </span>
              <div className="relative mt-2">
                <Building2
                  size={17}
                  className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${isLightMode ? "text-teal-700" : "text-cyan-200/70"}`}
                  aria-hidden="true"
                />
                <select
                  name="agencyId"
                  value={formData.agencyId}
                  onChange={handleChange}
                  className="admin-agency-select w-full appearance-none rounded-xl border border-white/20 bg-white/10 p-3 pl-10 pr-10 text-white outline-none placeholder:text-white/45 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
                >
                  <option value="">Select an agency</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={17}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${isLightMode ? "text-slate-500" : "text-white/50"}`}
                  aria-hidden="true"
                />
              </div>
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className={`admin-primary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-300/60 ${isLightMode ? "bg-teal-700 hover:bg-teal-600" : "bg-cyan-700 hover:bg-cyan-600"}`}
              >
                <UserPlus size={17} aria-hidden="true" />
                Add Agency Member
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/agencies")}
                className="admin-outline-button rounded-xl border border-white/20 px-5 py-3 font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
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
