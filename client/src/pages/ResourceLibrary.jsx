import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceApi } from '../services/resourceApi';
import ResourceGrid from '../components/resources/ResourceGrid';
import SearchBar from '../components/resources/SearchBar';
import SubjectFilter from '../components/resources/SubjectFilter';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', blue:'#858DFF' };

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = { page, limit:12, sort:'newest' };
      if (searchTerm) params.search = searchTerm;
      if (subject && subject !== 'All') params.subject = subject;
      const { data } = await resourceApi.getAll(params);
      setResources(data.resources);
      setTotalPages(data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [searchTerm, subject, page]);

  const handleSearch = t => { setSearchTerm(t); setPage(1); };
  const handleSubject = s => { setSubject(s); setPage(1); };
  const handleDelete = id => setResources(p => p.filter(r => r._id !== id));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
            Study <span style={{ background:`linear-gradient(135deg,${T.gold},${T.coral})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Resources</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Past papers, lecture notes, textbooks, and curated links — shared by students and mentors.</p>
        </div>
        <Link to="/resources/upload"
          style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.65rem 1.4rem', borderRadius:12, background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.85rem', textDecoration:'none', boxShadow:`0 0 28px rgba(172,106,255,0.25)`, flexShrink:0 }}>
          + Upload Resource
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.2rem 1.4rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          <SearchBar onSearch={handleSearch} initialValue={searchTerm}/>
        </div>
        <SubjectFilter currentSubject={subject} onSubjectChange={handleSubject}/>
      </motion.div>

      {/* Grid */}
      <ResourceGrid resources={resources} loading={loading} onDelete={handleDelete}/>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'.75rem', alignItems:'center', marginTop:'.5rem' }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:'.6rem 1.3rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', fontWeight:600, fontSize:'.84rem', cursor:page===1?'not-allowed':'pointer', fontFamily:"'Sora',sans-serif" }}>
            ← Previous
          </button>
          <span style={{ fontSize:'.84rem', color:'rgba(255,255,255,0.45)' }}>Page {page} of {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:'.6rem 1.3rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color: page===totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', fontWeight:600, fontSize:'.84rem', cursor:page===totalPages?'not-allowed':'pointer', fontFamily:"'Sora',sans-serif" }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
