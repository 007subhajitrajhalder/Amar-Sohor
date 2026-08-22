import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">
          Register as a citizen.
        </p>

        <form className="mt-6 grid gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="rounded-xl border p-3"
          />

          <input
            type="email"
            placeholder="Email address"
            className="rounded-xl border p-3"
          />

          <input
            type="tel"
            placeholder="Phone number"
            className="rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="rounded-xl border p-3"
          />

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-emerald-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;