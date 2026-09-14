import { LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AuthPageShell from "./AuthPageShell";

function LoginPage() {
  return (
    <AuthPageShell activePage="login">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-black/35 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden min-h-[580px] flex-col justify-end overflow-hidden border-r border-white/10 p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-300/20 via-transparent to-black/50" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[4px] text-lime-300">Smart city access</p>
            <h2 className="mt-5 font-serif text-5xl font-bold leading-tight">Your city,<br /><span className="text-lime-300">within reach.</span></h2>
            <p className="mt-5 max-w-md leading-7 text-white/55">Track your reports, discover nearby public facilities, and stay connected to your neighbourhood.</p>
          </div>
        </div>
        <div className="p-7 sm:p-10 lg:p-14">
          <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[3px] text-lime-300">Welcome back</span>
          <h1 className="mt-6 font-serif text-4xl font-bold sm:text-5xl">Sign in to your account</h1>
          <p className="mt-4 leading-7 text-white/50">Access your reports, saved facilities, and civic activity in one place.</p>
          <form className="mt-9 grid gap-5">
            <label htmlFor="email" className="grid gap-2 text-sm font-medium text-white/75">Email address
              <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <Mail size={19} className="text-lime-300" /><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full bg-transparent text-white outline-none placeholder:text-white/30" />
              </span>
            </label>
            <label htmlFor="password" className="grid gap-2 text-sm font-medium text-white/75">Password
              <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                <LockKeyhole size={19} className="text-lime-300" /><input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" className="w-full bg-transparent text-white outline-none placeholder:text-white/30" />
              </span>
            </label>
            <div className="text-right"><Link to="/forgot-password" className="text-sm font-medium text-lime-300 hover:text-lime-200">Forgot password?</Link></div>
            <button type="submit" className="min-h-14 rounded-2xl bg-lime-300 px-5 font-bold text-black shadow-lg shadow-lime-300/10 transition hover:-translate-y-0.5 hover:bg-lime-200">Login</button>
          </form>
          <p className="mt-7 text-center text-sm text-white/45">New to Amar Sohor? <Link to="/register" className="font-bold text-lime-300 hover:text-lime-200">Create an account</Link></p>
        </div>
      </section>
    </AuthPageShell>
  );
}

export default LoginPage;
