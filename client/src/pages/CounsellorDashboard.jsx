import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const MoodBadge = ({ mood }) => {
  const cfg = { Calm:{ c:T.lime, e:'😌' }, Anxious:{ c:T.gold, e:'😰' }, Stressed:{ c:T.coral, e:'😤' }, Positive:{ c:T.purple, e:'😊' }, Down:{ c:T.blue, e:'😔' }, Neutral:{ c:'rgba(255,255,255,0.5)', e:'😐' } };
  const { c='rgba(255,255,255,0.5)', e='😐' } = cfg[mood]||{};
  return <span style={{ padding:'.25rem .7rem', borderRadius:999, background:`${c}18`, color:c, fontSize:'.7rem', fontWeight:700 }}>{e} {mood}</span>;
};

const MOCK_CLIENTS = [
  { id:1, name:'Anika Sharma',    lastSession:'2 days ago',  mood:'Anxious',  sessions:6,  nextAppt:'Today 4 PM',     concern:'Exam stress',   progress:65 },
  { id:2, name:'Rahul Desai',     lastSession:'1 week ago',  mood:'Positive', sessions:12, nextAppt:'Thu 11 AM',      concern:'Social anxiety',progress:80 },
  { id:3, name:'Meera Joshi',     lastSession:'Yesterday',   mood:'Stressed', sessions:3,  nextAppt:'Tomorrow 3 PM', concern:'Academic burnout',progress:40 },
  { id:4, name:'Aryan Kapoor',    lastSession:'3 days ago',  mood:'Calm',     sessions:8,  nextAppt:'Fri 2 PM',       concern:'Transition anxiety',progress:72 },
  { id:5, name:'Divya Nair',      lastSession:'5 days ago',  mood:'Down',     sessions:4,  nextAppt:'Mon 10 AM',      concern:'Loneliness',    progress:35 },
  { id:6, name:'Siddharth Rao',   lastSession:'Today',       mood:'Neutral',  sessions:9,  nextAppt:'Next week',      concern:'Motivation',    progress:58 },
];

const ProgressBar = ({ value, color }) => (
  <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
    <motion.div initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:.8, ease:'easeOut' }}
      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }}/>
  </div>
);

const CounsellorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label:'Active Clients',      value:'18',   icon:'👥', color:T.pink   },
    { label:'Sessions This Month', value:'34',   icon:'📅', color:T.purple },
    { label:'Avg. Satisfaction',   value:'4.9⭐', icon:'💙', color:T.blue   },
    { label:'Mood Improved',       value:'76%',  icon:'📈', color:T.lime   },
  ];

  const todayAppointments = [
    { name:'Anika Sharma',  time:'10:00 AM', type:'Follow-up',       mood:'Anxious', color:T.gold   },
    { name:'Meera Joshi',   time:'12:30 PM', type:'Initial Session', mood:'Stressed', color:T.coral  },
    { name:'Divya Nair',    time:'3:00 PM',  type:'Check-in',       mood:'Down',    color:T.blue   },
    { name:'Aryan Kapoor',  time:'5:00 PM',  type:'Therapy Session', mood:'Calm',   color:T.lime   },
  ];

  const moodDistribution = [
    { label:'Calm',     count:28, color:T.lime   },
    { label:'Anxious',  count:20, color:T.gold   },
    { label:'Stressed', count:15, color:T.coral  },
    { label:'Positive', count:18, color:T.purple },
    { label:'Down',     count:12, color:T.blue   },
  ];
  const moodTotal = moodDistribution.reduce((s,m)=>s+m.count,0);

  const quickLinks = [
    { to:'/counsellor/clients',     icon:'👥', label:'My Clients',  color:T.pink   },
    { to:'/counsellor/availability',icon:'🗓️', label:'Schedule',    color:T.gold   },
    { to:'/counsellor/notes',       icon:'📝', label:'Notes',       color:T.blue   },
    { to:'/counsellor/reports',     icon:'📊', label:'Reports',     color:T.lime   },
    { to:'/community',              icon:'💬', label:'Community',   color:T.coral  },
    { to:'/meetups',                icon:'📍', label:'Meetups',     color:T.purple },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          Good day, <span style={{ background:`linear-gradient(135deg,${T.pink},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name?.split(' ')[0]}</span> 🌿
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.9rem' }}>You have {todayAppointments.length} appointments scheduled for today.</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.05+i*.05 }} whileHover={{ y:-4 }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', transition:'box-shadow .3s' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.4),0 0 30px ${s.color}18`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
            <div style={{ fontSize:'1.8rem', marginBottom:'.75rem' }}>{s.icon}</div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color:s.color, letterSpacing:'-.03em', marginBottom:'.25rem' }}>{s.value}</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'1.4rem' }}>
        <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1rem' }}>Quick Access</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'.75rem' }}>
          {quickLinks.map(l => (
            <Link key={l.to} to={l.to}
              style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.1rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', textDecoration:'none', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${l.color}14`; e.currentTarget.style.borderColor=`${l.color}44`; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; }}>
              <span style={{ fontSize:'1.2rem' }}>{l.icon}</span>
              <span style={{ fontSize:'.82rem', fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.5rem' }}>
        {/* Today's appointments */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'1.1rem' }}>📅 Today's Appointments</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
            {todayAppointments.map(a => (
              <div key={a.name} style={{ display:'flex', alignItems:'center', gap:'.9rem', padding:'.9rem 1.1rem', background:'rgba(255,255,255,0.03)', borderRadius:14, borderLeft:`3px solid ${a.color}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:'.875rem', marginBottom:'.2rem' }}>{a.name}</div>
                  <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.42)' }}>{a.type}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'.78rem', color:a.color, fontWeight:700 }}>{a.time}</div>
                  <MoodBadge mood={a.mood}/>
                </div>
              </div>
            ))}
          </div>
          <Link to="/counsellor/availability" style={{ display:'block', textAlign:'center', marginTop:'1rem', fontSize:'.8rem', color:T.pink, fontWeight:600, textDecoration:'none' }}>View full schedule →</Link>
        </motion.div>

        {/* Mood distribution */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'1.1rem' }}>🧠 Client Mood Overview</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
            {moodDistribution.map(m => (
              <div key={m.label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.35rem' }}>
                  <span style={{ fontSize:'.8rem', color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{m.label}</span>
                  <span style={{ fontSize:'.78rem', fontWeight:700, color:m.color }}>{m.count} clients · {Math.round(m.count/moodTotal*100)}%</span>
                </div>
                <ProgressBar value={m.count/moodTotal*100} color={m.color}/>
              </div>
            ))}
          </div>
          <Link to="/counsellor/reports" style={{ display:'block', textAlign:'center', marginTop:'1.1rem', fontSize:'.8rem', color:T.lime, fontWeight:600, textDecoration:'none' }}>Full mood report →</Link>
        </motion.div>
      </div>

      {/* Recent clients */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem' }}>
          <div style={{ fontWeight:700, fontSize:'1rem' }}>👥 Active Clients</div>
          <Link to="/counsellor/clients" style={{ fontSize:'.8rem', color:T.pink, fontWeight:600, textDecoration:'none' }}>View all →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
          {MOCK_CLIENTS.slice(0,4).map(c => (
            <div key={c.id} style={{ padding:'1.1rem', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${T.pink}35`; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.9rem' }}>
                <div style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg,${T.pink},${T.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.95rem', flexShrink:0 }}>
                  {c.name.charAt(0)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:'.875rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>{c.concern}</div>
                </div>
                <MoodBadge mood={c.mood}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:'rgba(255,255,255,0.38)', marginBottom:'.5rem' }}>
                <span>Progress</span><span style={{ color:T.lime, fontWeight:700 }}>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} color={T.lime}/>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.3)', marginTop:'.7rem' }}>Next: {c.nextAppt}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily reminder */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.26 }}
        style={{ background:`linear-gradient(135deg,rgba(255,152,226,0.06),rgba(172,106,255,0.06))`, border:`1px solid rgba(255,152,226,0.18)`, borderRadius:20, padding:'1.4rem', display:'flex', alignItems:'flex-start', gap:'1rem' }}>
        <span style={{ fontSize:'2rem', flexShrink:0 }}>🌿</span>
        <div>
          <div style={{ fontWeight:700, color:T.pink, marginBottom:'.3rem' }}>Counsellor Reminder</div>
          <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'.875rem', lineHeight:1.65 }}>
            Remember to document today's session notes within 24 hours. Timely notes help track client progress and ensure continuity of care. <strong>3 pending notes</strong> from last week — <Link to="/counsellor/notes" style={{ color:T.pink, textDecoration:'none', fontWeight:600 }}>complete them now →</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CounsellorDashboard;
