import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCall } from './../../context/CallContext';

const PeerVideoCall = ({ initialRoomCode = '', onEndCall }) => {
  const { socket } = useCall();

  // UI state
  const [callStatus, setCallStatus] = useState('idle'); // idle | active | ended
  const [callDuration, setCallDuration] = useState(0);
  const [roomCodeInput, setRoomCodeInput] = useState(initialRoomCode || '');
  const [peerConnected, setPeerConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Refs (do NOT cause re-renders)
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnRef = useRef(null);          // RTCPeerConnection
  const localStreamRef = useRef(null);       // local camera stream
  const remoteStreamRef = useRef(null);      // remote camera stream
  const roomCodeRef = useRef(initialRoomCode || ''); // current active room code
  const isInitiatorRef = useRef(false);      // whether this side created the offer

  // ICE / STUN config
  const RTC_CONFIG = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // ─── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let t;
    if (callStatus === 'active') {
      t = setInterval(() => setCallDuration(p => p + 1), 1000);
    }
    return () => clearInterval(t);
  }, [callStatus]);

  // ─── Attach local stream to <video> when callStatus becomes active ──────────
  useEffect(() => {
    if (callStatus === 'active' && localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (callStatus === 'active' && remoteStreamRef.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [callStatus]);

  // ─── ALL Socket + WebRTC lifecycle in ONE effect ────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // ── helpers ──────────────────────────────────────────────────────────────

    const createPeerConnection = (stream) => {
      // Close any old connection first
      if (peerConnRef.current) {
        peerConnRef.current.close();
        peerConnRef.current = null;
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnRef.current = pc;

      // Add local tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // When remote video arrives
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setPeerConnected(true);
      };

      // Send ICE candidates to partner via server
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('video-call:ice-candidate', {
            candidate: event.candidate,
            roomCode: roomCodeRef.current,
          });
        }
      };

      return pc;
    };

    const sendOffer = async (pc) => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('video-call:offer', { offer, roomCode: roomCodeRef.current });
      } catch (e) {
        console.error('[WebRTC] Error creating offer:', e);
      }
    };

    // ── Socket event handlers ─────────────────────────────────────────────────

    const handleRoomWaiting = () => {
      // We already transitioned to 'active' immediately on join, do nothing
    };

    const handleRoomReady = async (data) => {
      isInitiatorRef.current = data.isInitiator;
      if (data.roomCode) roomCodeRef.current = data.roomCode;

      // Make sure we have local stream
      let stream = localStreamRef.current;
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (e) {
          console.error('[Media] Could not get user media:', e);
          return;
        }
      }

      const pc = createPeerConnection(stream);

      if (data.isInitiator) {
        // Small delay to allow the other side to set up their listeners
        setTimeout(() => sendOffer(pc), 600);
      }
    };

    const handleRoomFull = () => {
      alert('This room is full. Please try a different code.');
      setCallStatus('idle');
    };

    const handlePeerLeft = () => {
      setPeerConnected(false);
      remoteStreamRef.current = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (peerConnRef.current) {
        peerConnRef.current.close();
        peerConnRef.current = null;
      }
    };

    // ── WebRTC Signaling ──────────────────────────────────────────────────────

    const handleOffer = async (offer) => {
      const pc = peerConnRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('video-call:answer', { answer, roomCode: roomCodeRef.current });
      } catch (e) {
        console.error('[WebRTC] Error handling offer:', e);
      }
    };

    const handleAnswer = async (answer) => {
      const pc = peerConnRef.current;
      if (!pc) return;
      try {
        if (pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (e) {
        console.error('[WebRTC] Error handling answer:', e);
      }
    };

    const handleIceCandidate = async (candidate) => {
      const pc = peerConnRef.current;
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('[WebRTC] Error adding ICE candidate:', e);
      }
    };

    // ── Register ALL listeners ────────────────────────────────────────────────
    socket.on('room:waiting', handleRoomWaiting);
    socket.on('room:ready', handleRoomReady);
    socket.on('room:full', handleRoomFull);
    socket.on('room:peer-left', handlePeerLeft);
    socket.on('video-call:offer', handleOffer);
    socket.on('video-call:answer', handleAnswer);
    socket.on('video-call:ice-candidate', handleIceCandidate);

    return () => {
      socket.off('room:waiting', handleRoomWaiting);
      socket.off('room:ready', handleRoomReady);
      socket.off('room:full', handleRoomFull);
      socket.off('room:peer-left', handlePeerLeft);
      socket.off('video-call:offer', handleOffer);
      socket.off('video-call:answer', handleAnswer);
      socket.off('video-call:ice-candidate', handleIceCandidate);
    };
  }, [socket]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const startCamera = async () => {
    if (localStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (e) {
      alert('Could not access camera/microphone. Please allow permissions and try again.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCodeInput.trim()) return;
    const code = roomCodeInput.trim().toUpperCase();
    roomCodeRef.current = code;
    setRoomCodeInput(code);
    setPeerConnected(false);

    // Start camera FIRST so user sees themselves immediately
    await startCamera();
    setCallStatus('active');

    if (socket) socket.emit('room:join', code);
  };

  const handleRandomConnect = async () => {
    setPeerConnected(false);
    await startCamera();
    setCallStatus('active');
    if (socket) socket.emit('room:random');
  };

  const handleEndCall = () => {
    if (socket) {
      socket.emit('room:leave', roomCodeRef.current);
    }
    if (peerConnRef.current) { peerConnRef.current.close(); peerConnRef.current = null; }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    remoteStreamRef.current = null;
    setPeerConnected(false);
    setCallStatus('ended');
    setCallDuration(0);

    setTimeout(() => {
      setCallStatus('idle');
      setRoomCodeInput('');
      if (onEndCall) onEndCall();
    }, 2500);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  // ─── IDLE / ENDED screen ─────────────────────────────────────────────────────
  if (callStatus === 'idle' || callStatus === 'ended') {
    return (
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto py-8 px-4 min-h-[700px]">
        {/* Main join panel */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -ml-20 -mb-20" />

          <div className="relative z-10 w-full max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-[2rem] shadow-lg shadow-emerald-200 flex items-center justify-center mx-auto mb-8 text-4xl transform rotate-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {callStatus === 'ended' ? 'Session Ended' : 'Start a Video Room'}
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              {callStatus === 'ended'
                ? 'Your session has ended. Enter a new Room Code to call again.'
                : 'Enter any Room Code — your camera starts immediately. Share the code with your partner to connect.'}
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                </div>
                <input
                  type="text"
                  placeholder="e.g.  MATH101"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white text-lg transition-all outline-none uppercase font-bold tracking-widest"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
              </div>
              <button
                onClick={handleJoinRoom}
                disabled={!roomCodeInput.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg transition-all transform flex items-center justify-center gap-3 ${
                  roomCodeInput.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-indigo-400/30'
                    : 'bg-indigo-300 cursor-not-allowed'
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                Join Video Room
              </button>
            </div>
          </div>
        </div>

        {/* Radar panel */}
        <div className="w-full lg:w-72 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 flex flex-col items-center justify-center text-center gap-5">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-ping opacity-60" />
            <div className="absolute inset-2 rounded-full border-2 border-indigo-300 animate-ping opacity-40" style={{ animationDelay: '300ms' }} />
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Radar Match</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Don't have a code? Get matched instantly with an available peer.</p>
          </div>
          <button
            onClick={handleRandomConnect}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-200"
          >
            Search Radar
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE call screen ────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative min-h-[600px] flex flex-col">

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 p-5 z-30 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${peerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              {peerConnected ? 'Live — Both Connected' : 'Waiting for partner...'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Room: <span className="text-amber-300 font-mono font-bold">{roomCodeRef.current}</span>
              {peerConnected && <span className="ml-3 text-emerald-400">{formatTime(callDuration)}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-red-900/40"
        >
          End Call
        </button>
      </div>

      {/* Remote video — always mounted, black when no stream */}
      <div className="flex-1 relative bg-gray-950 min-h-[480px]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay shown while waiting for partner to join */}
        {!peerConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 z-10 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />
            <div className="text-center">
              <p className="text-white font-bold text-xl">Room is Live!</p>
              <p className="text-gray-400 mt-1">Share your code with a friend to connect:</p>
              <div className="mt-3 px-8 py-3 bg-amber-500/10 border border-amber-400/40 rounded-2xl inline-block">
                <span className="text-amber-300 font-mono text-3xl font-black tracking-[0.2em]">{roomCodeRef.current}</span>
              </div>
              <p className="text-gray-500 text-sm mt-3">Your camera is ON. They'll appear here instantly when they join.</p>
            </div>
          </div>
        )}

        {/* Local camera PiP — bottom right */}
        <div className="absolute bottom-4 right-4 z-20 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl bg-gray-800">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <svg className="text-gray-500" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17H2a2 2 0 01-2-2V5a2 2 0 012-2h10"/><path d="M23 7l-7 5 7 5V7z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-black/50 rounded text-white text-[10px] px-1.5 py-0.5 font-medium">You</div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="h-20 bg-gray-900/95 backdrop-blur border-t border-gray-800 flex items-center justify-center gap-5 px-4 z-20">
        {/* Mute */}
        <button
          onClick={() => {
            setIsMuted(p => !p);
            localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMuted
              ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"/></>
              : <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></>
            }
          </svg>
        </button>

        {/* Video toggle */}
        <button
          onClick={() => {
            setIsVideoOff(p => !p);
            localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isVideoOff
              ? <><path d="M17 17H2a2 2 0 01-2-2V5a2 2 0 012-2h10"/><path d="M23 7l-7 5 7 5V7z"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>
            }
          </svg>
        </button>

        {/* End call */}
        <button
          onClick={handleEndCall}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-900/40 transition-all"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        </button>

        {/* Room code chip */}
        <div className="ml-2 hidden sm:flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2.5">
          <span className="text-gray-400 text-xs">Code:</span>
          <span className="text-amber-300 font-mono font-bold tracking-widest text-sm">{roomCodeRef.current}</span>
        </div>
      </div>
    </div>
  );
};

export default PeerVideoCall;
