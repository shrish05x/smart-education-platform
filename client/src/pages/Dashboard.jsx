import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudyProgressWidget from '../components/dashboard/widgets/StudyProgressWidget';
import MentorMessagesWidget from '../components/dashboard/widgets/MentorMessagesWidget';
import CommunityActivityWidget from '../components/dashboard/widgets/CommunityActivityWidget';
import UpcomingSessionsWidget from '../components/dashboard/widgets/UpcomingSessionsWidget';
import RecommendedResourcesWidget from '../components/dashboard/widgets/RecommendedResourcesWidget';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';
import DailyAffirmation from '../components/dashboard/DailyAffirmation';
import BreathingExercise from '../components/dashboard/BreathingExercise';
import SafeCornerWidget from '../components/dashboard/SafeCornerWidget';
import WinRecapModal from '../components/dashboard/WinRecapModal';
import FocusMusicPlayer from '../components/dashboard/FocusMusicPlayer';

const T = {
  purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78',
  blue:'#858DFF', pink:'#FF98E2', teal:'#5EEAD4', sage:'#86EFAC',
};

/* ── Backgrounds ── */
const BG_STYLES = {
  default: '#0D0C1D',
  forest:  'linear-gradient(135deg,#0a1a0f,#102418,#0f1e16)',
  starry:  'linear-gradient(135deg,#060b1a,#0d1433,#080e27)',
  purple:  'linear-gradient(135deg,#120826,#1a0d36,#100620)',
  warm:    'linear-gradient(135deg,#150e00,#1c1200,#140c00)',
};

/* ── Pinned mentor cards ── */
const PINNED_MENTORS = [
  { name:'Dr. Priya Sharma', subject:'Machine Learning', rating:4.9, avatar:'👩‍💻', online:true, color:T.purple },
  { name:'Rohit Mehra',      subject:'System Design',   rating:4.8, avatar:'👨‍🏫', online:false, color:T.teal },
];

