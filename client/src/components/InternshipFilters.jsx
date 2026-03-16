import React from 'react';

const skillOptions = [
  'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'TypeScript',
  'Machine Learning', 'SQL', 'MongoDB', 'Docker', 'CSS', 'HTML',
  'Data Structures', 'Algorithms', 'System Design', 'Figma',
  'Express.js', 'Git', 'REST API', 'UI Design', 'TensorFlow',
  'UX Research', 'Statistics', 'Prototyping', 'Design Systems'
];

const InternshipFilters = ({ filters, onFilterChange }) => {
  const { search = '', type = '', skills = [] } = filters;

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (newType) => {
    onFilterChange({ ...filters, type: type === newType ? '' : newType });
  };

  const handleSkillToggle = (skill) => {
    const newSkills = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    onFilterChange({ ...filters, skills: newSkills });
  };

  const clearAll = () => {
    onFilterChange({ search: '', type: '', skills: [] });
  };

  const hasActive = search || type || skills.length > 0;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search internships by role, company, or keyword..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all shadow-sm"
        />
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500 mr-1">Type:</span>
        {['remote', 'onsite', 'hybrid'].map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              type === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {t === 'remote' ? '🏠 Remote' : t === 'onsite' ? '🏢 On-site' : '🔄 Hybrid'}
          </button>
        ))}

        {hasActive && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-600 font-medium ml-2 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            Clear all
          </button>
        )}
      </div>

      {/* Skills pills */}
      <div>
        <span className="text-xs font-medium text-gray-500 mb-2 block">Filter by Skills:</span>
        <div className="flex flex-wrap gap-1.5">
          {skillOptions.slice(0, 15).map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                skills.includes(skill)
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Active skill tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400">Active:</span>
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipFilters;