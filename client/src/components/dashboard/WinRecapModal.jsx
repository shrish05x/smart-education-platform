import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', teal:'#5EEAD4', lime:'#7ADB78', coral:'#FF776F', pink:'#FF98E2' };
const CONFETTI_COLORS = [T.purple, T.gold, T.teal, T.lime, T.coral, T.pink, '#fff'];

const Confetti = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 28 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: p.rotate }}
          animate={{ y: '110%', opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position: 'absolute', top: 0, width: p.size, height: p.size, borderRadius: p.id % 3 === 0 ? '50%' : 3, background: p.color }}
        />
      ))}
    </div>
  );
};

const WinRecapModal = ({ weeklyHours = 18.5, weeklyAssignments = 5, onClose }) => {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'you';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: .85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 500, background: '#0D0C1D', border: `1px solid ${T.gold}30`, borderRadius: 28, padding: '2.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <Confetti />

        {/* Glow */}
        <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle,${T.gold}18 0%,transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: 2 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
          >🎉</motion.div>

          <div style={{ fontSize: '.72rem', fontWeight: 700, color: T.gold, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.6rem' }}>
            ✦ Weekly Win Recap
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            {name}, you{' '}
            <span style={{ background: `linear-gradient(135deg,${T.gold},${T.coral})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              crushed it
            </span>{' '}last week! 🔥
          </h2>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
            {[
              { icon:'⏱️', value:`${weeklyHours}h`, label:'Study hours logged', color:T.purple },
              { icon:'✅', value:weeklyAssignments, label:'Assignments completed', color:T.lime },
            ].map(s => (
              <motion.div key={s.label} initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:.4 }}
                style={{ padding: '1.1rem', borderRadius: 16, background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mentor shout-out card */}
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.6 }}
            style={{ padding: '1rem', borderRadius: 16, background: `rgba(94,234,212,0.07)`, border: `1px solid ${T.teal}25`, marginBottom: '1.5rem', textAlign: 'left', display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🎙️</span>
            <div>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: T.teal, marginBottom: '.3rem' }}>Mentor Message</div>
              <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: 0 }}>
                "Hey {name}, you put in <strong style={{color:'#fff'}}>{weeklyHours} focused hours</strong> last week — that's incredible consistency. You're building something real. Keep that energy! 💙"
              </p>
            </div>
          </motion.div>

          <button onClick={onClose}
            style={{ width: '100%', padding: '1rem', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${T.gold},${T.coral})`, color: '#0D0C1D', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily:"'Sora',sans-serif" }}>
            Let's Make This Week Even Better 🚀
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinRecapModal;
