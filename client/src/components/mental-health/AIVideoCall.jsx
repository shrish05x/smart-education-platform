import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import api from '../../services/api';

/* ─── Color palette ─── */
const C = {
  purple:'#AC6AFF', cyan:'#22D3EE', gold:'#FFC876', lime:'#4ADE80',
  coral:'#FF776F', pink:'#FF98E2', blue:'#858DFF', teal:'#5EEAD4',
  bg:'#080714', panel:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)',
};

/* ─── Helpers ─── */
const clamp = (v,mn,mx) => Math.min(mx,Math.max(mn,v));

/* Calculate confidence 0-100 from face expression map */
const calcConfidence = (expr) => {
  if (!expr) return null;
  // happy + neutral + surprised contribute positively; fearful/sad negatively
  const pos = (expr.happy||0)*1.2 + (expr.neutral||0)*0.8 + (expr.surprised||0)*0.5;
  const neg = (expr.fearful||0)*1.5 + (expr.sad||0)*1.2 + (expr.disgusted||0)*1.0 + (expr.angry||0)*0.8;
  return clamp(Math.round((pos / (pos + neg + 0.001)) * 100), 10, 99);
};

/* Mood label from expressions */
const calcMood = (expr) => {
  if (!expr) return 'Neutral';
  const dominant = Object.entries(expr).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const MAP = { happy:'Happy', neutral:'Neutral', sad:'Sad', surprised:'Surprised', fearful:'Anxious', disgusted:'Distracted', angry:'Frustrated' };
  return MAP[dominant] || 'Neutral';
};

/* Mood color */
const moodColor = (mood) => ({ Happy:C.lime, Neutral:C.blue, Sad:C.coral, Anxious:C.gold, Surprised:C.purple, Distracted:C.coral, Frustrated:C.coral }[mood] || C.blue);

/* Waveform bar group */
const WaveGroup = ({ active, color, height = 24, count = 9 }) => (
  <div style={{ display:'flex', alignItems:'center', gap:2 }}>
    {Array.from({length:count},(_,i)=>{
      const h = [.5,.9,.3,.7,.4,.8,.6,1,.5][i%9];
      return (
        <motion.div key={i}
          animate={active ? { scaleY:[h,.2,h] } : { scaleY:.3 }}
          transition={{ duration:.6+i*.07, repeat:Infinity, delay:i*.05 }}
          style={{ width:3, height:height*h, borderRadius:3, background:color, transformOrigin:'center', flexShrink:0 }}/>
      );
    })}
  </div>
);

