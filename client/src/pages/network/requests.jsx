import { useEffect, useState } from 'react';
import { useConnections } from '../../hooks/useConnections';
import RequestCard from '../../components/connections/RequestCard';
import { Link } from 'react-router-dom';

const NetworkRequests = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const { data: requests, loading, fetchPending, fetchSent, removeProcessedItem } = useConnections();

  useEffect(() => {
    if (activeTab === 'received') {
      fetchPending();
    } else {
      fetchSent();
    }
  }, [activeTab, fetchPending, fetchSent]);

  const handleActionComplete = (requestId) => {
    removeProcessedItem(requestId);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/community/network" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">📥</span> Manage Requests
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden min-h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'received' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'sent' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Sent
          </button>
        </div>

        <div className="p-6">
          {loading && requests.length === 0 ? (
            <div className="flex justify-center p-8">
              <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : requests.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((request) => (
                  <RequestCard key={request._id} request={request} type={activeTab} onAction={handleActionComplete} />
                ))}
             </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                {activeTab === 'received' ? ' Inbox Empty' : 'Outbox Empty'}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} requests
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                {activeTab === 'received' 
                  ? "You have no pending incoming connection requests." 
                  : "You haven't sent any connection requests recently."}
              </p>
              {activeTab === 'received' && (
                <Link
                  to="/community/network/suggestions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                  Find People to Connect With
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkRequests;
