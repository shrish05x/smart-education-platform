import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import InternshipCard from '../components/InternshipCard';
import InternshipFilters from '../components/InternshipFilters';
import OpportunitiesWidget from '../components/dashboard/widgets/OpportunitiesWidget';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF' };

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search:'', type:'', skills:[] });

  useEffect(() => { fetchInternships(); }, []);

  const fetchInternships = async () => {
    try { setLoading(true); setError(null); const r = await api.get('/internships?limit=50'); setInternships(r.data.internships||[]); }
    catch (err) { console.error(err); setError('Unable to load internships. Please try again.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let r = internships;
    if (filters.search) { const q=filters.search.toLowerCase(); r=r.filter(i=>i.role?.toLowerCase().includes(q)||(i.company||i.companyId?.name||'').toLowerCase().includes(q)); }
    if (filters.type) r = r.filter(i=>i.type===filters.type);
    if (filters.skills.length>0) r = r.filter(i=>filters.skills.some(s=>(i.skillsRequired||[]).some(sk=>sk.toLowerCase()===s.toLowerCase())));
    return r;
  }, [internships, filters]);

  const allSkills = useMemo(() => { const s=new Set(); internships.forEach(i=>(i.skillsRequired||[]).forEach(sk=>s.add(sk))); return s.size; }, [internships]);

  const stats = [
    { label:'Open Positions', value:internships.length, icon:'💼', color:T.purple },
    { label:'Companies',      value:new Set(internships.map(i=>i.company||i.companyId?.name)).size, icon:'🏢', color:T.blue },
    { label:'Skills Tracked', value:allSkills, icon:'🛠️', color:T.gold },
    { label:'Remote',         value:internships.filter(i=>i.type==='remote').length, icon:'🏠', color:T.lime },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
            Internships & <span style={{ background:`linear-gradient(135deg,${T.gold},${T.coral})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Opportunities</span> 💼
          </h1>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Discover and apply for top internships matching your skills.</p>
        </div>
        <span style={{ padding:'.4rem 1rem', borderRadius:999, background:`rgba(172,106,255,0.12)`, border:`1px solid rgba(172,106,255,0.25)`, color:T.purple, fontSize:'.78rem', fontWeight:700 }}>
          {filtered.length} {filtered.length===1?'result':'results'}
        </span>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.07 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem' }}>
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.1+i*.05 }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:16, padding:'1.2rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.6rem' }}>
              <span style={{ fontSize:'1.6rem' }}>{s.icon}</span>
              <span style={{ fontSize:'1.6rem', fontWeight:900, color:s.color, letterSpacing:'-.03em' }}>{s.value}</span>
            </div>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}>
        <h2 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'1rem' }}>🏫 Campus & Verified Internships</h2>
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:16, padding:'1.2rem', marginBottom:'1.2rem' }}>
          <InternshipFilters filters={filters} onFilterChange={setFilters}/>
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.1rem' }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:16, padding:'1.4rem', animation:'pulse 1.5s ease-in-out infinite' }}>
              {[80,55,70].map((w,j)=><div key={j} style={{ height:12, borderRadius:6, background:'rgba(255,255,255,0.08)', marginBottom:10, width:`${w}%` }}/>)}
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:16 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>😕</div>
          <p style={{ color:'rgba(255,255,255,0.45)', marginBottom:'1rem' }}>{error}</p>
          <button onClick={fetchInternships} style={{ padding:'.6rem 1.5rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Try Again</button>
        </div>
      ) : filtered.length===0 ? (
        <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:16 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>🔍</div>
          <h3 style={{ fontWeight:700, marginBottom:'.4rem' }}>No internships found</h3>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.875rem', marginBottom:'1rem' }}>Try adjusting your filters or search query.</p>
          {(filters.search||filters.type||filters.skills.length>0) && (
            <button onClick={()=>setFilters({search:'',type:'',skills:[]})} style={{ padding:'.55rem 1.3rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:'.82rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Clear Filters</button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.1rem' }}>
          {filtered.map((internship,i) => <InternshipCard key={internship._id} internship={internship} index={i}/>)}
        </div>
      )}

      {/* External opportunities */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
        style={{ paddingTop:'2rem', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <OpportunitiesWidget/>
      </motion.div>
    </div>
  );
};

export default InternshipsPage;