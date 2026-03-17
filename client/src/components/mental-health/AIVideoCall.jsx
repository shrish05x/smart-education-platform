import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import api from '../../services/api';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

/* ─── Waveform bars shown while mic is active ─── */
const MicWave = () => (
  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
    {[1,.5,.9,.3,.7,.4,.8,.6,1].map((h,i) => (
      <motion.div key={i}
        animate={{ scaleY:[h,.3,h], opacity:[1,.5,1] }}
        transition={{ duration:.7+i*.08, repeat:Infinity, delay:i*.07 }}
        style={{ width:3, height:28*h, borderRadius:3, background:T.lime, transformOrigin:'center' }}
      />
    ))}
  </div>
);

/* ─── AI speaking animation ─── */
const AiWave = () => (
  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
    {[.6,1,.7,.9,.5,.8,.4,.7,.6].map((h,i) => (
      <motion.div key={i}
        animate={{ scaleY:[h,.2,h], opacity:[1,.4,1] }}
        transition={{ duration:.5+i*.06, repeat:Infinity, delay:i*.05 }}
        style={{ width:3, height:32*h, borderRadius:3, background:T.purple, transformOrigin:'center' }}
      />
    ))}
  </div>
);

const AIVideoCall = () => {
  const [callStatus, setCallStatus] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [metrics, setMetrics] = useState({ mood:'Neutral', engagement:100, attention:true, posture:'Good' });
  const [language, setLanguage] = useState('en-IN');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  /* ─── Load face-api models & speech recognition ─── */
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.warn('Face API models not found — continuing without face analysis.', err);
        setModelsLoaded(true); // still allow call to start
      }
    };
    loadModels();

    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Init speech recognition
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart  = () => setIsListening(true);
      recognition.onend    = () => setIsListening(false);

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            handleFinalSpeech(event.results[i][0].transcript);
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(interim);
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => { stopMedia(); stopSpeech(); };
  }, []);

  // Sync language
  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = language;
  }, [language]);

  /* ─── Timer ─── */
  useEffect(() => {
    let t;
    if (callStatus === 'active') t = setInterval(() => setCallDuration(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  /* ─── Speech helpers ─── */
  const stopSpeech = () => {
    try { if (recognitionRef.current) recognitionRef.current.stop(); } catch(e){}
    if (synthesisRef.current) synthesisRef.current.cancel();
    setIsAiThinking(false); setIsAiSpeaking(false); setTranscript('');
  };

  const handleFinalSpeech = useCallback(async (text) => {
    if (!text?.trim()) return;
    try { if (recognitionRef.current) recognitionRef.current.stop(); } catch(e){}
    setTranscript('');
    setMessages(prev => [...prev, { role:'user', message:text.trim() }]);
    setIsAiThinking(true);

    try {
      const response = await api.post('/ai/chat', { message:text.trim(), history:messages });
      const reply = response.data.response || "I didn't catch that. Could you say it again?";
      setMessages(prev => [...prev, { role:'assistant', message:reply }]);
      speakResponse(reply);
    } catch(err) {
      console.error('AI Chat Error', err);
      speakResponse("Sorry, I'm having a little trouble right now. Could you try again?");
    } finally {
      setIsAiThinking(false);
    }
  }, [messages]);

  const speakResponse = (text) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel();
    setIsAiSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthesisRef.current.getVoices();
    const langVoices = voices.filter(v => v.lang.startsWith(language.split('-')[0]));
    const voice = langVoices[selectedVoiceIndex] || langVoices[0] || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    utterance.onend = utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (callStatus === 'active' && recognitionRef.current && !micMuted) {
        try { recognitionRef.current.start(); } catch(e){}
      }
    };

    synthesisRef.current.speak(utterance);
  };

  /* ─── Mic toggle ─── */
  const toggleMic = () => {
    if (micMuted) {
      setMicMuted(false);
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.enabled = true);
      }
      // resume listening
      if (recognitionRef.current && !isAiSpeaking) {
        try { recognitionRef.current.start(); } catch(e){}
      }
    } else {
      setMicMuted(true);
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.enabled = false);
      }
      try { if (recognitionRef.current) recognitionRef.current.stop(); } catch(e){}
    }
  };

  /* ─── Video toggle ─── */
  const toggleVideo = () => {
    setVideoMuted(v => {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => t.enabled = v); // toggle to opposite
      }
      return !v;
    });
  };

  /* ─── Camera & face analysis ─── */
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch(err) {
      console.warn('Camera/mic not available:', err);
    }
  };

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
  };

  const startAnalysis = () => {
    if (!videoRef.current || !modelsLoaded) return;
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    if (canvasRef.current) faceapi.matchDimensions(canvasRef.current, displaySize);

    analysisIntervalRef.current = setInterval(async () => {
      if (!videoRef.current?.paused) {
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceExpressions().catch(()=>null);

        if (detection) {
          const expressions = detection.expressions;
          const dominant = Object.entries(expressions).sort((a,b)=>b[1]-a[1])[0][0];
          const moodMap = { neutral:'Calm', happy:'Positive', sad:'Down', angry:'Stressed', fearful:'Anxious', disgusted:'Uncomfortable', surprised:'Alert' };
          const nose = detection.landmarks.getNose();
          const box = detection.detection.box;
          const noseX = nose[3].x;
          const lookingAway = noseX < box.left+(box.width*.3) || noseX > box.right-(box.width*.3);
          const slouching = box.y > (videoRef.current.videoHeight*.6);
          setMetrics(prev => ({
            mood: moodMap[dominant]||'Calm',
            attention: !lookingAway,
            posture: slouching?'Slouching':'Upright',
            engagement: !lookingAway ? Math.min(100,prev.engagement+2) : Math.max(0,prev.engagement-5)
          }));
        } else {
          setMetrics(prev => ({ ...prev, attention:false, posture:'Not Detected', engagement:Math.max(0,prev.engagement-5) }));
        }
      }
    }, 600);
  };

  /* ─── Call control ─── */
  const handleStartCall = async () => {
    setCallStatus('connecting');
    await startMedia();
    setTimeout(() => {
      setCallStatus('active');
      const greeting = language.startsWith('hi')
        ? 'नमस्ते! मैं आपका एआई टीचर हूँ। आज आप क्या पढ़ना चाहते हैं?'
        : 'Hey there! I am your AI Study Guide. What would you like to learn or talk about today?';
      setMessages([{ role:'assistant', message:greeting }]);
      speakResponse(greeting);
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    stopMedia(); stopSpeech();
    setTimeout(() => {
      setCallStatus('idle'); setCallDuration(0); setMessages([]);
      setMetrics({ mood:'Neutral', engagement:100, attention:true, posture:'Good' });
    }, 3000);
  };

  /* ─── English voices available for selector ─── */
  const langVoices = availableVoices.filter(v => v.lang.startsWith(language.split('-')[0]));

  /* ═══════════════════════════════════════════════════════════
     IDLE / ENDED SCREEN
  ═══════════════════════════════════════════════════════════ */
  if (callStatus === 'idle' || callStatus === 'ended') return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'4rem 1.5rem', textAlign:'center' }}>
      {/* AI orb */}
      <motion.div animate={{ y:[0,-10,0], boxShadow:[`0 0 40px ${T.purple}40`,`0 0 70px ${T.purple}70`,`0 0 40px ${T.purple}40`] }}
        transition={{ duration:3, repeat:Infinity }}
        style={{ width:120, height:120, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.8rem', marginBottom:'2rem' }}>
        🤖
      </motion.div>

      <h2 style={{ fontSize:'1.8rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.75rem' }}>
        <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>AI Study Guide</span>
      </h2>
      <p style={{ color:'rgba(255,255,255,0.44)', fontSize:'.95rem', maxWidth:440, lineHeight:1.7, marginBottom:'2.5rem' }}>
        {callStatus === 'ended'
          ? 'Great session! Your AI Guide is ready whenever you need support again.'
          : 'Talk live with your personal AI Study Guide. Speak, and it listens — answering in its voice, adapting to your mood in real time.'}
      </p>

      {/* Language & Voice selectors */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'center', marginBottom:'2rem' }}>
        <select value={language} onChange={e=>setLanguage(e.target.value)}
          style={{ padding:'.7rem 1.2rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, color:'#fff', fontSize:'.875rem', fontFamily:"'Sora',sans-serif", outline:'none', cursor:'pointer' }}>
          <option value="en-IN" style={{background:'#1a1a2e'}}>🇮🇳 English (India)</option>
          <option value="en-US" style={{background:'#1a1a2e'}}>🇺🇸 English (US)</option>
          <option value="en-GB" style={{background:'#1a1a2e'}}>🇬🇧 English (UK)</option>
          <option value="hi-IN" style={{background:'#1a1a2e'}}>🇮🇳 Hindi</option>
        </select>

        {langVoices.length > 1 && (
          <select value={selectedVoiceIndex} onChange={e=>setSelectedVoiceIndex(Number(e.target.value))}
            style={{ padding:'.7rem 1.2rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, color:'#fff', fontSize:'.875rem', fontFamily:"'Sora',sans-serif", outline:'none', cursor:'pointer' }}>
            {langVoices.map((v,i) => (
              <option key={v.name} value={i} style={{background:'#1a1a2e'}}>{v.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* How it works chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', justifyContent:'center', marginBottom:'2.5rem' }}>
        {['🎙️ Speak naturally','🤖 AI replies in voice','📊 Mood tracked live','🌐 Multi-language'].map(label => (
          <span key={label} style={{ padding:'.4rem 1rem', borderRadius:999, background:'rgba(172,106,255,0.1)', border:'1px solid rgba(172,106,255,0.2)', color:T.purple, fontSize:'.78rem', fontWeight:600 }}>{label}</span>
        ))}
      </div>

      <motion.button onClick={handleStartCall} disabled={!modelsLoaded}
        whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
        style={{ padding:'1.1rem 2.8rem', borderRadius:20, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:800, fontSize:'1.05rem', fontFamily:"'Sora',sans-serif", cursor:modelsLoaded?'pointer':'not-allowed', opacity:modelsLoaded?1:.6, boxShadow:`0 0 40px rgba(172,106,255,0.35)`, display:'flex', alignItems:'center', gap:'.8rem' }}>
        {modelsLoaded ? (
          <>🎙️ Start AI Session</>
        ) : (
          <><motion.span animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:'linear' }} style={{ display:'inline-block' }}>⚙️</motion.span> Loading AI...</>
        )}
      </motion.button>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     ACTIVE CALL SCREEN
  ═══════════════════════════════════════════════════════════ */
  return (
    <div style={{ position:'relative', borderRadius:24, overflow:'hidden', background:'#060614', border:'1px solid rgba(255,255,255,0.1)', minHeight:580, display:'flex', flexDirection:'column' }}>

      {/* ── Top bar ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30, padding:'1rem 1.4rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)', backdropFilter:'blur(4px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
          <div style={{ width:42, height:42, borderRadius:14, background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', boxShadow:`0 0 20px ${T.purple}50` }}>🤖</div>
          <div>
            <div style={{ fontWeight:700, fontSize:'.9rem' }}>EduSuccess AI Guide</div>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:.4 }}>
              {callStatus === 'active'
                ? <><span style={{ width:7, height:7, borderRadius:'50%', background:T.lime, display:'inline-block', boxShadow:`0 0 8px ${T.lime}` }}/> Connected</>
                : <><span style={{ width:7, height:7, borderRadius:'50%', background:T.gold, display:'inline-block' }}/> Connecting...</>}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          {/* Status indicator */}
          <AnimatePresence mode="wait">
            {isAiSpeaking && (
              <motion.div key="speaking" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.35rem .9rem', borderRadius:999, background:`rgba(172,106,255,0.15)`, border:`1px solid rgba(172,106,255,0.3)` }}>
                <AiWave/>
                <span style={{ fontSize:'.7rem', fontWeight:700, color:T.purple }}>AI SPEAKING</span>
              </motion.div>
            )}
            {isAiThinking && !isAiSpeaking && (
              <motion.div key="thinking" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.35rem .9rem', borderRadius:999, background:`rgba(255,200,118,0.12)`, border:`1px solid rgba(255,200,118,0.25)` }}>
                <motion.span animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:'linear' }}>⚙️</motion.span>
                <span style={{ fontSize:'.7rem', fontWeight:700, color:T.gold }}>THINKING</span>
              </motion.div>
            )}
            {isListening && !isAiSpeaking && !isAiThinking && (
              <motion.div key="listening" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.35rem .9rem', borderRadius:999, background:`rgba(122,219,120,0.12)`, border:`1px solid rgba(122,219,120,0.25)` }}>
                <MicWave/>
                <span style={{ fontSize:'.7rem', fontWeight:700, color:T.lime }}>LISTENING</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timer */}
          <div style={{ fontFamily:'monospace', fontSize:'.85rem', color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.07)', padding:'.35rem .8rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)' }}>
            {callStatus==='active' ? formatTime(callDuration) : '00:00'}
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', minHeight:400, background:'radial-gradient(circle at 50% 50%,rgba(172,106,255,0.08) 0%,transparent 70%)' }}>

        {callStatus === 'connecting' ? (
          <div style={{ textAlign:'center' }}>
            <motion.div animate={{ rotate:360 }} transition={{ duration:1.2, repeat:Infinity, ease:'linear' }}
              style={{ width:60, height:60, borderRadius:'50%', border:`3px solid rgba(172,106,255,0.2)`, borderTop:`3px solid ${T.purple}`, margin:'0 auto 1.2rem' }}/>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'.9rem' }}>Establishing neural link...</p>
          </div>
        ) : (
          <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.4rem' }}>
            {/* Pulsing rings */}
            {(isAiSpeaking||isListening) && [1,2,3].map(r => (
              <motion.div key={r}
                animate={{ scale:[1,1.4+r*.2], opacity:[.4,0] }}
                transition={{ duration:1.5, repeat:Infinity, delay:r*.3 }}
                style={{ position:'absolute', width:200, height:200, borderRadius:'50%', border:`1px solid ${isAiSpeaking?T.purple:T.lime}`,  pointerEvents:'none' }}/>
            ))}

            {/* AI Avatar orb */}
            <motion.div
              animate={isAiSpeaking ? { scale:[1,1.04,1] } : { scale:1 }}
              transition={{ duration:.5, repeat:Infinity }}
              style={{ width:160, height:160, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple}cc,${T.blue}cc)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem',
                boxShadow: isAiSpeaking ? `0 0 60px ${T.purple}80, 0 0 100px ${T.blue}40` : `0 0 40px ${T.purple}40`,
                border:`2px solid ${isAiSpeaking?T.purple:isListening?T.lime:'rgba(255,255,255,0.15)'}`,
                transition:'border .3s, box-shadow .3s',
                zIndex:10
              }}>
              {isAiThinking ? (
                <motion.span animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} style={{ display:'inline-block', fontSize:'2.5rem' }}>⚙️</motion.span>
              ) : '🤖'}
            </motion.div>

            {/* AI name + waveform */}
            <div style={{ textAlign:'center' }}>
              <div style={{ fontWeight:700, fontSize:'.95rem', marginBottom:'.3rem' }}>EduSuccess AI Guide</div>
              <div style={{ height:40, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {isAiSpeaking ? <AiWave/> : isAiThinking ? (
                  <span style={{ color:T.gold, fontSize:'.8rem', fontWeight:600 }}>Formulating answer...</span>
                ) : isListening ? <MicWave/> : (
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'.8rem' }}>Waiting for your voice...</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Live subtitles ── */}
        <AnimatePresence>
          {callStatus==='active' && (transcript || (messages.length>0 && messages[messages.length-1].role==='assistant' && !transcript && !isAiThinking)) && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', width:'90%', maxWidth:580, zIndex:20 }}>
              {transcript ? (
                <div style={{ background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', borderRadius:16, padding:'.9rem 1.2rem', textAlign:'center' }}>
                  <span style={{ color:T.gold, fontWeight:700, fontSize:'.78rem', marginRight:'.5rem' }}>YOU:</span>
                  <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'.9rem' }}>{transcript}</span>
                </div>
              ) : (
                <div style={{ background:'rgba(172,106,255,0.1)', border:`1px solid rgba(172,106,255,0.25)`, backdropFilter:'blur(12px)', borderRadius:16, padding:'.9rem 1.2rem', textAlign:'center' }}>
                  <span style={{ color:T.purple, fontWeight:700, fontSize:'.78rem', marginRight:'.5rem' }}>AI:</span>
                  <span style={{ color:'rgba(255,255,255,0.78)', fontSize:'.9rem' }}>{messages[messages.length-1].message}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── User camera pip ── */}
      <div style={{ position:'absolute', bottom:100, right:16, width:140, height:190, borderRadius:16, overflow:'hidden', border:`2px solid ${micMuted?T.coral:T.purple}`, boxShadow:`0 0 20px rgba(172,106,255,0.3)`, zIndex:25, background:'#111' }}>
        <video ref={videoRef} muted autoPlay playsInline onPlay={startAnalysis}
          style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)', opacity:(callStatus==='active'&&!videoMuted)?1:0 }}/>
        <canvas ref={canvasRef} style={{ display:'none', position:'absolute' }}/>
        {(callStatus!=='active'||videoMuted) && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)', gap:'.4rem' }}>
            <span style={{ fontSize:'1.5rem' }}>🎥</span>
            <span style={{ fontSize:'.68rem' }}>{videoMuted?'Cam Off':'Connecting...'}</span>
          </div>
        )}
        {micMuted && <div style={{ position:'absolute', top:6, right:6, background:T.coral, borderRadius:999, padding:'.2rem .5rem', fontSize:'.6rem', fontWeight:700, color:'#fff' }}>MUTED</div>}
      </div>

      {/* ── Analytics HUD ── */}
      <AnimatePresence>
        {callStatus==='active' && (
          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
            style={{ position:'absolute', left:14, top:80, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:16, padding:'1rem 1.1rem', width:180, zIndex:30 }}>
            <div style={{ fontSize:'.65rem', fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.9rem' }}>📊 Live Analysis</div>

            <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.45)' }}>Mood</span>
                <span style={{ fontSize:'.72rem', fontWeight:700, color:['Calm','Positive'].includes(metrics.mood)?T.lime:['Stressed','Anxious','Down'].includes(metrics.mood)?T.coral:T.blue }}>{metrics.mood}</span>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:.4 }}>
                  <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.45)' }}>Engagement</span>
                  <span style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,0.7)', fontFamily:'monospace' }}>{Math.round(metrics.engagement)}%</span>
                </div>
                <div style={{ height:4, borderRadius:999, background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
                  <motion.div animate={{ width:`${metrics.engagement}%` }} style={{ height:'100%', borderRadius:999, background:metrics.engagement>60?T.lime:T.coral }}/>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.45)' }}>Eye Contact</span>
                <span style={{ fontSize:'.68rem', fontWeight:700, padding:'.2rem .5rem', borderRadius:6, background:metrics.attention?`${T.lime}18`:`${T.coral}18`, color:metrics.attention?T.lime:T.coral }}>{metrics.attention?'Focused':'Away'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.45)' }}>Posture</span>
                <span style={{ fontSize:'.68rem', fontWeight:700, padding:'.2rem .5rem', borderRadius:6, background:metrics.posture==='Upright'?`${T.blue}18`:`${T.gold}18`, color:metrics.posture==='Upright'?T.blue:T.gold }}>{metrics.posture}</span>
              </div>
            </div>

            {['Stressed','Anxious','Down'].includes(metrics.mood) && (
              <div style={{ marginTop:'.8rem', fontSize:'.66rem', color:T.gold, background:`${T.gold}12`, border:`1px solid ${T.gold}25`, borderRadius:8, padding:'.5rem', lineHeight:1.5 }}>
                ⚡ Adjusting tone to be softer and more supportive.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom controls ── */}
      <div style={{ height:88, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', padding:'0 1.5rem', zIndex:30 }}>

        {/* Mic toggle — MAIN FEATURE */}
        <motion.button onClick={toggleMic} whileHover={{ scale:1.08 }} whileTap={{ scale:.92 }}
          style={{ width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', transition:'all .25s',
            background: micMuted?`${T.coral}25`:`rgba(122,219,120,0.15)`,
            boxShadow: micMuted?`0 0 20px ${T.coral}40`:`0 0 20px ${T.lime}30`,
            border: micMuted?`1px solid ${T.coral}50`:`1px solid ${T.lime}40`,
          }} title={micMuted?'Unmute mic':'Mute mic'}>
          {micMuted ? '🎙️✕' : isListening ? <MicWave/> : '🎙️'}
        </motion.button>

        {/* Camera toggle */}
        <motion.button onClick={toggleVideo} whileHover={{ scale:1.08 }} whileTap={{ scale:.92 }}
          style={{ width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', transition:'all .25s',
            background: videoMuted?`${T.coral}20`:'rgba(255,255,255,0.08)',
            border: videoMuted?`1px solid ${T.coral}40`:'1px solid rgba(255,255,255,0.12)',
          }} title={videoMuted?'Enable camera':'Disable camera'}>
          {videoMuted ? '📷✕' : '📷'}
        </motion.button>

        {/* Manual speak button — hold to speak */}
        {!micMuted && (
          <motion.button
            onMouseDown={()=>{ if(recognitionRef.current && !isAiSpeaking) try{recognitionRef.current.start()}catch(e){} }}
            onMouseUp={()=>{ /* let speech recognition decide */ }}
            whileHover={{ scale:1.05 }} whileTap={{ scale:.93 }}
            style={{ padding:'.7rem 1.5rem', borderRadius:14, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'.85rem', transition:'all .2s',
              background: isListening?`linear-gradient(135deg,${T.lime},#4bc24b)`:`linear-gradient(135deg,${T.purple},${T.blue})`,
              color: isListening?'#0D0C1D':'#fff',
              boxShadow: isListening?`0 0 28px ${T.lime}50`:`0 0 20px rgba(172,106,255,0.3)`,
            }}>
            {isListening ? '🎙️ Listening...' : '🎙️ Tap to Speak'}
          </motion.button>
        )}

        {/* End call */}
        <motion.button onClick={handleEndCall} whileHover={{ scale:1.1 }} whileTap={{ scale:.92 }}
          style={{ width:56, height:56, borderRadius:'50%', border:'none', background:`${T.coral}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', boxShadow:`0 0 28px ${T.coral}60` }}
          title="End call">
          📵
        </motion.button>
      </div>
    </div>
  );
};

export default AIVideoCall;
