import React, { useState, useEffect } from 'react';
import mentorApi from '../services/mentorApi';
import SearchBar from '../components/mentors/SearchBar';
import IndustryFilter from '../components/mentors/IndustryFilter';
import AvailabilityToggle from '../components/mentors/AvailabilityToggle';
import MentorGrid from '../components/mentors/MentorGrid';
import { motion } from 'framer-motion';

const MentorDiscovery = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState('Most Experienced');

  useEffect(() => {
    fetchMentors();
  }, [search, industry, availability, sort]);

  const fetchMentors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query params
      const params = {};
      if (search) params.search = search;
      if (industry && industry !== 'All') params.industry = industry;
      if (availability) params.availability = true;
      if (sort) params.sort = sort;

      const data = await mentorApi.getAllMentors(params);
      setMentors(data.data || []);
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
      setError('Could not load mentors. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-clash font-bold text-gray-900 mb-2">Find Your Mentor</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Connect with industry professionals for guidance, portfolio reviews, and career growth.
        </p>
      </motion.div>

      {/* Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 mb-8 z-10 relative"
      >
        {/* Search */}
        <div className="flex-1">
          <SearchBar onSearch={setSearch} placeholder="Search by name, role, or skill..." />
        </div>

        {/* Dropdowns & Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <IndustryFilter selectedIndustry={industry} onSelect={setIndustry} />
          
          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
          
          {/* Sort Dropdown */}
          <div className="relative min-w-[180px]">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm appearance-none text-sm text-gray-700 font-medium cursor-pointer"
            >
              <option value="Most Experienced">Most Experienced</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Most Sessions">Most Sessions</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          <AvailabilityToggle isAvailableOnly={availability} onToggle={setAvailability} />
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 pb-10">
        <MentorGrid mentors={mentors} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MentorDiscovery;
