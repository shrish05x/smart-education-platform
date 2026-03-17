import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const ProgressBar = ({ value, color }) => (
  <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
    <motion.div initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:.8, ease:'easeOut' }}
      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}80)` }}/>
  </div>
);

const BarChart = ({ data, color, max }) => (
  <div style={{ display:'flex', gap:'.5rem', alignItems:'flex-end', height:80 }}>
    {data.map((d,i)=>(
      <div key={d.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.35rem', flex:1 }}>
        <motion.div initial={{ height:0 }} animate={{ height:`${(d.value/max)*64}px` }} transition={{ delay:.1+i*.06 }}
          style={{ width:'100%', borderRadius:'5px 5px 0 0', background:`linear-gradient(to top,${color},${color}80)`, minHeight:3 }}/>
        <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,0.35)' }}>{d.label}</div>
      </div>
    ))}
  </div>
);

const CounsellorReports = () => {
  const moodTrend = [
    { label:'Oct', positive:38, negative:62 }, { label:'Nov', positive:45, negative:55 },
    { label:'Dec', positive:52, negative:48 }, { label:'Jan', positive:58, negative:42 },
    { label:'Feb', positive:65, negative:35 }, { label:'Mar', positive:72, negative:28 },
  ];

  const outcomeSessions = [
    { label:'Oct', value:28 }, { label:'Nov', value:33 }, { label:'Dec', value:30 },
    { label:'Jan', value:38 }, { label:'Feb', value:36 }, { label:'Mar', value:41 },
  ];

  const issueBreakdown = [
    { label:'Exam Stress',       count:22, color:T.gold   },
    { label:'Social Anxiety',    count:18, color:T.purple },
    { label:'Burnout',           count:16, color:T.coral  },
    { label:'Loneliness',        count:12, color:T.blue   },
    { label:'Grief / Loss',      count:8,  color:T.pink   },
    { label:'Motivation',        count:14, color:T.lime   },
  ];
  const issueTotal = issueBreakdown.reduce((s,x)=>s+x.count,0);

  const stats = [
    { label:'Total Clients Helped', value:'86', icon:'👥', color:T.pink   },
    { label:'Sessions This Month',  value:'41', icon:'📅', color:T.purple },
    { label:'Avg Mood Improvement', value:'+34%', icon:'📈', color:T.lime   },
    { label:'Avg Satisfaction',     value:'4.9⭐', icon:'💙', color:T.blue   },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          Session <span style={{ background:`linear-gradient(135deg,${T.lime},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Reports</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Client outcomes and session performance — last 6 months.</p>
      </motion.div>

      {/* KPI stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        {stats.map((s,i)=>(
          <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.05+i*.05 }} whileHover={{ y:-4 }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', transition:'box-shadow .3s' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.4),0 0 30px ${s.color}18`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
            <div style={{ fontSize:'1.8rem', marginBottom:'.75rem' }}>{s.icon}</div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color:s.color, letterSpacing:'-.03em', marginBottom:'.25rem' }}>{s.value}</div>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem' }}>
        {/* Mood improvement trend */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.14 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.2rem' }}>Client Mood Trend (%)</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
            {moodTrend.map(m=>(
              <div key={m.label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.3rem' }}>
                  <span style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.5)' }}>{m.label}</span>
                  <span style={{ fontSize:'.73rem', fontWeight:700, color:T.lime }}>{m.positive}% positive</span>
                </div>
                <div style={{ display:'flex', gap:2, borderRadius:999, overflow:'hidden', height:8 }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${m.positive}%` }} transition={{ duration:.8 }}
                    style={{ background:T.lime, borderRadius:'999px 0 0 999px' }}/>
                  <motion.div initial={{ width:0 }} animate={{ width:`${m.negative}%` }} transition={{ duration:.8 }}
                    style={{ background:T.coral, borderRadius:'0 999px 999px 0' }}/>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sessions per month chart */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.2rem' }}>Sessions Conducted</div>
          <BarChart data={outcomeSessions} color={T.purple} max={50}/>
          <div style={{ display:'flex', gap:'1.5rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div><div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>This Month</div><div style={{ fontWeight:800, color:T.purple, fontSize:'1.1rem' }}>41</div></div>
            <div><div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)' }}>6-Month Total</div><div style={{ fontWeight:800, color:T.gold, fontSize:'1.1rem' }}>206</div></div>
          </div>
        </motion.div>
      </div>

      {/* Issue breakdown */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem' }}>
        <div style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:'1.2rem' }}>Client Issues Breakdown</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.2rem' }}>
          {issueBreakdown.map(item=>(
            <div key={item.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem' }}>
                <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{item.label}</span>
                <span style={{ fontSize:'.78rem', fontWeight:700, color:item.color }}>{item.count} ({Math.round(item.count/issueTotal*100)}%)</span>
              </div>
              <ProgressBar value={item.count/issueTotal*100} color={item.color}/>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CounsellorReports;
