import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const BarChart = ({ data, color, label }) => {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div>
      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.42)', fontWeight:600, marginBottom:'.8rem', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
      <div style={{ display:'flex', gap:'.5rem', alignItems:'flex-end', height:100 }}>
        {data.map((d,i)=>(
          <div key={d.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:'.4rem' }}>
            <motion.div initial={{ height:0 }} animate={{ height:`${(d.value/max)*80}px` }} transition={{ delay:.1+i*.06 }}
              style={{ width:'100%', borderRadius:'6px 6px 0 0', background:`linear-gradient(to top,${color},${color}80)`, minHeight:4 }}/>
            <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,0.38)' }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MentorAnalytics = () => {
  const stats = [
    { label:'Total Earnings',    value:'₹48,200', icon:'💰', color:T.lime,   change:'+18%' },
    { label:'Sessions Completed',value:'87',      icon:'📅', color:T.blue,   change:'+12%' },
    { label:'Avg. Rating',       value:'4.8⭐',   icon:'⭐', color:T.gold,   change:'+0.2' },
    { label:'Mentee Success Rate',value:'91%',    icon:'🎯', color:T.purple, change:'+7%'  },
  ];

  const monthlyEarnings = [
    { label:'Oct', value:3200 }, { label:'Nov', value:4100 }, { label:'Dec', value:3800 },
    { label:'Jan', value:5200 }, { label:'Feb', value:4700 }, { label:'Mar', value:6000 },
  ];

  const sessionsByDay = [
    { label:'Mon', value:4 }, { label:'Tue', value:6 }, { label:'Wed', value:3 },
    { label:'Thu', value:7 }, { label:'Fri', value:5 }, { label:'Sat', value:2 }, { label:'Sun', value:1 },
  ];

  const subjectBreakdown = [
    { subject:'Data Structures', count:24, color:T.blue   },
    { subject:'System Design',   count:18, color:T.purple },
    { subject:'Interview Prep',  count:21, color:T.gold   },
    { subject:'ML / AI',         count:14, color:T.lime   },
    { subject:'Web Dev',         count:10, color:T.coral  },
  ];
  const subjectTotal = subjectBreakdown.reduce((s,x)=>s+x.count,0);

  const ratingDist = [
    { stars:5, count:62 }, { stars:4, count:24 }, { stars:3, count:6 }, { stars:2, count:1 }, { stars:1, count:1 },
  ];
  const ratingTotal = ratingDist.reduce((s,r)=>s+r.count,0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          Mentor <span style={{ background:`linear-gradient(135deg,${T.lime},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Analytics</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Your performance overview — last 6 months.</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        {stats.map((s,i)=>(
          <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.05+i*.05 }} whileHover={{ y:-4 }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', transition:'box-shadow .3s' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.4),0 0 30px ${s.color}18`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.8rem' }}>
              <span style={{ fontSize:'1.6rem' }}>{s.icon}</span>
              <span style={{ fontSize:'.72rem', fontWeight:700, padding:'.25rem .65rem', borderRadius:999, background:`${T.lime}18`, color:T.lime }}>{s.change}</span>
            </div>
            <div style={{ fontSize:'1.7rem', fontWeight:900, color:s.color, letterSpacing:'-.03em', marginBottom:'.2rem' }}>{s.value}</div>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem' }}>
        {/* Earnings chart */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <BarChart data={monthlyEarnings} color={T.lime} label="Monthly Earnings (₹)"/>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>This Month</div>
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:T.lime }}>₹6,000</div>
            </div>
            <div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>6-Month Total</div>
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:T.gold }}>₹27,000</div>
            </div>
          </div>
        </motion.div>

        {/* Sessions per day */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <BarChart data={sessionsByDay} color={T.purple} label="Sessions by Day of Week"/>
        </motion.div>
      </div>

      {/* Subject breakdown + ratings */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem' }}>
        {/* Subject breakdown */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.2rem' }}>Sessions by Subject</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
            {subjectBreakdown.map(s=>(
              <div key={s.subject}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.35rem' }}>
                  <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,0.6)' }}>{s.subject}</span>
                  <span style={{ fontSize:'.78rem', fontWeight:700, color:s.color }}>{s.count} ({Math.round(s.count/subjectTotal*100)}%)</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${s.count/subjectTotal*100}%` }} transition={{ duration:.8 }}
                    style={{ height:'100%', background:`linear-gradient(90deg,${s.color},${s.color}80)`, borderRadius:999 }}/>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ratings distribution */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.26 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.2rem' }}>Rating Distribution</div>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'3rem', fontWeight:900, color:T.gold, lineHeight:1 }}>4.8</div>
            <div>
              <div style={{ fontSize:'1.2rem', marginBottom:'.2rem' }}>⭐⭐⭐⭐⭐</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.38)' }}>Based on {ratingTotal} reviews</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {ratingDist.map(r=>(
              <div key={r.stars} style={{ display:'flex', alignItems:'center', gap:'.8rem' }}>
                <span style={{ fontSize:'.78rem', color:T.gold, width:28, flexShrink:0 }}>{r.stars}⭐</span>
                <div style={{ flex:1, height:6, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${r.count/ratingTotal*100}%` }} transition={{ duration:.8 }}
                    style={{ height:'100%', background:`linear-gradient(90deg,${T.gold},${T.coral}80)`, borderRadius:999 }}/>
                </div>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)', width:24, flexShrink:0 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorAnalytics;
