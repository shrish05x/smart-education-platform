import { motion } from 'framer-motion';

const MentorMessagesWidget = ({ messages = [] }) => {
  const defaultMessages = [
    { _id: '1', from: 'Dr. Sarah Chen', avatar: 'SC', message: 'Great progress on your calculus assignments!', time: '2h ago', unread: true },
    { _id: '2', from: 'Prof. Raj Patel', avatar: 'RP', message: 'Shared resources for your ML project.', time: '5h ago', unread: true },
    { _id: '3', from: 'Dr. Emily Brooks', avatar: 'EB', message: 'Your essay draft looks promising.', time: '1d ago', unread: false },
  ];
  const data = messages.length > 0 ? messages : defaultMessages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Mentor Messages</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
          {data.filter(m => m.unread).length} new
        </span>
      </div>

      <div className="space-y-3">
        {data.map((msg, i) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${msg.unread ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {msg.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-800 truncate">{msg.from}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
            </div>
            {msg.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MentorMessagesWidget;
