import AuthGate from "./components/AuthGate";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

// Authentication pages (Public)
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Citizen pages (Protected: Accessible to authenticated users)
import UserDashboardPage from "./pages/citizen/UserDashboardPage";
import MapViewPage from "./pages/citizen/MapViewPage";
import FacilityDetailsPage from "./pages/citizen/FacilityDetailsPage";
import ReportIssuePage from "./pages/citizen/ReportIssuePage";
import MyReportsPage from "./pages/citizen/MyReportsPage";
import ReportStatusPage from "./pages/citizen/ReportStatusPage";
import UserRecommendationPage from "./pages/citizen/UserRecommendationPage";
import MyRecommendationsPage from "./pages/citizen/MyRecommendationsPage";
import RecommendationStatusPage from "./pages/citizen/RecommendationStatusPage";

// Agency pages (Protected: Accessible to Agency members and Admins)
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

// Admin pages (Protected: Accessible only to Municipal Admins)
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
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Citizen / User Protected Routes */}
      <Route
        path="/citizen/dashboard"
        element={<AuthGate role="USER"><UserDashboardPage /></AuthGate>}
      />
      <Route
        path="/map"
        element={<AuthGate role="USER"><MapViewPage /></AuthGate>}
      />
      <Route
        path="/facilities/:facilityId"
        element={<AuthGate role="USER"><FacilityDetailsPage /></AuthGate>}
      />
      <Route
        path="/citizen/report-issue"
        element={<AuthGate role="USER"><ReportIssuePage /></AuthGate>}
      />
      <Route
        path="/citizen/report-issue/:facilityId"
        element={<AuthGate role="USER"><ReportIssuePage /></AuthGate>}
      />
      <Route
        path="/citizen/my-reports"
        element={<AuthGate role="USER"><MyReportsPage /></AuthGate>}
      />
      <Route
        path="/citizen/reports/:reportId"
        element={<AuthGate role="USER"><ReportStatusPage /></AuthGate>}
      />
      <Route
        path="/citizen/recommendation"
        element={<AuthGate role="USER"><UserRecommendationPage /></AuthGate>}
      />
      <Route
        path="/citizen/user-recommendation"
        element={<AuthGate role="USER"><UserRecommendationPage /></AuthGate>}
      />
      <Route
        path="/citizen/my-recommendations"
        element={<AuthGate role="USER"><MyRecommendationsPage /></AuthGate>}
      />
      <Route
        path="/citizen/recommendations/:recommendationId"
        element={<AuthGate role="USER"><RecommendationStatusPage /></AuthGate>}
      />

      {/* Agency Protected Routes */}
      <Route
        path="/agency/dashboard"
        element={<AuthGate role="AGENT"><AgencyDashboardPage /></AuthGate>}
      />
      <Route
        path="/agency/reports"
        element={<AuthGate role="AGENT"><AssignedReportsPage /></AuthGate>}
      />
      <Route
        path="/agency/reports/:reportId/investigate"
        element={<AuthGate role="AGENT"><ReportInvestigationPage /></AuthGate>}
      />
      <Route
        path="/agency/resolved"
        element={<AuthGate role="AGENT"><PreviouslyResolvedPage /></AuthGate>}
      />
      <Route
        path="/agency/facilities/:facilityId/edit"
        element={<AuthGate role="AGENT"><EditFacilityPage /></AuthGate>}
      />
      <Route
        path="/agency/facilities/add"
        element={<AuthGate role="AGENT"><AddFacilityPage /></AuthGate>}
      />
      <Route
        path="/agency/facilities"
        element={<AuthGate role="AGENT"><FacilityManagementPage /></AuthGate>}
      />
      <Route
        path="/agency/reports/:reportId/resolution"
        element={<AuthGate role="AGENT"><UploadResolutionPage /></AuthGate>}
      />
      <Route
        path="/agency/recommendations"
        element={<AuthGate role="AGENT"><AssignedRecommendationsPage /></AuthGate>}
      />
      <Route
        path="/agency/recommendations/:recommendationId/investigate"
        element={<AuthGate role="AGENT"><RecommendationInvestigationPage /></AuthGate>}
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={<AuthGate role="ADMIN"><AdminDashboardPage /></AuthGate>}
      />
      <Route
        path="/admin/users"
        element={<AuthGate role="ADMIN"><UserManagementPage /></AuthGate>}
      />
      <Route
        path="/admin/agencies"
        element={<AuthGate role="ADMIN"><AgencyManagementPage /></AuthGate>}
      />
      <Route
        path="/admin/agency-members/add"
        element={<AuthGate role="ADMIN"><AddAgencyMemberPage /></AuthGate>}
      />
      <Route
        path="/admin/complaints"
        element={<AuthGate role="ADMIN"><AllComplaintsPage /></AuthGate>}
      />
      <Route
        path="/admin/complaints/:reportId"
        element={<AuthGate role="ADMIN"><AdminComplaintDetailsPage /></AuthGate>}
      />
      <Route
        path="/admin/agencies/:agencyId/members"
        element={<AuthGate role="ADMIN"><AgencyMembersPage /></AuthGate>}
      />
      <Route
        path="/admin/recommendations"
        element={<AuthGate role="ADMIN"><AllRecommendationsPage /></AuthGate>}
      />
      <Route
        path="/admin/recommendations/:recommendationId/allocate"
        element={<AuthGate role="ADMIN"><AllocateRecommendationPage /></AuthGate>}
      />
      <Route
        path="/admin/recommendations/:recommendationId/progress"
        element={<AuthGate role="ADMIN"><AdminRecommendationProgressPage /></AuthGate>}
      />
    </Routes>
  );
}

export default App;
