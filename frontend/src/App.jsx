import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

// Protected Route Guard with Role-Based Access Control
import ProtectedRoute from "./components/ProtectedRoute";

// Authentication pages (Public)
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Citizen pages (Protected: Accessible to all authenticated users)
import UserDashboardPage from "./pages/citizen/UserDashboardPage";
import MapViewPage from "./pages/citizen/MapViewPage";
import FacilityDetailsPage from "./pages/citizen/FacilityDetailsPage";
import ReportIssuePage from "./pages/citizen/ReportIssuePage";
import MyReportsPage from "./pages/citizen/MyReportsPage";
import ReportStatusPage from "./pages/citizen/ReportStatusPage";
import UserRecommendationPage from "./pages/citizen/UserRecommendationPage";
import MyRecommendationsPage from "./pages/citizen/MyRecommendationsPage";
import RecommendationStatusPage from "./pages/citizen/RecommendationStatusPage";

// Agency pages (Protected: Accessible only to Agency members and Admin)
import AgencyDashboardPage from "./pages/agency/AgencyDashboardPage";
import AssignedReportsPage from "./pages/agency/AssignedReportsPage";
import ReportInvestigationPage from "./pages/agency/ReportInvestigationPage";
import PreviouslyResolvedPage from "./pages/agency/PreviouslyResolvedPage";
import AddFacilityPage from "./pages/agency/AddFacilityPage";
import FacilityManagementPage from "./pages/agency/FacilityManagementPage";
import UploadResolutionPage from "./pages/agency/UploadResolutionPage";
import EditFacilityPage from "./pages/agency/EditFacilityPage";
import AssignedRecommendationsPage from "./pages/agency/AssignedRecommendationsPage";
import RecommendationInvestigationPage from "./pages/agency/RecommendationInvestigationPage";

// Admin pages (Protected: Accessible only to Municipal Admin)
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AgencyManagementPage from "./pages/admin/AgencyManagementPage";
import AddAgencyMemberPage from "./pages/admin/AddAgencyMemberPage";
import AllComplaintsPage from "./pages/admin/AllComplaintsPage";
import AdminComplaintDetailsPage from "./pages/admin/AdminComplaintDetailsPage";
import AgencyMembersPage from "./pages/admin/AgencyMembersPage";
import AllRecommendationsPage from "./pages/admin/AllRecommendationsPage";
import AllocateRecommendationPage from "./pages/admin/AllocateRecommendationPage";
import AdminRecommendationProgressPage from "./pages/admin/AdminRecommendationProgressPage";


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Citizen Routes (Accessible to authenticated users) */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facilities/:facilityId"
        element={
          <ProtectedRoute>
            <FacilityDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report-issue"
        element={
          <ProtectedRoute>
            <ReportIssuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report-issue/:facilityId"
        element={
          <ProtectedRoute>
            <ReportIssuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/my-reports"
        element={
          <ProtectedRoute>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/reports/:reportId"
        element={
          <ProtectedRoute>
            <ReportStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/recommendation"
        element={
          <ProtectedRoute>
            <UserRecommendationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/user-recommendation"
        element={
          <ProtectedRoute>
            <UserRecommendationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/my-recommendations"
        element={
          <ProtectedRoute>
            <MyRecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/recommendations/:recommendationId"
        element={
          <ProtectedRoute>
            <RecommendationStatusPage />
          </ProtectedRoute>
        }
      />

      {/* Agency Routes (Restricted: AGENT, AGENCY, ADMIN) */}
      <Route
        path="/agency/dashboard"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <AgencyDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/reports"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <AssignedReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/reports/:reportId/investigate"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <ReportInvestigationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/resolved"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <PreviouslyResolvedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/facilities/:facilityId/edit"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <EditFacilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/facilities/add"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <AddFacilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/facilities"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <FacilityManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/reports/:reportId/resolution"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <UploadResolutionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/recommendations"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <AssignedRecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agency/recommendations/:recommendationId/investigate"
        element={
          <ProtectedRoute allowedRoles={["AGENT", "AGENCY", "ADMIN"]}>
            <RecommendationInvestigationPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (Restricted: ADMIN only) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agencies"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AgencyManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agency-members/add"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AddAgencyMemberPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AllComplaintsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints/:reportId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminComplaintDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agencies/:agencyId/members"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AgencyMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recommendations"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AllRecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recommendations/:recommendationId/allocate"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AllocateRecommendationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recommendations/:recommendationId/progress"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminRecommendationProgressPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
