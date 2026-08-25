import { Link } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthLayout from "../../components/AuthLayout";

function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Access your reports, saved facilities, and civic activity in one place."
    >
        <form className="mt-8 grid gap-5">
          <AuthInput id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
          <AuthInput id="password" label="Password" type="password" placeholder="Enter your password" autoComplete="current-password" />

          <AuthButton>
            Login
          </AuthButton>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-slate-500">New to Amar Sohor?</span>
          <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-900">
            Create account
          </Link>

          <Link
            to="/forgot-password"
            className="font-bold text-emerald-700"
          >
            Forgot password?
          </Link>
        </div>
    </AuthLayout>
  );
}

export default LoginPage;