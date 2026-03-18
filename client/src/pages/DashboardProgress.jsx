import { useState } from 'react';
import { motion } from 'framer-motion';
import WeeklyStudyChart from '../components/dashboard/charts/WeeklyStudyChart';
import CourseCompletionChart from '../components/dashboard/charts/CourseCompletionChart';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2', teal:'#5EEAD4', sage:'#86EFAC' };

const STATS = [
  { label:'Total Study Hours',  value:'142h',  icon:'⏱️', color:T.purple },
  { label:'Average Score',      value:'87%',   icon:'🎯', color:T.sage   },
  { label:'Assignments Done',   value:'34/42', icon:'📝', color:T.teal   },
  { label:'Overall Progress',   value:'64%',   icon:'📈', color:T.gold   },
];

const BADGES = [
  { title:'Week Warrior',   desc:'7-day study streak',               icon:'🔥', earned:true  },
  { title:'Quick Learner',  desc:'Complete 5 modules in a week',     icon:'⚡', earned:true  },
  { title:'Community Star', desc:'10 helpful answers',               icon:'⭐', earned:false },
  { title:'Bookworm',       desc:'100 hours of study',               icon:'📚', earned:true  },
  { title:'Team Player',    desc:'Join 3 study groups',              icon:'🤝', earned:false },
  { title:'Data Wizard',    desc:'Complete all Data Science modules',icon:'🧙', earned:false },
];

/* Growth areas — warm encouraging bars */
const GROWTH_AREAS = [
  { subject:'Machine Learning',    pct:48, tip:'You\'ve built a strong foundation in ML (48%) — let\'s grow it to 60% this week! 🚀' },
  { subject:'Data Structures',     pct:38, tip:'You\'re building real problem-solving muscle here (38%) — halfway is closer than you think! 💪' },
  { subject:'System Design',       pct:55, tip:'Over halfway on System Design (55%) — you can reach 70% by next session! ✨' },
];

const GrowthBar = ({ subject, pct, tip }) => {
  const [hovered, setHovered] = useState(false);
  const warmColor = pct < 50 ? '#F97316' : T.gold; // orange for <50, gold for ≥50
  return (
    <div style={{ position:'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.35rem', alignItems:'center' }}>
        <span style={{ fontSize:'.82rem', fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{subject}</span>
        <span style={{ fontSize:'.78rem', fontWeight:700, color:warmColor }}>
          {pct}% — Growth Area 🌱
        </span>
      </div>
      <div style={{ height:8, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:.9, ease:'easeOut' }}
          style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${warmColor},${warmColor}90)` }}/>
      </div>
      {/* Encouraging tooltip */}
      {hovered && (
        <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          style={{ position:'absolute', bottom:'110%', left:0, right:0, background:'rgba(13,12,29,0.97)', border:`1px solid ${warmColor}40`, borderRadius:12, padding:'.65rem .9rem', fontSize:'.78rem', color:'rgba(255,255,255,0.8)', lineHeight:1.65, boxShadow:`0 8px 24px rgba(0,0,0,0.4)`, zIndex:10, whiteSpace:'normal' }}>
          💡 {tip}
        </motion.div>
      )}
    </div>
  );
};

const DashboardProgress = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.25rem' }}>
        Your Learning <span style={{ background:`linear-gradient(135deg,${T.purple},${T.teal})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Journey</span>
      </h1>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>
        Every step forward — even tiny ones — is building something extraordinary. 🌱
      </p>
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

    {/* Growth Areas */}
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
      style={{ background:'rgba(255,255,255,0.04)', border:`1px solid rgba(249,115,22,0.2)`, backdropFilter:'blur(20px)', borderRadius:22, padding:'1.8rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'1.3rem' }}>
        <span style={{ fontSize:'1.1rem' }}>🌱</span>
        <div>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'#F97316', textTransform:'uppercase', letterSpacing:'.09em' }}>Growth Areas</div>
          <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.35)', marginTop:'.15rem' }}>Hover over any bar for an encouraging tip 💡</div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
        {GROWTH_AREAS.map(g => <GrowthBar key={g.subject} {...g}/>)}
      </div>
    </motion.div>

    {/* Badges */}
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'1.8rem' }}>
      <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.3rem' }}>🏆 Milestones & Badges</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'1rem' }}>
        {BADGES.map((b,i) => (
          <motion.div key={b.title} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.35+i*.05 }}
            style={{ padding:'1.1rem', borderRadius:16, border:`2px solid ${b.earned?`${T.purple}35`:'rgba(255,255,255,0.07)'}`, background: b.earned?`rgba(172,106,255,0.07)`:'rgba(255,255,255,0.03)', opacity: b.earned?1:.55, transition:'all .3s' }}
            onMouseEnter={e=>{ if(b.earned){ e.currentTarget.style.borderColor=`${T.purple}60`; e.currentTarget.style.transform='translateY(-3px)'; } }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=b.earned?`${T.purple}35`:'rgba(255,255,255,0.07)'; e.currentTarget.style.transform=''; }}>
            <div style={{ fontSize:'1.7rem', marginBottom:'.6rem' }}>{b.icon}</div>
            <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.2rem' }}>{b.title}</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.4)' }}>{b.desc}</div>
            {b.earned && <div style={{ fontSize:'.68rem', color:T.sage, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginTop:'.5rem' }}>✓ Earned</div>}
            {!b.earned && <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,0.28)', marginTop:'.5rem' }}>Keep going — you're close!</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default DashboardProgress;
