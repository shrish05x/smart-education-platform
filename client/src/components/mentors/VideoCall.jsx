import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const VideoCall = ({ sessionId, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const intervalRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join:video-call', sessionId);
    });

    socketRef.current.on('video-call:offer', handleOffer);
    socketRef.current.on('video-call:answer', handleAnswer);
    socketRef.current.on('video-call:ice-candidate', handleIceCandidate);
    socketRef.current.on('video-call:end', handleCallEnd);
  };

  const startCall = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('video-call:ice-candidate', {
            sessionId,
            candidate: event.candidate,
          });
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socketRef.current.emit('video-call:offer', {
        sessionId,
        offer,
      });

      setIsInCall(true);
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to access camera/microphone. Please check permissions.');
      console.error('Error starting call:', err);
    }
  };

  const handleOffer = async (data) => {
    try {
      if (!peerConnectionRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        peerConnectionRef.current = new RTCPeerConnection(configuration);

        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit('video-call:ice-candidate', {
              sessionId,
              candidate: event.candidate,
            });
          }
        };

        peerConnectionRef.current.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };
      }

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socketRef.current.emit('video-call:answer', {
        sessionId,
        answer,
      });

      setIsInCall(true);
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to join the call.');
      console.error('Error handling offer:', err);
    }
  };

  const handleAnswer = async (data) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (data.candidate) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  };

  const handleCallEnd = () => {
    endCall();
  };

  const endCall = () => {
    socketRef.current?.emit('video-call:end', { sessionId });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsInCall(false);
    setCallDuration(0);
    onClose();
  };

  const cleanup = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to video call...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-medium">Video Call</span>
          {isInCall && (
            <span className="text-sm text-gray-300">
              {formatTime(callDuration)}
            </span>
          )}
        </div>
        <button
          onClick={endCall}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={startCall}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {!isInCall && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Ready for Video Call</h2>
                  <p className="text-gray-300 mb-8 max-w-md">
                    Click the button below to start your mentorship session video call.
                  </p>
                  <button
                    onClick={startCall}
                    className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Start Call
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {isInCall && (
        <div className="bg-gray-900 p-6 flex justify-center gap-4">
          <button
            onClick={toggleAudio}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={toggleVideo}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={endCall}
            className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-6 6.5a9 9 0 1112.5 0M12 2v6m0 6v6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;