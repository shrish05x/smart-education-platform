import { motion } from 'framer-motion';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';

const DashboardProgress = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Study Progress</h1>
        <p className="text-gray-500 mt-1">Track your learning journey and achievements</p>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Study Hours', value: '142h', icon: '⏱️', color: 'from-indigo-500 to-blue-500' },
          { label: 'Average Score', value: '87%', icon: '🎯', color: 'from-emerald-500 to-teal-500' },
          { label: 'Assignments Done', value: '34/42', icon: '📝', color: 'from-purple-500 to-violet-500' },
          { label: 'Overall Progress', value: '64%', icon: '📈', color: 'from-amber-500 to-orange-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyStudyChart />
        <CourseCompletionChart />
      </div>

      {/* Learning milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Recent Milestones</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Week Warrior', desc: '7-day study streak', icon: '🔥', earned: true },
            { title: 'Quick Learner', desc: 'Complete 5 modules in a week', icon: '⚡', earned: true },
            { title: 'Community Star', desc: '10 helpful answers', icon: '⭐', earned: false },
            { title: 'Bookworm', desc: '100 hours of study', icon: '📚', earned: true },
            { title: 'Team Player', desc: 'Join 3 study groups', icon: '🤝', earned: false },
            { title: 'Data Wizard', desc: 'Complete all Data Science modules', icon: '🧙', earned: false },
          ].map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                badge.earned
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-sm font-semibold text-gray-800 mt-2">{badge.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
              {badge.earned && <span className="text-[10px] text-indigo-600 font-bold uppercase mt-1 block">✓ Earned</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardProgress;
