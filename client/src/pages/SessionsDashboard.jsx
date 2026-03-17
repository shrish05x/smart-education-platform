import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mentorApi from '../services/mentorApi';
import SessionsTable from '../components/mentors/SessionsTable';
import { Link } from 'react-router-dom';

const SessionsDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await mentorApi.getSessions();
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Could not load your mentorship sessions at this time.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'All') return true;
    return session.status.toLowerCase() === filter.toLowerCase();
  });

  const TABS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>
        <div className="w-full h-12 bg-gray-200 rounded-t-xl mb-1"></div>
        <div className="w-full h-64 bg-gray-200 rounded-b-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-clash font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600 max-w-2xl">
            Track and manage your upcoming and past mentorship requests.
          </p>
        </div>
        <Link 
          to="/mentors" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Find New Mentor
        </Link>
      </motion.div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          {/* Tabs Filter */}
          <div className="flex overflow-x-auto hide-scrollbar mb-6 gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <SessionsTable sessions={filteredSessions} />
        </motion.div>
      )}
    </div>
  );
};

export default SessionsDashboard;
