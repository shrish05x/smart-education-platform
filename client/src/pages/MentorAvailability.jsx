import { useState } from 'react';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];

const SLOT_STATUS = { available:'available', booked:'booked', blocked:'blocked' };

// Mock initial availability
const makeInitialSlots = () => {
  const slots = {};
  DAYS.forEach(d => {
    slots[d] = {};
    HOURS.forEach(h => {
      // Randomly assign some booked slots
      const r = Math.random();
      slots[d][h] = r < .15 ? 'booked' : r < .45 ? 'available' : 'blocked';
    });
  });
  return slots;
};

const SLOT_COLORS = {
  available: { bg:`rgba(122,219,120,0.15)`, border:`rgba(122,219,120,0.35)`, text:T.lime, label:'Available' },
  booked:    { bg:`rgba(172,106,255,0.15)`, border:`rgba(172,106,255,0.35)`, text:T.purple, label:'Booked' },
  blocked:   { bg:`rgba(255,255,255,0.04)`, border:`rgba(255,255,255,0.08)`, text:'rgba(255,255,255,0.25)', label:'Blocked' },
};

const MentorAvailability = () => {
  const [slots, setSlots] = useState(makeInitialSlots);
  const [instantMode, setInstantMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (day, hour) => {
    setSlots(prev => {
      const curr = prev[day][hour];
      const next = curr === 'blocked' ? 'available' : curr === 'available' ? 'blocked' : 'booked';
      return { ...prev, [day]: { ...prev[day], [hour]: next } };
    });
    setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  const totalAvailable = Object.values(slots).flatMap(d=>Object.values(d)).filter(s=>s==='available').length;
  const totalBooked = Object.values(slots).flatMap(d=>Object.values(d)).filter(s=>s==='booked').length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          My <span style={{ background:`linear-gradient(135deg,${T.gold},${T.coral})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Availability</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Set your weekly availability for mentoring sessions. Click any slot to toggle.</p>
      </motion.div>

      {/* Stats + Instant Mode */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.06 }}
        style={{ display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          {[{ label:'Available Slots', value:totalAvailable, color:T.lime },{ label:'Booked Sessions', value:totalBooked, color:T.purple }].map(s=>(
            <div key={s.label} style={{ padding:'.8rem 1.4rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)' }}>
              <div style={{ fontSize:'1.4rem', fontWeight:900, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.42)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.75rem 1.2rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)' }}>
            <span style={{ fontSize:'.85rem', fontWeight:600 }}>⚡ Instant Available</span>
            <button onClick={()=>setInstantMode(!instantMode)}
              style={{ width:46, height:26, borderRadius:13, border:'none', cursor:'pointer', background:instantMode?T.lime:'rgba(255,255,255,0.12)', transition:'all .3s', position:'relative', flexShrink:0 }}>
              <span style={{ position:'absolute', top:3, left: instantMode?22:3, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left .3s', display:'block' }}/>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        {Object.entries(SLOT_COLORS).map(([k,v])=>(
          <div key={k} style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.75rem', color:'rgba(255,255,255,0.55)' }}>
            <div style={{ width:14, height:14, borderRadius:4, background:v.bg, border:`1px solid ${v.border}` }}/>
            {v.label}
          </div>
        ))}
        <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.35)', marginLeft:'auto' }}>Click any slot to cycle: Blocked → Available → Blocked</div>
      </div>

      {/* Calendar grid */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'1.5rem', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:'4px' }}>
          <thead>
            <tr>
              <th style={{ width:80, padding:'.5rem .7rem', textAlign:'left', fontSize:'.72rem', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>Time</th>
              {DAYS.map(d=>(
                <th key={d} style={{ padding:'.5rem .3rem', textAlign:'center', fontSize:'.78rem', color:T.gold, fontWeight:700 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(h=>(
              <tr key={h}>
                <td style={{ padding:'.4rem .6rem', fontSize:'.7rem', color:'rgba(255,255,255,0.38)', whiteSpace:'nowrap', fontWeight:500 }}>{h}</td>
                {DAYS.map(d=>{
                  const status = slots[d]?.[h] || 'blocked';
                  const cfg = SLOT_COLORS[status];
                  return (
                    <td key={d} style={{ padding:0 }}>
                      <button onClick={()=>status!=='booked'&&toggleSlot(d,h)}
                        style={{ display:'block', width:'100%', padding:'.45rem .2rem', borderRadius:8, border:`1px solid ${cfg.border}`, background:cfg.bg, color:cfg.text, fontSize:'.65rem', fontWeight:600, cursor:status==='booked'?'not-allowed':'pointer', fontFamily:"'Sora',sans-serif", transition:'all .15s', minWidth:60 }}
                        onMouseEnter={e=>{ if(status!=='booked') e.currentTarget.style.filter='brightness(1.3)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.filter=''; }}>
                        {status==='booked'?'📅':status==='available'?'✓':''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Save */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <button onClick={handleSave}
          style={{ padding:'.8rem 2rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.gold},${T.coral})`, color:'#0D0C1D', fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 24px rgba(255,200,118,0.25)` }}>
          Save Availability
        </button>
        {saved && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ color:T.lime, fontWeight:700, fontSize:'.875rem' }}>✓ Saved!</motion.span>}
      </div>
    </div>
  );
};

export default MentorAvailability;
