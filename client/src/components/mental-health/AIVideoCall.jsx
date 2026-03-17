import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import api from '../../services/api';

const AIVideoCall = () => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended
  const [callDuration, setCallDuration] = useState(0);
  
  // AI Analysis State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState({
    mood: 'Neutral',
    engagement: 100,
    attention: true,
    posture: 'Good'
  });

  // Conversation & Speech State
  const [language, setLanguage] = useState('en-IN'); // Default to Indian English
  const [messages, setMessages] = useState([]);      // Conversation history
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);

  // Load Models on Mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log("Face API Models Loaded Successfully");
      } catch (err) {
        console.error("Failed to load models. Ensure they are in public/models", err);
      }
    };
    loadModels();
    
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            handleFinalSpeech(result[0].transcript);
          } else {
            currentTranscript += result[0].transcript;
          }
        }
        setTranscript(currentTranscript);
        
        // Reset silence timer on any speech
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
    
    return () => {
      stopMedia();
      stopSpeech();
    };
  }, []);

  // Sync recognition language if changed
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      // Restart if actively listening to apply new language
      if (isListening) {
         recognitionRef.current.stop();
         setTimeout(() => recognitionRef.current.start(), 300);
      }
    }
  }, [language]);

  const stopSpeech = () => {
    if (recognitionRef.current) captureAndStopListening();
    if (synthesisRef.current) synthesisRef.current.cancel();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsAiThinking(false);
    setIsAiSpeaking(false);
    setTranscript('');
  };

  const handleFinalSpeech = useCallback(async (text) => {
     if (!text || text.trim() === '') return;
     
     // Stop listening while AI thinks and speaks
     captureAndStopListening();
     
     const newUserMessage = { role: 'user', message: text.trim() };
     setMessages(prev => [...prev, newUserMessage]);
     setTranscript('');
     setIsAiThinking(true);
     
     try {
       // Ask Gemini API
       const response = await api.post('/ai/chat', { message: text.trim(), history: messages });
       const aiResponseText = response.data.response || 'I am sorry, I did not understand that.';
       
       const newAiMessage = { role: 'assistant', message: aiResponseText };
       setMessages(prev => [...prev, newAiMessage]);
       speakResponse(aiResponseText);
       
     } catch (err) {
       console.error("AI Chat Error", err);
       speakResponse("Sorry, I am having trouble connecting to my brain right now.");
     } finally {
       setIsAiThinking(false);
     }
  }, [messages]);

  const speakResponse = (text) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel(); // cancel any ongoing speech
    
    setIsAiSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a voice that matches the selected language
    const voices = synthesisRef.current.getVoices();
    const langCode = language.split('-')[0]; // 'en' or 'hi'
    const bestVoice = voices.find(v => v.lang.includes(language)) || voices.find(v => v.lang.startsWith(langCode));
    
    if (bestVoice) utterance.voice = bestVoice;
    utterance.lang = language;
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Make it sound slightly more empathetic/friendly
    
    utterance.onend = () => {
       setIsAiSpeaking(false);
       // Resume listening after AI finishes speaking
       if (callStatus === 'active' && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e){}
       }
    };
    
    utterance.onerror = () => {
       setIsAiSpeaking(false);
       if (callStatus === 'active' && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e){}
       }
    };

    synthesisRef.current.speak(utterance);
  };

  const captureAndStopListening = () => {
    if (recognitionRef.current) {
       try { recognitionRef.current.stop(); } catch(e) {}
    }
  };

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

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or failed", err);
      alert("Could not access camera. Analysis will be disabled.");
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
  };

  const startAnalysis = () => {
    if (!videoRef.current || !modelsLoaded) return;
    setIsAnalyzing(true);
    
    // Create canvas matching video dimensions
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    analysisIntervalRef.current = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        const detection = await faceapi.detectSingleFace(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        if (detection) {
          // Draw bounding box (optional, for debug)
          // const resizedDetections = faceapi.resizeResults(detection, displaySize);
          // const ctx = canvasRef.current.getContext('2d');
          // ctx.clearRect(0, 0, displaySize.width, displaySize.height);
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

          analyzeMetrics(detection);
        } else {
          // Face lost
          setMetrics(prev => ({
            ...prev,
            attention: false,
            engagement: Math.max(0, prev.engagement - 5),
            posture: 'Not Detected'
          }));
        }
      }
    }, 500); // Analyze every 500ms
  };

  const analyzeMetrics = (detection) => {
    // 1. Mood Detection
    const expressions = detection.expressions;
    const sortedExpressions = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
    const dominantMood = sortedExpressions[0][0]; // happy, sad, angry, neutral, etc.
    
    const moodMap = {
      neutral: 'Calm',
      happy: 'Positive',
      sad: 'Down',
      angry: 'Stressed',
      fearful: 'Anxious',
      disgusted: 'Uncomfortable',
      surprised: 'Alert'
    };

    // 2. Attention (Gaze/Head Pose proxy using landmarks)
    // Very simplified proxy: check if nose roughly in middle of face bounds
    const nose = detection.landmarks.getNose();
    const box = detection.detection.box;
    const noseCenter = nose[3].x; // Tip of nose
    const isLookingAway = noseCenter < box.left + (box.width * 0.3) || noseCenter > box.right - (box.width * 0.3);

    // 3. Posture
    // Simplified: check if face is too low in the video frame
    const isSlouching = box.y > (videoRef.current.videoHeight * 0.6);

    // 4. Engagement
    // Increase if looking, neutral/positive. Decrease if away/negative.
    setMetrics(prev => {
      let newEngagement = prev.engagement;
      if (!isLookingAway) newEngagement = Math.min(100, newEngagement + 2);
      else newEngagement = Math.max(0, newEngagement - 5);
      
      return {
        mood: moodMap[dominantMood] || 'Calm',
        attention: !isLookingAway,
        posture: isSlouching ? 'Slouching' : 'Upright',
        engagement: newEngagement
      };
    });
  };

  const handleStartCall = async () => {
    setCallStatus('connecting');
    await startMedia();
    setTimeout(() => {
      setCallStatus('active');
      
      // Start initial greeting
      if (synthesisRef.current && recognitionRef.current) {
        setTimeout(() => {
          const greeting = language.startsWith('hi') 
             ? "नमस्ते, मैं आपका एआई मार्गदर्शक हूँ। आप कैसा महसूस कर रहे हैं?" 
             : "Hello there, I am your AI Support Guide. How are you feeling today?";
             
          const initMsg = { role: 'assistant', message: greeting };
          setMessages([initMsg]);
          speakResponse(greeting);
        }, 1000);
      }
    }, 2500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    stopMedia();
    stopSpeech();
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setMessages([]);
      setMetrics({ mood: 'Neutral', engagement: 100, attention: true, posture: 'Good' });
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

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border-2 border-indigo-100 text-indigo-900 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="en-IN">English (India)</option>
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (हिंदी)</option>
            <option value="hi-IN">Hinglish</option>
          </select>

          <button 
            onClick={handleStartCall}
            disabled={!modelsLoaded}
            className={`px-8 py-4 rounded-xl font-bold text-lg text-white shadow-sm transition-all flex items-center justify-center gap-3 transform ${
              modelsLoaded ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1' : 'bg-indigo-300 cursor-not-allowed'
            }`}
          >
            {modelsLoaded ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                Start Voice/Video Session
              </>
            ) : (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Loading AI Vision...
              </>
            )}
          </button>
        </div>
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
        <div className="text-white font-mono bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-3">
          {/* Status Indicator */}
          {isAiSpeaking && <span className="text-xs text-indigo-300 font-sans uppercase tracking-widest animate-pulse">AI Speaking...</span>}
          {isAiThinking && <span className="text-xs text-amber-300 font-sans uppercase tracking-widest animate-pulse">AI Thinking...</span>}
          {isListening && <span className="text-xs text-emerald-300 font-sans uppercase tracking-widest flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Listening</span>}
          
          <span className="opacity-50">|</span>
          {callStatus === 'active' ? formatTime(callDuration) : '00:00'}
        </div>
      </div>

      {/* Main Video Area (Simulated AI Avatar) */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900 border-b border-gray-800 pb-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4f46e5 0%, transparent 70%)' }}></div>
        
        {callStatus === 'connecting' ? (
          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium tracking-wide">Establishing secure neural link...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            {/* Pulsing rings around AI avatar based on "speaking" */}
            <div className={`absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl ${isAiSpeaking ? 'animate-pulse scale-150' : ''}`}></div>
            <div className={`absolute -inset-8 rounded-full border border-indigo-500/30 ${isAiSpeaking ? 'animate-ping' : isAiThinking ? 'animate-spin border-dashed' : ''}`}></div>
            
            <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 border-4 ${isAiSpeaking ? 'border-indigo-400' : 'border-gray-800'} shadow-[0_0_50px_rgba(79,70,229,0.3)] relative z-10 flex items-center justify-center transition-colors duration-500`}>
              {isAiThinking ? (
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="animate-spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
              ) : (
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={isAiSpeaking ? 'animate-bounce' : ''}><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zm0 6c2.21 0 4 1.79 4 4v4H8v-4c0-2.21 1.79-4 4-4zm0 10v4m-4-2h8"/></svg>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Real-time Subtitles / Live Transcript Override */}
      <AnimatePresence>
        {callStatus === 'active' && (
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className="absolute bottom-32 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none"
          >
             <div className="max-w-3xl w-full flex flex-col items-center gap-2">
               {/* User Speech (Yellow/White) */}
               {transcript && (
                  <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 text-center shadow-lg transform transition-all">
                     <p className="text-gray-100 text-lg md:text-xl font-medium tracking-wide">
                        <span className="text-amber-400 mr-2 opacity-80">You:</span> {transcript}
                     </p>
                  </div>
               )}
               {/* Last AI Message (Indigo) */}
               {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !transcript && !isAiThinking && (
                  <div className="bg-indigo-900/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-indigo-500/30 text-center shadow-lg max-w-2xl transform transition-all">
                     <p className="text-indigo-50 text-lg md:text-xl font-medium">
                        {messages[messages.length - 1].message}
                     </p>
                  </div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Analytics Overlay (HUD) */}
      <AnimatePresence>
        {callStatus === 'active' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-6 top-28 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-64 z-30"
          >
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2 tracking-wider">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              LIVE ANALYSIS
            </h4>
            
            <div className="space-y-4">
              {/* Mood */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Detected State</span>
                  <span className={`${
                    ['Calm', 'Positive'].includes(metrics.mood) ? 'text-emerald-400' 
                    : ['Stressed', 'Anxious', 'Down'].includes(metrics.mood) ? 'text-amber-400' 
                    : 'text-indigo-400'
                  } font-semibold`}>
                    {metrics.mood}
                  </span>
                </div>
              </div>

              {/* Engagement */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-white font-mono">{Math.round(metrics.engagement)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${metrics.engagement}%` }}
                    className={`h-full ${metrics.engagement > 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </div>

              {/* Attention/Eye Contact */}
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <span className="text-xs text-gray-400">Eye Contact</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${metrics.attention ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {metrics.attention ? 'Focused' : 'Distracted'}
                </span>
              </div>

              {/* Posture */}
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <span className="text-xs text-gray-400">Posture</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${metrics.posture === 'Upright' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {metrics.posture}
                </span>
              </div>
            </div>
            
            {/* AI Action Indicator */}
            {['Stressed', 'Anxious', 'Down'].includes(metrics.mood) && (
               <div className="mt-4 text-[10px] text-amber-300/80 bg-amber-500/10 p-2 rounded flex items-start gap-2">
                 <span className="animate-pulse">⚡</span>
                 AI Guide is automatically adjusting tone to be softer and more supportive.
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Camera Picture-in-Picture */}
      <div className="absolute bottom-28 right-6 w-48 h-64 bg-black rounded-xl border-2 border-indigo-500 shadow-2xl overflow-hidden z-20 flex items-center justify-center">
        <video 
          ref={videoRef} 
          muted 
          autoPlay 
          playsInline
          onPlay={startAnalysis}
          className={`w-full h-full object-cover transform -scale-x-100 ${callStatus === 'active' ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Hidden Canvas for Face API calculations */}
        <canvas ref={canvasRef} className="hidden absolute" />
        
        {callStatus !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            <span className="text-xs font-medium">Camera Preparing...</span>
          </div>
        )}
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
