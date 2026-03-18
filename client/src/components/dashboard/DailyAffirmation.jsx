import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', teal:'#5EEAD4', pink:'#FF98E2' };

const AFFIRMATIONS = [
  (name) => `You showed up today — that's already winning, ${name}. 🌟`,
  () => `Progress is progress, even on hard days. Keep going 💪`,
  (name) => `Every expert was once a beginner. You've got this, ${name} ✨`,
  () => `Small steps every day lead to big changes. You're building something great! 🚀`,
  (name) => `${name}, your curiosity is your superpower. Never stop asking "why". 🧠`,
  () => `Rest is part of the journey. Today counts, even if it feels slow. 🌿`,
  (name) => `The fact that you're here means you're further than you think, ${name}. 🎯`,
  () => `Learning is not a race. Your pace is perfect for you. 🌈`,
  (name) => `Hard days build resilience. You're stronger than you know, ${name}. 💙`,
  () => `One focused hour beats ten distracted ones. Quality over quantity today. ⏱️`,
  (name) => `${name}, someone out there will benefit from what you're learning right now. 🌍`,
  () => `You don't have to be great to start, but you have to start to be great. 🔥`,
];

const DailyAffirmation = () => {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'you';
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Pick affirmation by day-of-year so it rotates daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const affirmation = AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length](name);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: .9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: .9 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            position: 'fixed', bottom: '1.8rem', right: '1.6rem', zIndex: 900,
            maxWidth: expanded ? 320 : 56, width: expanded ? 320 : 56,
            transition: 'max-width .35s cubic-bezier(.4,0,.2,1), width .35s cubic-bezier(.4,0,.2,1)',
            cursor: 'pointer',
          }}
        >
          {/* Pulsing outer ring */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -6, borderRadius: expanded ? 22 : 999,
              border: `2px solid ${T.teal}`, pointerEvents: 'none',
            }}
          />

          <div
            onClick={() => setExpanded(e => !e)}
            style={{
              background: expanded
                ? 'linear-gradient(135deg,rgba(94,234,212,0.12),rgba(172,106,255,0.12))'
                : `rgba(94,234,212,0.15)`,
              border: `1px solid ${T.teal}40`,
              backdropFilter: 'blur(24px)',
              borderRadius: expanded ? 20 : 999,
              padding: expanded ? '1.1rem 1.1rem 1rem' : '.85rem',
              display: 'flex', alignItems: expanded ? 'flex-start' : 'center',
              gap: expanded ? '.8rem' : 0,
              boxShadow: `0 8px 32px rgba(94,234,212,0.15)`,
              transition: 'border-radius .35s, padding .35s',
              overflow: 'hidden',
            }}
          >
            {/* Icon */}
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              style={{ fontSize: expanded ? '1.5rem' : '1.2rem', flexShrink: 0, display: 'block' }}
            >
              💬
            </motion.span>

            {/* Expanded content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ flex: 1 }}
                >
                  <div style={{ fontSize: '.65rem', fontWeight: 700, color: T.teal, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.4rem' }}>
                    ✦ Daily Affirmation
                  </div>
                  <p style={{ fontSize: '.875rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, margin: 0 }}>
                    {affirmation}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setDismissed(true); }}
                    style={{ marginTop: '.7rem', fontSize: '.72rem', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif" }}
                  >
                    Dismiss for today ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyAffirmation;
