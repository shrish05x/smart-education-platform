import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
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
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><MentorDirectory /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityForum /></ProtectedRoute>} />
        <Route path="/mental-health" element={<ProtectedRoute><MentalHealthSupport /></ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute><InternshipBoard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
