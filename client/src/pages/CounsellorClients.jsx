import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const MOOD_CFG = {
  Calm:     { c:T.lime,   e:'😌' }, Anxious: { c:T.gold,   e:'😰' },
  Stressed: { c:T.coral,  e:'😤' }, Positive:{ c:T.purple, e:'😊' },
  Down:     { c:T.blue,   e:'😔' }, Neutral: { c:'rgba(255,255,255,0.5)', e:'😐' },
};

const CLIENTS = [
  { id:1, name:'Anika Sharma',   issue:'Exam stress & perfectionism', sessions:6,  mood:'Anxious',  progress:65, nextAppt:'Today 4 PM',      urgency:'high',   lastNote:'Discussed breathing techniques...' },
  { id:2, name:'Rahul Desai',    issue:'Social anxiety',              sessions:12, mood:'Positive', progress:80, nextAppt:'Thu 11 AM',       urgency:'low',    lastNote:'Great progress with cognitive restructuring...' },
  { id:3, name:'Meera Joshi',    issue:'Academic burnout',            sessions:3,  mood:'Stressed', progress:40, nextAppt:'Tomorrow 3 PM',   urgency:'high',   lastNote:'Feeling overwhelmed; introduced journaling...' },
  { id:4, name:'Aryan Kapoor',   issue:'Transition anxiety',          sessions:8,  mood:'Calm',     progress:72, nextAppt:'Fri 2 PM',        urgency:'medium', lastNote:'Adapting well; exploring career goals...' },
  { id:5, name:'Divya Nair',     issue:'Loneliness & isolation',      sessions:4,  mood:'Down',     progress:35, nextAppt:'Mon 10 AM',       urgency:'high',   lastNote:'Opened up about family dynamics...' },
  { id:6, name:'Siddharth Rao',  issue:'Motivation & procrastination',sessions:9,  mood:'Neutral',  progress:58, nextAppt:'Next week',        urgency:'low',    lastNote:'Setting SMART goals together...' },
  { id:7, name:'Nisha Gupta',    issue:'Relationship issues',         sessions:5,  mood:'Anxious',  progress:50, nextAppt:'Wed 1 PM',        urgency:'medium', lastNote:'Working on communication patterns...' },
  { id:8, name:'Aditya Rao',     issue:'Grief & loss',                sessions:7,  mood:'Down',     progress:45, nextAppt:'Tue 5 PM',        urgency:'medium', lastNote:'Introduced grief stages model...' },
];

const URGENCY_CFG = {
  high:   { c:T.coral,  label:'High Priority'   },
  medium: { c:T.gold,   label:'Medium Priority' },
  low:    { c:T.lime,   label:'Stable'          },
};

const ProgressBar = ({ value, color }) => (
  <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
    <motion.div initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:.8 }}
      style={{ height:'100%', borderRadius:999, background:color }}/>
  </div>
);

