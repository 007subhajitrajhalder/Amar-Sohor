import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">
          Forgot Password
        </h1>

        <p className="mt-2 text-slate-500">
          Enter your registered email address.
        </p>

        <form className="mt-6 grid gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="rounded-xl border p-3"
          />

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Send Reset Link
          </button>
        </form>

        <Link
          to="/login"
          className="mt-5 block text-center font-bold text-emerald-700"
        >
          Return to Login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;