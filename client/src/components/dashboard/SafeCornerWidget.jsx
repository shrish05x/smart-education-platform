import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const T = { purple:'#AC6AFF', gold:'#FFC876', teal:'#5EEAD4', pink:'#FF98E2', sage:'#86EFAC' };

const BACKGROUNDS = [
  { id:'default',     label:'Cosmic Dark',   icon:'🌌', style:{ background:'#0D0C1D' } },
  { id:'forest',      label:'Calm Forest',   icon:'🌿', style:{ background:'linear-gradient(135deg,#0a1a0f,#102418,#0f1e16)' } },
  { id:'starry',      label:'Starry Night',  icon:'🌙', style:{ background:'linear-gradient(135deg,#060b1a,#0d1433,#080e27)' } },
  { id:'purple',      label:'Pure Calm',     icon:'💜', style:{ background:'linear-gradient(135deg,#120826,#1a0d36,#100620)' } },
  { id:'warm',        label:'Warm Amber',    icon:'🕯️', style:{ background:'linear-gradient(135deg,#150e00,#1c1200,#140c00)' } },
];

const EMPATHETIC_RESPONSES = [
  "I hear you. It's completely okay to feel this way. 💙",
  "Thank you for sharing that with me. You're not alone in this.",
  "That sounds really tough. Your feelings are valid and I'm here to listen.",
  "I'm glad you told me. Take as much time as you need.",
  "It makes sense that you feel that way. This is a safe space — no judgment here.",
  "You're doing so much better than you think. Just being here takes courage.",
  "Your emotions deserve space. Let them flow — that's what healing looks like.",
  "I'm listening. You don't have to figure everything out right now.",
];

export const SafeCornerContext = {
  hideProgress: false,
  bg: BACKGROUNDS[0],
};

