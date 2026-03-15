import { motion } from 'framer-motion';

const StudyProgressWidget = ({ stats = {} }) => {
  const progress = stats.overallProgress || 64;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Study Progress</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">This Week</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#progressGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - progress / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{progress}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Hours this week</span>
            <span className="font-semibold text-gray-800">{stats.studyHoursThisWeek || 18.5}h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Courses</span>
            <span className="font-semibold text-gray-800">{stats.coursesCompleted || 2}/{stats.coursesEnrolled || 5}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Streak</span>
            <span className="font-semibold text-indigo-600">🔥 {stats.streakDays || 12} days</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyProgressWidget;
