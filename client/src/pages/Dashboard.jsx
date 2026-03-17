import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StudyProgressWidget from '../components/dashboard/widgets/StudyProgressWidget';
import MentorMessagesWidget from '../components/dashboard/widgets/MentorMessagesWidget';
import CommunityActivityWidget from '../components/dashboard/widgets/CommunityActivityWidget';
import UpcomingSessionsWidget from '../components/dashboard/widgets/UpcomingSessionsWidget';
import RecommendedResourcesWidget from '../components/dashboard/widgets/RecommendedResourcesWidget';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

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
    <div style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.03em', color:color, lineHeight:1, marginBottom:'.3rem' }}>{value}</div>
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
  const navigate = useNavigate();
  const [completion, setCompletion] = useState(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (!user?._id) return;
    api.get(`/profile/completion-status/${user._id}`)
      .then(({ data }) => { if (data.success) setCompletion(data.data); })
      .catch(() => setCompletion({ completionPercentage: 0, isVerified: false }));
  }, [user]);

  const stats = [
    { label:'Study Hours',       value:'18.5h', change:'+2.5h',    icon:'📖', color:T.purple },
    { label:'Assignments Done',  value:'34/42', change:'81%',      icon:'✅', color:T.lime   },
    { label:'Mentor Sessions',   value:'3',     change:'This week',icon:'👨‍🏫', color:T.blue   },
    { label:'Community Posts',   value:'8',     change:'+3 new',   icon:'💬', color:T.gold   },
  ];

  const quickLinks = [
    { to:'/ai-assistant',  icon:'🤖', label:'Ask AI Tutor',     color:T.blue   },
    { to:'/mentors',       icon:'👨‍🏫', label:'Find Mentors',     color:T.purple },
    { to:'/community',     icon:'💬', label:'Study Groups',      color:T.lime   },
    { to:'/internships',   icon:'💼', label:'Internships',       color:T.gold   },
    { to:'/mental-health', icon:'🧘', label:'Wellness Support',  color:T.pink   },
    { to:'/resources',     icon:'📚', label:'Resources',         color:T.coral  },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>

      {/* Welcome header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
        style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
            {greeting}, <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.9rem' }}>Here's what's happening with your studies today.</p>
        </div>
        <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
          <span style={{ padding:'.4rem 1rem', borderRadius:999, background:`rgba(172,106,255,0.12)`, border:`1px solid rgba(172,106,255,0.25)`, color:T.purple, fontSize:'.78rem', fontWeight:700, textTransform:'capitalize' }}>
            🎓 {user?.role || 'Student'}
          </span>
          {user?.university && (
            <span style={{ padding:'.4rem 1rem', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.65)', fontSize:'.78rem', fontWeight:600 }}>
              🏫 {user.university}
            </span>
          )}
        </div>
      </motion.div>

      {/* Profile completion banner */}
      {completion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className={`rounded-2xl p-4 shadow-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
            completion.isVerified
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {completion.isVerified ? (
              <span className="text-lg px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">✔ Verified</span>
            ) : (
              <span className="text-lg px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">⚠ Incomplete</span>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Profile {completion.completionPercentage}% complete
              </p>
              <div className="w-40 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completion.completionPercentage}%`,
                    background: completion.isVerified
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #f59e0b, #d97706)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          {!completion.isVerified && (
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
               Complete Profile →
            </button>
          )}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        {stats.map((s,i) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'1.4rem' }}>
          <div style={{ fontSize:'.8rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1rem' }}>Quick Access</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'.75rem' }}>
            {quickLinks.map(l => <QuickLink key={l.to} {...l}/>)}
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
        <WeeklyStudyChart />
        <CourseCompletionChart />
      </div>

      {/* Widgets */}
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
  );
};

export default Dashboard;
