import { useEffect } from 'react';
import { useConnections } from '../../hooks/useConnections';
import ConnectionCard from '../../components/connections/ConnectionCard';
import { Link } from 'react-router-dom';

const MyNetwork = () => {
  const { data: network, loading, fetchNetwork } = useConnections();

  useEffect(() => {
    fetchNetwork();
  }, [fetchNetwork]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Network Header & Nav */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">🌐</span> My Network
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {network.length} connection{network.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/community/network/requests"
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Manage Requests
          </Link>
          <Link
            to="/community/network/suggestions"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            Find Peers
          </Link>
        </div>
      </div>

      {/* Network List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="font-semibold text-gray-900 dark:text-white">Your Connections</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by name or skills..."
              onChange={(e) => fetchNetwork(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="p-6">
          {loading && network.length === 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
               ))}
            </div>
          ) : network.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {network.map((user) => (
                <ConnectionCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                📬
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No connections yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                Start building your professional network to see friends here.
              </p>
              <Link
                to="/community/network/suggestions"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm"
              >
                Discover Peers
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
