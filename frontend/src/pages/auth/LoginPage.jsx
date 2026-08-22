import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">
          Login
        </h1>

        <p className="mt-2 text-slate-500">
          Sign in to your Amar Kolkata account.
        </p>

        <form className="mt-6 grid gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-xl border p-3"
          />

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 p-3 font-bold text-white"
          >
            Login
          </button>
        </form>

        <div className="mt-5 flex justify-between text-sm">
          <Link to="/register" className="font-bold text-emerald-700">
            Register
          </Link>

          <Link
            to="/forgot-password"
            className="font-bold text-emerald-700"
          >
            Forgot password?
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;