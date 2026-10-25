import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuthHeaders, logout, roleHome } from "../api/client";
import { useApi } from "../api/useApi";
import ApiState from "./ApiState";
function ProfileGate({ role, children }) {
  const profile = useApi("/users/me", { poll: 0 });
  const navigate = useNavigate();
  if (profile.loading || profile.error) return <main className="min-h-screen bg-slate-950 p-8 text-white"><ApiState {...profile} /></main>;
  const allowed = role === "AGENT"
    ? ["AGENT", "AGENCY", "ADMIN"].includes(profile.data.role)
    : role === "USER"
    ? ["USER", "AGENT", "AGENCY", "ADMIN"].includes(profile.data.role)
    : profile.data.role === role;
  if (!allowed) return <Navigate to={roleHome(profile.data.role)} replace />;
  return <>{children}<button type="button" className="fixed bottom-3 right-3 z-[60] rounded-xl border bg-slate-900 px-4 py-2 text-sm text-white"
    onClick={() => { logout(); navigate("/login", { replace: true }); }}>Log out</button></>;
}
export default function AuthGate({ role, children }) {
  const location = useLocation();
  const [signedIn, setSignedIn] = useState(() => Boolean(getAuthHeaders().Authorization));
  useEffect(() => {
    const sync = () => setSignedIn(Boolean(getAuthHeaders().Authorization));
    window.addEventListener("authChanged", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("authChanged", sync); window.removeEventListener("storage", sync); };
  }, []);
  return signedIn ? <ProfileGate role={role}>{children}</ProfileGate>
    : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}
