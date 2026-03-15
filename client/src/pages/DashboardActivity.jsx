import { motion } from 'framer-motion';

const typeConfig = {
  study: { color: 'bg-indigo-500', ring: 'ring-indigo-100', icon: '📖' },
  mentoring: { color: 'bg-blue-500', ring: 'ring-blue-100', icon: '👨‍🏫' },
  community: { color: 'bg-green-500', ring: 'ring-green-100', icon: '💬' },
  achievement: { color: 'bg-amber-500', ring: 'ring-amber-100', icon: '🏆' },
  internship: { color: 'bg-purple-500', ring: 'ring-purple-100', icon: '💼' },
  counseling: { color: 'bg-rose-500', ring: 'ring-rose-100', icon: '❤️' },
};

const activities = [
  { _id: '1', type: 'study', title: 'Completed Chapter 5: Data Structures', description: 'Finished binary trees and heap implementations', time: '1h ago' },
  { _id: '2', type: 'mentoring', title: 'Mentor Session with Dr. Sarah Chen', description: 'Reviewed calculus integration techniques', time: '3h ago' },
  { _id: '3', type: 'community', title: 'Posted in CS201 Discussion', description: 'Shared solution approach for sorting algorithms', time: '5h ago' },
  { _id: '4', type: 'achievement', title: 'Earned "Week Warrior" Badge', description: '7-day study streak achieved!', time: '1d ago' },
  { _id: '5', type: 'study', title: 'Started Machine Learning Module', description: 'Beginning neural network fundamentals', time: '1d ago' },
  { _id: '6', type: 'internship', title: 'Applied to Google SWE Internship', description: 'Application submitted successfully', time: '2d ago' },
  { _id: '7', type: 'counseling', title: 'Wellbeing Check-in Completed', description: 'Monthly mental health assessment', time: '3d ago' },
  { _id: '8', type: 'study', title: 'Completed Quiz: Database Systems', description: 'Scored 92% on normalization quiz', time: '3d ago' },
];

const DashboardActivity = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
        <p className="text-gray-500 mt-1">Your learning activity timeline</p>
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-2"
      >
        {['All', 'Study', 'Mentoring', 'Community', 'Achievements'].map((filter, i) => (
          <button
            key={filter}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              i === 0
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="divide-y divide-gray-50">
          {activities.map((item, i) => {
            const config = typeConfig[item.type] || typeConfig.study;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors"
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className={`w-10 h-10 rounded-xl ${config.color} ring-4 ${config.ring} flex items-center justify-center text-lg shadow-sm`}>
                    {config.icon}
                  </div>
                  {i < activities.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-100"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{item.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardActivity;
