import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  HelpCircle,
  Map,
  MapPin,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { REGISTERED_FACILITIES } from "./reportsData";

const logo = new URL("../../assets/logo.png", import.meta.url).href;

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

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setPhotoPreview(null);
    setPhotoName("");
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="relative min-h-screen bg-[#070b18] text-white">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-lime-300/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 h-96 w-96 rounded-full bg-red-500/10 blur-[150px]" />

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
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-3xl">
          {/* Top Title */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3.5 py-1 text-xs font-bold tracking-[3px] text-lime-300 uppercase">
              <AlertTriangle size={13} />
              CIVIC GRIEVANCE & MAINTENANCE
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Report an <span className="text-lime-300">Issue</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/50">
              Help keep Kolkata clean, safe, and functioning by reporting facility damage, overflow, or service disruptions to the municipal authorities.
            </p>
          </div>

          {/* Submission Success View */}
          {isSubmitted && submittedData ? (
            <div className="mt-8 rounded-[28px] border border-lime-300/30 bg-white/[0.045] p-6 text-center shadow-2xl backdrop-blur-2xl md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-300/20 text-lime-300">
                <CheckCircle2 size={36} />
              </div>

              <span className="mt-5 inline-block rounded-full bg-lime-300/15 px-3.5 py-1 text-xs font-semibold text-lime-300">
                Grievance Registered • {submittedData.id}
              </span>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Report Submitted Successfully!
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm text-white/60">
                Your report for{" "}
                <strong className="text-white font-semibold">
                  {submittedData.facility}
                </strong>{" "}
                has been logged. The municipal agency has been dispatched to investigate and initiate repairs.
              </p>

              {/* Summary card */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-left text-sm space-y-3">
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
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/citizen/reports/${submittedData.id}`}
                  className="w-full sm:w-auto rounded-xl bg-lime-300 px-6 py-3 font-bold text-black hover:bg-lime-200 transition shadow-lg shadow-lime-300/15"
                >
                  Track Report Status
                </Link>
                
                <Link
                  to="/map"
                  className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 font-semibold text-white/80 hover:bg-white/15 hover:text-white transition"
                >
                  Report Another Facility on Map
                </Link>
                
              </div>
            </div>
          ) : (
            /* Report Issue Form */
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-6 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8"
            >
              {/* Selected Facility Card with Change Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">
                    Selected Facility <span className="text-lime-300">*</span>
                  </span>
                  
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white/85">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{facility.name}</p>
                      <p className="text-xs text-white/45 mt-0.5">{facility.address}</p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/60">
                    {facility.categoryLabel || "Public Facility"}
                  </span>
                </div>
              </div>

              {/* Issue Title */}
              <div className="space-y-2">
                <label htmlFor="issue-title" className="text-sm font-medium text-white/70">
                  Report Title <span className="text-lime-300">*</span>
                </label>
                <input
                  id="issue-title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dustbin overflow onto walkway / Tap leaking heavily"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
                <p className="text-xs text-white/35">
                  Briefly name the main problem observed.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="issue-description" className="text-sm font-medium text-white/70">
                  Detailed Description <span className="text-lime-300">*</span>
                </label>
                <textarea
                  id="issue-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is damaged, when you observed it, and any immediate hazard..."
                  className="min-h-[120px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-lime-300/40 focus:bg-white/[0.07]"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">
                  Upload Complaint Photograph (Optional but recommended)
                </label>

                {photoPreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-3">
                    <img
                      src={photoPreview}
                      alt="Complaint evidence preview"
                      className="max-h-60 w-full rounded-xl object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between px-2 text-xs">
                      <span className="truncate max-w-xs text-white/60 font-mono">
                        {photoName || "Uploaded photograph"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-red-300 hover:bg-red-500 hover:text-white transition"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="complaint-photo"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.025] p-8 text-center transition duration-200 hover:border-lime-300/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-300/10 text-lime-300 transition duration-300 group-hover:scale-110 group-hover:bg-lime-300 group-hover:text-black">
                      <Camera size={22} />
                    </div>
                    <span className="mt-3 block text-sm font-bold text-white">
                      Upload Complaint Photograph
                    </span>
                    <span className="mt-1 block text-xs text-white/40">
                      Help agency field teams quickly assess the issue (PNG, JPG up to 10 MB)
                    </span>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/70">
                      <Upload size={13} /> Select Image File
                    </div>
                    <input
                      id="complaint-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-lime-300 p-4 font-bold text-black shadow-lg shadow-lime-300/10 transition duration-200 hover:bg-lime-200 hover:scale-[1.01]"
              >
                <span>Submit Grievance Report</span>
                <Send size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <HelpCircle size={14} />
                <span>
                  Reports are officially sent to the assigned municipal department and given a tracking ID.
                </span>
              </div>
            </form>
          )}

          {/* Quick Info Callout */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-lime-300 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">How does issue resolution work?</h3>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Upon submission, your complaint is routed to the corresponding municipal agency. You will be able to track every stage on your dashboard from inspection to repair verification with photographic evidence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 px-5 py-9 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            <b className="text-white">
              Amar <span className="text-lime-300">Sohor</span>
            </b>
            <br />
            My City. My Responsibility.
          </p>
          <div className="flex gap-5">
            <Link to="/map" className="hover:text-lime-300">
              Facility Map
            </Link>
            <Link to="/citizen/my-reports" className="hover:text-lime-300">
              My Reports
            </Link>
            <Link to="/citizen/my-recommendations" className="hover:text-lime-300">
              My Recommendations
            </Link>
          </div>
          <p>© 2026 Amar Sohor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ReportIssuePage;
