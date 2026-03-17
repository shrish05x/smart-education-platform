import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();
  
  // Provide fallback initials if avatar is missing
  const getInitials = (name) => {
    if (!name) return 'M';
    const split = name.split(' ');
    if (split.length > 1) return split[0][0] + split[1][0];
    return split[0][0];
  };

  const handleRequestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/mentorship/request?mentorId=${mentor._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 relative"
    >
      {/* Availability indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur pb-1 pl-2 pr-2 pt-1 rounded-full shadow-sm z-10 border border-gray-100 text-xs font-medium">
        {mentor.availability ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-gray-700">Available</span>
          </>
        ) : (
          <>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400"></span>
            <span className="text-gray-500">Unavailable</span>
          </>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 mb-4 bg-indigo-100 flex items-center justify-center flex-shrink-0 relative">
          {mentor.avatar ? (
            <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-indigo-800">{getInitials(mentor.name)}</span>
          )}
        </div>

        {/* Basic Info */}
        <h3 className="font-clash text-xl font-semibold text-gray-900 mb-1">{mentor.name}</h3>
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-3">
          {mentor.industry}
        </span>
        
        {/* Stats Row */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4 w-full">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span className="font-medium text-gray-900">{mentor.rating?.toFixed(1) || 'New'}</span>
            <span className="text-gray-400">({mentor.sessionCount})</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div>
            <span className="font-medium text-gray-900">{mentor.experience}</span> yrs exp
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {mentor.expertise?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-violet-50 text-violet-700 text-xs rounded-md font-medium border border-violet-100">
              {tag}
            </span>
          ))}
          {mentor.expertise?.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium border border-gray-200">
              +{mentor.expertise.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-3">
        <Link 
          to={`/mentors/${mentor._id}`}
          className="flex-1 text-center py-2 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          View Profile
        </Link>
        <button 
          onClick={handleRequestClick}
          disabled={!mentor.availability}
          className={`flex-1 text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm
            ${mentor.availability 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Request
        </button>
      </div>
    </motion.div>
  );
};

export default MentorCard;
