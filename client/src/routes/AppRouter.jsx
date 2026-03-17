import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import DashboardProfile from '../pages/DashboardProfile';
import DashboardProgress from '../pages/DashboardProgress';
import DashboardActivity from '../pages/DashboardActivity';
import AiAssistant from '../pages/AiAssistant';
import MentorDiscovery from '../pages/MentorDiscovery';
import MentorProfileDetail from '../pages/MentorProfileDetail';
import MentorshipRequest from '../pages/MentorshipRequest';
import SessionsDashboard from '../pages/SessionsDashboard';
import CommunityForum from '../pages/CommunityForum';
import MentalHealthSupport from '../pages/MentalHealthSupport';
import InternshipsPage from '../pages/InternshipsPage';
import InternshipDetails from '../pages/InternshipDetails';
import ApplyInternship from '../pages/ApplyInternship';
import SavedInternships from '../pages/SavedInternships';
import MyApplications from '../pages/MyApplications';
import RecommendedInternships from '../pages/RecommendedInternships';
import CompaniesPage from '../pages/CompaniesPage';
import CompanyProfile from '../pages/CompanyProfile';
import Profile from '../pages/Profile';
import AdminPanel from '../pages/AdminPanel';
import ResourceLibrary from '../pages/ResourceLibrary';
import ResourceUpload from '../pages/ResourceUpload';
import ResourceDetail from '../pages/ResourceDetail';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public pages with MainLayout (Navbar + content) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Dashboard pages with DashboardLayout (Sidebar + Topbar + content) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/progress" element={<DashboardProgress />} />
        <Route path="/dashboard/activity" element={<DashboardActivity />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        {/* Mentorship Module Routes */}
        <Route path="/mentors" element={<MentorDiscovery />} />
        <Route path="/mentors/:id" element={<MentorProfileDetail />} />
        <Route path="/mentorship/request" element={<MentorshipRequest />} />
        <Route path="/mentorship/sessions" element={<SessionsDashboard />} />
        
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/mental-health" element={<MentalHealthSupport />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/internships/apply/:id" element={<ApplyInternship />} />
        <Route path="/recommended-internships" element={<RecommendedInternships />} />
        <Route path="/saved-internships" element={<SavedInternships />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
        
        {/* Resource Module Routes */}
        <Route path="/resources" element={<ResourceLibrary />} />
        <Route path="/resources/upload" element={<ResourceUpload />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
