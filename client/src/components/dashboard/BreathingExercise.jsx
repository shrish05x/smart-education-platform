import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T = { teal: '#5EEAD4', purple: '#AC6AFF', blue: '#858DFF' };

// 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s = one cycle ~19s
const PHASES = [
  { label: 'Breathe In', duration: 4, scale: 1.5, color: T.teal,   tip: 'Slowly inhale through your nose...' },
  { label: 'Hold',       duration: 7, scale: 1.5, color: T.purple, tip: 'Hold gently. Feel the stillness.' },
  { label: 'Breathe Out',duration: 8, scale: 1,   color: T.blue,   tip: 'Slowly exhale through your mouth...' },
];
const TOTAL_SECONDS = 60;

const BreathingExercise = ({ onClose }) => {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= TOTAL_SECONDS) { clearInterval(intervalRef.current); setDone(true); return TOTAL_SECONDS; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started]);

  // Determine current phase
  let cycle = 0, phaseIdx = 0, phaseElapsed = 0;
  if (started && !done) {
    const cycleLen = PHASES.reduce((s, p) => s + p.duration, 0); // 19s
    const cycleTime = elapsed % cycleLen;
    let acc = 0;
    for (let i = 0; i < PHASES.length; i++) {
      if (cycleTime < acc + PHASES[i].duration) { phaseIdx = i; phaseElapsed = cycleTime - acc; break; }
      acc += PHASES[i].duration;
    }
    cycle = Math.floor(elapsed / cycleLen) + 1;
  }

  const phase = PHASES[phaseIdx];
  const remaining = TOTAL_SECONDS - elapsed;
  const phaseFrac = started && !done ? phaseElapsed / phase.duration : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: .9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 440, background: '#0D0C1D', border: '1px solid rgba(94,234,212,0.2)', borderRadius: 28, padding: '2.5rem 2rem', textAlign: 'center', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}>✕</button>

        <div style={{ fontSize: '.72rem', fontWeight: 700, color: T.teal, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: '1rem' }}>
          🌿 1-Minute Breathing Break
        </div>

        {done ? (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '.8rem' }}>🌟</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: T.teal, marginBottom: '.5rem' }}>You did it!</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>Your nervous system is calmer now. You're ready to continue. You've got this 💙</p>
            <button onClick={onClose} style={{ marginTop: '1.5rem', padding: '.8rem 2rem', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${T.teal},${T.purple})`, color: '#0D0C1D', fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>Back to Dashboard</button>
          </motion.div>
        ) : (
          <>
            {/* Breathing orb */}
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 1.5rem' }}>
              {/* Outer pulse ring */}
              {started && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: phase.duration, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: `2px solid ${phase.color}`, pointerEvents: 'none' }}
                />
              )}
              {/* Main circle */}
              <motion.div
                animate={started ? { scale: phase.scale } : { scale: 1 }}
                transition={{ duration: phase.duration, ease: phaseIdx === 2 ? 'easeIn' : 'easeOut' }}
                style={{ width: '100%', height: '100%', borderRadius: '50%', background: started ? `radial-gradient(circle,${phase.color}28 0%,transparent 70%)` : 'radial-gradient(circle,rgba(94,234,212,0.1) 0%,transparent 70%)', border: `2px solid ${started ? phase.color : T.teal}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
              >
                {started ? (
                  <>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.2rem' }}>{phase.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: phase.color }}>{phase.duration - phaseElapsed}</div>
                    <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,0.35)' }}>seconds</div>
                  </>
                ) : (
                  <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.45)' }}>Press Start</div>
                )}
              </motion.div>
            </div>

            {started ? (
              <>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '.875rem', minHeight: '1.5rem', marginBottom: '1.2rem' }}>{phase.tip}</p>
                {/* Progress bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden', marginBottom: '1rem' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg,${T.teal},${T.purple})` }}
                    animate={{ width: `${(elapsed / TOTAL_SECONDS) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.35)' }}>{remaining}s remaining · Cycle {cycle}</div>
              </>
            ) : (
              <>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>4-7-8 technique: inhale for 4s, hold for 7s, exhale for 8s. Proven to calm anxiety in under a minute.</p>
                <button onClick={() => setStarted(true)} style={{ padding: '.9rem 2.5rem', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${T.teal},${T.blue})`, color: '#0D0C1D', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: "'Sora',sans-serif", boxShadow: `0 0 24px ${T.teal}25` }}>
                  Start Breathing 🌿
                </button>
              </>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BreathingExercise;
