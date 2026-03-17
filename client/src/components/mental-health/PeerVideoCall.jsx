import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCall } from './../../context/CallContext';

const PeerVideoCall = ({ initialPartner = null, onEndCall }) => {
  const { startOutgoingCall, activeCall, setActiveCall, endCall: contextEndCall, socket } = useCall();
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended, ai-fallback
  const [callDuration, setCallDuration] = useState(0);
  const [emailInput, setEmailInput] = useState(initialPartner?.email || '');
  const [partnerDetails, setPartnerDetails] = useState(initialPartner || { name: 'Friend / Mentor', isAI: false });

  // WebRTC & Media State
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Initialize Media and WebRTC if we're active
  useEffect(() => {
    if (callStatus === 'active' && !partnerDetails.isAI) {
      initializeMediaAndWebRTC();
    }
    
    // Cleanup media when leaving
    return () => {
      cleanupMedia();
    };
  }, [callStatus]);

  useEffect(() => {
    if (activeCall && activeCall.status === 'active' && callStatus === 'idle') {
      setPartnerDetails({
        name: activeCall.partnerName,
        email: activeCall.partnerEmail,
        avatar: activeCall.partnerAvatar,
        isAI: activeCall.isAI,
        sessionId: activeCall.sessionId
      });
      setCallStatus('active');
      
      // If we are answering, we'll initialize WebRTC inside the other useEffect, 
      // but we need to set a flag to know we should send an answer
      if (activeCall.isAnswering) {
         // handle answer logic later in initializeMediaAndWebRTC
      }
    }
  }, [activeCall]);

  useEffect(() => {
    if (initialPartner && initialPartner.autoStart && callStatus === 'idle') {
      handleStartCall(initialPartner.email);
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

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const cleanupMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const initializeMediaAndWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setupWebRTC(stream);

    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera or microphone.");
    }
  };

  const setupWebRTC = async (stream) => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket && partnerDetails.sessionId) {
        socket.emit('video-call:ice-candidate', {
          candidate: event.candidate,
          sessionId: partnerDetails.sessionId
        });
      }
    };

    // Signaling events
    if (socket) {
      socket.on('video-call:answer', async (data) => {
        if (!peerConnection.currentRemoteDescription && data.answer) {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          } catch (e) {
            console.error("Error setting remote description", e);
          }
        }
      });

      socket.on('video-call:ice-candidate', async (data) => {
        if (data.candidate && peerConnection.remoteDescription) {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error("Error adding ice candidate", e);
          }
        }
      });
      
      socket.on('call:accepted', async (data) => {
         // The other side accepted our call visually and might have sent an answer
         if (data.answer && peerConnection.signalingState !== 'stable') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
         }
      });
      
      socket.on('call:rejected', () => {
         handleEndCall();
         alert("Call was declined.");
      });
      
      socket.on('video-call:end', () => {
         handleEndCall();
      });
    }

    // If we are initiating the call (caller)
    if (!activeCall?.isAnswering) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        // The offer gets sent through startOutgoingCall context logic via socket
        // but we can re-emit here if needed.
      } catch (err) {
        console.error(err);
      }
    } else if (activeCall?.offer) {
      // If we are answering the call (callee)
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(activeCall.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        if (socket) {
          socket.emit('call:accepted', {
             sessionId: activeCall.sessionId,
             answer: answer
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStartCall = async (emailOverride) => {
    const targetEmail = emailOverride || emailInput;
    if (!targetEmail) return;
    
    setCallStatus('connecting');
    setPartnerDetails(prev => ({ ...prev, name: 'Calling...' }));

    // Simulate routing using the context
    const response = await startOutgoingCall(targetEmail, true);
    setPartnerDetails(response);

    setTimeout(() => {
      if (response.isAI) {
        setCallStatus('ai-fallback');
        // Auto transition into AI call after a brief pause
        setTimeout(() => setCallStatus('active'), 2000);
      } else {
        setCallStatus('active');
      }
      
      setActiveCall({
        ...response,
        status: 'active'
      });
    }, 2500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    
    if (socket && partnerDetails.sessionId) {
       socket.emit('video-call:end', { sessionId: partnerDetails.sessionId });
    }
    
    cleanupMedia();
    contextEndCall();
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setEmailInput('');
      setPartnerDetails({ name: 'Friend / Mentor', isAI: false });
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
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden border border-gray-700">
            {partnerDetails.avatar ? (
              <img src={partnerDetails.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              partnerDetails.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">
              {partnerDetails.name} {partnerDetails.isAI && <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded ml-2">AI</span>}
            </h3>
            <p className="text-gray-300 text-xs flex items-center gap-1.5">
              {callStatus === 'active' ? (
                <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected</>
              ) : callStatus === 'ai-fallback' ? (
                <><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Transferring to AI...</>
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
        {callStatus === 'connecting' || callStatus === 'ai-fallback' ? (
          <div className="flex flex-col items-center z-10 text-center px-4">
            <div className={`w-20 h-20 rounded-full ${callStatus === 'ai-fallback' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-emerald-600/20 border-emerald-500/30'} flex items-center justify-center mb-6 animate-pulse border-4`}>
               {callStatus === 'ai-fallback' ? (
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
               ) : (
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
               )}
            </div>
            {callStatus === 'ai-fallback' ? (
              <div>
                <p className="text-white font-bold text-xl mb-2">User Unavailable</p>
                <p className="text-indigo-300 font-medium">Transferring you to our empathetic AI Support Guide...</p>
              </div>
            ) : (
              <p className="text-gray-400 font-medium text-lg">Ringing {partnerDetails.email}...</p>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Simulated Partner Camera Feed or AI Avatar */}
            {partnerDetails.isAI ? (
               <div className="w-full h-full flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse"></div>
                 <div className={`absolute -inset-8 rounded-full border border-indigo-500/30 max-w-[300px] max-h-[300px] m-auto ${callDuration % 5 !== 0 ? 'animate-ping' : ''}`}></div>
                 <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 border-4 border-gray-800 shadow-2xl relative z-10 flex items-center justify-center m-auto">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zm0 6c2.21 0 4 1.79 4 4v4H8v-4c0-2.21 1.79-4 4-4zm0 10v4m-4-2h8"/></svg>
                 </div>
               </div>
            ) : (
              <video 
                ref={remoteVideoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover bg-black"
              />
            )}
          </motion.div>
        )}
      </div>

      {/* User Camera Picture-in-Picture */}
      <div className="absolute bottom-28 right-6 w-32 h-44 sm:w-48 sm:h-64 bg-black rounded-xl border-2 border-emerald-500 shadow-2xl overflow-hidden z-20 flex items-center justify-center">
        {!partnerDetails.isAI && callStatus === 'active' ? (
           <video 
             ref={localVideoRef}
             autoPlay 
             playsInline 
             muted 
             className={`w-full h-full object-cover transform -scale-x-100 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
           />
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            <span className="text-xs font-medium text-center px-2">Waiting for camera...</span>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-center gap-4 sm:gap-6 px-4 z-20">
        <button 
          onClick={() => {
            setIsMuted(!isMuted);
            if(localStreamRef.current) {
              localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
            }
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          )}
        </button>
        <button 
          onClick={() => {
            setIsVideoOff(!isVideoOff);
            if(localStreamRef.current) {
              localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !t.enabled);
            }
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
          title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
        >
          {isVideoOff ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          )}
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-white transition-colors" title="Chat">
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
