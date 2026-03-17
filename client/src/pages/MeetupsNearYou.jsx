import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_MEETUPS = [
  {
    id: 1,
    title: 'Full-Stack Developer Hackathon',
    area: 'Tech Hub Downtown',
    distance: '2.4 km',
    type: 'Coding',
    date: 'Today, 6:00 PM',
    attendees: 34,
    hasGaming: true,
    hasChallenges: true,
    isInstant: true,
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    description: 'Join us for an evening of intense coding, pizza, and networking. Bring your laptop and your A-game!',
    challenges: ['Build a real-time chat app', 'Fix 5 open source bugs'],
  },
  {
    id: 2,
    title: 'AI Ethics Discussion Circle',
    area: 'Central Library, Room 4B',
    distance: '4.1 km',
    type: 'Discussion',
    date: 'Tomorrow, 5:00 PM',
    attendees: 12,
    hasGaming: false,
    hasChallenges: false,
    isInstant: false,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
    description: 'A deep dive into the ethical implications of recent advancements in generative AI.',
    challenges: [],
  },
  {
    id: 3,
    title: 'Startup Pitch & Play',
    area: 'Innovation Center',
    distance: '1.2 km',
    type: 'Networking',
    date: 'Friday, 7:00 PM',
    attendees: 56,
    hasGaming: true,
    hasChallenges: false,
    isInstant: true,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400',
    description: 'Pitch your startup idea in 60 seconds, then enjoy some retro arcade gaming.',
    challenges: [],
  },
  {
    id: 4,
    title: 'Algorithm Problem Solving',
    area: 'University Cafe',
    distance: '0.8 km',
    type: 'Study',
    date: 'Today, 8:00 PM',
    attendees: 8,
    hasGaming: false,
    hasChallenges: true,
    isInstant: true,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
    description: 'Preparing for interviews? Let\'s solve LeetCode Hard problems together.',
    challenges: ['Solve 3 graph problems in 1 hour'],
  }
];

const MeetupsNearYou = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeetups = MOCK_MEETUPS.filter(meetup => {
    if (filter === 'instant' && !meetup.isInstant) return false;
    if (filter === 'gaming' && !meetup.hasGaming) return false;
    if (filter === 'challenges' && !meetup.hasChallenges) return false;
    return meetup.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           meetup.area.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meetups Near You</h1>
            <p className="text-gray-500 mt-1">Discover, join, and collaborate with peers in your area</p>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Host a Meetup
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or area..."
              className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 py-2.5 transition-colors border outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'All Meetups' },
              { id: 'instant', label: '⚡ Join Instant' },
              { id: 'challenges', label: '🏆 Challenges' },
              { id: 'gaming', label: '🎮 Gaming' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  filter === f.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meetups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMeetups.map((meetup, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={meetup.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
          >
            {/* Card Image Header */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={meetup.image} 
                alt={meetup.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                {meetup.isInstant && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                    ⚡ Instant
                  </span>
                )}
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-indigo-600/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block">
                  {meetup.type}
                </span>
                <h3 className="text-xl font-bold leading-tight line-clamp-2">{meetup.title}</h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="truncate">{meetup.area}</span>
                <span className="text-gray-300">•</span>
                <span className="font-medium text-indigo-600">{meetup.distance}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span>{meetup.date}</span>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {meetup.description}
              </p>

              {/* Tags / Options */}
              <div className="flex flex-wrap gap-2 mb-5">
                {meetup.hasGaming && (
                  <span className="bg-purple-50 text-purple-600 border border-purple-100 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    🎮 Gaming Session
                  </span>
                )}
                {meetup.hasChallenges && (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    🏆 Coding Challenges
                  </span>
                )}
                <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  👥 {meetup.attendees} attending
                </span>
              </div>

              {meetup.challenges.length > 0 && filter === 'challenges' && (
                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Active Challenge</span>
                  <p className="text-sm text-gray-600 mt-1">{meetup.challenges[0]}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                <button className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl transition-colors">
                  Details
                </button>
                <button className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm ${
                  meetup.isInstant 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}>
                  {meetup.isInstant ? 'Join Now ⚡' : 'RSVP'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredMeetups.length === 0 && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No meetups found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetupsNearYou;
