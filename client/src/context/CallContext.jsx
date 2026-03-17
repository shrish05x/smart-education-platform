import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null); // { callerName, callerEmail, callerAvatar, ... }
  const [activeCall, setActiveCall] = useState(null);     // { partnerName, partnerEmail, isAI, ... }
  const [pendingCalls, setPendingCalls] = useState([]);   // List of missed/pending calls
  const [socket, setSocket] = useState(null);
  
  // Initialize Socket.io connection when user logs in
  useEffect(() => {
    if (user && token) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: { token },
        query: { email: user.email }
      });

      setSocket(newSocket);

      newSocket.on('call:incoming', (data) => {
        // Automatically set incoming call if we aren't already in one
        setIncomingCall({
           ...data,
           callerAvatar: data.callerAvatar || `https://ui-avatars.com/api/?name=${data.callerName}&background=random`
        });
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

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
        status: 'active',
        isAnswering: true,
        offer: incomingCall.offer,
        sessionId: incomingCall.sessionId
      });
      setIncomingCall(null);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      if (socket) {
        socket.emit('call:rejected', {
          callerEmail: incomingCall.callerEmail,
          targetEmail: user?.email,
          sessionId: incomingCall.sessionId
        });
      }
      
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

  const startOutgoingCall = async (email, autoStart = false, offer = null) => {
    const isAIFallback = email.includes('ai') || email.includes('bot');
    let nameStr = email.split('@')[0];
    nameStr = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    const sessionId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!isAIFallback && socket) {
      socket.emit('call:initiate', {
        targetEmail: email,
        callerName: user?.name,
        callerEmail: user?.email,
        callerAvatar: `https://ui-avatars.com/api/?name=${user?.name}&background=random`,
        offer,
        sessionId
      });
    }

    return {
       partnerName: isAIFallback ? 'AI Support Guide' : nameStr,
       partnerEmail: email,
       isAI: isAIFallback,
       autoStart,
       sessionId
    };
  };

  const clearPendingCall = (id) => {
    setPendingCalls(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CallContext.Provider value={{
      socket,
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
