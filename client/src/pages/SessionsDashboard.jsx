import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import mentorApi from '../services/mentorApi';
import SessionsTable from '../components/mentors/SessionsTable';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF' };

const TABS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];
const TAB_COLORS = { All:T.purple, Pending:T.gold, Accepted:T.lime, Completed:T.blue, Cancelled:T.coral };

const SessionsDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try { const res = await mentorApi.getSessions(); setSessions(res.data||[]); }
    catch (err) { console.error(err); setError('Could not load your mentorship sessions at this time.'); }
    finally { setLoading(false); }
  };

  const filtered = sessions.filter(s => filter==='All' || s.status?.toLowerCase()===filter.toLowerCase());

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem', animation:'pulse 1.5s ease-in-out infinite' }}>
      {[80,40,100].map((w,i)=><div key={i} style={{ height: i===2?200:18, borderRadius:12, background:'rgba(255,255,255,0.06)', width:`${w}%` }}/>)}
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
            My <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Sessions</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Track and manage your upcoming and past mentorship requests.</p>
        </div>
        <Link to="/mentors"
          style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.65rem 1.4rem', borderRadius:12, background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.85rem', textDecoration:'none', boxShadow:`0 0 24px rgba(172,106,255,0.22)` }}>
          🔍 Find New Mentor
        </Link>
      </motion.div>

      {error && (
        <div style={{ padding:'1rem 1.2rem', borderRadius:14, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:T.coral }}>
          ⚠ {error}
        </div>
      )}

      {!error && (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          {/* Tab filters */}
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
            {TABS.map(tab => {
              const active = filter===tab;
              const c = TAB_COLORS[tab];
              return (
                <button key={tab} onClick={()=>setFilter(tab)}
                  style={{ padding:'.5rem 1.1rem', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.82rem', fontWeight:600, transition:'all .2s',
                    background: active?`${c}18`:'rgba(255,255,255,0.05)',
                    color: active?c:'rgba(255,255,255,0.52)',
                    boxShadow: active?`0 0 16px ${c}22`:'none',
                    border: active?`1px solid ${c}40`:'1px solid rgba(255,255,255,0.08)',
                  }}>
                  {tab}
                  {tab!=='All' && <span style={{ marginLeft:'.4rem', fontSize:'.7rem', opacity:.7 }}>
                    {sessions.filter(s=>s.status?.toLowerCase()===tab.toLowerCase()).length}
                  </span>}
                </button>
              );
            })}
          </div>

          <SessionsTable sessions={filtered}/>
        </motion.div>
      )}
    </div>
  );
};

export default SessionsDashboard;
