import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const NOTES = [
  { id:1, client:'Anika Sharma',   date:'2026-03-17', sessionType:'Follow-up',    mood:'Anxious', summary:'Discussed exam anxiety and breathing techniques. Practiced 4-7-8 breathing. Assigned daily journaling.', tags:['anxiety','breathing','journaling'] },
  { id:2, client:'Meera Joshi',    date:'2026-03-16', sessionType:'Initial',       mood:'Stressed',summary:'First session. Presented with academic burnout. Introduced concept of stress bucket. Built initial rapport.', tags:['burnout','initial','rapport'] },
  { id:3, client:'Rahul Desai',    date:'2026-03-15', sessionType:'Therapy',       mood:'Positive',summary:'Remarkable progress on social anxiety. CBT exercises showing results. Ready to attempt group social setting.', tags:['CBT','social-anxiety','progress'] },
  { id:4, client:'Divya Nair',     date:'2026-03-14', sessionType:'Check-in',      mood:'Down',    summary:'Shared feelings of loneliness. Explored family dynamics. Provided validation. Assigned outreach activity.', tags:['loneliness','family','outreach'] },
  { id:5, client:'Aryan Kapoor',   date:'2026-03-12', sessionType:'Therapy',       mood:'Calm',    summary:'Transition anxiety improving. Explored identity and values. Goals becoming clearer. Very engaged today.', tags:['identity','values','goals'] },
];

const MOOD_CFG = {
  Anxious:{c:T.gold,e:'😰'}, Stressed:{c:T.coral,e:'😤'}, Positive:{c:T.lime,e:'😊'}, Down:{c:T.blue,e:'😔'}, Calm:{c:T.purple,e:'😌'}, Neutral:{c:'rgba(255,255,255,0.42)',e:'😐'}
};

const CounsellorNotes = () => {
  const [notes, setNotes] = useState(NOTES);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNote, setNewNote] = useState({ client:'', sessionType:'Follow-up', mood:'Neutral', summary:'' });

  const filtered = notes.filter(n =>
    n.client.toLowerCase().includes(search.toLowerCase()) ||
    n.summary.toLowerCase().includes(search.toLowerCase()) ||
    n.tags.some(t => t.includes(search.toLowerCase()))
  );

  const addNote = () => {
    if (!newNote.client || !newNote.summary) return;
    setNotes(prev => [{ ...newNote, id:Date.now(), date:new Date().toISOString().split('T')[0], tags:[] }, ...prev]);
    setNewNote({ client:'', sessionType:'Follow-up', mood:'Neutral', summary:'' });
    setShowNewForm(false);
  };

  const inputSt = { width:'100%', boxSizing:'border-box', padding:'.7rem 1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" };
  const selectSt = { ...inputSt, cursor:'pointer' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
            Session <span style={{ background:`linear-gradient(135deg,${T.blue},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Notes</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Private session notes — encrypted and confidential.</p>
        </div>
        <button onClick={()=>setShowNewForm(!showNewForm)}
          style={{ padding:'.65rem 1.4rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.pink},${T.purple})`, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 24px rgba(255,152,226,0.25)` }}>
          + New Note
        </button>
      </motion.div>

      {/* New note form */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${T.pink}30`, backdropFilter:'blur(20px)', borderRadius:20, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ fontWeight:700, fontSize:'1rem', color:T.pink }}>📝 New Session Note</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              <div>
                <label style={{ display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:'.4rem' }}>Client Name</label>
                <input style={inputSt} placeholder="Client name" value={newNote.client} onChange={e=>setNewNote({...newNote,client:e.target.value})}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:'.4rem' }}>Session Type</label>
                <select style={selectSt} value={newNote.sessionType} onChange={e=>setNewNote({...newNote,sessionType:e.target.value})}>
                  {['Initial','Follow-up','Check-in','Therapy','Crisis'].map(t=><option key={t} style={{background:'#1a1a2e'}}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:'.4rem' }}>Client Mood</label>
                <select style={selectSt} value={newNote.mood} onChange={e=>setNewNote({...newNote,mood:e.target.value})}>
                  {Object.keys(MOOD_CFG).map(m=><option key={m} style={{background:'#1a1a2e'}}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:'.4rem' }}>Session Summary</label>
              <textarea rows={4} style={{ ...inputSt, resize:'vertical' }} placeholder="Document what was discussed, techniques used, client response, and homework assigned..." value={newNote.summary} onChange={e=>setNewNote({...newNote,summary:e.target.value})}/>
            </div>
            <div style={{ display:'flex', gap:'.75rem' }}>
              <button onClick={addNote} style={{ padding:'.7rem 1.6rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.pink},${T.purple})`, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Save Note</button>
              <button onClick={()=>setShowNewForm(false)} style={{ padding:'.7rem 1.2rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.55)', fontWeight:600, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>🔍</span>
        <input type="text" placeholder="Search by client, keywords, or tags..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:'100%', boxSizing:'border-box', padding:'.7rem 1rem .7rem 2.4rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" }}/>
      </div>

      {/* Notes list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {filtered.map((note,i)=>{
          const mood = MOOD_CFG[note.mood]||MOOD_CFG.Neutral;
          return (
            <motion.div key={note.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.05 }}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.4rem', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${T.blue}35`; e.currentTarget.style.transform='translateX(4px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.transform=''; }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'.9rem' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'.95rem', marginBottom:'.2rem' }}>📋 {note.client}</div>
                  <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)' }}>{note.date} · {note.sessionType}</div>
                </div>
                <span style={{ padding:'.3rem .75rem', borderRadius:999, background:`${mood.c}18`, color:mood.c, fontSize:'.75rem', fontWeight:700 }}>{mood.e} {note.mood}</span>
              </div>
              <p style={{ fontSize:'.875rem', color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:'1rem' }}>{note.summary}</p>
              {note.tags.length > 0 && (
                <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                  {note.tags.map(tag=>(
                    <span key={tag} style={{ padding:'.2rem .65rem', borderRadius:999, background:'rgba(133,141,255,0.1)', border:'1px solid rgba(133,141,255,0.2)', color:T.blue, fontSize:'.68rem', fontWeight:600 }}>#{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.03)', borderRadius:20 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>📂</div>
          <p style={{ color:'rgba(255,255,255,0.42)' }}>No notes found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CounsellorNotes;
