import { useEffect } from 'react';
import { useConnections } from '../../hooks/useConnections';
import SuggestionCard from '../../components/connections/SuggestionCard';
import { Link } from 'react-router-dom';

const NetworkSuggestions = () => {
  const { data: suggestions, loading, fetchSuggestions } = useConnections();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

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
            <span className="text-3xl">✨</span> Discover Peers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Build your network with like-minded students and professionals.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="font-semibold text-gray-900 dark:text-white">People you may know</h2>
        </div>

        <div className="p-6 bg-gray-50/30 dark:bg-gray-900/10">
          {loading && suggestions.length === 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 bg-white dark:bg-gray-800 border items-start p-5 rounded-2xl h-32">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
               ))}
             </div>
          ) : suggestions.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {suggestions.map((user) => (
                 <SuggestionCard key={user._id} user={user} />
               ))}
             </div>
          ) : (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                 🔍
               </div>
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No new suggestions</h3>
               <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                 We've shown you everyone we can find for now. Check back later as more students join!
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkSuggestions;
