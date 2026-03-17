import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const MENTEES = [
  { id:1, name:'Arjun Sharma',    subject:'Data Structures & Algorithms', sessions:8,  progress:72, lastSession:'2 days ago',  nextSession:'Today 4 PM',      avatar:'A', status:'active',  rating:5 },
  { id:2, name:'Priya Nair',      subject:'System Design',               sessions:5,  progress:55, lastSession:'4 days ago',  nextSession:'Thu 11 AM',       avatar:'P', status:'active',  rating:4 },
  { id:3, name:'Ravi Mehta',      subject:'Interview Preparation',       sessions:12, progress:88, lastSession:'Yesterday',   nextSession:'Fri 3 PM',        avatar:'R', status:'active',  rating:5 },
  { id:4, name:'Ananya Singh',    subject:'Machine Learning',            sessions:3,  progress:30, lastSession:'1 week ago',  nextSession:'Not scheduled',   avatar:'A', status:'paused',  rating:4 },
  { id:5, name:'Karan Verma',     subject:'Portfolio & Resume',          sessions:6,  progress:60, lastSession:'3 days ago',  nextSession:'Mon 2 PM',        avatar:'K', status:'active',  rating:5 },
  { id:6, name:'Shreya Patel',    subject:'Web Development',             sessions:9,  progress:79, lastSession:'Yesterday',   nextSession:'Wed 5 PM',        avatar:'S', status:'active',  rating:4 },
];

const ProgressBar = ({ value, color }) => (
  <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
    <motion.div initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:.8 }}
      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}80)` }}/>
  </div>
);

const MentorStudents = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = MENTEES
    .filter(m => filter === 'all' || m.status === filter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          My <span style={{ background:`linear-gradient(135deg,${T.blue},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Mentees</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Track your mentees' progress and upcoming sessions.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.06 }}
        style={{ display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <span style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', fontSize:'.9rem' }}>🔍</span>
          <input type="text" placeholder="Search mentees..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', boxSizing:'border-box', padding:'.7rem 1rem .7rem 2.4rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" }}/>
        </div>
        <div style={{ display:'flex', gap:'.5rem' }}>
          {['all','active','paused'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:'.5rem 1.1rem', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.8rem', fontWeight:600, transition:'all .2s',
                background: filter===f?`rgba(133,141,255,0.15)`:'rgba(255,255,255,0.05)',
                color: filter===f?T.blue:'rgba(255,255,255,0.52)',
                border: filter===f?`1px solid rgba(133,141,255,0.35)`:'1px solid rgba(255,255,255,0.08)',
              }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:'1.2rem' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((m,i) => (
            <motion.div key={m.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ delay:i*.05 }}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.4rem', transition:'all .3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor=`${T.blue}40`; e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.35)`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow=''; }}>
              {/* Top */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1.1rem' }}>
                <div style={{ width:46, height:46, borderRadius:14, background:`linear-gradient(135deg,${T.blue},${T.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.1rem', flexShrink:0 }}>
                  {m.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'.95rem', marginBottom:'.2rem' }}>{m.name}</div>
                  <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.42)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.subject}</div>
                </div>
                <span style={{ padding:'.25rem .65rem', borderRadius:999, background: m.status==='active'?`${T.lime}18`:`rgba(255,255,255,0.07)`, color: m.status==='active'?T.lime:'rgba(255,255,255,0.4)', fontSize:'.68rem', fontWeight:700, flexShrink:0 }}>
                  {m.status}
                </span>
              </div>
              {/* Stats row */}
              <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem' }}>
                <div style={{ flex:1, textAlign:'center', padding:'.6rem', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:T.blue }}>{m.sessions}</div>
                  <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.38)' }}>Sessions</div>
                </div>
                <div style={{ flex:1, textAlign:'center', padding:'.6rem', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:T.lime }}>{m.progress}%</div>
                  <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.38)' }}>Progress</div>
                </div>
                <div style={{ flex:1, textAlign:'center', padding:'.6rem', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:T.gold }}>{'⭐'.repeat(m.rating)}</div>
                  <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.38)' }}>Rating</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:'rgba(255,255,255,0.38)', marginBottom:'.4rem' }}>
                  <span>Overall Progress</span><span style={{ color:T.lime }}>{m.progress}%</span>
                </div>
                <ProgressBar value={m.progress} color={T.lime}/>
              </div>
              {/* Sessions info */}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:'rgba(255,255,255,0.38)', marginBottom:'1rem' }}>
                <span>Last: {m.lastSession}</span>
                <span style={{ color: m.nextSession==='Not scheduled' ? T.coral : T.gold, fontWeight:600 }}>{m.nextSession}</span>
              </div>
              {/* Actions */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem' }}>
                <button style={{ padding:'.6rem', borderRadius:10, border:`1px solid rgba(133,141,255,0.3)`, background:`rgba(133,141,255,0.1)`, color:T.blue, fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>View Profile</button>
                <button style={{ padding:'.6rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.78rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Schedule</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>🔍</div>
          <p style={{ color:'rgba(255,255,255,0.42)' }}>No mentees match your search.</p>
        </div>
      )}
    </div>
  );
};

export default MentorStudents;
