import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TYPE_CFG = {
  study:       { icon:'📖', color:T.purple },
  mentoring:   { icon:'👨‍🏫', color:T.blue   },
  community:   { icon:'💬', color:T.lime   },
  achievement: { icon:'🏆', color:T.gold   },
  internship:  { icon:'💼', color:T.coral  },
  counseling:  { icon:'❤️', color:T.pink   },
};

const ACTIVITIES = [
  { _id:'1', type:'study',       title:'Completed Chapter 5: Data Structures',    description:'Finished binary trees and heap implementations',     time:'1h ago'  },
  { _id:'2', type:'mentoring',   title:'Mentor Session with Dr. Sarah Chen',       description:'Reviewed calculus integration techniques',            time:'3h ago'  },
  { _id:'3', type:'community',   title:'Posted in CS201 Discussion',               description:'Shared solution approach for sorting algorithms',      time:'5h ago'  },
  { _id:'4', type:'achievement', title:'Earned "Week Warrior" Badge',              description:'7-day study streak achieved!',                        time:'1d ago'  },
  { _id:'5', type:'study',       title:'Started Machine Learning Module',          description:'Beginning neural network fundamentals',               time:'1d ago'  },
  { _id:'6', type:'internship',  title:'Applied to Google SWE Internship',         description:'Application submitted successfully',                  time:'2d ago'  },
  { _id:'7', type:'counseling',  title:'Wellbeing Check-in Completed',             description:'Monthly mental health assessment',                    time:'3d ago'  },
  { _id:'8', type:'study',       title:'Completed Quiz: Database Systems',         description:'Scored 92% on normalisation quiz',                   time:'3d ago'  },
];

const FILTERS = ['All', 'Study', 'Mentoring', 'Community', 'Achievement', 'Internship'];

const DashboardActivity = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ACTIVITIES.filter(a =>
    activeFilter === 'All' || a.type === activeFilter.toLowerCase()
  );

  return (
    <div style={{ maxWidth:680, display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.25rem' }}>
          Recent <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Activity</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>Your learning activity timeline</p>
      </motion.div>

      {/* Filter chips */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
        style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
        {FILTERS.map(f => {
          const cfg = TYPE_CFG[f.toLowerCase()];
          const active = activeFilter === f;
          return (
            <button key={f} onClick={()=>setActiveFilter(f)}
              style={{ padding:'.45rem 1rem', borderRadius:999, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.78rem', fontWeight:600, transition:'all .2s',
                background: active ? (cfg ? `${cfg.color}20` : `rgba(172,106,255,0.15)`) : 'rgba(255,255,255,0.05)',
                color: active ? (cfg?.color || T.purple) : 'rgba(255,255,255,0.5)',
                boxShadow: active ? `0 0 16px ${cfg?.color || T.purple}25` : 'none',
                border: active ? `1px solid ${cfg?.color || T.purple}40` : '1px solid rgba(255,255,255,0.08)',
              }}>
              {cfg?.icon && `${cfg.icon} `}{f}
            </button>
          );
        })}
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, overflow:'hidden' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const cfg = TYPE_CFG[item.type] || TYPE_CFG.study;
            return (
              <motion.div key={item._id} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ delay:.05+i*.04 }}
                style={{ display:'flex', alignItems:'flex-start', gap:'1rem', padding:'1.1rem 1.4rem', borderBottom: i<filtered.length-1?'1px solid rgba(255,255,255,0.06)':'none', transition:'background .2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {/* Icon */}
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${cfg.color}18`, border:`1px solid ${cfg.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:`0 0 16px ${cfg.color}20` }}>
                    {cfg.icon}
                  </div>
                  {i < filtered.length-1 && (
                    <div style={{ position:'absolute', top:44, left:'50%', transform:'translateX(-50%)', width:1, height:28, background:'rgba(255,255,255,0.07)' }}/>
                  )}
                </div>
                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
                    <div>
                      <p style={{ fontWeight:600, fontSize:'.875rem', marginBottom:'.2rem' }}>{item.title}</p>
                      <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.42)' }}>{item.description}</p>
                    </div>
                    <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.3)', flexShrink:0, marginTop:'.15rem' }}>{item.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DashboardActivity;
