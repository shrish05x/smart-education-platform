import { useState } from 'react';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import ConnectModal from './ConnectModal';
import { Link } from 'react-router-dom';

const ConnectionButton = ({ userId, userName, userProfileImage, buttonSize = 'md' }) => {
  const { status, loading, sendRequest, acceptRequest, remove } = useConnectionStatus(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // If viewing our own profile/post, don't show the button
  if (status === 'self') return null;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ${sizeClasses[buttonSize]}`;

  // Skeleton loader while fetching initial status
  if (loading && status === 'loading') {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${sizeClasses[buttonSize]} w-28`}></div>
    );
  }

  const handleSend = async (message) => {
    return await sendRequest(message);
  };

  if (status === 'not_connected' || status === 'loading') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className={`${baseClasses} bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-200 dark:hover:shadow-none disabled:opacity-70`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Connect
        </button>
        <ConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userName={userName}
          userProfileImage={userProfileImage}
          onSend={handleSend}
        />
      </>
    );
  }

  if (status === 'pending_sent') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10 overflow-hidden">
            <button
              onClick={() => {
                remove();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Withdraw Request
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'pending_received') {
    return (
      <div className="flex gap-2">
        <button
          onClick={acceptRequest}
          disabled={loading}
          className={`${baseClasses} bg-indigo-600 hover:bg-indigo-700 text-white`}
        >
          Accept
        </button>
        <button
          onClick={remove} // effectively reject
          disabled={loading}
          className={`${baseClasses} bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200`}
        >
          Decline
        </button>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="flex gap-2 items-center">
        <Link
          to={`/messages/${userId}`} // Assuming a messaging system exists or will be added
          className={`${baseClasses} bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Message
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10 overflow-hidden">
              <button
                onClick={() => {
                  remove();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
                Remove Connection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Backup return for blocked or unknown
  return null;
};

export default ConnectionButton;
