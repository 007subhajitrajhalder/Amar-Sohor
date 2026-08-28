import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import AuthPageShell from "./AuthPageShell";

const fields = [
  ["name", "Full name", "text", "Your full name", "name", UserRound],
  ["email", "Email address", "email", "you@example.com", "email", Mail],
  ["phone", "Phone number", "tel", "Your phone number", "tel", Phone],
  ["password", "Password", "password", "Create a password", "new-password", LockKeyhole],
  ["confirm-password", "Confirm password", "password", "Repeat your password", "new-password", LockKeyhole],
];

function RegisterPage() {
  return (
    <AuthPageShell activePage="register">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-black/35 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[720px] flex-col justify-end overflow-hidden border-r border-white/10 p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-300/20 via-transparent to-black/50" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[4px] text-lime-300">Join the community</p>
            <h2 className="mt-5 font-serif text-5xl font-bold leading-tight">A better city<br /><span className="text-lime-300">starts with you.</span></h2>
            <p className="mt-5 max-w-md leading-7 text-white/55">Create your citizen account and help make public services more responsive and transparent.</p>
          </div>
        </div>
        <div className="p-7 sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[3px] text-lime-300">Create an account</span>
          <h1 className="mt-5 font-serif text-4xl font-bold sm:text-5xl">Join Amar Sohor</h1>
          <p className="mt-3 leading-7 text-white/50">One account for facilities, reports, and civic updates.</p>
          <form className="mt-7 grid gap-4 sm:grid-cols-2">
            {fields.map(([id, label, type, placeholder, autoComplete, Icon], index) => (
              <label key={id} htmlFor={id} className={`grid gap-2 text-sm font-medium text-white/75 ${index < 2 ? "sm:col-span-1" : "sm:col-span-2"}`}>{label}
                <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 transition focus-within:border-lime-300/60 focus-within:bg-white/10">
                  <Icon size={18} className="shrink-0 text-lime-300" /><input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} className="w-full bg-transparent text-white outline-none placeholder:text-white/30" />
                </span>
              </label>
            ))}
            <button type="submit" className="min-h-14 rounded-2xl bg-lime-300 px-5 font-bold text-black shadow-lg shadow-lime-300/10 transition hover:-translate-y-0.5 hover:bg-lime-200 sm:col-span-2">Register</button>
          </form>
          <p className="mt-6 text-center text-sm text-white/45">Already have an account? <Link to="/login" className="font-bold text-lime-300 hover:text-lime-200">Sign in</Link></p>
        </div>
      </section>
    </AuthPageShell>
  );
}

export default RegisterPage;
