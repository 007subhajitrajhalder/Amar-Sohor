import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest } from "../../api/client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  UserPlus,
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./useAdminTheme";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  agencyId: "",
  latitude: "",
  longitude: "",
  role: "AGENT",
};

function AddAgencyMemberPage() {
  const [searchParams] = useSearchParams();
  const preselectedAgencyId = searchParams.get("agencyId") || "";

  const resource = useApi("/admin/agencies");
  const agencies = (resource.data || []).map((a) => ({
    id: a.agency_id,
    name: a.agency_name,
    department: a.department_type,
  }));

  const [submitting, setSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useAdminTheme();
  const [formData, setFormData] = useState({
    ...emptyForm,
    agencyId: preselectedAgencyId,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update agencyId if URL params change or agencies load
  useEffect(() => {
    if (preselectedAgencyId && !formData.agencyId) {
      setFormData((prev) => ({ ...prev, agencyId: preselectedAgencyId }));
    }
  }, [preselectedAgencyId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAutoFetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    setIsLocating(true);
    setLocationStatus("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude).toFixed(7);
        const lng = Number(position.coords.longitude).toFixed(7);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsLocating(false);
        setLocationStatus(`Captured coordinates: ${lat}, ${lng}`);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus("");
        let msg = "Could not retrieve GPS coordinates.";
        if (err.code === 1) msg = "Location permission denied. Please allow location access or type coordinates manually.";
        else if (err.code === 2) msg = "Position unavailable. Please type coordinates manually.";
        else if (err.code === 3) msg = "Location request timed out.";
        setError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPhone = formData.phone.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedPassword || !formData.agencyId) {
      setError("Please complete all required fields (Name, Email, Phone, Password, and Agency).");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password length validation
    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Optional coordinate validation
    let latNum = null;
    let lngNum = null;
    if (formData.latitude !== "") {
      latNum = Number(formData.latitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        setError("Latitude must be a valid number between -90 and 90.");
        return;
      }
    }
    if (formData.longitude !== "") {
      lngNum = Number(formData.longitude);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        setError("Longitude must be a valid number between -180 and 180.");
        return;
      }
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      await apiRequest("/admin/agency-members", {
        method: "POST",
        body: {
          full_name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          password: trimmedPassword,
          agency_id: Number(formData.agencyId),
          latitude: latNum,
          longitude: lngNum,
        },
      });

      setSuccess(`Agency member "${trimmedName}" has been successfully registered and allotted to the department.`);
      setFormData(emptyForm);
      setLocationStatus("");
    } catch (err) {
      setError(err.message || "Failed to create agency member account.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white outline-none placeholder:text-white/45 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20";

  return (
    <main
      className={`admin-themed-page relative min-h-screen overflow-hidden bg-[#100e0b] p-6 transition-colors duration-500 ${
        isLightMode ? "admin-light-mode bg-[#faf8f2]" : ""
      }`}
    >
      <AdminHeader isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <ApiState {...resource} />

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
            Municipal Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold">Add New Agency Member</h1>
          <p className="mt-2 text-sm text-white/60">
            Register a new field response officer, link them to a civic agency, and assign their base location coordinates.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-400/40 bg-rose-500/15 p-4 text-rose-200">
              <AlertCircle size={20} className="shrink-0 text-rose-300 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/15 p-4 text-emerald-200">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-300 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{success}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/agencies")}
                    className="rounded-lg bg-emerald-600/40 px-3 py-1.5 text-xs font-bold text-emerald-100 hover:bg-emerald-600/60"
                  >
                    Go to Agencies List &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccess("")}
                    className="rounded-lg border border-emerald-400/30 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white"
                  >
                    Add Another Member
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
            {/* Full Name */}
            <label>
              <span className="admin-field-label font-bold text-white text-sm">
                Full Name <span className="text-rose-400">*</span>
              </span>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Subrata Mukherjee"
                className={fieldClass}
              />
            </label>

            {/* Email Address */}
            <label>
              <div className="flex items-center justify-between">
                <span className="admin-field-label font-bold text-white text-sm">
                  Email Address <span className="text-rose-400">*</span>
                </span>
                <span className="text-xs text-white/40">Verified for uniqueness</span>
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. officer.smukherjee@kmc.gov.in"
                className={fieldClass}
              />
            </label>

            {/* Phone Number */}
            <label>
              <div className="flex items-center justify-between">
                <span className="admin-field-label font-bold text-white text-sm">
                  Phone Number <span className="text-rose-400">*</span>
                </span>
                <span className="text-xs text-white/40">Verified for uniqueness</span>
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9830012345"
                className={fieldClass}
              />
            </label>

            {/* Temporary Password */}
            <label>
              <span className="admin-field-label font-bold text-white text-sm">
                Temporary Password <span className="text-rose-400">*</span>
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className={fieldClass}
              />
            </label>

            {/* Government Agency */}
            <label>
              <span className="admin-field-label font-bold text-white text-sm">
                Designated Municipal Agency <span className="text-rose-400">*</span>
              </span>
              <div className="relative mt-2">
                <Building2
                  size={17}
                  className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${
                    isLightMode ? "text-teal-700" : "text-cyan-200/70"
                  }`}
                  aria-hidden="true"
                />
                <select
                  name="agencyId"
                  required
                  value={formData.agencyId}
                  onChange={handleChange}
                  className="admin-agency-select w-full appearance-none rounded-xl border border-white/20 bg-white/10 p-3 pl-10 pr-10 text-white outline-none placeholder:text-white/45 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/20"
                >
                  <option value="">Select an agency</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name} {agency.department ? `(${agency.department})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={17}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                    isLightMode ? "text-slate-500" : "text-white/50"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </label>

            {/* Location Coordinates Section */}
            <div className="rounded-xl border border-white/15 bg-white/5 p-4.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <MapPin size={16} className="text-cyan-300" />
                    Officer Duty Coordinates
                  </span>
                  <p className="mt-0.5 text-xs text-white/50">
                    Defines the officer&apos;s primary patrol or office location for dispatching nearby civic issues.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFetchLocation}
                  disabled={isLocating}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-500/30 hover:border-cyan-300 disabled:opacity-50"
                >
                  {isLocating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Fetching GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={14} className="text-cyan-200" />
                      <span>Detect My Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationStatus && (
                <p className="mt-2.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  {locationStatus}
                </p>
              )}

              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="text-xs font-medium text-white/70">Latitude</span>
                  <input
                    type="number"
                    step="0.0000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 22.5726460"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 p-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-200/70"
                  />
                </label>

                <label>
                  <span className="text-xs font-medium text-white/70">Longitude</span>
                  <input
                    type="number"
                    step="0.0000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 88.3638950"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 p-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-200/70"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className={`admin-primary-action inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-300/60 disabled:opacity-50 ${
                  isLightMode ? "bg-teal-700 hover:bg-teal-600" : "bg-cyan-700 hover:bg-cyan-600"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                    <span>Registering Officer...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={17} aria-hidden="true" />
                    <span>Add Agency Member</span>
                  </>
                )}
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
