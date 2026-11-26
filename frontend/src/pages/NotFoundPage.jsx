import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import { roleHome } from "../api/client";
import { useAuth } from "../context/AuthContext";

const kolkataBg = new URL("../assets/kolkata-bg.jpg", import.meta.url).href;

export default function NotFoundPage() {
  const { user, isAuthenticated } = useAuth();
  const home = isAuthenticated && user ? roleHome(user.role) : "/";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
      <div className="page-bg pointer-events-none fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${kolkataBg})` }} />
      <div className="pointer-events-none fixed inset-0 bg-black/75" />
      <main className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/40 p-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-300/30 bg-lime-300/10 text-lime-300">
          <Compass size={26} aria-hidden="true" />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[3px] text-lime-300">Error 404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to={home}
          className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-black transition hover:bg-lime-200"
        >
          <Home size={16} aria-hidden="true" />
          {isAuthenticated ? "Go to dashboard" : "Back to home"}
        </Link>
      </main>
    </div>
  );
}
