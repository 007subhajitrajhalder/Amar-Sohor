import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Mail,
  Map,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { REGISTERED_FACILITIES } from "./reportsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;

function ReportIssuePage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();

  const facility =
    REGISTERED_FACILITIES[facilityId] || {
      id: facilityId || 1,
      name: `Facility #${facilityId || 1}`,
      address: "Civic Public Location, Kolkata",
      category: "dustbin",
      categoryLabel: "Civic Facility",
      agency: "Kolkata Municipal Corporation",
    };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size should be less than 10MB.");
      return;
    }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title for your report.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the issue observed.");
      return;
    }

    if (!photoPreview) {
      alert("Please upload a complaint photograph before submitting.");
      return;
    }

    const newReport = {
      id: "REP-" + Date.now().toString().slice(-5),
      facilityId: facility.id,
      facility: facility.name,
      facilityAddress: facility.address,
      facilityCategory: facility.category,
      title: title.trim(),
      description: description.trim(),
      photoPreview: photoPreview || null,
      photoName: photoName || null,
      status: "Pending",
      stage: 1,
      createdAt: new Date().toISOString(),
      assignedAgency: facility.agency,
      assignedOfficer: "Civic Response Team",
      agencyNotes:
        "Your report has been logged and assigned to the local municipal ward inspector for site verification.",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("citizen_reports") || "[]"
      );
      existing.unshift(newReport);
      localStorage.setItem("citizen_reports", JSON.stringify(existing));
    } catch {
      // ignore storage error
    }

    setSubmittedData(newReport);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Amar Sohor Logo"
              className="h-11 w-11 rounded-full border border-lime-300/20 object-cover"
            />
            <h1 className="text-xl font-bold md:text-2xl">
              Amar <span className="text-lime-300">Sohor</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/my-reports"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
            >
              My Reports
            </Link>
            <Link
              to="/map"
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:border-lime-300/30 hover:text-white transition"
            >
              <Map size={16} />
              Change Facility
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black transition"
            >
              <ArrowLeft size={17} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-3xl">
          {/* Top Title */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3.5 py-1 text-xs font-bold tracking-[3px] text-lime-300 uppercase">
              <AlertTriangle size={13} />
              CIVIC GRIEVANCE & MAINTENANCE
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-4xl">
              Report an <span className="text-lime-300">Issue</span>
            </h1>
            <p className="mt-1.5 text-xs text-white/50 md:text-sm max-w-2xl">
              Help keep Kolkata clean, safe, and functioning by reporting facility damage, overflow, or service disruptions to the municipal authorities.
            </p>
          </div>

          {/* Submission Success View */}
          {isSubmitted && submittedData ? (
            <div className="mt-6 rounded-2xl border border-lime-300/30 bg-white/[0.045] p-5 text-center shadow-xl backdrop-blur-2xl md:p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-300/20 text-lime-300">
                <CheckCircle2 size={32} />
              </div>

              <span className="mt-4 inline-block rounded-full bg-lime-300/15 px-3 py-1 text-xs font-semibold text-lime-300">
                Grievance Registered • {submittedData.id}
              </span>

              <h2 className="mt-2.5 text-xl font-bold md:text-2xl">
                Report Submitted Successfully!
              </h2>

              <p className="mx-auto mt-1.5 max-w-lg text-xs md:text-sm text-white/60">
                Your report for{" "}
                <strong className="text-white font-semibold">
                  {submittedData.facility}
                </strong>{" "}
                has been logged. The municipal agency has been dispatched to investigate and initiate repairs.
              </p>

              {/* Summary card */}
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">Issue Title</p>
                    <p className="mt-0.5 font-semibold text-white">{submittedData.title}</p>
                  </div>
                  <span className="rounded-lg bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 text-xs font-medium text-amber-300">
                    ● Pending Review
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Facility</p>
                  <p className="mt-0.5 text-white/80 flex items-center gap-1.5">
                    <MapPin size={15} className="text-lime-300 shrink-0" />
                    {submittedData.facility} ({submittedData.facilityAddress})
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Description</p>
                  <p className="mt-0.5 text-white/70 leading-relaxed">{submittedData.description}</p>
                </div>

                {submittedData.photoPreview && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1.5">Attached Photograph</p>
                    <img
                      src={submittedData.photoPreview}
                      alt="Complaint snapshot"
                      className="h-36 w-full rounded-xl border border-white/10 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
                <Link
                  to={`/citizen/reports/${submittedData.id}`}
                  className="w-full sm:w-auto rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/15"
                >
                  Track Report Status
                </Link>
                
                <button
                  type="button"
                  onClick={() => navigate("/map")}
                  className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/15 hover:text-white transition"
                >
                  File Another Report
                </button>
              </div>
            </div>
          ) : (
            /* Report Issue Form */
            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6"
            >
              {/* Selected Facility Card with Change Option */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/70">
                    Selected Facility <span className="text-lime-300">*</span>
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white/85">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm sm:text-base">{facility.name}</p>
                      <p className="text-xs text-white/45 mt-0.5">{facility.address}</p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
                    {facility.categoryLabel || "Public Facility"}
                  </span>
                </div>
              </div>

              {/* Issue Title */}
              <div className="space-y-1.5">
                <label htmlFor="issue-title" className="text-xs font-medium text-white/70">
                  Report Title <span className="text-lime-300">*</span>
                </label>
                <input
                  id="issue-title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dustbin overflow onto walkway / Tap leaking heavily"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
                <p className="text-xs text-white/35">
                  Briefly name the main problem observed.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="issue-description" className="text-xs font-medium text-white/70">
                  Detailed Description <span className="text-lime-300">*</span>
                </label>
                <textarea
                  id="issue-description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is damaged, when you observed it, and any immediate hazard..."
                  className="min-h-[100px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70">
                  Upload Complaint Photograph <span className="text-lime-300">*</span>
                </label>

                {photoPreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/40 p-2.5">
                    <img
                      src={photoPreview}
                      alt="Complaint evidence preview"
                      className="max-h-56 w-full rounded-lg object-cover"
                    />
                    <div className="mt-2.5 flex items-center justify-between px-2 text-xs">
                      <span className="truncate max-w-xs text-white/60 font-mono">
                        {photoName || "Uploaded photograph"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-500/10 px-2 py-1 text-red-300 hover:bg-red-500 hover:text-white transition"
                      >
                        <X size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="complaint-photo"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.025] p-5 sm:p-6 text-center transition duration-200 hover:border-lime-300/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300/10 text-lime-300 transition duration-300 group-hover:scale-110 group-hover:bg-lime-300 group-hover:text-black">
                      <Camera size={20} />
                    </div>
                    <span className="mt-2.5 block text-sm font-bold text-white">
                      Upload Complaint Photograph
                    </span>
                    <span className="mt-0.5 block text-xs text-white/40">
                      Help agency field teams quickly assess the issue (PNG, JPG up to 10 MB)
                    </span>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
                      <Upload size={13} /> Select Image File
                    </div>
                    <input
                      id="complaint-photo"
                      type="file"
                      accept="image/*"
                      required
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-3 text-sm font-bold text-black shadow-lg shadow-lime-300/10 transition duration-200 hover:bg-lime-200 hover:scale-[1.01]"
              >
                <span>Submit Grievance Report</span>
                <Send size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <HelpCircle size={13} />
                <span>
                  Reports are officially sent to the assigned municipal department and given a tracking ID.
                </span>
              </div>
            </form>
          )}

          {/* Quick Info Callout */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="text-lime-300 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">How does issue resolution work?</h3>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Upon submission, your complaint is routed to the corresponding municipal agency. You will be able to track every stage on your dashboard from inspection to repair verification with photographic evidence.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex ">
              <Link
                to="/citizen/recommendation"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-3 text-sm font-bold text-black shadow-md shadow-lime-300/10 transition duration-300 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
              >
                Any new recommendations?
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-30 overflow-hidden border-t border-white/15 bg-white/[0.08] px-5 py-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-lime-300/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-lime-300/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-lime-300/30 bg-white/[0.08] shadow-lg shadow-lime-300/10 backdrop-blur-md transition duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Amar Sohor Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-wide text-white">
                    Amar <span className="text-lime-300">Sohor</span>
                  </h3>
                  <p className="mt-1 text-[11px] tracking-wide text-white/40">
                    My City. My Responsibility.
                  </p>
                </div>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
                A citizen-centric smart city platform designed to help people discover public facilities and stay connected with their city.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                <span className="h-px w-12 bg-lime-300/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-lime-300/70">
                  Smart City Platform
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Contact Us
              </h4>

              <div className="mt-4 flex flex-col gap-4">
                <a href="mailto:amersohor@gmail.com" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Email</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      amersohor@gmail.com
                    </p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-lime-300 backdrop-blur-md transition duration-300 group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#081b2e]">
                    <Phone size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Phone</p>
                    <p className="mt-1 text-sm text-white/70 transition group-hover:text-lime-300">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[3px] text-lime-300">
                Follow Us
              </h4>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Stay connected with Amar Sohor and follow our latest updates across social platforms.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">f</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-lg font-bold">◎</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/65 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-[#081b2e] hover:shadow-lg hover:shadow-lime-300/10"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </a>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-white/35">
              © 2026 Amar Sohor. All rights reserved.
            </p>

            <p className="text-xs text-white/35">
              Making cities smarter, cleaner and more connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ReportIssuePage;
