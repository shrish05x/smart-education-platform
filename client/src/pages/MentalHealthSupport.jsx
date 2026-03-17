import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MoodTracker from '../components/mental-health/MoodTracker';
import AIVideoCall from '../components/mental-health/AIVideoCall';
import MentorTalk from '../components/mental-health/MentorTalk';
import PeerVideoCall from '../components/mental-health/PeerVideoCall';

const MentalHealthSupport = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'video' ? 'peer-call' : 'overview'); 
  const [roomCodeContext, setRoomCodeContext] = useState(
    searchParams.get('callId') ? searchParams.get('callId') : ''
  );

  useEffect(() => {
    // If navigating back to this page with new params while it's already mounted
    if (searchParams.get('tab') === 'video' && searchParams.get('callId')) {
      setActiveTab('peer-call');
      setRoomCodeContext(searchParams.get('callId'));
    }
  }, [searchParams]);

  const handleStartCall = (partner) => {
    // When clicking a mentor or peer talk button, we can generate a random short code for them to share
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCodeContext(randomCode);
    setActiveTab('peer-call');
  };

  const resources = [
    { title: 'Book a Counseling Session', desc: 'Connect with a certified counselor for a private session.', icon: '🗓️' },
    { title: 'Self-Help Resources', desc: 'Access articles, videos, and tools for mental wellness.', icon: '📚' },
    { title: 'Crisis Helpline', desc: 'Immediate support available 24/7.', icon: '📞' },
    { title: 'Peer Support Groups', desc: 'Join a supportive community of students.', icon: '🤝' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health & Wellness</h1>
          <p className="text-gray-600 mb-8 max-w-2xl">Your well-being matters. Track your mood, talk to an AI guide, or connect with peers and mentors in a safe, supportive environment.</p>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'mood', label: 'Mood Tracker', icon: '🧠' },
              { id: 'ai-guide', label: 'AI Guide Talk', icon: '🤖' },
              { id: 'mentor', label: 'Peer & Mentor Talk', icon: '💬' },
              { id: 'peer-call', label: 'Friends Video Call', icon: '📹' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div key={resource.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform origin-left">{resource.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-500">{resource.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Developer Tool: Simulate Incoming Call */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-900">Test Feature: Incoming Call</h4>
                <p className="text-sm text-indigo-700">Simulate a friend or mentor calling you right now.</p>
              </div>
              <button 
                onClick={() => window.simulateIncomingCall && window.simulateIncomingCall('Jane Doe', 'jane.doe@university.edu')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                Simulate Call
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">How are you feeling today?</h2>
              <p className="text-gray-500 mt-2">Take a quick 20-question check-in to track your mental well-being over time.</p>
            </div>
            <MoodTracker />
          </div>
        )}

        {activeTab === 'ai-guide' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIVideoCall />
          </div>
        )}

        {activeTab === 'mentor' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900">Talk to Someone Who Understands</h2>
              <p className="text-gray-500 mt-2">Connect with trained student peers, alumni, and mentors who have been through similar experiences.</p>
            </div>
            <MentorTalk onStartCall={handleStartCall} />
          </div>
        )}

        {activeTab === 'peer-call' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PeerVideoCall 
              initialRoomCode={roomCodeContext} 
              onEndCall={() => {
                setRoomCodeContext('');
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthSupport;
