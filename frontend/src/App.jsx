import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
// Authentication pages
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Citizen pages
import UserDashboardPage from "./pages/citizen/UserDashboardPage";
import MapViewPage from "./pages/citizen/MapViewPage";
import FacilityDetailsPage from "./pages/citizen/FacilityDetailsPage";
import ReportIssuePage from "./pages/citizen/ReportIssuePage";
import MyReportsPage from "./pages/citizen/MyReportsPage";
import ReportStatusPage from "./pages/citizen/ReportStatusPage";

// Agency pages
import AgencyDashboardPage from "./pages/agency/AgencyDashboardPage";
import AssignedReportsPage from "./pages/agency/AssignedReportsPage";
import ReportInvestigationPage from "./pages/agency/ReportInvestigationPage";
import PreviouslyResolvedPage from "./pages/agency/PreviouslyResolvedPage";
import AddFacilityPage from "./pages/agency/AddFacilityPage";
import FacilityManagementPage from "./pages/agency/FacilityManagementPage";
import UploadResolutionPage from "./pages/agency/UploadResolutionPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AgencyManagementPage from "./pages/admin/AgencyManagementPage";
import AddAgencyMemberPage from "./pages/admin/AddAgencyMemberPage";
import AllComplaintsPage from "./pages/admin/AllComplaintsPage";
import AdminComplaintDetailsPage from "./pages/admin/AdminComplaintDetailsPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Authentication */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      {/* Citizen */}
      <Route
        path="/citizen/dashboard"
        element={<UserDashboardPage />}
      />

      <Route path="/map" element={<MapViewPage />} />

      <Route
        path="/facilities/:facilityId"
        element={<FacilityDetailsPage />}
      />

      <Route
        path="/citizen/report-issue/:facilityId"
        element={<ReportIssuePage />}
      />

      <Route
        path="/citizen/my-reports"
        element={<MyReportsPage />}
      />

      <Route
        path="/citizen/reports/:reportId"
        element={<ReportStatusPage />}
      />

      {/* Agency */}
      <Route
        path="/agency/dashboard"
        element={<AgencyDashboardPage />}
      />

      <Route
        path="/agency/reports"
        element={<AssignedReportsPage />}
      />

      <Route
        path="/agency/reports/:reportId/investigate"
        element={<ReportInvestigationPage />}
      />

      <Route
        path="/agency/resolved"
        element={<PreviouslyResolvedPage />}
      />

      

      <Route
        path="/agency/facilities/add"
        element={<AddFacilityPage />}
      />

      <Route
        path="/agency/facilities"
        element={<FacilityManagementPage />}
      />

      <Route
        path="/agency/reports/:reportId/resolution"
        element={<UploadResolutionPage />}
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />}
      />

      <Route
        path="/admin/users"
        element={<UserManagementPage />}
      />

      <Route
        path="/admin/agencies"
        element={<AgencyManagementPage />}
      />
      <Route
        path="/admin/agency-members/add"
        element={<AddAgencyMemberPage />}
      />

      <Route
        path="/admin/complaints"
        element={<AllComplaintsPage />}
      />

      <Route
        path="/admin/complaints/:reportId"
        element={<AdminComplaintDetailsPage />}
      />

      
    </Routes>
  );
}

export default App;