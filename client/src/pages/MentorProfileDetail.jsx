import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import mentorApi from '../services/mentorApi';
import ExpertiseTags from '../components/mentors/ExpertiseTags';
import RatingStars from '../components/mentors/RatingStars';

const MentorProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorDetail();
  }, [id]);

  const fetchMentorDetail = async () => {
    try {
      const response = await mentorApi.getMentorById(id);
      setMentor(response.data);
    } catch (err) {
      console.error('Error fetching mentor:', err);
      setError('Failed to load mentor profile. They may no longer exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    const split = name.split(' ');
    if (split.length > 1) return split[0][0] + split[1][0];
    return split[0][0];
  };

  const handleRequestMentorship = () => {
    navigate(`/mentorship/request?mentorId=${mentor._id}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-3xl mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded w-full mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex gap-2"><div className="w-16 h-8 bg-gray-200 rounded"></div><div className="w-20 h-8 bg-gray-200 rounded"></div></div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={() => navigate('/mentors')} className="text-indigo-600 font-medium hover:underline">
          &larr; Back to Mentors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <button 
        onClick={() => navigate('/mentors')} 
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Directory
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1">
          {/* Header/Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 relative -mt-16">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-indigo-100 flex items-center justify-center flex-shrink-0 shadow-md">
                {mentor.avatar ? (
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-indigo-800">{getInitials(mentor.name)}</span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                  <h1 className="text-3xl font-clash font-bold text-gray-900">{mentor.name}</h1>
                  {mentor.availability && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Accepting Students
                    </span>
                  )}
                </div>
                <p className="text-lg text-indigo-600 font-medium">{mentor.industry}</p>
              </div>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{mentor.bio}</p>
          </motion.div>

          {/* Expertise Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Expertise & Skills</h2>
            <ExpertiseTags tags={mentor.expertise} />
          </motion.div>
        </div>

        {/* Sidebar / Sticky Action Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Mentorship Details</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Experience</p>
                  <p className="text-gray-900 font-bold">{mentor.experience} Years</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                  <RatingStars rating={mentor.rating} count={mentor.sessionCount} />
                </div>
              </div>

              {mentor.linkedIn && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <div>
                    <a href={mentor.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                      View LinkedIn Profile &↗
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRequestMentorship}
              disabled={!mentor.availability}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all
              ${mentor.availability 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {mentor.availability ? 'Request Mentorship Session' : 'Currently Unavailable'}
            </button>
            
            {!mentor.availability && (
              <p className="text-xs text-center text-gray-500 mt-3">
                This mentor is not accepting new students at the moment.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileDetail;
