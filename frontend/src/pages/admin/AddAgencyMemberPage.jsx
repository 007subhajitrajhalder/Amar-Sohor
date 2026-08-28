import { ArrowLeft, Building2, Check, CheckCircle2, Copy, Eye, EyeOff, Home, Moon, RotateCcw, ShieldCheck, Sun, UserPlus, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminBrandLockup from "./AdminBrandLockup";
import AdminDropdown from "./AdminDropdown";
import { useAdminTheme } from "./useAdminTheme";

function AddAgencyMemberPage() {
  const navigate = useNavigate();

  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    agencyId: "",
    role: "AGENCY_MEMBER"
  });

  const auraLayers = [
    {
      background:
        "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(0, 90, 110, 0.8) 0%, rgba(0, 45, 60, 0.5) 40%, rgba(0, 0, 0, 0) 75%)",
      mixBlendMode: "screen",
      filter: "blur(125px)"
    },
    {
      background:
        "linear-gradient(to top, rgba(0, 130, 150, 0.25) 0%, rgba(0, 0, 0, 0) 35%)",
      mixBlendMode: "screen",
      filter: "blur(50px)"
    }
  ];

  const lightAuraLayers = [
    {
      background:
        "linear-gradient(rgba(0,0,0,0) 0%, rgba(178,235,242,0.12) 28%, rgb(255,255,255) 18%, rgb(77,182,200) 68%, rgb(45,100,130) 100%)",
      mixBlendMode: "multiply",
      filter: "blur(90px)"
    },
    {
      background:
        "linear-gradient(rgba(0,0,0,0) 0%, rgba(178,235,242,0.22) 34%, rgb(255,255,255) 66%, rgb(77,182,200) 82%, rgb(45,100,130) 100%)",
      mixBlendMode: "multiply",
      filter: "blur(90px)"
    }
  ];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

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
      role: "AGENCY_MEMBER"
    });
  };

  const handleReset = () => {
    setError("");
    setSuccess("");
    setShowPassword(false);
    setPasswordCopied(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      agencyId: "",
      role: "AGENCY_MEMBER"
    });
  };

  const generatePassword = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const randomValues = new Uint32Array(12);
    window.crypto.getRandomValues(randomValues);
    const generatedPassword = Array.from(randomValues, (value) => characters[value % characters.length]).join("");

    setFormData((previousData) => ({ ...previousData, password: generatedPassword }));
    setShowPassword(true);
    setPasswordCopied(false);
  };

  const copyPassword = async () => {
    if (!formData.password) return;

    try {
      await navigator.clipboard.writeText(formData.password);
      setPasswordCopied(true);
      window.setTimeout(() => setPasswordCopied(false), 1800);
    } catch {
      setPasswordCopied(false);
    }
  };

  const selectedAgency = agencies.find((agency) => String(agency.id) === formData.agencyId);

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""}`}>
      {[...auraLayers, ...lightAuraLayers].map((layer, index) => {
        const isLightLayer = index >= auraLayers.length;

        return (
          <div
            key={`${isLightLayer ? "light" : "dark"}-${index}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              background: layer.background,
              mixBlendMode: layer.mixBlendMode,
              filter: layer.filter,
              transform: "translateZ(0)",
              opacity: isLightMode === isLightLayer ? 1 : 0
            }}
          />
        );
      })}

      <section className="admin-dashboard-welcome relative z-10 mx-auto max-w-3xl">
        <div className="admin-dashboard-reveal flex items-center justify-between gap-4" style={{ "--dashboard-delay": "80ms" }}>
          <AdminBrandLockup />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLightMode((currentMode) => !currentMode)}
              aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
              className={`group relative inline-flex h-8 w-14 items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-lg backdrop-blur-xl transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 ${isLightMode ? "border-amber-300/70 bg-white/70 text-amber-600 shadow-amber-200/50 focus:ring-offset-slate-100" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 focus:ring-offset-[#100e0b]"}`}
            >
              <Sun size={13} className={`transition-all duration-700 ${isLightMode ? "scale-110 opacity-100" : "-rotate-90 scale-75 opacity-50"}`} aria-hidden="true" />
              <Moon size={13} className={`transition-all duration-700 ${isLightMode ? "rotate-90 scale-75 opacity-50" : "scale-110 opacity-100"}`} aria-hidden="true" />
              <span className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-700 ${isLightMode ? "translate-x-6 bg-amber-300 shadow-lg shadow-amber-300/60" : "bg-cyan-200 shadow-lg shadow-cyan-200/50"}`} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-xl transition ${isLightMode ? "border-slate-300 bg-white/70 text-slate-700 shadow-slate-300/30 hover:bg-white" : "border-white/30 bg-white/10 text-white shadow-cyan-950/20 hover:bg-white/20"}`}
            >
              <Home size={16} aria-hidden="true" />
              Home
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/agencies")}
          className="admin-dashboard-reveal mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          style={{ "--dashboard-delay": "140ms" }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Agency Management
        </button>

        <div className="admin-dashboard-reveal admin-glass-card mt-5 rounded-2xl border border-white/30 p-8 text-white shadow-xl shadow-cyan-950/25 ring-1 ring-inset ring-white/15 backdrop-blur-2xl" style={{ "--dashboard-delay": "200ms" }}>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-xl border border-cyan-200/25 bg-cyan-300/10 p-3 text-cyan-200">
              <UserPlus size={22} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Add New Agency Member
            </h1>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Create an account and assign the
            member to a government agency.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200/25 bg-red-300/10 p-4 text-sm font-semibold text-red-100" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200/25 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100" role="status">
              <CheckCircle2 size={17} aria-hidden="true" />
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldLabel label="Full Name" htmlFor="fullName">
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter member's full name"
                  required
                  className="admin-form-input mt-2 w-full rounded-xl border p-3"
                />
              </FieldLabel>

              <FieldLabel label="Email Address" htmlFor="email">
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required className="admin-form-input mt-2 w-full rounded-xl border p-3" />
              </FieldLabel>

              <FieldLabel label="Phone Number" htmlFor="phone">
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required className="admin-form-input mt-2 w-full rounded-xl border p-3" />
              </FieldLabel>

              <FieldLabel label="Temporary Password" htmlFor="password">
                <div className="relative mt-2">
                  <input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a temporary password" required minLength={8} className="admin-form-input w-full rounded-xl border p-3 pr-12" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide temporary password" : "Show temporary password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-cyan-200">
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={generatePassword} className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-200 transition hover:text-white">
                    <WandSparkles size={14} aria-hidden="true" />
                    Generate secure password
                  </button>
                  <button type="button" onClick={copyPassword} disabled={!formData.password} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                    {passwordCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    {passwordCopied ? "Copied" : "Copy password"}
                  </button>
                </div>
                <span className="mt-1 block text-xs text-white/45">Use at least 8 characters.</span>
              </FieldLabel>

              <FieldLabel label="Government Agency" htmlFor="agencyId">
                <AdminDropdown
                  id="agencyId"
                  value={formData.agencyId}
                  onChange={(value) => setFormData((previousData) => ({ ...previousData, agencyId: value }))}
                  placeholder="Select an agency"
                  options={agencies.map((agency) => ({ value: String(agency.id), label: agency.name }))}
                />
              </FieldLabel>

              <FieldLabel label="Access Role" htmlFor="role">
                <AdminDropdown
                  id="role"
                  value={formData.role}
                  onChange={(value) => setFormData((previousData) => ({ ...previousData, role: value }))}
                  options={[
                    { value: "AGENCY_MEMBER", label: "Agency member" },
                    { value: "AGENCY_ADMIN", label: "Agency admin" }
                  ]}
                />
              </FieldLabel>
            </div>

            <div className="rounded-xl border border-cyan-200/15 bg-cyan-300/5 p-4">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/45">Assignment preview</p>
                  <p className="mt-1 text-sm font-semibold text-white/85">{selectedAgency ? selectedAgency.name : "Select an agency to continue"}</p>
                  <p className="mt-1 text-xs text-white/50">{formData.role === "AGENCY_ADMIN" ? "This member will receive agency management access." : "This member will receive standard agency access."}</p>
                </div>
                <ShieldCheck size={18} className="ml-auto shrink-0 text-emerald-200/80" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200/30 bg-emerald-400/15 px-5 py-3 font-bold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-400/25"
              >
                <UserPlus size={17} aria-hidden="true" />
                Add Agency Member
              </button>

              <button type="button" onClick={handleReset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">
                <RotateCcw size={16} aria-hidden="true" />
                Reset form
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/agencies")
                }
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
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

function FieldLabel({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-bold text-white/85">{label}</span>
      {children}
    </label>
  );
}