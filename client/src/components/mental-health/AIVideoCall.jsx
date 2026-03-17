import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AIVideoCall = () => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended
  const [callDuration, setCallDuration] = useState(0);

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

  const handleStartCall = () => {
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
    }, 3000);
  };

  if (callStatus === 'idle' || callStatus === 'ended') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Gemini AI Support</h2>
        <p className="text-gray-600 text-center max-w-xl mb-10 text-lg">
          {callStatus === 'ended' 
            ? "Your session has ended. We hope you feel better. You can start a new session anytime." 
            : "Talk live with our empathetic AI guide powered by Gemini. Discuss your feelings, get advice, or just vent in a safe, private space."}
        </p>

        <button 
          onClick={handleStartCall}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-3 transform hover:-translate-y-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start Live Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative min-h-[600px] flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
          </div>
          <div>
            <h3 className="text-white font-medium">Gemini Guide</h3>
            <p className="text-gray-300 text-xs flex items-center gap-1.5">
              {callStatus === 'active' ? (
                <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-amber-500"></span> Connecting...</>
              )}
            </p>
          </div>
        </div>
        <div className="text-white font-mono bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
          {callStatus === 'active' ? formatTime(callDuration) : '00:00'}
        </div>
      </div>

      {/* Main Video Area (Simulated AI Avatar) */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4f46e5 0%, transparent 70%)' }}></div>
        
        {callStatus === 'connecting' ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Establishing secure connection...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Pulsing rings around AI avatar based on "speaking" */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse"></div>
            <div className={`absolute -inset-8 rounded-full border border-indigo-500/30 ${callDuration % 5 !== 0 ? 'animate-ping' : ''}`}></div>
            
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 border-4 border-gray-800 shadow-2xl relative z-10 flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zm0 6c2.21 0 4 1.79 4 4v4H8v-4c0-2.21 1.79-4 4-4zm0 10v4m-4-2h8"/></svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* User Camera Picture-in-Picture */}
      <div className="absolute bottom-28 right-6 w-48 h-64 bg-gray-800 rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden z-20 flex items-center justify-center">
        {/* Placeholder for actual user camera */}
        <div className="text-gray-500 flex flex-col items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span className="text-xs font-medium">Camera Active</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-gray-800/90 backdrop-blur-md border-t border-gray-700 flex items-center justify-center gap-6 px-6 z-20">
        <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
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

export default AIVideoCall;
