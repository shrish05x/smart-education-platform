import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import VerificationQuiz from '../pages/VerificationQuiz';

// Public pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Student dashboard
import Dashboard from '../pages/Dashboard';
import DashboardProfile from '../pages/DashboardProfile';
import DashboardProgress from '../pages/DashboardProgress';
import DashboardActivity from '../pages/DashboardActivity';

// Mentor dashboard
import MentorDashboard from '../pages/MentorDashboard';
import MentorStudents from '../pages/MentorStudents';
import MentorAvailability from '../pages/MentorAvailability';
import MentorAnalytics from '../pages/MentorAnalytics';

// Counsellor dashboard
import CounsellorDashboard from '../pages/CounsellorDashboard';
import CounsellorClients from '../pages/CounsellorClients';
import CounsellorAvailability from '../pages/CounsellorAvailability';
import CounsellorNotes from '../pages/CounsellorNotes';
import CounsellorReports from '../pages/CounsellorReports';

// Shared feature pages
import AiAssistant from '../pages/AiAssistant';
import MentorDiscovery from '../pages/MentorDiscovery';
import MentorProfileDetail from '../pages/MentorProfileDetail';
import MentorshipRequest from '../pages/MentorshipRequest';
import SessionsDashboard from '../pages/SessionsDashboard';
import CommunityForum from '../pages/CommunityForum';
import MeetupsNearYou from '../pages/MeetupsNearYou';
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

/** Redirects /dashboard to the right home based on role */
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'mentor') return <Navigate to="/mentor-dashboard" replace />;
  if (user.role === 'counselor') return <Navigate to="/counsellor-dashboard" replace />;
  return <Dashboard />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* ── Public pages ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* ── Verification Quiz (standalone — no dashboard layout) ── */}
      <Route path="/verify" element={<ProtectedRoute><VerificationQuiz /></ProtectedRoute>} />

      {/* ── Protected dashboard pages ── */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

        {/* ─── Role-based home ─── */}
        <Route path="/dashboard" element={<RoleBasedDashboard />} />
        <Route path="/dashboard/profile"   element={<DashboardProfile />} />
        <Route path="/dashboard/progress"  element={<DashboardProgress />} />
        <Route path="/dashboard/activity"  element={<DashboardActivity />} />

        {/* ─── Mentor routes ─── */}
        <Route path="/mentor-dashboard"   element={<MentorDashboard />} />
        <Route path="/mentor/students"    element={<MentorStudents />} />
        <Route path="/mentor/availability" element={<MentorAvailability />} />
        <Route path="/mentor/analytics"   element={<MentorAnalytics />} />

        {/* ─── Counsellor routes ─── */}
        <Route path="/counsellor-dashboard"    element={<CounsellorDashboard />} />
        <Route path="/counsellor/clients"      element={<CounsellorClients />} />
        <Route path="/counsellor/availability" element={<CounsellorAvailability />} />
        <Route path="/counsellor/notes"        element={<CounsellorNotes />} />
        <Route path="/counsellor/reports"      element={<CounsellorReports />} />

        {/* ─── Shared feature routes ─── */}
        <Route path="/ai-assistant"           element={<AiAssistant />} />
        <Route path="/mentors"                element={<MentorDiscovery />} />
        <Route path="/mentors/:id"            element={<MentorProfileDetail />} />
        <Route path="/mentorship/request"     element={<MentorshipRequest />} />
        <Route path="/mentorship/sessions"    element={<SessionsDashboard />} />
        <Route path="/community"              element={<CommunityForum />} />
        <Route path="/meetups"                element={<MeetupsNearYou />} />
        <Route path="/mental-health"          element={<MentalHealthSupport />} />
        <Route path="/internships"            element={<InternshipsPage />} />
        <Route path="/internships/:id"        element={<InternshipDetails />} />
        <Route path="/internships/apply/:id"  element={<ApplyInternship />} />
        <Route path="/recommended-internships" element={<RecommendedInternships />} />
        <Route path="/saved-internships"      element={<SavedInternships />} />
        <Route path="/my-applications"        element={<MyApplications />} />
        <Route path="/companies"              element={<CompaniesPage />} />
        <Route path="/companies/:id"          element={<CompanyProfile />} />
        <Route path="/profile"               element={<Profile />} />
        <Route path="/admin"                 element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
        <Route path="/resources"             element={<ResourceLibrary />} />
        <Route path="/resources/upload"      element={<ResourceUpload />} />
        <Route path="/resources/:id"         element={<ResourceDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
