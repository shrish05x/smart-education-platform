import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };
const PASS_SCORE = 70; // % required to get verified

/* ─── helpers ─── */
const ROLE_CFG = {
  mentor:    { color:T.gold,   icon:'👨‍🏫', name:'Mentor',    expertiseLabel:'Teaching / Mentoring Expertise', expertisePlaceholder:'e.g. Data Structures, System Design, Machine Learning, Web Development, Interview Prep...' },
  counselor: { color:T.pink,   icon:'🧠',  name:'Counsellor', expertiseLabel:'Counselling Specialisation',       expertisePlaceholder:'e.g. Anxiety, Academic Stress, Grief Counselling, CBT, Student Well-being...' },
};

/* ─── Step indicator ─── */
const Step = ({ n, label, active, done, color }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', opacity: done||active?1:.35 }}>
    <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'.8rem', flexShrink:0, background: done?color:active?`${color}30`:'rgba(255,255,255,0.07)', border:`2px solid ${done||active?color:'rgba(255,255,255,0.15)'}`, color: done?'#0D0C1D':color }}>
      {done?'✓':n}
    </div>
    <span style={{ fontSize:'.75rem', fontWeight:600, color: active?'#fff':'rgba(255,255,255,0.45)', whiteSpace:'nowrap' }}>{label}</span>
  </div>
);