/* Single live-analysis metric row */
const MetricRow = ({ icon, label, value, type, color, animated }) => {
  const isBar = type === 'bar';
  const isPill = type === 'pill';
  const isTag = type === 'tag';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.7rem', minHeight:28 }}>
      <span style={{ fontSize:'.95rem', flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isBar?'.3rem':0 }}>
          <span style={{ fontSize:'.72rem', fontWeight:600, color:'rgba(255,255,255,0.5)' }}>{label}</span>
          {isPill && <span style={{ padding:'.15rem .65rem', borderRadius:999, background:`${color}22`, border:`1px solid ${color}50`, color, fontSize:'.7rem', fontWeight:700 }}>{value}</span>}
          {isTag && <span style={{ padding:'.15rem .7rem', borderRadius:8, background:`${color}20`, border:`1px solid ${color}45`, color, fontSize:'.7rem', fontWeight:700, display:'flex', alignItems:'center', gap:'.3rem' }}>{value}</span>}
          {isBar && <span style={{ fontSize:'.72rem', fontWeight:800, color }}>{value}</span>}
        </div>
        {isBar && (
          <div style={{ height:6, borderRadius:999, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:value }}
              transition={{ duration:.9, ease:'easeOut' }}
              style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}bb)`, boxShadow:`0 0 8px ${color}55` }}/>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────── MAIN COMPONENT ─────────────────────────────────── */
const AIVideoCall = () => {
  /* ── State ── */
  const [callStatus, setCallStatus] = useState('idle');   // idle | active | ended
  const [callDuration, setCallDuration] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Initializing AI systems...');

  /* Live analysis */
  const [confidence, setConfidence] = useState(null);     // null until first detection
  const [mood, setMood]             = useState('Neutral');
  const [engagement, setEngagement] = useState(100);
  const [eyeContact, setEyeContact] = useState(true);
  const [posture, setPosture]       = useState('Good');
  const [faceDetected, setFaceDetected] = useState(false);

  /* Chat / voice */
  const [messages, setMessages]     = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micMuted, setMicMuted]     = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [chatInput, setChatInput]   = useState('');

  /* Refs */
  const videoRef       = useRef(null);
  const canvasRef      = useRef(null);
  const streamRef      = useRef(null);
  const analysisRef    = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);
  const engagementRef  = useRef(100);
  const lastFaceRef    = useRef(Date.now());

  /* ── Load face-api models ── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMsg('Loading face analysis models...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        setLoadingMsg('Models ready ✓');
      } catch {
        setLoadingMsg('Starting without face models...');
      }
      setModelsLoaded(true);
    };
    load();
  }, []);

  /* ── Start call ── */
  const startCall = useCallback(async () => {
    setCallStatus('active');
    setMessages([{ role:'ai', text:`Hello! I'm Priya, your AI study guide. I'm analyzing your confidence and engagement in real-time. What would you like to work on today?` }]);

    // Start webcam
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }

      // Start face analysis loop
      analysisRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const det = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceExpressions();

          if (det) {
            lastFaceRef.current = Date.now();
            setFaceDetected(true);

            const expr = det.expressions;
            const newConf = calcConfidence(expr);
            setConfidence(newConf);
            setMood(calcMood(expr));

            // Eye contact: rough proxy — face must be mostly centered
            const box = det.detection.box;
            const cx = box.x + box.width/2;
            const vw = videoRef.current.videoWidth || 640;
            setEyeContact(Math.abs(cx - vw/2) < vw*0.22);

            // Posture: use landmark vertical spread vs box height ratio
            const lms = det.landmarks.positions;
            const yMin = Math.min(...lms.map(p=>p.y));
            const yMax = Math.max(...lms.map(p=>p.y));
            const spread = (yMax - yMin) / (box.height || 1);
            setPosture(spread > 0.7 ? 'Good' : 'Hunched');

            // Engagement: decays if face lost, grows back when present
            engagementRef.current = clamp(engagementRef.current + 1, 0, 100);
            setEngagement(Math.round(engagementRef.current));
          } else {
            setFaceDetected(false);
            const secsSinceFace = (Date.now() - lastFaceRef.current) / 1000;
            if (secsSinceFace > 3) {
              engagementRef.current = clamp(engagementRef.current - 2, 20, 100);
              setEngagement(Math.round(engagementRef.current));
              setEyeContact(false);
            }
          }
        } catch { /* face-api errors are non-fatal */ }
      }, 1500);
    } catch (err) {
      console.warn('Webcam unavailable:', err);
    }

    // Start timer
    timerRef.current = setInterval(() => setCallDuration(d => d+1), 1000);

    // Speak greeting
    speakText(`Hello! I'm Priya, your AI study guide. I'm analyzing your confidence and engagement in real time. What would you like to work on today?`);

    // Start mic listening
    startListening();
  }, []);

  /* ── End call ── */
  const endCall = useCallback(() => {
    setCallStatus('ended');
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(analysisRef.current);
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
  }, []);

  /* ── Duration formatter ── */
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  /* ── Speech-to-text ── */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || micMuted) return;
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) { final += e.results[i][0].transcript; }
        else { interim += e.results[i][0].transcript; }
      }
      setTranscript(interim || final);
      if (final.trim()) handleUserMessage(final.trim());
    };
    rec.onend = () => { if (callStatus === 'active' && !micMuted) rec.start(); };
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  }, [micMuted, callStatus]);

  /* ── Send user message to AI ── */
  const handleUserMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role:'user', text }]);
    setTranscript('');
    setIsAiThinking(true);
    setChatInput('');
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role==='ai'?'model':'user', parts:[{ text:m.text }] }));
      const systemPrompt = `You are Priya, a warm and knowledgeable AI study guide. Keep responses concise (2-4 sentences). Be encouraging, educational, and supportive. The student's current confidence level is ${confidence ?? 'unknown'}%, mood is ${mood}.`;
      const res = await api.post('/ai/chat', { message: systemPrompt + '\n\nStudent: ' + text, history });
      const reply = res.data.response || "That's a great question! Let's explore this together.";
      setMessages(prev => [...prev, { role:'ai', text:reply }]);
      speakText(reply);
    } catch {
      const fallback = "I'm here! Could you repeat that? Let's dive into your studies together.";
      setMessages(prev => [...prev, { role:'ai', text:fallback }]);
      speakText(fallback);
    } finally { setIsAiThinking(false); }
  }, [messages, confidence, mood]);

  /* ── Text-to-speech ── */
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v => /female|woman|zira|samantha|victoria|aria/i.test(v.name)) || voices.find(v => v.lang === 'en-IN') || voices[0];
    if (femaleVoice) utt.voice = femaleVoice;
    utt.rate = 0.95; utt.pitch = 1.1;
    utt.onstart = () => setIsAiSpeaking(true);
    utt.onend   = () => setIsAiSpeaking(false);
    synth.speak(utt);
  };

  const toggleMic = () => {
    setMicMuted(m => !m);
    if (micMuted) startListening(); else recognitionRef.current?.stop();
  };

  const toggleVideo = () => {
    setVideoMuted(v => {
      const newVal = !v;
      streamRef.current?.getVideoTracks().forEach(t => t.enabled = !newVal);
      return newVal;
    });
  };

  /* cleanup */
  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t=>t.stop());
    clearInterval(analysisRef.current);
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
  }, []);

  /* ─── STYLE CONSTANTS ─── */
  const panelSt = { background:C.panel, border:`1px solid ${C.border}`, backdropFilter:'blur(24px)', borderRadius:20 };

  /* ════════════════════════ IDLE SCREEN ════════════════════════ */
  if (callStatus === 'idle') return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Sora',sans-serif" }}>
      <motion.div initial={{ opacity:0, y:28, scale:.96 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.7 }}
        style={{ width:'100%', maxWidth:480, ...panelSt, padding:'2.8rem 2.5rem', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:`linear-gradient(90deg,transparent,${C.purple},${C.cyan},transparent)` }}/>

        {/* AI Avatar */}
        <div style={{ position:'relative', width:140, height:140, margin:'0 auto 1.5rem' }}>
          {[1.4,1.2,1].map((s,i) => (
            <motion.div key={i} animate={{ scale:[s,s+.06,s], opacity:[.15,.05,.15] }} transition={{ duration:2.5, repeat:Infinity, delay:i*.5 }}
              style={{ position:'absolute', inset:0, borderRadius:'50%', border:`1px solid ${C.purple}`, margin:`${i*-10}px` }}/>
          ))}
          {/* Holographic circle */}
          <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:`conic-gradient(from 0deg,${C.purple}44,${C.cyan}33,${C.purple}44,${C.teal}22,${C.purple}44)`, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.purple}60`, boxShadow:`0 0 40px ${C.purple}35, inset 0 0 30px ${C.cyan}15` }}>
            <span style={{ fontSize:'4rem' }}>👩‍💻</span>
          </div>
          {/* Live ring */}
          <motion.div animate={{ rotate:360 }} transition={{ duration:6, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', inset:-6, borderRadius:'50%', border:`2px dashed ${C.cyan}40` }}/>
        </div>

        <h2 style={{ fontSize:'1.7rem', fontWeight:900, letterSpacing:'-.03em', marginBottom:'.5rem' }}>
          <span style={{ background:`linear-gradient(135deg,${C.purple},${C.cyan})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Priya</span>
          {' '}<span style={{ color:'rgba(255,255,255,0.7)' }}>— AI Study Guide</span>
        </h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.9rem', lineHeight:1.7, marginBottom:'2rem' }}>
          Your real-time AI tutor with live confidence analysis. Priya watches your engagement, mood, and posture as you learn — to help you be at your best.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.8rem', marginBottom:'2rem' }}>
          {[['🧠','Mood Detection','Real-time'],['📊','Confidence','Live scoring'],['👁️','Eye Contact','Cam analysis'],['🎙️','Voice Chat','Natural speech']].map(([e,t,s])=>(
            <div key={t} style={{ padding:'.85rem', borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
              <div style={{ fontSize:'1.3rem', marginBottom:'.25rem' }}>{e}</div>
              <div style={{ fontWeight:700, fontSize:'.78rem', marginBottom:'.1rem' }}>{t}</div>
              <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.35)' }}>{s}</div>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
          disabled={!modelsLoaded}
          onClick={startCall}
          style={{ width:'100%', padding:'1.1rem', borderRadius:16, border:'none', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:'#0D0C1D', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 36px ${C.purple}35`, opacity:modelsLoaded?1:.7 }}>
          {modelsLoaded ? '🚀 Start Session with Priya' : loadingMsg}
        </motion.button>
      </motion.div>
    </div>
  );

  /* ════════════════════════ ENDED SCREEN ════════════════════════ */
  if (callStatus === 'ended') return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Sora',sans-serif" }}>
      <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
        style={{ maxWidth:420, width:'100%', ...panelSt, padding:'2.5rem', textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎓</div>
        <h2 style={{ fontWeight:900, fontSize:'1.5rem', color:C.purple, marginBottom:'.5rem' }}>Great Session!</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'1.5rem' }}>Duration: {fmt(callDuration)}</p>
        {confidence && (
          <div style={{ padding:'1rem', borderRadius:16, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)', marginBottom:'.3rem' }}>Avg Confidence Score</div>
            <div style={{ fontSize:'2.5rem', fontWeight:900, color:C.purple }}>{confidence}%</div>
          </div>
        )}
        <button onClick={() => { setCallStatus('idle'); setMessages([]); setCallDuration(0); setConfidence(null); }}
          style={{ width:'100%', padding:'1rem', borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:'#0D0C1D', fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
          Start New Session
        </button>
      </motion.div>
    </div>
  );

  /* ════════════════════════ ACTIVE CALL ════════════════════════ */
  const confVal = confidence ?? 72;
  const eyeLabel = eyeContact ? 'Focused' : 'Distracted';
  const eyeColor = eyeContact ? C.lime : C.coral;
  const postureColor = posture === 'Good' ? C.gold : C.coral;

  return (
    <div style={{ height:'calc(100vh - 80px)', display:'flex', flexDirection:'column', background:'#080714', fontFamily:"'Sora',sans-serif", overflow:'hidden', position:'relative' }}>
      {/* Background glow orbs */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,${C.purple}15 0%,transparent 70%)`, filter:'blur(80px)', top:-100, left:'30%', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,${C.cyan}10 0%,transparent 70%)`, filter:'blur(80px)', bottom:0, right:'10%', pointerEvents:'none', zIndex:0 }}/>

      {/* ── TOP BAR ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.85rem 1.5rem', borderBottom:`1px solid ${C.border}`, background:'rgba(8,7,20,0.9)', backdropFilter:'blur(20px)', zIndex:10, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
          <motion.div animate={{ opacity:[1,.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
            style={{ width:8, height:8, borderRadius:'50%', background:C.lime, flexShrink:0 }}/>
          <span style={{ fontWeight:700, fontSize:'.9rem', color:C.cyan }}>LIVE SESSION</span>
          <span style={{ fontSize:'.8rem', color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>{fmt(callDuration)}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:.6 }}>
          <span style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.35)' }}>Priya — AI Study Guide</span>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
          onClick={endCall}
          style={{ padding:'.4rem 1.1rem', borderRadius:999, border:'none', background:`${C.coral}22`, color:C.coral, fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", border:`1px solid ${C.coral}45` }}>
          End Session
        </motion.button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.2rem', padding:'1.2rem 1.5rem', overflow:'hidden', zIndex:1 }}>

        {/* LEFT: AI Avatar + Chat */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem', overflow:'hidden' }}>

          {/* AI Avatar area */}
          <div style={{ flex:'0 0 auto', ...panelSt, padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.5rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 30% 50%,${C.purple}12 0%,transparent 60%)`, pointerEvents:'none' }}/>

            {/* Holographic avatar */}
            <div style={{ position:'relative', flexShrink:0 }}>
              {/* Spinning rings */}
              <motion.div animate={{ rotate:360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:-10, borderRadius:'50%', border:`1px dashed ${C.cyan}30` }}/>
              <motion.div animate={{ rotate:-360 }} transition={{ duration:7, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:-18, borderRadius:'50%', border:`1px dashed ${C.purple}25` }}/>

              <div style={{ width:120, height:120, borderRadius:'50%', background:`conic-gradient(from 0deg,${C.purple}60,${C.cyan}44,${C.purple}60,${C.teal}30,${C.purple}60)`, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.purple}70`, boxShadow:`0 0 50px ${C.purple}40, inset 0 0 25px ${C.cyan}15, 0 0 0 1px ${C.cyan}20` }}>
                <span style={{ fontSize:'3.5rem' }}>👩‍💻</span>
              </div>

              {/* Speaking glow */}
              <AnimatePresence>
                {isAiSpeaking && (
                  <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                    style={{ position:'absolute', inset:-6, borderRadius:'50%', border:`2px solid ${C.cyan}`, boxShadow:`0 0 20px ${C.cyan}50` }}/>
                )}
              </AnimatePresence>
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.65rem', marginBottom:'.4rem' }}>
                <div style={{ fontWeight:800, fontSize:'1.1rem' }}>Priya</div>
                <span style={{ padding:'.2rem .65rem', borderRadius:999, background:`${C.cyan}18`, border:`1px solid ${C.cyan}40`, color:C.cyan, fontSize:'.68rem', fontWeight:700 }}>AI Study Guide</span>
                {isAiSpeaking && <WaveGroup active color={C.cyan} height={20} count={7}/>}
              </div>
              <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.45)', lineHeight:1.6, margin:0 }}>
                {isAiThinking ? '💭 Thinking...' : isAiSpeaking ? '🔊 Speaking...' : messages[messages.length-1]?.role==='ai' ? messages[messages.length-1].text.slice(0,120)+'...' : 'Ready to help you learn!'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, ...panelSt, padding:'1rem 1.2rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'.7rem' }}>
            {messages.map((m,i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'80%', padding:'.65rem .95rem', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?`${C.purple}22`:'rgba(255,255,255,0.05)', border:`1px solid ${m.role==='user'?C.purple+'40':'rgba(255,255,255,0.08)'}`, fontSize:'.85rem', color:'rgba(255,255,255,0.82)', lineHeight:1.65 }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div style={{ display:'flex' }}>
                <div style={{ padding:'.65rem .95rem', borderRadius:'16px 16px 16px 4px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <WaveGroup active color={C.purple} height={14} count={5}/>
                </div>
              </div>
            )}
          </div>

          {/* Input bar + user cam */}
          <div style={{ flexShrink:0, display:'flex', gap:'.8rem', alignItems:'flex-end' }}>
            <div style={{ flex:1, ...panelSt, borderRadius:16, display:'flex', alignItems:'center', gap:'.75rem', padding:'.75rem 1rem', position:'relative' }}>
              {/* Listening indicator */}
              {isListening && !micMuted && (
                <motion.div animate={{ opacity:[1,.3,1] }} transition={{ duration:1, repeat:Infinity }}
                  style={{ width:8, height:8, borderRadius:'50%', background:C.lime, flexShrink:0 }}/>
              )}
              <input value={transcript || chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && chatInput && handleUserMessage(chatInput)}
                placeholder={isListening && !micMuted ? "Listening... or type here" : "Type your question..."}
                style={{ flex:1, background:'none', border:'none', color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif", minWidth:0 }}/>
              {(transcript||chatInput) && (
                <button onClick={() => handleUserMessage(chatInput||transcript)}
                  style={{ padding:'.4rem .9rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:'#0D0C1D', fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", flexShrink:0 }}>→</button>
              )}
            </div>

            {/* User cam selfie */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:72, height:72, borderRadius:999, overflow:'hidden', border:`2px solid ${C.purple}60`, background:'rgba(255,255,255,0.05)', boxShadow:`0 0 20px ${C.purple}30` }}>
                {!videoMuted ? (
                  <video ref={videoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)' }}/>
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem' }}>😊</div>
                )}
              </div>
              {faceDetected && (
                <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:2, repeat:Infinity }}
                  style={{ position:'absolute', inset:-3, borderRadius:999, border:`1px solid ${C.lime}60`, pointerEvents:'none' }}/>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Live Analysis ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem', overflow:'hidden' }}>

          {/* LIVE ANALYSIS header */}
          <div style={{ ...panelSt, padding:'1.2rem 1.3rem', border:`1px solid ${C.cyan}25` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem' }}>
              <div>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:C.cyan, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.1rem' }}>⚡ LIVE ANALYSIS</div>
                <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,0.3)' }}>Updating every 1.5s</div>
              </div>
              <motion.div animate={{ opacity:[1,.4,1] }} transition={{ duration:1.2, repeat:Infinity }}
                style={{ width:8, height:8, borderRadius:'50%', background:C.lime }}/>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'.95rem' }}>
              {/* 1. Mood */}
              <MetricRow icon="🧠" label="Mood" type="pill" value={mood} color={moodColor(mood)}/>

              {/* 2. Engagement */}
              <MetricRow icon="⚡" label="Engagement" type="bar" value={`${engagement}%`} color={C.lime}/>

              {/* 3. Eye Contact */}
              <MetricRow icon="👁️" label="Eye Contact" type="tag" value={eyeLabel} color={eyeColor}/>

              {/* 4. Posture */}
              <MetricRow icon="🧍" label="Posture" type="tag" value={posture} color={postureColor}/>

              {/* 5. Confidence — real-time from cam */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'.7rem', marginBottom:'.45rem' }}>
                  <span style={{ fontSize:'.95rem' }}>✨</span>
                  <span style={{ fontSize:'.72rem', fontWeight:600, color:'rgba(255,255,255,0.5)', flex:1 }}>Confidence</span>
                  <span style={{ fontSize:'.82rem', fontWeight:900, color:C.purple }}>{confVal}%</span>
                  {confidence === null && <span style={{ fontSize:'.62rem', color:'rgba(255,255,255,0.28)' }}>estimating...</span>}
                </div>
                <div style={{ height:8, borderRadius:999, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <motion.div
                    animate={{ width:`${confVal}%` }}
                    transition={{ duration:.8, ease:'easeOut' }}
                    style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${C.purple},${C.pink})`, boxShadow:`0 0 10px ${C.purple}60`, position:'relative', overflow:'hidden' }}>
                    {/* Shimmer */}
                    <motion.div animate={{ x:['-100%','200%'] }} transition={{ duration:2, repeat:Infinity, delay:1 }}
                      style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', width:'50%' }}/>
                  </motion.div>
                </div>
                {confidence !== null && (
                  <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,0.3)', marginTop:'.25rem' }}>
                    {confVal >= 80 ? '🔥 Excellent confidence!' : confVal >= 60 ? '😊 Good confidence' : confVal >= 40 ? '💪 Keep going!' : '🌱 Building up...'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confidence tip card */}
          <AnimatePresence mode="wait">
            <motion.div key={confVal > 70 ? 'high' : 'low'} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ ...panelSt, padding:'1rem 1.1rem', border:`1px solid ${confVal>70?C.purple:C.gold}25` }}>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:confVal>70?C.purple:C.gold, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.4rem' }}>
                {confVal>70 ? '✨ Confidence Tip' : '💡 Boost Your Confidence'}
              </div>
              <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, margin:0 }}>
                {confVal >= 80 ? `Amazing energy, ${confVal}%! Your posture and expression show you're fully engaged. Keep this momentum!`
                  : confVal >= 60 ? `You're doing well! Sit up straight and maintain eye contact to push your confidence even higher.`
                  : `Take a deep breath. Start with what you know best — confidence builds as you engage more deeply.`}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div style={{ ...panelSt, padding:'.9rem 1rem', display:'flex', gap:'.65rem', justifyContent:'center', flexWrap:'wrap' }}>
            {/* Mic */}
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
              onClick={toggleMic}
              style={{ width:48, height:48, borderRadius:999, border:`1px solid ${micMuted?C.coral:C.lime}50`, background:`${micMuted?C.coral:C.lime}15`, color:micMuted?C.coral:C.lime, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
              {micMuted ? '🔇' : '🎙️'}
            </motion.button>
            {/* Camera */}
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
              onClick={toggleVideo}
              style={{ width:48, height:48, borderRadius:999, border:`1px solid ${videoMuted?C.coral:C.cyan}50`, background:`${videoMuted?C.coral:C.cyan}15`, color:videoMuted?C.coral:C.cyan, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
              {videoMuted ? '📵' : '📷'}
            </motion.button>
            {/* Speaker */}
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
              onClick={() => window.speechSynthesis.cancel()}
              style={{ width:48, height:48, borderRadius:999, border:`1px solid ${C.purple}50`, background:`${C.purple}15`, color:C.purple, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
              🔈
            </motion.button>
            {/* End call */}
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
              onClick={endCall}
              style={{ width:48, height:48, borderRadius:999, border:`1px solid ${C.coral}60`, background:`${C.coral}22`, color:C.coral, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
              📵
            </motion.button>
          </div>

          {/* Hidden canvas for face-api */}
          <canvas ref={canvasRef} style={{ display:'none' }}/>
        </div>
      </div>
    </div>
  );
};

export default AIVideoCall;
