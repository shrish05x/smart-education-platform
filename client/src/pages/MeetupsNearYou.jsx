import React, { useState } from 'react';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TYPE_CLR = { Coding:T.blue, Discussion:T.purple, Networking:T.gold, Study:T.lime };

const MOCK_MEETUPS = [
  { id:1, title:'Full-Stack Developer Hackathon', area:'Tech Hub Downtown', distance:'2.4 km', type:'Coding', date:'Today, 6:00 PM', attendees:34, hasGaming:true, hasChallenges:true, isInstant:true, image:'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400', description:'Join us for an evening of intense coding, pizza, and networking. Bring your laptop and your A-game!', challenges:['Build a real-time chat app','Fix 5 open source bugs'] },
  { id:2, title:'AI Ethics Discussion Circle', area:'Central Library, Room 4B', distance:'4.1 km', type:'Discussion', date:'Tomorrow, 5:00 PM', attendees:12, hasGaming:false, hasChallenges:false, isInstant:false, image:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400', description:'A deep dive into the ethical implications of recent advancements in generative AI.', challenges:[] },
  { id:3, title:'Startup Pitch & Play', area:'Innovation Center', distance:'1.2 km', type:'Networking', date:'Friday, 7:00 PM', attendees:56, hasGaming:true, hasChallenges:false, isInstant:true, image:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400', description:"Pitch your startup idea in 60 seconds, then enjoy some retro arcade gaming.", challenges:[] },
  { id:4, title:'Algorithm Problem Solving', area:'University Cafe', distance:'0.8 km', type:'Study', date:'Today, 8:00 PM', attendees:8, hasGaming:false, hasChallenges:true, isInstant:true, image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400', description:"Preparing for interviews? Let's solve LeetCode Hard problems together.", challenges:['Solve 3 graph problems in 1 hour'] },
];

const MeetupsNearYou = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_MEETUPS.filter(m => {
    if (filter==='instant' && !m.isInstant) return false;
    if (filter==='gaming' && !m.hasGaming) return false;
    if (filter==='challenges' && !m.hasChallenges) return false;
    return m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.area.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const FILTERS = [
    { id:'all', label:'All Meetups' }, { id:'instant', label:'⚡ Instant' },
    { id:'challenges', label:'🏆 Challenges' }, { id:'gaming', label:'🎮 Gaming' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'1.6rem 1.8rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'1.2rem' }}>
          <div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
              Meetups <span style={{ background:`linear-gradient(135deg,${T.lime},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Near You</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>Discover, join, and collaborate with peers in your area.</p>
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.65rem 1.4rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.lime},#4bc24b)`, color:'#0D0C1D', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
            + Host a Meetup
          </button>
        </div>
        {/* Search + filters */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <div style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', lineHeight:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" placeholder="Search by name or area..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              style={{ width:'100%', boxSizing:'border-box', padding:'.7rem 1rem .7rem 2.6rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" }}/>
          </div>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.id} onClick={()=>setFilter(f.id)}
                style={{ padding:'.5rem 1rem', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.8rem', fontWeight:600, transition:'all .2s', whiteSpace:'nowrap',
                  background: filter===f.id?`rgba(122,219,120,0.15)`:'rgba(255,255,255,0.05)',
                  color: filter===f.id?T.lime:'rgba(255,255,255,0.52)',
                  border: filter===f.id?`1px solid rgba(122,219,120,0.35)`:'1px solid rgba(255,255,255,0.08)',
                }}>{f.label}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.2rem' }}>
        {filtered.map((meetup,i) => {
          const tc = TYPE_CLR[meetup.type]||T.purple;
          return (
            <motion.div key={meetup.id} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.07 }}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column', transition:'all .3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor=`${tc}40`; e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,0.3)`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow=''; }}>
              {/* Image */}
              <div style={{ position:'relative', height:160, overflow:'hidden' }}>
                <img src={meetup.image} alt={meetup.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,12,29,0.85) 0%,transparent 50%)' }}/>
                {meetup.isInstant && <span style={{ position:'absolute', top:'0.7rem', right:'0.7rem', padding:'.3rem .65rem', borderRadius:8, background:'rgba(255,200,118,0.9)', color:'#0D0C1D', fontSize:'.7rem', fontWeight:700 }}>⚡ Instant</span>}
                <div style={{ position:'absolute', bottom:'0.7rem', left:'0.8rem', right:'0.8rem' }}>
                  <span style={{ padding:'.25rem .7rem', borderRadius:8, background:`${tc}cc`, color:'#fff', fontSize:'.68rem', fontWeight:700, display:'inline-block', marginBottom:'.4rem' }}>{meetup.type}</span>
                  <h3 style={{ fontWeight:700, fontSize:'1rem', lineHeight:1.25, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{meetup.title}</h3>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding:'1.1rem', display:'flex', flexDirection:'column', flex:1, gap:'.6rem' }}>
                <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.45)', display:'flex', alignItems:'center', gap:'.4rem' }}>
                  📍 {meetup.area} <span style={{ color:'rgba(255,255,255,0.25)' }}>•</span> <span style={{ color:tc, fontWeight:600 }}>{meetup.distance}</span>
                </div>
                <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.45)' }}>📅 {meetup.date}</div>
                <p style={{ fontSize:'.82rem', color:'rgba(255,255,255,0.5)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{meetup.description}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
                  {meetup.hasGaming && <span style={{ padding:'.25rem .7rem', borderRadius:999, background:'rgba(172,106,255,0.1)', border:'1px solid rgba(172,106,255,0.2)', color:T.purple, fontSize:'.7rem', fontWeight:600 }}>🎮 Gaming</span>}
                  {meetup.hasChallenges && <span style={{ padding:'.25rem .7rem', borderRadius:999, background:'rgba(122,219,120,0.1)', border:'1px solid rgba(122,219,120,0.2)', color:T.lime, fontSize:'.7rem', fontWeight:600 }}>🏆 Challenges</span>}
                  <span style={{ padding:'.25rem .7rem', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.45)', fontSize:'.7rem', fontWeight:600 }}>👥 {meetup.attendees}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem', marginTop:'auto', paddingTop:'.6rem', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <button style={{ padding:'.6rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Details</button>
                  <button style={{ padding:'.6rem', borderRadius:10, border:'none', background:meetup.isInstant?`linear-gradient(135deg,${T.gold},${T.coral})`:`linear-gradient(135deg,${T.purple},${T.blue})`, color:meetup.isInstant?'#0D0C1D':'#fff', fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                    {meetup.isInstant?'Join Now ⚡':'RSVP'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length===0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20 }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>🔍</div>
            <h3 style={{ fontWeight:700, marginBottom:'.4rem' }}>No meetups found</h3>
            <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetupsNearYou;
