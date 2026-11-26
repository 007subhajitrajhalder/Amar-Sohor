import { useApi } from "../../api/useApi";
import ApiState from "../../components/ApiState";
import { apiRequest, facilityView, displayDate, getStoredUser } from "../../api/client";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Send,
  Star,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";

const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;
const CATEGORY_DEFAULT_IMAGES = {
  dustbin: "https://5.imimg.com/data5/SELLER/Default/2025/2/486095262/LF/DS/JX/5315025/public-litter-bins.jpeg",
  water: "https://static.vecteezy.com/system/resources/thumbnails/070/255/438/small/smiling-woman-in-business-attire-fills-plastic-bottle-with-water-from-modern-water-cooler-in-bright-office-space-with-large-windows-and-green-plants-creating-refreshing-moment-free-photo.jpeg",
  toilet: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jNlEfRWHdLN7SKkh0mVNP1f1ALiCHGg2fC-YMwKtPVO9gYq62JKVi8nZ&s=10",
  parking: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
};

const Stars = ({ value }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={15}
        className={n <= value ? "fill-lime-300 text-lime-300" : "text-white/15"}
      />
    ))}
  </span>
);

function FacilityDetailsPage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const resource = useApi("/facilities/" + facilityId);
  const ratings = useApi("/facilities/" + facilityId + "/ratings");
  const facility = resource.data ? facilityView(resource.data) : null;
  const name = facility?.name, address = facility?.address, category = facility?.categoryLabel;
  const reviews = (ratings.data || []).map(item => ({ ...item, date: displayDate(item.date) }));
  const rating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "Not rated";
  const currentUser = getStoredUser();
  const existingUserReview = reviews.find(
    item => currentUser?.user_id !== undefined && String(item.user_id) === String(currentUser.user_id)
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const [imgLoadError, setImgLoadError] = useState(false);
  const fallbackPhoto = CATEGORY_DEFAULT_IMAGES[facility?.category] || CATEGORY_DEFAULT_IMAGES.dustbin;
  const displayPhotoUrl = (!imgLoadError && facility?.imageUrl) ? facility.imageUrl : fallbackPhoto;

  const resetReviewForm = () => {
    setReview("");
    setUserRating(0);
    setEditingReviewId(null);
    setError("");
  };

  const startEditingReview = item => {
    setEditingReviewId(item.id);
    setReview(item.text || "");
    setUserRating(item.rating || 0);
    setError("");
  };

  const submitReview = async event => {
    event.preventDefault();

    if (userRating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }

    if (!review.trim()) {
      setError("Please write your review.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      if (editingReviewId !== null) {
        await apiRequest(
          "/facilities/" + facilityId + "/ratings/" + editingReviewId,
          {
            method: "PUT",
            body: { title: review.trim(), rating: userRating }
          }
        );
      } else {
        await apiRequest("/facilities/" + facilityId + "/ratings", {
          method: "POST",
          body: { title: review.trim(), rating: userRating }
        });
      }

      resetReviewForm();
      ratings.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async reviewId => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed || deletingReviewId !== null) return;

    setDeletingReviewId(reviewId);
    setError("");

    try {
      await apiRequest(
        "/facilities/" + facilityId + "/ratings/" + reviewId,
        { method: "DELETE" }
      );

      if (editingReviewId === reviewId) {
        resetReviewForm();
      }

      ratings.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingReviewId(null);
    }
  };
  if (!facility) return <main className="min-h-screen bg-slate-950 p-8 text-white"><ApiState {...resource} /><Link to="/map">Return to Map</Link></main>;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="page-bg pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

      <SiteHeader>
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black"
          >
            <ArrowLeft size={17} />{" "}
            <span className="hidden sm:inline">Back to Map</span>
          </button>
      </SiteHeader>
      <main className="relative z-30 px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[3px] text-lime-300">
            FACILITY DETAILS
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-4xl">{name}</h1>
          <div className="mt-2.5 flex flex-wrap gap-4 text-sm text-white/45">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-lime-300" />
              {address}
            </span>
            <span className="flex items-center gap-2">
              <Star size={16} className="fill-lime-300 text-lime-300" />
              {rating} rating
            </span>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-1">
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-xl backdrop-blur-2xl">

              {/* Top Split Visual Media: Map on Left, Facility Photo on Right */}
              <div className="grid grid-cols-1 border-b border-white/10 md:grid-cols-2">
                {/* Google Map (First Half) */}
                <div className="relative h-72 md:h-80 w-full border-b border-white/10 md:border-b-0 md:border-r">
                  <iframe
                    title={`${name} map`}
                    src={`https://www.google.com/maps?q=${facility.latitude},${facility.longitude}&output=embed`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                    Location Map
                  </div>
                </div>

                {/* Facility Photo (Second Half) */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-black/30">
                  <img
                    src={displayPhotoUrl}
                    alt={name}
                    onError={() => setImgLoadError(true)}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                    {imgLoadError || !facility?.imageUrl ? "Category Reference Photo" : "Facility Photo"}
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">

                {/* Status Badge & Header */}
                <span className="inline-block rounded-full bg-lime-300/10 px-3.5 py-1.5 text-xs font-semibold text-lime-300">
                  {facility.status}
                </span>

                <h2 className="mt-4 text-xl font-bold md:text-2xl">
                  Facility Information
                </h2>

                <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-white/40">Category</p>
                    <p className="mt-1 font-semibold">{category}</p>
                  </div>

                  <div>
                    <p className="text-xs text-white/40">Managing Agency</p>
                    <p className="mt-1 font-semibold">
                      {facility.agency || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/40">Address</p>
                    <p className="mt-1 font-semibold">{address}</p>
                  </div>

                  {/* Get Directions Button in place of Coordinates */}
                  <div className="flex flex-col justify-end">
                    <p className="text-xs text-white/40">Navigation</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black shadow-md shadow-lime-300/15 transition hover:bg-lime-200"
                    >
                      <span>Get Directions</span> ↗
                    </a>
                  </div>

                </div>

                {facility.additional_notes && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs text-white/40">Additional Information</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {facility.additional_notes}
                    </p>
                  </div>
                )}

                {/* Report an Issue Button in its Original Position */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <Link
                    to={`/citizen/report-issue/${facilityId}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/[0.05] px-5 py-2.5 text-sm font-bold text-lime-300 transition hover:bg-lime-300 hover:text-black"
                  >
                    Report an Issue <Send size={16} />
                  </Link>
                </div>

              </div>
            </section>
            <aside className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                COMMUNITY
              </p>
              <h2 className="mt-1.5 text-xl font-bold">User reviews</h2>
              <ApiState {...ratings} /><ApiState error={error} />

              {existingUserReview && editingReviewId === null ? (
                <div className="mt-4 rounded-xl border border-lime-300/30 bg-lime-300/[0.06] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-lime-300">
                      Your Review
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingReview(existingUserReview)}
                        disabled={deletingReviewId !== null || submitting}
                        className="rounded-md border border-lime-300/40 bg-lime-300/10 px-2.5 py-1 text-xs font-semibold text-lime-300 transition hover:bg-lime-300 hover:text-black disabled:opacity-40"
                      >
                        Edit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReview(existingUserReview.id)}
                        disabled={deletingReviewId !== null}
                        className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-semibold text-white/70 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                      >
                        {deletingReviewId === existingUserReview.id ? "Deleting..." : "Delete Review"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={existingUserReview.rating} />
                    <span className="text-xs text-white/40">{existingUserReview.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/80">{existingUserReview.text}</p>
                  <p className="mt-3 text-[11px] text-white/40 border-t border-white/10 pt-2">
                    You have already reviewed this facility. You can edit or delete your review above.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={submitReview}
                  className="mt-4 border-b border-white/10 pb-4"
                >
                  {editingReviewId !== null && (
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-lime-300">
                        Editing Your Review
                      </span>
                      <button
                        type="button"
                        onClick={resetReviewForm}
                        className="text-xs text-white/50 hover:underline"
                      >
                        Cancel Edit
                      </button>
                    </div>
                  )}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={20}
                          className={
                            star <= userRating
                              ? "fill-lime-300 text-lime-300"
                              : "text-white/20"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <textarea maxLength={200} required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder={editingReviewId !== null ? "Update your experience..." : "Share your experience..."}
                    className="mt-2.5 min-h-20 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/40"
                  />
                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-xl border border-lime-300/30 py-2.5 text-sm font-bold text-lime-300 transition hover:bg-lime-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting
                        ? (editingReviewId !== null ? "Updating..." : "Submitting...")
                        : (editingReviewId !== null ? "Update Review" : "Submit Review")}
                    </button>

                    {editingReviewId !== null && (
                      <button
                        type="button"
                        onClick={resetReviewForm}
                        disabled={submitting}
                        className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
              <div className="mt-4 grid gap-3">
                {reviews.map((item) => {
                  return (
                    <article
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-black/15 p-3.5"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="mt-0.5 text-xs text-white/30">
                            {item.date}
                          </p>
                        </div>
                        <Stars value={item.rating} />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-white/50">
                        {item.text}
                      </p>

                      
                    </article>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
export default FacilityDetailsPage;
