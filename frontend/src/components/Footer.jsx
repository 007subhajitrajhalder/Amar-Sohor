import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold">Amar Sohor</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-100">
            A smart public facility and complaint-management platform.
          </p>
        </div>

        <div>
          <h2 className="font-bold">Quick Links</h2>
          <div className="mt-3 grid gap-2 text-sm text-emerald-100">
            <Link to="/">Home</Link>
            <Link to="/map">Find Facilities</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>

        <div>
          <h2 className="font-bold">Contact Us</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-100">
            Kolkata, West Bengal
            <br />
            support@amarsohor.com
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-emerald-200">
        © 2026-27 Amar Sohor
      </div>
    </footer>
  );
}

export default Footer;
