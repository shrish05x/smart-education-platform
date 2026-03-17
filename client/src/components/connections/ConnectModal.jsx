import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConnectModal = ({ isOpen, onClose, userName, userProfileImage, onSend }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSend(message);
    setLoading(false);
    if (success) {
      setMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">🤝</span> Connect
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={userProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
                  alt={userName}
                  className="w-16 h-16 rounded-full border-2 border-indigo-100 dark:border-indigo-900 object-cover"
                />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">You are inviting</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{userName}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add a personal note (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi ${userName.split(' ')[0]}, I'd love to connect and...`}
                  maxLength={200}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow"
                />
                <div className="flex justify-end mt-2">
                  <span className={`text-xs ${message.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                    {message.length} / 200
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm shadow-indigo-200 dark:shadow-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConnectModal;