const SafeCornerWidget = ({ onHideProgressChange, onBgChange }) => {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'you';
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('main'); // main | chat | bg
  const [hideProgress, setHideProgress] = useState(false);
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: `Hey ${name} 💙 This is your safe space. I'm here to listen — not to judge or advise, just to be present with you. How are you really feeling today?` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const toggleHideProgress = () => {
    const newVal = !hideProgress;
    setHideProgress(newVal);
    onHideProgressChange?.(newVal);
  };

  const applyBg = (bg) => {
    setSelectedBg(bg);
    onBgChange?.(bg);
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setChatLoading(true);
    try {
      const systemPrefix = `You are an empathetic AI companion in a student wellness app. You ONLY listen and validate feelings. You never give unsolicited advice or diagnose. Keep responses short (2-3 sentences), warm, and non-judgmental. Always validate first. Use gentle language. User's name is ${name}. `;
      const res = await api.post('/ai/chat', {
        message: systemPrefix + text,
        history: chatMessages.slice(-4).map(m => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] }))
      });
      const reply = res.data.response || EMPATHETIC_RESPONSES[Math.floor(Math.random() * EMPATHETIC_RESPONSES.length)];
      setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: EMPATHETIC_RESPONSES[Math.floor(Math.random() * EMPATHETIC_RESPONSES.length)] }]);
    } finally { setChatLoading(false); }
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }}
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: '6rem', right: '1.6rem', zIndex: 850, width: 54, height: 54, borderRadius: 999, border: `1px solid ${T.teal}40`, background: `rgba(94,234,212,0.12)`, backdropFilter: 'blur(20px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: `0 4px 20px rgba(94,234,212,0.18)` }}
        title="My Safe Corner"
      >
        🔒
      </motion.button>

      {/* Safe Corner panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: .95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 10 }}
            style={{ position: 'fixed', bottom: '11rem', right: '1.6rem', zIndex: 850, width: 320, background: 'rgba(13,12,29,0.97)', border: `1px solid ${T.teal}25`, backdropFilter: 'blur(28px)', borderRadius: 24, overflow: 'hidden', boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${T.teal}10` }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🔒</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{name}'s Safe Zone</div>
                  <div style={{ fontSize: '.65rem', color: T.teal }}>Private & Protected</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 26, height: 26, borderRadius: 7, cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
            </div>

            {/* Tabs */}
            {activeTab !== 'chat' && (
              <div style={{ display: 'flex', padding: '.7rem .8rem', gap: '.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[['main','🏠 Main'],['bg','🎨 Background']].map(([id, label]) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{ flex: 1, padding: '.45rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily:"'Sora',sans-serif", fontSize: '.72rem', fontWeight: 700, background: activeTab === id ? `${T.teal}18` : 'rgba(255,255,255,0.04)', color: activeTab === id ? T.teal : 'rgba(255,255,255,0.45)', transition: 'all .2s' }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Main tab */}
              {activeTab === 'main' && (
                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                  {/* Talk to AI Friend */}
                  <button onClick={() => setActiveTab('chat')}
                    style={{ width: '100%', padding: '.85rem 1rem', borderRadius: 14, border: `1px solid ${T.purple}35`, background: `${T.purple}10`, cursor: 'pointer', fontFamily:"'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: '.75rem', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.3rem' }}>💬</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>Talk to AI Friend</div>
                      <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.4)' }}>Listens. Never judges. Always here.</div>
                    </div>
                  </button>

                  {/* Hide Progress toggle */}
                  <div style={{ padding: '.85rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.85rem' }}>Hide Progress Today</div>
                      <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,0.38)', marginTop: '.1rem' }}>Take a break from numbers</div>
                    </div>
                    <button onClick={toggleHideProgress}
                      style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: hideProgress ? T.teal : 'rgba(255,255,255,0.12)', transition: 'all .3s', position: 'relative', flexShrink: 0 }}>
                      <span style={{ position: 'absolute', top: 3, left: hideProgress ? 24 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .3s', display: 'block' }} />
                    </button>
                  </div>

                  <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.6 }}>
                    This space is yours. No one else can see what you do here. 💙
                  </p>
                </motion.div>
              )}

              {/* AI Chat tab */}
              {activeTab === 'chat' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.6rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setActiveTab('main')} style={{ background: 'none', border: 'none', color: T.teal, cursor: 'pointer', fontSize: '1rem' }}>←</button>
                    <span style={{ fontSize: '.82rem', fontWeight: 700, color: T.teal }}>AI Friend 💙</span>
                  </div>
                  <div style={{ height: 200, overflowY: 'auto', padding: '.9rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    {chatMessages.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '82%', padding: '.6rem .85rem', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? `${T.purple}25` : 'rgba(255,255,255,0.06)', border: `1px solid ${m.role === 'user' ? T.purple+'35' : 'rgba(255,255,255,0.08)'}`, fontSize: '.8rem', color:'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.3)' }}>💙 thinking...</div>}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={{ padding: '.7rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '.5rem' }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder="Share how you feel..."
                      style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '.55rem .8rem', color: '#fff', fontSize: '.8rem', outline: 'none', fontFamily:"'Sora',sans-serif" }}
                    />
                    <button onClick={sendChat} disabled={chatLoading} style={{ padding: '.55rem .9rem', borderRadius: 10, border: 'none', background: T.teal, color: '#0D0C1D', fontWeight: 700, cursor: 'pointer', fontSize: '.8rem' }}>→</button>
                  </div>
                </motion.div>
              )}

              {/* Background tab */}
              {activeTab === 'bg' && (
                <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '.2rem' }}>Choose your dashboard vibe:</div>
                  {BACKGROUNDS.map(bg => (
                    <button key={bg.id} onClick={() => applyBg(bg)}
                      style={{ width: '100%', padding: '.7rem 1rem', borderRadius: 12, border: `1px solid ${selectedBg.id === bg.id ? T.teal : 'rgba(255,255,255,0.08)'}`, background: selectedBg.id === bg.id ? `${T.teal}12` : 'rgba(255,255,255,0.03)', cursor: 'pointer', fontFamily:"'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: '.7rem', transition: 'all .2s' }}>
                      <span style={{ fontSize: '1.2rem' }}>{bg.icon}</span>
                      <span style={{ fontSize: '.82rem', fontWeight: 600, color: selectedBg.id === bg.id ? T.teal : 'rgba(255,255,255,0.65)' }}>{bg.label}</span>
                      {selectedBg.id === bg.id && <span style={{ marginLeft: 'auto', fontSize: '.7rem', color: T.teal, fontWeight: 700 }}>✓ Active</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SafeCornerWidget;
