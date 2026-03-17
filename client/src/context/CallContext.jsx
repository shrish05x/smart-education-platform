import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [activeCall, setActiveCall] = useState(null);     // { partnerId, partnerName, isAI, ... }
  const [socket, setSocket] = useState(null);
  
  // Initialize Socket.io connection when user logs in
  useEffect(() => {
    if (user && token) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const endCall = () => {
    setActiveCall(null);
  };

  return (
    <CallContext.Provider value={{
      socket,
      activeCall,
      endCall,
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
