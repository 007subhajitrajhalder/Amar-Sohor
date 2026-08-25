import { Link } from "react-router-dom";

function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="relative flex min-h-[calc(100vh-81px)] items-center overflow-hidden bg-[#f4f7f2] px-5 py-12 sm:px-8">
      <div className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <section className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_24px_80px_rgba(20,55,37,0.14)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-emerald-950 p-10 text-white lg:flex">
          <Link to="/" className="text-lg font-bold tracking-tight">Amar Sohor</Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-lime-300">A better city, together</p>
            <h2 className="mt-5 max-w-sm text-4xl font-bold leading-tight">Make everyday civic life simpler.</h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-emerald-100/75">
              Find public facilities, report issues, and help your neighbourhood stay cared for.
            </p>
          </div>
          <p className="text-sm text-emerald-200/60">Trusted tools for a more responsive city.</p>
        </div>

        <div className="p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md leading-6 text-slate-500">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
