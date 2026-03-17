import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null); // { callerName, callerEmail, callerAvatar }
  const [activeCall, setActiveCall] = useState(null);     // { partnerName, partnerEmail, isAI, ... }
  const [pendingCalls, setPendingCalls] = useState([]);   // List of missed/pending calls

  // Simulate receiving a call from another user
  // In a real app, this would be wired up to WebSockets/WebRTC signaling
  window.simulateIncomingCall = (callerName = 'Alex Smith', callerEmail = 'alex@university.edu') => {
    setIncomingCall({
      callerName,
      callerEmail,
      callerAvatar: `https://ui-avatars.com/api/?name=${callerName}&background=random`
    });
  };

  const answerCall = () => {
    if (incomingCall) {
      setActiveCall({
        partnerName: incomingCall.callerName,
        partnerEmail: incomingCall.callerEmail,
        partnerAvatar: incomingCall.callerAvatar,
        isAI: false,
        status: 'active'
      });
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      // Add to pending calls instead of just dismissing
      setPendingCalls(prev => [
        { ...incomingCall, timestamp: new Date(), id: Date.now() },
        ...prev
      ]);
      setIncomingCall(null);
    }
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const startOutgoingCall = async (email, autoStart = false) => {
    // In our simulation, check if it's a known user, else fallback to AI or simulate ringing
    // Here we'll simulate that we're routing the call.
    return new Promise((resolve) => {
      // Return a structured object that the UI components can use to set their state
      const isAIFallback = email.includes('ai') || email.includes('bot');
      let nameStr = email.split('@')[0];
      nameStr = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
      
      resolve({
         partnerName: isAIFallback ? 'AI Support Guide' : nameStr,
         partnerEmail: email,
         isAI: isAIFallback,
         autoStart: autoStart
      });
    });
  };

  const clearPendingCall = (id) => {
    setPendingCalls(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CallContext.Provider value={{
      incomingCall,
      activeCall,
      pendingCalls,
      answerCall,
      rejectCall,
      endCall,
      startOutgoingCall,
      clearPendingCall,
      setActiveCall
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
