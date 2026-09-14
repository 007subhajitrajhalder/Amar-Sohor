import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import AuthPageShell from "./AuthPageShell";

function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/15 bg-black/40 p-7 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/25 bg-lime-300/10 text-lime-300"><ShieldCheck size={30} /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[4px] text-lime-300">Account recovery</p>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Reset your password</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-white/50">Enter the email connected to your account and we will send you a secure reset link.</p>
        <form className="mt-8 grid gap-5 text-left">
          <label htmlFor="email" className="grid gap-2 text-sm font-medium text-white/75">Email address
            <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
              <Mail size={19} className="text-lime-300" /><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full bg-transparent text-white outline-none placeholder:text-white/30" />
            </span>
          </label>
          <button type="submit" className="min-h-14 rounded-2xl bg-lime-300 px-5 font-bold text-black shadow-lg shadow-lime-300/10 transition hover:-translate-y-0.5 hover:bg-lime-200">Send reset link</button>
        </form>
        <Link to="/login" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-lime-300 hover:text-lime-200"><ArrowLeft size={16} />Back to sign in</Link>
      </section>
    </AuthPageShell>
  );
}

export default ForgotPasswordPage;