const StatCard = ({ label, value, change, icon, color }) => (
  <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
    whileHover={{ y:-4 }}
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', transition:'box-shadow .3s', cursor:'default' }}
    onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.4),0 0 30px ${color}18`}
    onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
      <span style={{ fontSize:'1.8rem', lineHeight:1 }}>{icon}</span>
      <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.3rem .7rem', borderRadius:999, background:`${color}18`, color, letterSpacing:'.04em' }}>{change}</span>
    </div>
    <div style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.03em', color, lineHeight:1, marginBottom:'.3rem' }}>{value}</div>
    <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{label}</div>
  </motion.div>
);

const QuickLink = ({ to, icon, label, color }) => (
  <Link to={to} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.1rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', textDecoration:'none', transition:'all .25s' }}
    onMouseEnter={e=>{ e.currentTarget.style.background=`${color}14`; e.currentTarget.style.borderColor=`${color}44`; e.currentTarget.style.transform='translateY(-3px)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; }}>
    <span style={{ fontSize:'1.3rem' }}>{icon}</span>
    <span style={{ fontSize:'.82rem', fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{label}</span>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  // Feature states
  const [showBreathing, setShowBreathing] = useState(false);
  const [hideProgress, setHideProgress] = useState(false);
  const [bgKey, setBgKey] = useState('default');

  // Win Recap: show on Monday mornings only
  const now = new Date();
  const isMonday = now.getDay() === 1;
  const isMorning = now.getHours() < 12;
  const recapKey = `winRecapDismissed_${now.getFullYear()}_${now.getMonth()}_${Math.floor(now.getDate()/7)}`;
  const [showWinRecap, setShowWinRecap] = useState(() => isMonday && isMorning && !localStorage.getItem(recapKey));
  const dismissWinRecap = () => { localStorage.setItem(recapKey, '1'); setShowWinRecap(false); };

  const stats = [
    { label:'Study Hours this week',  value:'18.5h', change:'+2.5h',    icon:'📖', color:T.purple },
    { label:'Assignments completed',  value:'34/42', change:'81%',      icon:'✅', color:T.sage   },
    { label:'Mentor Sessions',        value:'3',     change:'This week', icon:'👨‍🏫', color:T.teal   },
    { label:'Community Posts',        value:'8',     change:'+3 new',   icon:'💬', color:T.gold   },
  ];

  const quickLinks = [
    { to:'/ai-assistant',  icon:'🤖', label:'Ask AI Tutor',     color:T.blue   },
    { to:'/mentors',       icon:'👨‍🏫', label:'Find Mentors',     color:T.purple },
    { to:'/community',     icon:'💬', label:'Study Groups',      color:T.lime   },
    { to:'/internships',   icon:'💼', label:'Internships',       color:T.gold   },
    { to:'/mental-health', icon:'🧘', label:'Wellness Support',  color:T.pink   },
    { to:'/resources',     icon:'📚', label:'Resources',         color:T.coral  },
  ];

  const bg = BG_STYLES[bgKey] || BG_STYLES.default;

  return (
    <>
      {/* Dynamic background overlay */}
      <AnimatePresence mode="wait">
        <motion.div key={bgKey} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ position:'fixed', inset:0, background:bg, zIndex:-1, pointerEvents:'none', transition:'background 1s' }}/>
      </AnimatePresence>

      <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>

        {/* ── Welcome header ── */}
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
          style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.25rem' }}>
              {greeting},{' '}
              <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{firstName}</span> 👋
            </h1>
            {/* Warm encouraging sub-message */}
            <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.9rem' }}>
              You've built a strong foundation this week — let's grow it together. 🌱
            </p>
          </div>
          <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap', alignItems:'center' }}>
            {/* Safe Zone badge */}
            <span style={{ padding:'.4rem 1rem', borderRadius:999, background:`rgba(94,234,212,0.1)`, border:`1px solid rgba(94,234,212,0.25)`, color:T.teal, fontSize:'.78rem', fontWeight:700, display:'flex', alignItems:'center', gap:'.3rem' }}>
              🔒 {firstName}'s Safe Zone
            </span>
            <span style={{ padding:'.4rem 1rem', borderRadius:999, background:`rgba(172,106,255,0.12)`, border:`1px solid rgba(172,106,255,0.25)`, color:T.purple, fontSize:'.78rem', fontWeight:700, textTransform:'capitalize' }}>
              🎓 {user?.role || 'Student'}
            </span>
            {/* Need a break? button */}
            <motion.button
              whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
              onClick={() => setShowBreathing(true)}
              style={{ padding:'.4rem 1rem', borderRadius:999, background:`rgba(255,152,226,0.1)`, border:`1px solid rgba(255,152,226,0.25)`, color:T.pink, fontSize:'.78rem', fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif", display:'flex', alignItems:'center', gap:'.35rem' }}>
              <motion.span animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }}>🧘</motion.span>
              Need a break?
            </motion.button>
          </div>
        </motion.div>

        {/* ── Pinned Mentors ── */}
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}>
          <div style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'.7rem' }}>📌 My Mentors</div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {PINNED_MENTORS.map(m => (
              <div key={m.name} style={{ display:'flex', alignItems:'center', gap:'.85rem', padding:'.75rem 1rem', borderRadius:16, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', flex:'0 0 auto', backdropFilter:'blur(20px)' }}>
                <div style={{ position:'relative' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:`${m.color}25`, border:`2px solid ${m.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>{m.avatar}</div>
                  {m.online && <div style={{ position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:T.lime, border:'2px solid #0D0C1D' }}/>}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'.85rem' }}>{m.name}</div>
                  <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.42)' }}>{m.subject} · ⭐{m.rating}</div>
                </div>
                <Link to="/mentors" style={{ padding:'.35rem .85rem', borderRadius:8, background:`${m.color}18`, border:`1px solid ${m.color}35`, color:m.color, fontSize:'.72rem', fontWeight:700, textDecoration:'none', marginLeft:'.5rem' }}>Message</Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Stats ── */}
        {!hideProgress ? (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ padding:'1.2rem 1.5rem', borderRadius:16, background:'rgba(94,234,212,0.06)', border:`1px solid ${T.teal}25`, textAlign:'center', color:'rgba(255,255,255,0.45)', fontSize:'.9rem' }}>
            📊 Progress is taking a rest today — and that's perfectly okay. 💙
          </motion.div>
        )}

        {/* ── Quick links ── */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'1.4rem' }}>
            <div style={{ fontSize:'.8rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1rem' }}>Quick Access</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'.75rem' }}>
              {quickLinks.map(l => <QuickLink key={l.to} {...l}/>)}
            </div>
          </div>
        </motion.div>

        {/* ── Charts ── */}
        {!hideProgress && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
            <WeeklyStudyChart />
            <CourseCompletionChart />
          </div>
        )}

        {/* ── Widgets ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem' }}>
          <StudyProgressWidget />
          <MentorMessagesWidget />
          <UpcomingSessionsWidget />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
          <CommunityActivityWidget />
          <RecommendedResourcesWidget />
        </div>
      </div>

      {/* ── Floating widgets (visible on all dashboard pages) ── */}
      <DailyAffirmation />
      <SafeCornerWidget
        onHideProgressChange={setHideProgress}
        onBgChange={bg => setBgKey(bg.id)}
      />
      <FocusMusicPlayer />

      {/* ── Modals ── */}
      <AnimatePresence>
        {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showWinRecap && <WinRecapModal weeklyHours={18.5} weeklyAssignments={5} onClose={dismissWinRecap} />}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
