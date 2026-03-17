import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MoodTracker from '../components/mental-health/MoodTracker';
import AIVideoCall from '../components/mental-health/AIVideoCall';
import MentorTalk from '../components/mental-health/MentorTalk';
import PeerVideoCall from '../components/mental-health/PeerVideoCall';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TABS = [
  { id:'overview',   label:'Overview',       icon:'🏠', color:T.purple },
  { id:'mood',       label:'Mood Tracker',   icon:'🧠', color:T.pink   },
  { id:'ai-guide',   label:'AI Guide',       icon:'🤖', color:T.blue   },
  { id:'mentor',     label:'Peer & Mentor',  icon:'💬', color:T.lime   },
  { id:'peer-call',  label:'Video Call',     icon:'📹', color:T.coral  },
];

const RESOURCES = [
  { title:'Book a Counselling Session', desc:'Connect with a certified counsellor for a private session.', icon:'🗓️', color:T.purple },
  { title:'Self-Help Library',          desc:'Access articles, videos, and tools for mental wellness.',    icon:'📚', color:T.blue   },
  { title:'Crisis Helpline 24/7',       desc:'Immediate support always available — you are not alone.',   icon:'📞', color:T.coral  },
  { title:'Peer Support Groups',        desc:'Join a supportive community of students who get it.',        icon:'🤝', color:T.lime   },
];

const MentalHealthSupport = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'video' ? 'peer-call' : 'overview');
  const [roomCodeContext, setRoomCodeContext] = useState(searchParams.get('callId') || '');

  useEffect(() => {
    if (searchParams.get('tab') === 'video' && searchParams.get('callId')) {
      setActiveTab('peer-call');
      setRoomCodeContext(searchParams.get('callId'));
    }
  }, [searchParams]);

  const handleStartCall = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCodeContext(code);
    setActiveTab('peer-call');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'1.8rem 2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'50%', height:1, background:`linear-gradient(90deg,transparent,${T.pink},transparent)` }}/>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.2rem' }}>
          <div style={{ width:48, height:48, borderRadius:16, background:`linear-gradient(135deg,${T.pink},${T.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>🧘</div>
          <div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.2rem' }}>Mental Health & Wellness</h1>
            <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem', maxWidth:540 }}>Your well-being matters. Track your mood, talk to an AI guide, or connect with peers and mentors in a safe, supportive space.</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display:'flex', alignItems:'center', gap:'.45rem', padding:'.6rem 1.1rem', borderRadius:12, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.82rem', fontWeight:600, transition:'all .2s',
                background: activeTab===tab.id ? `${tab.color}20` : 'rgba(255,255,255,0.05)',
                color: activeTab===tab.id ? tab.color : 'rgba(255,255,255,0.52)',
                boxShadow: activeTab===tab.id ? `0 0 20px ${tab.color}25` : 'none',
                border: activeTab===tab.id ? `1px solid ${tab.color}40` : '1px solid rgba(255,255,255,0.08)',
              }}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        {activeTab === 'overview' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'1.1rem' }}>
              {RESOURCES.map(r => (
                <div key={r.title}
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.6rem', cursor:'pointer', transition:'all .3s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.3),0 0 30px ${r.color}18`; e.currentTarget.style.borderColor=`${r.color}40`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}>
                  <div style={{ fontSize:'2.2rem', marginBottom:'1rem' }}>{r.icon}</div>
                  <h3 style={{ fontWeight:700, fontSize:'1rem', letterSpacing:'-.01em', color:r.color, marginBottom:'.4rem' }}>{r.title}</h3>
                  <p style={{ color:'rgba(255,255,255,0.44)', fontSize:'.84rem', lineHeight:1.65 }}>{r.desc}</p>
                </div>
              ))}
            </div>
            {/* Dev tool */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', padding:'1.2rem 1.5rem', borderRadius:16, background:'rgba(133,141,255,0.08)', border:'1px solid rgba(133,141,255,0.2)' }}>
              <div>
                <div style={{ fontWeight:700, color:T.blue, marginBottom:'.2rem' }}>🔬 Test: Simulate Incoming Call</div>
                <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,0.45)' }}>Simulate a friend or mentor calling you right now.</div>
              </div>
              <button onClick={() => window.simulateIncomingCall && window.simulateIncomingCall('Jane Doe', 'jane@university.edu')}
                style={{ padding:'.6rem 1.4rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.blue},${T.purple})`, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                Simulate Call
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mood' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.4rem', fontWeight:700, letterSpacing:'-.02em', marginBottom:'.4rem' }}>How are you feeling today?</h2>
              <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Take a quick check-in to track your mental well-being over time.</p>
            </div>
            <MoodTracker />
          </div>
        )}
        {activeTab === 'ai-guide' && <AIVideoCall />}
        {activeTab === 'mentor' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.4rem', fontWeight:700, letterSpacing:'-.02em', marginBottom:'.4rem' }}>Talk to Someone Who Understands</h2>
              <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem', maxWidth:500, margin:'0 auto' }}>Connect with trained peers, alumni, and mentors who have been through similar experiences.</p>
            </div>
            <MentorTalk onStartCall={handleStartCall} />
          </div>
        )}
        {activeTab === 'peer-call' && (
          <PeerVideoCall initialRoomCode={roomCodeContext} onEndCall={() => setRoomCodeContext('')} />
        )}
      </motion.div>
    </div>
  );
};

export default MentalHealthSupport;
