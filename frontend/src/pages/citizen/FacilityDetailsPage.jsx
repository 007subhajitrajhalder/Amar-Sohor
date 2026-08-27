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
  const submitReview = (event) => {
    event.preventDefault();
    if (!review.trim()) return;
    setReviews([
      {
        id: Date.now(),
        name: "You",
        rating: 5,
        date: "Just now",
        text: review.trim(),
      },
      ...reviews,
    ]);
    setReview("");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b18] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-lime-300/[0.07] blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-purple-500/[0.08] blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07101f] via-[#080d1b] to-[#050812]" />
      </div>
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
      <main className="relative z-10 px-5 py-12 md:px-10 md:py-16">
        <section className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[3px] text-lime-300">
            FACILITY DETAILS
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">{name}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/45">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-lime-300" />
              {address}
            </span>
            <span className="flex items-center gap-2">
              <Star size={16} className="fill-lime-300 text-lime-300" />
              {rating} rating
            </span>
          </div>
          <div className="mt-9 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-2xl">
              <iframe
                title={`${name} map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                className="h-72 w-full border-0 opacity-80"
                loading="lazy"
              />
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between gap-3">
                  <span className="rounded-full bg-lime-300/10 px-4 py-2 text-xs font-semibold text-lime-300">
                    ● Open now
                  </span>
                  <span className="flex items-center gap-2 text-sm text-white/40">
                    <Clock size={16} />
                    6:00 AM – 10:00 PM
                  </span>
                </div>
                <h2 className="mt-7 text-2xl font-bold">
                  Facility information
                </h2>
                <p className="mt-3 leading-7 text-white/50">
                  A registered public facility managed by the relevant Kolkata
                  municipal department and maintained for daily community use.
                </p>
                <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-white/30">Category</p>
                    <p className="mt-1 font-semibold">{category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30">Facility ID</p>
                    <p className="mt-1 font-semibold">
                      AS-{String(facilityId).padStart(4, "0")}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/citizen/report-issue/${facilityId}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-6 py-3 font-bold text-black hover:bg-lime-200"
                >
                  Report an Issue <Send size={17} />
                </Link>
              </div>
            </section>
            <aside className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
              <p className="text-xs font-bold tracking-[3px] text-lime-300">
                COMMUNITY
              </p>
              <h2 className="mt-2 text-2xl font-bold">User reviews</h2>
              <form
                onSubmit={submitReview}
                className="mt-6 border-b border-white/10 pb-6"
              >
                <Stars value={5} />
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="mt-3 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/40"
                />
                <button className="mt-3 w-full rounded-xl border border-lime-300/30 py-3 font-bold text-lime-300 hover:bg-lime-300 hover:text-black">
                  Submit Review
                </button>
              </form>
              <div className="mt-6 grid gap-5">
                {reviews.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-white/30">
                          {item.date}
                        </p>
                      </div>
                      <Stars value={item.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="text-lg font-bold">
              Amar <span className="text-lime-300">Sohor</span>
            </p>
            <p className="mt-2 text-sm text-white/40">
              My City. My Responsibility.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-white/45">
            <span className="flex items-center gap-2">
              <MapPin size={15} />
              Kolkata, India
            </span>
            <span className="flex items-center gap-2">
              <Mail size={15} />
              support@amarsohor.in
            </span>
            <span className="flex items-center gap-2">
              <Phone size={15} />
              +91 98765 43210
            </span>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/30">
          © 2026 Amar Sohor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
export default FacilityDetailsPage;
