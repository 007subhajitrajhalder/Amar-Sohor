import { Link } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthLayout from "../../components/AuthLayout";

function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email connected to your account and we will send you a secure reset link."
    >
        <form className="mt-8 grid gap-5">
          <AuthInput id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />

          <AuthButton>
            Send Reset Link
          </AuthButton>
        </form>

        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-bold text-emerald-700 hover:text-emerald-900"
        >
          Back to sign in
        </Link>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;