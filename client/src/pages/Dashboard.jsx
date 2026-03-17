import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StudyProgressWidget from '../components/dashboard/widgets/StudyProgressWidget';
import MentorMessagesWidget from '../components/dashboard/widgets/MentorMessagesWidget';
import CommunityActivityWidget from '../components/dashboard/widgets/CommunityActivityWidget';
import UpcomingSessionsWidget from '../components/dashboard/widgets/UpcomingSessionsWidget';
import RecommendedResourcesWidget from '../components/dashboard/widgets/RecommendedResourcesWidget';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    api.get(`/profile/completion-status/${user._id}`)
      .then(({ data }) => { if (data.success) setCompletion(data.data); })
      .catch(() => setCompletion({ completionPercentage: 0, isVerified: false }));
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-medium capitalize">
            🎓 {user?.role || 'Student'}
          </span>
          {user?.university && (
            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              🏫 {user.university}
            </span>
          )}
        </div>
      </motion.div>

      {/* Profile completion banner */}
      {completion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className={`rounded-2xl p-4 shadow-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
            completion.isVerified
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {completion.isVerified ? (
              <span className="text-lg px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">✔ Verified</span>
            ) : (
              <span className="text-lg px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">⚠ Incomplete</span>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Profile {completion.completionPercentage}% complete
              </p>
              <div className="w-40 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completion.completionPercentage}%`,
                    background: completion.isVerified
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #f59e0b, #d97706)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          {!completion.isVerified && (
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Complete Profile →
            </button>
          )}
        </motion.div>
      )}

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Study Hours', value: '18.5h', change: '+2.5h', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: '📖' },
          { label: 'Assignments', value: '34/42', change: '81%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
          { label: 'Mentor Sessions', value: '3', change: 'This week', color: 'text-purple-600', bg: 'bg-purple-50', icon: '👨‍🏫' },
          { label: 'Community Posts', value: '8', change: '+3 new', color: 'text-amber-600', bg: 'bg-amber-50', icon: '💬' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl`}>{stat.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stat.bg} ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyStudyChart />
        <CourseCompletionChart />
      </div>

      {/* Widgets grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <StudyProgressWidget />
        <MentorMessagesWidget />
        <UpcomingSessionsWidget />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CommunityActivityWidget />
        <RecommendedResourcesWidget />
      </div>
    </div>
  );
};

export default Dashboard;
