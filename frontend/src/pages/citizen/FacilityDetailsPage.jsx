import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Star,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const logo = new URL("../../assets/logo.png", import.meta.url).href;
const kolkataBg = new URL("../../assets/kolkata-bg.jpg", import.meta.url).href;
const facilities = {
  1: [
    "College Street Public Toilet",
    "College Street, Kolkata",
    "Public Toilet",
    4.5,
  ],
  2: [
    "Gariahat Community Dustbin",
    "Gariahat, Kolkata",
    "Waste Management",
    4.2,
  ],
  3: [
    "Sealdah Drinking Water Point",
    "Sealdah, Kolkata",
    "Drinking Water",
    4.4,
  ],
  4: ["New Market Parking Area", "New Market, Kolkata", "Parking", 4.1],
  5: ["Park Street Dustbin", "Park Street, Kolkata", "Waste Management", 4.5],
  6: ["Howrah Parking Zone", "Howrah Station Area", "Parking", 3.9],
};
const seedReviews = [
  {
    id: 1,
    name: "Ananya S.",
    rating: 5,
    date: "18 Aug 2026",
    text: "Clean, easy to find, and the caretaker was helpful.",
  },
  {
    id: 2,
    name: "Rahul D.",
    rating: 4,
    date: "11 Aug 2026",
    text: "Useful and well located. It can get busy in the evening.",
  },
  {
    id: 3,
    name: "Moumita P.",
    rating: 4,
    date: "02 Aug 2026",
    text: "The area was maintained well during my visit.",
  },
];

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
  const [name, address, category, rating] =
    facilities[facilityId] || facilities[1];
  const [reviews, setReviews] = useState(seedReviews);
  const [review, setReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const submitReview = (event) => {
  event.preventDefault();
  if (!review.trim() || userRating === 0) return;

  setReviews([
    {
      id: Date.now(),
      name: "You",
      rating: userRating,
      date: "Just now",
      text: review.trim(),
    },
    ...reviews,
  ]);

  setReview("");
  setUserRating(0);
};

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kolkataBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/60" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-lime-300 hover:text-black"
          >
            <ArrowLeft size={17} />{" "}
            <span className="hidden sm:inline">Back to Map</span>
          </button>
        </div>
      </header>
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
              <iframe
                title={`${name} map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                className="h-64 w-full border-0 opacity-80"
                loading="lazy"
              />
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap justify-between gap-3">
                  <span className="rounded-full bg-lime-300/10 px-3.5 py-1.5 text-xs font-semibold text-lime-300">
                    ● Open now
                  </span>
                  <span className="flex items-center gap-2 text-sm text-white/40">
                    <Clock size={16} />
                    6:00 AM – 10:00 PM
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-bold">
                  Facility information
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  A registered public facility managed by the relevant Kolkata
                  municipal department and maintained for daily community use.
                </p>
                <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-white/30">Category</p>
                    <p className="mt-1 font-semibold">{category}</p>
                  </div>
                  
                </div>
                <Link
                  to={`/citizen/report-issue/${facilityId}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-200"
                >
                  Report an Issue <Send size={16} />
                </Link>
              </div>
            </section>
            <aside className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-2xl md:p-6">
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                COMMUNITY
              </p>
              <h2 className="mt-1.5 text-xl font-bold">User reviews</h2>
              <form
                onSubmit={submitReview}
                className="mt-4 border-b border-white/10 pb-4"
              >
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
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="mt-2.5 min-h-20 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/40"
                />
                <button className="mt-2.5 w-full rounded-xl border border-lime-300/30 py-2.5 text-sm font-bold text-lime-300 hover:bg-lime-300 hover:text-black">
                  Submit Review
                </button>
              </form>
              <div className="mt-4 grid gap-3">
                {reviews.map((item) => (
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
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
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
export default FacilityDetailsPage;
