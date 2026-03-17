import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCall } from '../../context/CallContext';
import { useNavigate } from 'react-router-dom';

const IncomingCallModal = () => {
  const { incomingCall, answerCall, rejectCall } = useCall();
  const navigate = useNavigate();

  // Play a ringtone sound when there's an incoming call
  // For safety, we'll just log or you could actually use an Audio object
  useEffect(() => {
    if (incomingCall) {
      console.log("Ringing...");
      // let ringtone = new Audio('/ringtone.mp3');
      // ringtone.play().catch(e => console.log('Audio autoplay blocked'));
    }
  }, [incomingCall]);

  const handleAnswer = () => {
    answerCall();
    navigate('/mental-health'); // Assuming the call UI is housed here for now, or redirect to a dedicated /call room
  };

  return (
    <AnimatePresence>
      {incomingCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-gray-700 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Background pulsing effect */}
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                <img 
                  src={incomingCall.callerAvatar} 
                  alt={incomingCall.callerName} 
                  className="w-full h-full rounded-full object-cover border-4 border-gray-800 relative z-10"
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{incomingCall.callerName}</h3>
              <p className="text-gray-400 mb-1">{incomingCall.callerEmail}</p>
              <p className="text-indigo-400 font-medium mb-8 animate-pulse">is calling you...</p>

              <div className="flex gap-6 justify-center w-full">
                <button
                  onClick={rejectCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
                  title="Decline"
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.6 3.4M23 1L1 23"/></svg>
                </button>
                <button
                  onClick={handleAnswer}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
                  title="Accept"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IncomingCallModal;
