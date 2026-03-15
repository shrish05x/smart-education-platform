import { motion } from 'framer-motion';

const CommunityActivityWidget = ({ activities = [] }) => {
  const defaultActivities = [
    { _id: '1', user: 'Alice Wang', action: 'posted in', target: 'CS201 Discussion', time: '30m ago', likes: 12 },
    { _id: '2', user: 'Marcus Johnson', action: 'answered in', target: 'Math Help Forum', time: '1h ago', likes: 8 },
    { _id: '3', user: 'Priya Sharma', action: 'created', target: 'Study Group: Physics', time: '2h ago', likes: 15 },
    { _id: '4', user: 'David Kim', action: 'shared resource in', target: 'Web Dev Community', time: '3h ago', likes: 22 },
  ];
  const data = activities.length > 0 ? activities : defaultActivities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Community Activity</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-medium">Live</span>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{item.user}</span>{' '}
                <span className="text-gray-400">{item.action}</span>{' '}
                <span className="font-medium text-indigo-600">{item.target}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 ml-3 flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              {item.likes}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityActivityWidget;
