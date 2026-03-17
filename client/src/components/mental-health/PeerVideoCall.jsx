import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PeerVideoCall = ({ initialPartner = null, onEndCall }) => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended
  const [callDuration, setCallDuration] = useState(0);
  const [emailInput, setEmailInput] = useState(initialPartner?.email || '');
  const [partnerName, setPartnerName] = useState(initialPartner?.name || 'Friend / Mentor');

  useEffect(() => {
    if (initialPartner && initialPartner.autoStart) {
      handleStartCall(initialPartner.name);
    }
  }, [initialPartner]);

  useEffect(() => {
    let interval;
    if (callStatus === 'active') {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartCall = (nameOverride) => {
    if (!emailInput && !nameOverride) return;
    
    if (emailInput && !nameOverride) {
      // Very basic extraction of name from email if not provided
      const extracted = emailInput.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
      setPartnerName(extracted.charAt(0).toUpperCase() + extracted.slice(1) || 'Friend');
    }

    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
    }, 2500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setEmailInput('');
      setPartnerName('Friend / Mentor');
      if (onEndCall) onEndCall();
    }, 3000);
  };

  if (callStatus === 'idle' || callStatus === 'ended') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm w-full text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🎥
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {callStatus === 'ended' ? 'Call Ended' : 'Video Call a Friend'}
          </h2>
          <p className="text-gray-500 mb-8">
            {callStatus === 'ended' 
              ? "Your session has ended. To start another call, enter their email below." 
              : "Enter your friend or mentor's email address to start a secure video call."}
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input
                type="email"
                placeholder="friend@university.edu"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors outline-none"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleStartCall()}
              disabled={!emailInput}
              className={`w-full py-3 rounded-xl font-medium text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                emailInput ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200' : 'bg-indigo-300 cursor-not-allowed'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Video Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative min-h-[600px] flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {partnerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-medium">{partnerName}</h3>
            <p className="text-gray-300 text-xs flex items-center gap-1.5">
              {callStatus === 'active' ? (
                <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-amber-500"></span> Calling...</>
              )}
            </p>
          </div>
        </div>
        <div className="text-white font-mono bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
          {callStatus === 'active' ? formatTime(callDuration) : '00:00'}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
        {callStatus === 'connecting' ? (
          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center mb-6 animate-pulse border-4 border-emerald-500/30">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <p className="text-gray-400 font-medium text-lg">Ringing {partnerName}...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Simulated Partner Camera Feed */}
            <img 
              src={initialPartner?.avatar || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800"} 
              alt="Partner Video" 
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
        )}
      </div>

      {/* User Camera Picture-in-Picture */}
      <div className="absolute bottom-28 right-6 w-48 h-64 bg-gray-800 rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden z-20 flex items-center justify-center">
        {/* Placeholder for actual user camera */}
        <div className="text-gray-500 flex flex-col items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span className="text-xs font-medium">Your Camera</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-center gap-6 px-6 z-20">
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
        
        <button 
          onClick={handleEndCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-all transform hover:scale-105 ml-4"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.6 3.4M23 1L1 23"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PeerVideoCall;
