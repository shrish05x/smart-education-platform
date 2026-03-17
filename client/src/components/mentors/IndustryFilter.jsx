import React from 'react';

const INDUSTRIES = [
  'All',
  'Software Engineering',
  'Product Management',
  'UX/UI Design',
  'Data Science',
  'Finance',
  'Marketing'
];

const IndustryFilter = ({ selectedIndustry, onSelect }) => {
  return (
    <div className="relative min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </div>
      <select
        value={selectedIndustry}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm appearance-none text-sm text-gray-700 font-medium cursor-pointer"
      >
        {INDUSTRIES.map(industry => (
          <option key={industry} value={industry}>
            {industry === 'All' ? 'All Industries' : industry}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default IndustryFilter;
