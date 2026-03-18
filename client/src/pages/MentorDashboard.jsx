import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const StatCard = ({ label, value, icon, color, sub }) => (
  <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} whileHover={{ y:-4 }}
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', cursor:'default', transition:'box-shadow .3s' }}
    onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.4),0 0 30px ${color}18`}
    onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
      <span style={{ fontSize:'1.8rem' }}>{icon}</span>
      {sub && <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.3rem .7rem', borderRadius:999, background:`${color}18`, color }}>{sub}</span>}
    </div>
    <div style={{ fontSize:'1.8rem', fontWeight:900, letterSpacing:'-.03em', color, lineHeight:1, marginBottom:'.25rem' }}>{value}</div>
    <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{label}</div>
  </motion.div>
);

const SessionRequestCard = ({ name, subject, time, status }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.2rem', background:'rgba(255,255,255,0.03)', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
      {name.charAt(0)}
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontWeight:600, fontSize:'.875rem', marginBottom:'.15rem' }}>{name}</div>
      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.42)' }}>{subject} · {time}</div>
    </div>
    <div style={{ display:'flex', gap:'.5rem' }}>
      <button style={{ padding:'.4rem .9rem', borderRadius:8, border:'none', background:`${T.lime}18`, color:T.lime, fontWeight:700, fontSize:'.75rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Accept</button>
      <button style={{ padding:'.4rem .9rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', fontWeight:600, fontSize:'.75rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Decline</button>
    </div>
  </div>
);

const UpcomingSession = ({ name, time, type, color }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'.9rem', padding:'.9rem 1.1rem', background:'rgba(255,255,255,0.03)', borderRadius:12, borderLeft:`3px solid ${color}` }}>
    <div style={{ flex:1 }}>
      <div style={{ fontWeight:600, fontSize:'.875rem' }}>{name}</div>
      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)', marginTop:'.1rem' }}>{type}</div>
    </div>
    <div style={{ fontSize:'.78rem', color:color, fontWeight:700 }}>{time}</div>
  </div>
);

const MentorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label:'Active Mentees',    value:'12',   icon:'👥', color:T.purple, sub:'+2 this week'   },
    { label:'Sessions This Month', value:'28', icon:'📅', color:T.blue,   sub:'92% completion' },
    { label:'Avg. Rating',       value:'4.8',  icon:'⭐', color:T.gold,   sub:'from 94 reviews' },
    { label:'Monthly Earnings',  value:'₹12k', icon:'💰', color:T.lime,   sub:'+18% vs last month' },
  ];

  const pendingRequests = [
    { name:'Arjun Sharma',   subject:'Data Structures',     time:'Requested 2h ago' },
    { name:'Priya Nair',     subject:'System Design',       time:'Requested 5h ago' },
    { name:'Ravi Mehta',     subject:'Interview Prep',      time:'Requested 1d ago' },
  ];

  const upcomingSessions = [
    { name:'Ananya Singh',   time:'Today 4:00 PM', type:'1-on-1 Mentoring',       color:T.purple },
    { name:'Karan Verma',    time:'Today 6:30 PM', type:'Portfolio Review',        color:T.blue   },
    { name:'Shreya Patel',   time:'Tomorrow 11 AM', type:'Career Guidance',        color:T.lime   },
    { name:'Dev Kumar',      time:'Tomorrow 3 PM',  type:'Technical Interview Prep', color:T.gold  },
  ];

  const quickLinks = [
    { to:'/mentor/students',    icon:'👥', label:'My Mentees',    color:T.blue   },
    { to:'/mentor/availability',icon:'🗓️', label:'Set Schedule',  color:T.gold   },
    { to:'/mentor/analytics',   icon:'📊', label:'Analytics',     color:T.lime   },
    { to:'/mentorship/sessions',icon:'📅', label:'All Sessions',  color:T.purple },
    { to:'/community',          icon:'💬', label:'Community',     color:T.coral  },
    { to:'/resources',          icon:'📚', label:'Resources',     color:T.pink   },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          Welcome back, <span style={{ background:`linear-gradient(135deg,${T.gold},${T.coral})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.9rem' }}>Here's your mentoring overview for today.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.06 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        {stats.map(s => <StatCard key={s.label} {...s}/>)}
      </motion.div>

      {/* Quick links */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'1.4rem' }}>
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
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.5rem' }}>
        {/* Pending session requests */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem' }}>
            <div style={{ fontWeight:700, fontSize:'1rem' }}>🔔 Pending Requests</div>
            <span style={{ padding:'.3rem .7rem', borderRadius:999, background:`${T.coral}18`, color:T.coral, fontSize:'.72rem', fontWeight:700 }}>{pendingRequests.length} new</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {pendingRequests.map(r => <SessionRequestCard key={r.name} {...r}/>)}
          </div>
          <Link to="/mentorship/sessions" style={{ display:'block', textAlign:'center', marginTop:'1rem', fontSize:'.8rem', color:T.purple, fontWeight:600, textDecoration:'none' }}>View all sessions →</Link>
        </motion.div>

        {/* Upcoming sessions */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'1.1rem' }}>📅 Upcoming Sessions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
            {upcomingSessions.map(s => <UpcomingSession key={s.name} {...s}/>)}
          </div>
          <Link to="/mentor/availability" style={{ display:'block', textAlign:'center', marginTop:'1rem', fontSize:'.8rem', color:T.gold, fontWeight:600, textDecoration:'none' }}>Manage availability →</Link>
        </motion.div>
      </div>

      {/* Mentor Tips */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
        style={{ background:`linear-gradient(135deg,rgba(255,200,118,0.06),rgba(172,106,255,0.06))`, border:`1px solid rgba(255,200,118,0.18)`, borderRadius:20, padding:'1.4rem', display:'flex', alignItems:'flex-start', gap:'1rem' }}>
        <span style={{ fontSize:'2rem', flexShrink:0 }}>💡</span>
        <div>
          <div style={{ fontWeight:700, color:T.gold, marginBottom:'.3rem' }}>Mentor Tip of the Day</div>
          <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'.875rem', lineHeight:1.65 }}>
            <strong>Active listening</strong> is your superpower. Before giving advice, ask your mentee "What do you think is blocking you?" — it builds critical thinking and self-reliance. 🎯
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorDashboard;
