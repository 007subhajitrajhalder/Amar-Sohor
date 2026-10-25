import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route protection wrapper with role-based access control.
 * - Guarantees that only authenticated users can access the wrapped component.
 * - Restricts access based on allowedRoles.
 * - Agency members have access to /agency/* pages.
 * - Admins have access to /admin/* pages.
 * - If user does not have permission, redirects to their authorized dashboard.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07101f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-300 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide text-white/70">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve attempted location so user can be redirected after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    const isAllowed = allowedRoles.some((role) => {
      if (role === "AGENCY" || role === "AGENT") {
        return userRole === "AGENCY" || userRole === "AGENT";
      }
      return userRole === role;
    });

    if (!isAllowed) {
      // Redirect unauthorized user to their respective permitted dashboard
      if (userRole === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (userRole === "AGENT" || userRole === "AGENCY") {
        return <Navigate to="/agency/dashboard" replace />;
      }
      return <Navigate to="/citizen/dashboard" replace />;
    }
  }

  return children;
}
