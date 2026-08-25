import { Link } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthLayout from "../../components/AuthLayout";

function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Join the community"
      title="Create your account"
      description="Join residents making Amar Sohor more connected, responsive, and cared for."
    >
        <form className="mt-8 grid gap-5">
          <AuthInput id="name" label="Full name" type="text" placeholder="Your full name" autoComplete="name" />
          <AuthInput id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
          <AuthInput id="phone" label="Phone number" type="tel" placeholder="Your phone number" autoComplete="tel" />
          <AuthInput id="password" label="Password" type="password" placeholder="Create a password" autoComplete="new-password" />
          <AuthInput id="confirm-password" label="Confirm password" type="password" placeholder="Repeat your password" autoComplete="new-password" />

          <AuthButton>
            Register
          </AuthButton>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-900">
            Sign in
          </Link>
        </p>
    </AuthLayout>
  );
}

export default RegisterPage;