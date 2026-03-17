import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import VideoCall from './VideoCall';

const SessionsTable = ({ sessions }) => {
  const [activeVideoCall, setActiveVideoCall] = useState(null);
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-xl font-clash font-semibold text-gray-900 mb-2">No Sessions Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          You don't have any mentorship sessions matching this filter.
        </p>
      </div>
    );
  }

  // Format date correctly
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if dates are in the past (to help visualize upcoming vs history)
  const isPast = (dateString) => new Date(dateString) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider w-[240px]">Mentor</th>
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider w-[280px]">Date & Time</th>
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider">Duration</th>
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider">Status</th>
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider flex-1">Goals / Notes</th>
              <th className="py-4 px-6 font-semibold text-sm text-gray-600 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessions.map((session) => {
              const mentor = session.mentorId || {};
              const past = isPast(session.date);
              
              return (
                <tr key={session._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-50 flex-shrink-0 flex items-center justify-center border border-indigo-100">
                         {mentor.avatar ? (
                            <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-indigo-700 font-bold">{mentor.name ? mentor.name.charAt(0) : 'M'}</span>
                          )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{mentor.name}</div>
                        <div className="text-xs text-gray-500 truncate w-32">{mentor.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`text-sm ${past ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                      {formatDate(session.date)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded inline-flex items-center gap-1.5 border border-gray-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {session.duration}m
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs" title={session.requestMessage || session.notes}>
                      {session.requestMessage || session.notes || '-'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    {session.status === 'accepted' && !past && (
                      <button
                        onClick={() => setActiveVideoCall(session._id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Call
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeVideoCall && (
        <VideoCall
          sessionId={activeVideoCall}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </div>
  );
};

export default SessionsTable;
