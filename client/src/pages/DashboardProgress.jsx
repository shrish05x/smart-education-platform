import { motion } from 'framer-motion';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const STATS = [
  { label:'Total Study Hours',  value:'142h',  icon:'⏱️', color:T.purple },
  { label:'Average Score',      value:'87%',   icon:'🎯', color:T.lime   },
  { label:'Assignments Done',   value:'34/42', icon:'📝', color:T.blue   },
  { label:'Overall Progress',   value:'64%',   icon:'📈', color:T.gold   },
];

const BADGES = [
  { title:'Week Warrior',   desc:'7-day study streak',               icon:'🔥', earned:true  },
  { title:'Quick Learner',  desc:'Complete 5 modules in a week',      icon:'⚡', earned:true  },
  { title:'Community Star', desc:'10 helpful answers',                icon:'⭐', earned:false },
  { title:'Bookworm',       desc:'100 hours of study',                icon:'📚', earned:true  },
  { title:'Team Player',    desc:'Join 3 study groups',               icon:'🤝', earned:false },
  { title:'Data Wizard',    desc:'Complete all Data Science modules', icon:'🧙', earned:false },
];

const DashboardProgress = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.25rem' }}>
        Study <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Progress</span>
      </h1>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>Track your learning journey and achievements</p>
    </motion.div>

    {/* Stats */}
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.06 }}
      style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem' }}>
      {STATS.map((s,i) => (
        <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.1+i*.05 }}
          whileHover={{ y:-4 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.3rem', transition:'box-shadow .3s', cursor:'default' }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.3),0 0 30px ${s.color}20`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
          <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}18`, border:`1px solid ${s.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', marginBottom:'.9rem' }}>{s.icon}</div>
          <div style={{ fontSize:'1.8rem', fontWeight:900, color:s.color, letterSpacing:'-.03em', lineHeight:1, marginBottom:'.3rem' }}>{s.value}</div>
          <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{s.label}</div>
        </motion.div>
      ))}
    </motion.div>

    {/* Charts */}
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
      <WeeklyStudyChart/>
      <CourseCompletionChart/>
    </div>

    {/* Badges */}
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'1.8rem' }}>
      <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.3rem' }}>🏆 Recent Milestones</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'1rem' }}>
        {BADGES.map((b,i) => (
          <motion.div key={b.title} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.35+i*.05 }}
            style={{ padding:'1.1rem', borderRadius:16, border:`2px solid ${b.earned?`${T.purple}35`:'rgba(255,255,255,0.07)'}`, background: b.earned?`rgba(172,106,255,0.07)`:'rgba(255,255,255,0.03)', opacity: b.earned?1:.55, transition:'all .3s' }}
            onMouseEnter={e=>{ if(b.earned){ e.currentTarget.style.borderColor=`${T.purple}60`; e.currentTarget.style.transform='translateY(-3px)'; } }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=b.earned?`${T.purple}35`:'rgba(255,255,255,0.07)'; e.currentTarget.style.transform=''; }}>
            <div style={{ fontSize:'1.7rem', marginBottom:'.6rem' }}>{b.icon}</div>
            <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.2rem' }}>{b.title}</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)' }}>{b.desc}</div>
            {b.earned && <div style={{ fontSize:'.68rem', color:T.lime, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginTop:'.5rem' }}>✓ Earned</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default DashboardProgress;
