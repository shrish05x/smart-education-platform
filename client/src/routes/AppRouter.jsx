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
import MentorDirectory from '../pages/MentorDirectory';
import CommunityForum from '../pages/CommunityForum';
import MentalHealthSupport from '../pages/MentalHealthSupport';
import InternshipBoard from '../pages/InternshipBoard';
import Profile from '../pages/Profile';
import AdminPanel from '../pages/AdminPanel';

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
        <Route path="/mentors" element={<MentorDirectory />} />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/mental-health" element={<MentalHealthSupport />} />
        <Route path="/internships" element={<InternshipBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