const CounsellorClients = () => {
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = CLIENTS
    .filter(c => urgencyFilter === 'all' || c.urgency === urgencyFilter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.issue.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          My <span style={{ background:`linear-gradient(135deg,${T.pink},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Clients</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Active counselling clients, mood tracking, and session history.</p>
      </motion.div>

      {/* Summary chips */}
      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
        {[{ label:`${CLIENTS.filter(c=>c.urgency==='high').length} High Priority`, color:T.coral },{ label:`${CLIENTS.filter(c=>c.mood==='Anxious'||c.mood==='Down'||c.mood==='Stressed').length} Need Attention`, color:T.gold },{ label:`${CLIENTS.length} Total Clients`, color:T.purple }].map(c=>(
          <span key={c.label} style={{ padding:'.4rem 1rem', borderRadius:999, background:`${c.color}15`, border:`1px solid ${c.color}30`, color:c.color, fontSize:'.78rem', fontWeight:700 }}>{c.label}</span>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <span style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>🔍</span>
          <input type="text" placeholder="Search clients..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', boxSizing:'border-box', padding:'.7rem 1rem .7rem 2.4rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" }}/>
        </div>
        <div style={{ display:'flex', gap:'.5rem' }}>
          {['all','high','medium','low'].map(f=>(
            <button key={f} onClick={()=>setUrgencyFilter(f)}
              style={{ padding:'.5rem 1rem', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.78rem', fontWeight:600, transition:'all .2s',
                background: urgencyFilter===f?`${URGENCY_CFG[f]?.c||T.pink}18`:'rgba(255,255,255,0.05)',
                color: urgencyFilter===f?(URGENCY_CFG[f]?.c||T.pink):'rgba(255,255,255,0.52)',
                border: urgencyFilter===f?`1px solid ${URGENCY_CFG[f]?.c||T.pink}40`:'1px solid rgba(255,255,255,0.08)',
              }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.2rem' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((c,i)=>{
            const mood = MOOD_CFG[c.mood]||MOOD_CFG.Neutral;
            const urg = URGENCY_CFG[c.urgency];
            return (
              <motion.div key={c.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ delay:i*.04 }}
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.3rem', cursor:'pointer', transition:'all .3s' }}
                onClick={()=>setSelectedClient(c)}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor=`${T.pink}40`; e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.35)`; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
                    <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${T.pink},${T.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.1rem', flexShrink:0 }}>{c.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.9rem' }}>{c.name}</div>
                      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.42)', marginTop:'.1rem' }}>{c.issue}</div>
                    </div>
                  </div>
                  <span style={{ padding:'.25rem .65rem', borderRadius:999, background:`${urg.c}18`, color:urg.c, fontSize:'.65rem', fontWeight:700, flexShrink:0 }}>{urg.label}</span>
                </div>
                <div style={{ display:'flex', gap:'.6rem', marginBottom:'.9rem' }}>
                  <span style={{ padding:'.3rem .75rem', borderRadius:999, background:`${mood.c}18`, color:mood.c, fontSize:'.75rem', fontWeight:700 }}>{mood.e} {c.mood}</span>
                  <span style={{ padding:'.3rem .75rem', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.55)', fontSize:'.72rem', fontWeight:600 }}>💬 {c.sessions} sessions</span>
                </div>
                <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)', marginBottom:'.45rem', display:'flex', justifyContent:'space-between' }}>
                  <span>Recovery Progress</span><span style={{ color:T.lime, fontWeight:700 }}>{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress} color={T.lime}/>
                <div style={{ fontSize:'.72rem', color:c.urgency==='high'?T.coral:T.gold, fontWeight:600, marginTop:'.75rem' }}>Next: {c.nextAppt}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Client detail modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}
            onClick={()=>setSelectedClient(null)}>
            <motion.div initial={{ scale:.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:.9, opacity:0 }}
              onClick={e=>e.stopPropagation()}
              style={{ width:'100%', maxWidth:520, background:'#0F0E21', border:'1px solid rgba(255,255,255,0.12)', borderRadius:24, padding:'2rem', position:'relative' }}>
              <button onClick={()=>setSelectedClient(null)}
                style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.6)', width:30, height:30, borderRadius:8, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'1rem' }}>✕</button>
              <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.5rem' }}>
                <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${T.pink},${T.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.4rem' }}>{selectedClient.name.charAt(0)}</div>
                <div>
                  <h3 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'.2rem' }}>{selectedClient.name}</h3>
                  <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,0.45)' }}>{selectedClient.issue}</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                {[['Sessions',selectedClient.sessions,T.purple],['Progress',`${selectedClient.progress}%`,T.lime],['Mood',`${MOOD_CFG[selectedClient.mood]?.e} ${selectedClient.mood}`,MOOD_CFG[selectedClient.mood]?.c||T.blue],['Next Appt',selectedClient.nextAppt,T.gold]].map(([l,v,c])=>(
                  <div key={l} style={{ padding:'.9rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.38)', marginBottom:'.3rem' }}>{l}</div>
                    <div style={{ fontSize:'.95rem', fontWeight:700, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'1rem', background:'rgba(255,255,255,0.04)', borderRadius:14, marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.5rem' }}>Latest Session Note</div>
                <p style={{ fontSize:'.875rem', color:'rgba(255,255,255,0.65)', lineHeight:1.65 }}>{selectedClient.lastNote}</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                <button style={{ padding:'.75rem', borderRadius:12, border:`1px solid ${T.pink}40`, background:`${T.pink}12`, color:T.pink, fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Add Note</button>
                <button style={{ padding:'.75rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.pink},${T.purple})`, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Schedule Session</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounsellorClients;
