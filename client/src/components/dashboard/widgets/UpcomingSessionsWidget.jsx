import { motion } from 'framer-motion';

const typeStyles = {
  mentoring: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500' },
  'study-group': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  counseling: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
};

const UpcomingSessionsWidget = ({ sessions = [] }) => {
  const defaultSessions = [
    { _id: '1', title: 'Calculus II Tutoring', mentor: 'Dr. Sarah Chen', date: new Date(Date.now() + 86400000).toISOString(), type: 'mentoring', status: 'confirmed' },
    { _id: '2', title: 'Data Structures Study Group', mentor: 'Peer Group', date: new Date(Date.now() + 172800000).toISOString(), type: 'study-group', status: 'confirmed' },
    { _id: '3', title: 'Career Counseling', mentor: 'Prof. James Miller', date: new Date(Date.now() + 259200000).toISOString(), type: 'counseling', status: 'pending' },
  ];
  const data = sessions.length > 0 ? sessions : defaultSessions;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((d - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming Sessions</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">{data.length} sessions</span>
      </div>

      <div className="space-y-3">
        {data.map((session, i) => {
          const style = typeStyles[session.type] || typeStyles.mentoring;
          return (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={`p-3 rounded-xl ${style.bg} border border-transparent hover:border-gray-200 transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{session.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{session.mentor}</p>
                </div>
                <span className={`text-xs font-medium ${style.text} flex-shrink-0`}>
                  {formatDate(session.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
                <span className="text-xs text-gray-500 capitalize">{session.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default UpcomingSessionsWidget;