/* ─── Main Component ─── */
const VerificationQuiz = () => {
  const { user, updateVerification } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'mentor';
  const cfg  = ROLE_CFG[role] || ROLE_CFG.mentor;

  // ── Phase state ──
  const [phase, setPhase]         = useState('intro');      // intro | quiz | result
  const [expertise, setExpertise] = useState(user?.expertise||'');
  const [questions, setQuestions] = useState([]);           // [{q, options:[A,B,C,D], correct, explanation}]
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);         // answer chosen
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers]     = useState([]);           // {correct:bool}[]
  const [score, setScore]         = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]         = useState('');
  const textareaRef = useRef(null);

  const needs = ['mentor','counselor'];
  if (!needs.includes(role)) { navigate('/dashboard',{replace:true}); return null; }

  /* ── Robust JSON cleaner for AI output ── */
  const cleanAndParseJSON = (raw) => {
    // 1. Strip markdown code fences  ```json ... ```
    let text = raw.replace(/```(?:json)?[\r\n]*([\sS]*?)```/gi, '$1').trim();

    // 2. Extract the outermost { ... } block
    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object found in response.');
    text = text.slice(start, end + 1);

    // 3. Remove trailing commas before ] or } — common AI mistake
    text = text.replace(/,\s*([\]}])/g, '$1');

    // 4. Fix literal newlines/tabs inside string values (walk char-by-char)
    let inString = false, escaped = false, result = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escaped)        { result += ch; escaped = false; continue; }
      if (ch === '\\')    { escaped = true; result += ch; continue; }
      if (ch === '"')     { inString = !inString; result += ch; continue; }
      if (inString && ch === '\n') { result += '\\n'; continue; }
      if (inString && ch === '\r') { result += '\\r'; continue; }
      if (inString && ch === '\t') { result += '\\t'; continue; }
      result += ch;
    }
    return JSON.parse(result);
  };

  /* ── Fallback question bank (used when AI fails to return valid JSON) ── */
  const FALLBACK_QUESTIONS = {
    default: [
      { q:'What is the most important quality of an effective professional in your field?', options:['A. Technical skills only','B. Empathy and communication combined with expertise','C. Following rules strictly','D. Speed of delivery'], correct:1, explanation:'Both soft and hard skills are essential for professional effectiveness.' },
      { q:'How do you handle a situation where your approach is not working for the person you are helping?', options:['A. Continue the same approach','B. Blame the person','C. Reassess and adapt your strategy','D. Refer immediately without trying'], correct:2, explanation:'Adapting to individual needs is a core professional competency.' },
      { q:'What is evidence-based practice?', options:['A. Using only personal experience','B. Integrating research evidence with professional expertise and individual context','C. Following what is most popular','D. Doing what colleagues suggest'], correct:1, explanation:'Evidence-based practice combines research, expertise, and individual needs.' },
      { q:'How should you maintain professional boundaries?', options:['A. Be friendly with no limits','B. Avoid all personal connection','C. Maintain clear professional limits while being warm and supportive','D. Boundaries are not important'], correct:2, explanation:'Professional boundaries protect both parties and ensure ethical practice.' },
      { q:'What is the first step when meeting someone new in your professional capacity?', options:['A. Immediately give advice','B. Build rapport and understand their specific context and needs','C. Start with assessments','D. Set strict rules'], correct:1, explanation:'Understanding context before advising ensures relevant and effective help.' },
      { q:'How do you ensure ethical practice in your work?', options:['A. Follow only what feels right','B. Adhere to professional codes of ethics and seek supervision','C. Do what the person asks regardless','D. Only follow laws'], correct:1, explanation:'Professional ethics codes and supervision ensure accountable practice.' },
      { q:'What is active listening?', options:['A. Waiting for your turn to speak','B. Fully concentrating, understanding, and responding thoughtfully to what is said','C. Listening while multitasking','D. Only hearing keywords'], correct:1, explanation:'Active listening involves full attention and thoughtful response.' },
      { q:'When should you seek supervision or consultation?', options:['A. Never handle everything independently','B. Only in emergencies','C. Regularly and when facing complex or challenging situations','D. Only when failing'], correct:2, explanation:'Regular supervision improves practice quality and professional growth.' },
      { q:'What is the importance of continuing professional development?', options:['A. It is optional','B. It keeps skills current and improves service quality','C. It is only for beginners','D. It is required only by employers'], correct:1, explanation:'Ongoing learning ensures practitioners remain effective and current.' },
      { q:'How do you handle confidentiality?', options:['A. Share information freely','B. Maintain strict confidentiality with clear exceptions for safety','C. Only keep medical information private','D. Share with colleagues freely'], correct:1, explanation:'Confidentiality builds trust; exceptions exist for serious safety concerns.' },
      { q:'What does a strengths-based approach mean?', options:['A. Ignoring problems','B. Focusing only on positives','C. Identifying and building on existing strengths to address challenges','D. Avoiding difficult conversations'], correct:2, explanation:'Strength-based approaches empower through existing capabilities.' },
      { q:'How do you set measurable goals with someone you are helping?', options:['A. Set goals for them','B. Collaboratively define specific, measurable, achievable, relevant, time-bound goals','C. Keep goals vague for flexibility','D. Goals are not necessary'], correct:1, explanation:'SMART goals provide clear direction and allow progress measurement.' },
      { q:'What is the significance of cultural competence?', options:['A. Only relevant in diverse settings','B. Understanding and respecting cultural differences to provide appropriate support','C. Treating everyone exactly the same','D. Knowing only your own culture'], correct:1, explanation:'Cultural competence ensures relevant and respectful practice for all backgrounds.' },
      { q:'How often should you review and update your approach with someone?', options:['A. Never once set','B. Regularly, based on progress and changing needs','C. Only at the end','D. Once per year'], correct:1, explanation:'Regular review ensures the approach remains effective and relevant.' },
      { q:'What is the difference between sympathy and empathy?', options:['A. They are the same','B. Sympathy feels sorry for someone; empathy understands their perspective from within','C. Empathy is less effective','D. Sympathy is more professional'], correct:1, explanation:'Empathy creates deeper connection and support than sympathy.' },
      { q:'How do you handle disagreement with a person you are helping?', options:['A. Assert your position forcefully','B. Dismiss their view','C. Acknowledge their perspective and explore differences respectfully','D. Immediately refer them elsewhere'], correct:2, explanation:'Respectful exploration of disagreement helps maintain trust and find solutions.' },
      { q:'What is the role of feedback in professional practice?', options:['A. Feedback is negative criticism','B. Feedback helps identify blind spots and improve quality of practice','C. Feedback should be avoided','D. Only positive feedback matters'], correct:1, explanation:'Constructive feedback is essential for professional growth and quality.' },
      { q:'How do you manage your own wellbeing to prevent burnout?', options:['A. Work longer hours to catch up','B. Ignore personal needs while working','C. Practice self-care, set boundaries, and seek support when needed','D. Burnout is unavoidable'], correct:2, explanation:'Practitioner wellbeing directly impacts the quality of care provided.' },
      { q:'What is the importance of documentation in your professional role?', options:['A. Documentation is just bureaucracy','B. It ensures accountability, continuity, and legal protection','C. Only needed for serious cases','D. Documentation is the manager job'], correct:1, explanation:'Proper documentation supports quality, accountability, and continuity of care.' },
      { q:'How do you approach a situation where progress seems to have stalled?', options:['A. Blame the person for lack of effort','B. Continue unchanged','C. Review goals, reassess barriers, and collaboratively adjust the approach','D. Immediately close the case'], correct:2, explanation:'Stalled progress requires reflective review and collaborative adjustment.' },
    ]
  };

  const getFallbackQuestions = () => {
    const bank = FALLBACK_QUESTIONS.default;
    return [...bank].sort(() => Math.random() - 0.5).slice(0, 20);
  };

  /* ── Generate 20 MCQ questions from AI, with fallback ── */
  const generateQuestions = async () => {
    if (!expertise.trim()) { setError('Please describe your area of expertise first.'); return; }
    setError('');
    setIsGenerating(true);

    let questions = null;

    // Strategy 1 — strict single-line JSON prompt
    try {
      const p1 = `Generate 20 MCQ questions for a ${cfg.name} expertise test on "${expertise}". ` +
        `Return ONLY raw JSON (no markdown, no text): ` +
        `{"questions":[{"q":"Question?","options":["A. a","B. b","C. c","D. d"],"correct":0,"explanation":"reason"}]}`;
      const res = await api.post('/ai/chat', { message: p1, history: [] });
      const raw = (res.data.response || '').trim();
      console.log('[Quiz] AI response preview:', raw.slice(0, 200));
      const parsed = cleanAndParseJSON(raw);
      if (parsed?.questions?.length >= 5) questions = parsed.questions.slice(0, 20);
    } catch (e1) { console.warn('[Quiz] Strategy 1 failed:', e1.message); }

    // Strategy 2 — retry with different wording
    if (!questions) {
      try {
        const p2 = `Output JSON only (no prose). 20 quiz questions on ${expertise} for verifying a ${cfg.name}. ` +
          `Schema: {"questions":[{"q":"Q","options":["A. x","B. x","C. x","D. x"],"correct":0,"explanation":"E"}]}`;
        const res = await api.post('/ai/chat', { message: p2, history: [] });
        const raw = (res.data.response || '').trim();
        const parsed = cleanAndParseJSON(raw);
        if (parsed?.questions?.length >= 5) questions = parsed.questions.slice(0, 20);
      } catch (e2) { console.warn('[Quiz] Strategy 2 failed:', e2.message); }
    }

    // Strategy 3 — built-in fallback bank (always works)
    if (!questions) {
      console.warn('[Quiz] Using built-in fallback question bank.');
      questions = getFallbackQuestions();
    }

    setQuestions(questions);
    setPhase('quiz');
    setIsGenerating(false);
  };

  /* ── Confirm answer ── */
  const confirmAnswer = () => {
    if (selected === null) return;
    const isCorrect = selected === questions[current].correct;
    setAnswers(prev => [...prev, { correct:isCorrect, selected, question:questions[current] }]);
    setConfirmed(true);
  };

  /* ── Next question / finish ── */
  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c+1);
      setSelected(null);
      setConfirmed(false);
    } else {
      // Calculate score
      const correctCount = [...answers, { correct: selected === questions[current].correct }].filter(a => a.correct).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      setScore(pct);
      setPhase('result');
      saveVerification(pct >= PASS_SCORE);
    }
  };

  /* ── Save to backend + context ── */
  const saveVerification = async (passed) => {
    try {
      await api.patch('/auth/verify', { isVerified: passed });
      if (updateVerification) updateVerification(passed);
    } catch (err) {
      console.error('Could not save verification status:', err);
      // Store in localStorage as fallback
      const stored = JSON.parse(localStorage.getItem('verificationStatus')||'{}');
      stored[user?._id||user?.email] = passed;
      localStorage.setItem('verificationStatus', JSON.stringify(stored));
      if (updateVerification) updateVerification(passed);
    }
  };

  const correctCount = answers.filter(a => a.correct).length + (phase==='result' ? (answers[answers.length-1]?.correct?0:0) : 0);
  const passed = score >= PASS_SCORE;

  /* ════════════════════════════════════════════════════════════
     INTRO PHASE
  ════════════════════════════════════════════════════════════ */
  if (phase === 'intro') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;} textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.28)!important;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Bg orbs */}
      <div style={{ position:'fixed', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle,${cfg.color}20 0%,transparent 70%)`, filter:'blur(90px)', top:-200, right:-100, pointerEvents:'none' }}/>
      <div style={{ position:'fixed', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,rgba(172,106,255,0.12) 0%,transparent 70%)`, filter:'blur(80px)', bottom:-100, left:-60, pointerEvents:'none' }}/>

      <motion.div initial={{ opacity:0, y:28, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.7 }}
        style={{ width:'100%', maxWidth:560, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'55%', height:1, background:`linear-gradient(90deg,transparent,${cfg.color},transparent)` }}/>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:2.5, repeat:Infinity }}
            style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>{cfg.icon}</motion.div>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.6rem' }}>
            <span style={{ background:`linear-gradient(135deg,${cfg.color},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{cfg.name} Verification</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'.9rem', lineHeight:1.7 }}>
            Before you can access the platform as a verified {cfg.name}, you must pass a <strong style={{ color:'#fff' }}>20-question AI assessment</strong> based on your expertise. You need <strong style={{ color:cfg.color }}>70% or above</strong> to get verified.
          </p>
        </div>

        {/* Info cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.8rem', marginBottom:'1.8rem' }}>
          {[['📋','20 Questions','AI-generated MCQs'],['⏱️','No Time Limit','Take your time'],['🎯','70% to Pass','Score ≥ 14/20'],['🔄','Retake Anytime','If you don\'t pass']].map(([e,t,s])=>(
            <div key={t} style={{ padding:'.9rem 1rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
              <div style={{ fontSize:'1.4rem', marginBottom:'.3rem' }}>{e}</div>
              <div style={{ fontWeight:700, fontSize:'.82rem', marginBottom:'.15rem' }}>{t}</div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Expertise input */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontSize:'.8rem', fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:'.55rem' }}>
            {cfg.expertiseLabel} *
          </label>
          <textarea ref={textareaRef} rows={3} value={expertise} onChange={e=>{ setExpertise(e.target.value); setError(''); }}
            placeholder={cfg.expertisePlaceholder}
            style={{ width:'100%', boxSizing:'border-box', padding:'.85rem 1rem', background:'rgba(255,255,255,0.06)', border:`1px solid ${error?T.coral:'rgba(255,255,255,0.12)'}`, borderRadius:14, color:'#fff', fontSize:'.875rem', outline:'none', resize:'vertical', lineHeight:1.65 }}
            onFocus={e=>{ e.target.style.borderColor=cfg.color; e.target.style.boxShadow=`0 0 0 3px ${cfg.color}20`; }}
            onBlur={e=>{ e.target.style.borderColor=error?T.coral:'rgba(255,255,255,0.12)'; e.target.style.boxShadow='none'; }}/>
          {error && <div style={{ color:T.coral, fontSize:'.78rem', marginTop:'.4rem' }}>⚠ {error}</div>}
        </div>

        {/* Start button */}
        <button onClick={generateQuestions} disabled={isGenerating}
          style={{ width:'100%', padding:'1rem', borderRadius:16, border:'none', background:`linear-gradient(135deg,${cfg.color},${T.purple})`, color: cfg.color===T.gold?'#0D0C1D':'#fff', fontWeight:800, fontSize:'1rem', cursor:isGenerating?'not-allowed':'pointer', boxShadow:`0 0 36px ${cfg.color}30`, opacity:isGenerating?.75:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.75rem' }}>
          {isGenerating ? (
            <><motion.span animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:'linear' }}>⚙️</motion.span> AI is generating your 20 questions...</>
          ) : (
            <>🚀 Start Verification Quiz</>
          )}
        </button>

        <p style={{ textAlign:'center', marginTop:'1.2rem', fontSize:'.78rem', color:'rgba(255,255,255,0.3)' }}>
          You can skip for now and take it later from your dashboard.{' '}
          <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'none', color:T.purple, fontWeight:600, cursor:'pointer', fontSize:'.78rem' }}>Skip →</button>
        </p>
      </motion.div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     QUIZ PHASE
  ════════════════════════════════════════════════════════════ */
  if (phase === 'quiz') {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'1.5rem', fontFamily:"'Sora',sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;}`}</style>

        <div style={{ position:'fixed', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,${cfg.color}12 0%,transparent 70%)`, filter:'blur(90px)', top:'20%', right:'-10%', pointerEvents:'none' }}/>

        <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }}
          style={{ width:'100%', maxWidth:640, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, overflow:'hidden', position:'relative', zIndex:1 }}>

          {/* Top bar */}
          <div style={{ padding:'1.4rem 1.8rem', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
              <span style={{ fontSize:'1.4rem' }}>{cfg.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:'.88rem' }}>{cfg.name} Verification</div>
                <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>{expertise.slice(0,40)}{expertise.length>40?'...':''}</div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:cfg.color }}>{current+1}<span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>/{questions.length}</span></div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>{answers.filter(a=>a.correct).length} correct so far</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height:3, background:'rgba(255,255,255,0.07)' }}>
            <motion.div animate={{ width:`${progress}%` }} style={{ height:'100%', background:`linear-gradient(90deg,${cfg.color},${T.purple})` }}/>
          </div>

          {/* Question */}
          <div style={{ padding:'2rem 1.8rem' }}>
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:cfg.color, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.8rem' }}>
                  Question {current+1} of {questions.length}
                </div>
                <p style={{ fontSize:'1.05rem', fontWeight:600, lineHeight:1.7, marginBottom:'1.6rem', color:'rgba(255,255,255,0.9)' }}>{q.q}</p>

                {/* Options */}
                <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                  {q.options.map((opt, idx) => {
                    let bg = 'rgba(255,255,255,0.04)', border = '1px solid rgba(255,255,255,0.1)', color = 'rgba(255,255,255,0.75)';
                    if (confirmed) {
                      if (idx === q.correct) { bg=`${T.lime}15`; border=`1px solid ${T.lime}50`; color='#fff'; }
                      else if (idx === selected && selected !== q.correct) { bg=`${T.coral}15`; border=`1px solid ${T.coral}50`; color=T.coral; }
                      else { bg='rgba(255,255,255,0.02)'; color='rgba(255,255,255,0.3)'; }
                    } else if (idx === selected) { bg=`${cfg.color}18`; border=`1px solid ${cfg.color}50`; color='#fff'; }
                    return (
                      <button key={idx} onClick={()=>{ if(!confirmed) setSelected(idx); }}
                        style={{ width:'100%', padding:'1rem 1.2rem', borderRadius:14, border, background:bg, color, textAlign:'left', cursor:confirmed?'default':'pointer', fontSize:'.9rem', lineHeight:1.55, transition:'all .2s', display:'flex', alignItems:'flex-start', gap:'.75rem' }}>
                        <span style={{ flexShrink:0, width:22, height:22, borderRadius:6, border:`1px solid ${idx===selected?cfg.color:'rgba(255,255,255,0.15)'}`, background:idx===selected?`${cfg.color}25`:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:700, color: confirmed&&idx===q.correct?T.lime:idx===selected?cfg.color:'rgba(255,255,255,0.35)', marginTop:'.1rem' }}>
                          {confirmed && idx===q.correct ? '✓' : confirmed && idx===selected && idx!==q.correct ? '✗' : String.fromCharCode(65+idx)}
                        </span>
                        <span>{opt.replace(/^[A-D]\.\s*/,'')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (after confirming) */}
                {confirmed && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    style={{ marginTop:'1.2rem', padding:'1rem 1.2rem', borderRadius:14, background: selected===q.correct?`${T.lime}10`:`${T.coral}10`, border:`1px solid ${selected===q.correct?T.lime:T.coral}30` }}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, color: selected===q.correct?T.lime:T.coral, marginBottom:'.35rem' }}>
                      {selected===q.correct?'✓ Correct! ':'✗ Incorrect — '}
                    </div>
                    <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,0.65)', lineHeight:1.6 }}>{q.explanation}</div>
                  </motion.div>
                )}

                {/* Action button */}
                <div style={{ marginTop:'1.5rem', display:'flex', justifyContent:'flex-end' }}>
                  {!confirmed ? (
                    <button onClick={confirmAnswer} disabled={selected===null}
                      style={{ padding:'.8rem 2rem', borderRadius:14, border:'none', background: selected===null?'rgba(255,255,255,0.07)':`linear-gradient(135deg,${cfg.color},${T.purple})`, color: selected===null?'rgba(255,255,255,0.3)':'#fff', fontWeight:700, fontSize:'.9rem', cursor:selected===null?'not-allowed':'pointer' }}>
                      Confirm Answer
                    </button>
                  ) : (
                    <button onClick={nextQuestion}
                      style={{ padding:'.8rem 2rem', borderRadius:14, border:'none', background:`linear-gradient(135deg,${T.lime},${T.blue})`, color:'#0D0C1D', fontWeight:700, fontSize:'.9rem', cursor:'pointer', boxShadow:`0 0 24px ${T.lime}30` }}>
                      {current<questions.length-1?'Next Question →':'See Results 🏁'}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RESULT PHASE
  ════════════════════════════════════════════════════════════ */
  const correctFinal = answers.filter(a=>a.correct).length;
  const scoreFinal   = passed ? score : score;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;}`}</style>

      <div style={{ position:'fixed', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle,${passed?T.lime:T.coral}18 0%,transparent 70%)`, filter:'blur(100px)', top:'10%', left:'20%', pointerEvents:'none' }}/>

      <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6, ease:[.16,1,.3,1] }}
        style={{ width:'100%', maxWidth:540, background:'rgba(255,255,255,0.05)', border:`1px solid ${passed?`rgba(122,219,120,0.25)`:`rgba(255,119,111,0.2)`}`, backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:`linear-gradient(90deg,transparent,${passed?T.lime:T.coral},transparent)` }}/>

        {/* Icon */}
        <motion.div animate={{ scale:[1,1.08,1] }} transition={{ duration:2, repeat:Infinity }}
          style={{ fontSize:'4rem', marginBottom:'1.2rem' }}>{passed?'🎉':'😔'}</motion.div>

        <h2 style={{ fontSize:'1.8rem', fontWeight:900, letterSpacing:'-.03em', marginBottom:'.5rem', color: passed?T.lime:T.coral }}>
          {passed?'You\'re Verified! ✓':'Not Qualified Yet'}
        </h2>

        {/* Score ring */}
        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:120, height:120, borderRadius:'50%', background: passed?`${T.lime}12`:`${T.coral}12`, border:`3px solid ${passed?T.lime:T.coral}`, margin:'1.2rem auto', flexDirection:'column' }}>
          <div style={{ fontSize:'2rem', fontWeight:900, color: passed?T.lime:T.coral, lineHeight:1 }}>{score}%</div>
          <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.45)' }}>{correctFinal}/{questions.length} correct</div>
        </div>

        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'.9rem', lineHeight:1.75, marginBottom:'2rem' }}>
          {passed
            ? `Congratulations! You scored ${score}% on the ${cfg.name} verification assessment. Your ${cfg.name} account is now verified and you'll see a verified badge on your profile.`
            : `You scored ${score}% — you need at least ${PASS_SCORE}% to become a verified ${cfg.name}. Don't worry, you can retake the quiz anytime. Review the subject areas and try again!`
          }
        </p>

        {/* Breakdown */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.75rem', marginBottom:'2rem' }}>
          {[['✓ Correct', correctFinal, T.lime],['✗ Incorrect', questions.length-correctFinal, T.coral],['Pass Mark', `${PASS_SCORE}%`, cfg.color]].map(([l,v,c])=>(
            <div key={l} style={{ padding:'.9rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize:'1.2rem', fontWeight:900, color:c, marginBottom:'.2rem' }}>{v}</div>
              <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.38)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          <button onClick={()=>navigate('/dashboard')}
            style={{ padding:'1rem', borderRadius:14, border:'none', background:`linear-gradient(135deg,${cfg.color},${T.purple})`, color: cfg.color===T.gold?'#0D0C1D':'#fff', fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:`0 0 28px ${cfg.color}30` }}>
            {passed?'🚀 Go to Dashboard':'🏠 Back to Dashboard'}
          </button>
          {!passed && (
            <button onClick={()=>{ setPhase('intro'); setQuestions([]); setCurrent(0); setAnswers([]); setSelected(null); setConfirmed(false); setScore(0); }}
              style={{ padding:'1rem', borderRadius:14, border:`1px solid ${cfg.color}40`, background:'transparent', color:cfg.color, fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
              🔄 Retake Quiz
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationQuiz;
