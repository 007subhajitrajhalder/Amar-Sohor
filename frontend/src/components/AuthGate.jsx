import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { getAuthHeaders, logout, roleHome } from "../api/client";
import { useApi } from "../api/useApi";
import ApiState from "./ApiState";

function ProfileGate({ role, children }) {
  const profile = useApi("/users/me", { poll: 0 });
  const navigate = useNavigate();

  if (profile.loading || profile.error) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <ApiState {...profile} />
      </main>
    );
  }

  const allowed = role === "AGENT"
    ? ["AGENT", "AGENCY", "ADMIN"].includes(profile.data.role)
    : role === "USER"
    ? ["USER", "AGENT", "AGENCY", "ADMIN"].includes(profile.data.role)
    : profile.data.role === role;

  if (!allowed) {
    return <Navigate to={roleHome(profile.data.role)} replace />;
  }

  return (
    <>
      <button
        type="button"
        className="fixed top-3.5 right-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#07101f]/90 px-3.5 py-2 text-xs font-semibold text-white shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-200 hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300 md:text-sm active:scale-95"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
        title="Sign Out"
      >
        <LogOut size={15} className="text-rose-400" />
        <span>Log out</span>
      </button>
      {children}
    </>
  );
}

export default function AuthGate({ role, children }) {
  const location = useLocation();
  const [signedIn, setSignedIn] = useState(() => Boolean(getAuthHeaders().Authorization));

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(getAuthHeaders().Authorization));
    window.addEventListener("authChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("authChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return signedIn ? (
    <ProfileGate role={role}>{children}</ProfileGate>
  ) : (
    <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  );
}
