import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import InternshipCard from '../components/InternshipCard';
import InternshipFilters from '../components/InternshipFilters';
import OpportunitiesWidget from '../components/dashboard/widgets/OpportunitiesWidget';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: '', skills: [] });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/internships?limit=50');
      setInternships(response.data.internships || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Unable to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredInternships = useMemo(() => {
    let result = internships;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(i =>
        i.role?.toLowerCase().includes(q) ||
        (i.company || i.companyId?.name || '').toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      );
    }

    if (filters.type) {
      result = result.filter(i => i.type === filters.type);
    }

    if (filters.skills.length > 0) {
      result = result.filter(i =>
        filters.skills.some(skill =>
          (i.skillsRequired || []).some(s => s.toLowerCase() === skill.toLowerCase())
        )
      );
    }

    return result;
  }, [internships, filters]);

  // Collect all unique skills for stats
  const allSkills = useMemo(() => {
    const set = new Set();
    internships.forEach(i => (i.skillsRequired || []).forEach(s => set.add(s)));
    return set.size;
  }, [internships]);

  const stats = [
    { label: 'Open Positions', value: internships.length, icon: '💼', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Companies', value: new Set(internships.map(i => i.company || i.companyId?.name)).size, icon: '🏢', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Skills Tracked', value: allSkills, icon: '🛠️', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Remote Available', value: internships.filter(i => i.type === 'remote').length, icon: '🏠', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Internships & Opportunities 💼
          </h1>
          <p className="text-gray-500 mt-1">Discover and apply for top internships matching your skills.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
            {filteredInternships.length} {filteredInternships.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stat.bg} ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Internal Portal Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="pt-6 border-t border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏫 Campus & Verified Internships</h2>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <InternshipFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-1.5 bg-gray-200 rounded-full mb-4 w-full" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="h-6 bg-gray-100 rounded-full w-16" />
                <div className="h-6 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="flex gap-1.5 mb-4">
                <div className="h-5 bg-gray-50 rounded w-14" />
                <div className="h-5 bg-gray-50 rounded w-16" />
                <div className="h-5 bg-gray-50 rounded w-12" />
              </div>
              <div className="h-px bg-gray-100 mb-3" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <div className="text-4xl mb-3">😕</div>
          <p className="text-gray-600 font-medium">{error}</p>
          <button
            onClick={fetchInternships}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </motion.div>
      ) : filteredInternships.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No internships found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
          {(filters.search || filters.type || filters.skills.length > 0) && (
            <button
              onClick={() => setFilters({ search: '', type: '', skills: [] })}
              className="mt-4 px-5 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredInternships.map((internship, index) => (
            <InternshipCard key={internship._id} internship={internship} index={index} />
          ))}
        </div>
      )}

      {/* External Opportunities Widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-8 mt-4 border-t border-gray-100"
      >
        <OpportunitiesWidget />
      </motion.div>
    </div>
  );
};

export default InternshipsPage;