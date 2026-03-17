import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Senior Psychology Student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    specialties: ['Anxiety', 'Burnout', 'Study Habits'],
    isOnline: true,
    rating: 4.9,
    sessionsCount: 124
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Alumni Peer Counselor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    specialties: ['Career Stress', 'Time Management', 'Depression'],
    isOnline: false,
    rating: 4.8,
    sessionsCount: 89
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Trained Listener',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    specialties: ['Homesickness', 'Relationships', 'General Venting'],
    isOnline: true,
    rating: 5.0,
    sessionsCount: 215
  }
];

const MentorTalk = ({ onStartCall }) => {
  const [activeTab, setActiveTab] = useState('find'); // find, scheduled

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-8 mx-auto">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'find' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Find a Peer / Mentor
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'scheduled' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Sessions
        </button>
      </div>

      {activeTab === 'find' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {MOCK_MENTORS.map((mentor, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={mentor.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center"
            >
              <div className="relative mb-4">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                />
                {mentor.isOnline && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{mentor.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-3">{mentor.role}</p>

              <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                {mentor.specialties.map(spec => (
                  <span key={spec} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 w-full justify-center">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <span className="font-semibold text-gray-900">{mentor.rating}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="text-gray-500">{mentor.sessionsCount} sessions</div>
              </div>

              <div className="mt-auto w-full space-y-2">
                <button 
                  onClick={() => mentor.isOnline && onStartCall && onStartCall({ name: mentor.name, avatar: mentor.avatar, autoStart: true, email: `${mentor.name.replace(/\s+/g, '').toLowerCase()}@university.edu` })}
                  className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                  mentor.isOnline 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}>
                  {mentor.isOnline ? 'Talk Now' : 'Schedule Call'}
                </button>
                <button className="w-full py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-50 border border-transparent transition-colors">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Scheduled Sessions</h3>
          <p className="text-gray-500 mb-6">You don't have any upcoming peer or mentor talks.</p>
          <button onClick={() => setActiveTab('find')} className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Find Someone to Talk to
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorTalk;
