import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';

const OpportunitiesWidget = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [activeType, setActiveType] = useState(''); // '', 'internship', 'job', 'hackathon', 'part-time'
  
  const types = [
    { id: '', label: 'All Jobs' },
    { id: 'internship', label: 'Internships' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'job', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' }
  ];

  const fetchOpportunities = async (typeFilter) => {
    try {
      setLoading(true);
      setError(null);
      let url = '/opportunities';
      if (typeFilter) {
        url += `?type=${typeFilter}`;
      }
      const response = await api.get(url);
      setOpportunities(response.data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to load opportunities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(activeType);
  }, [activeType]);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'internship': return 'bg-purple-100 text-purple-700';
      case 'hackathon': return 'bg-pink-100 text-pink-700';
      case 'job': return 'bg-blue-100 text-blue-700';
      case 'part-time': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            🚀 Top External Opportunities
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real jobs and hackathons fetched live from around the web.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex bg-gray-50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeType === t.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-gray-50/50">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button 
              onClick={() => fetchOpportunities(activeType)}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No opportunities found for this category at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {opportunities.map((opp, idx) => (
                <motion.div
                  key={`${opp.applyUrl}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {opp.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {opp.title}
                        </h3>
                        <p className="text-sm text-gray-500">{opp.company}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTypeBadgeColor(opp.type)} capitalize flex-shrink-0`}>
                      {opp.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-gray-500 font-medium mt-auto border-t border-gray-50 pt-3">
                    <span className="flex items-center gap-1.5">
                      📍 {opp.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      💰 {opp.salary}
                    </span>
                    {opp.deadline && opp.deadline !== 'N/A' && (
                      <span className="flex items-center gap-1.5">
                        📅 {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <a 
                    href={opp.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Apply on {opp.sourcePlatform}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesWidget;
