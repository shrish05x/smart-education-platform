import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mentorApi from '../services/mentorApi';
import SearchBar from '../components/mentors/SearchBar';
import IndustryFilter from '../components/mentors/IndustryFilter';
import AvailabilityToggle from '../components/mentors/AvailabilityToggle';
import MentorGrid from '../components/mentors/MentorGrid';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', blue:'#858DFF' };

const MentorDiscovery = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState('Most Experienced');

  useEffect(() => { fetchMentors(); }, [search, industry, availability, sort]);

  const fetchMentors = async () => {
    setIsLoading(true); setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (industry && industry !== 'All') params.industry = industry;
      if (availability) params.availability = true;
      if (sort) params.sort = sort;
      const data = await mentorApi.getAllMentors(params);
      setMentors(data.data || []);
    } catch (err) { console.error(err); setError('Could not load mentors. Please try again later.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          Find Your <span style={{ background:`linear-gradient(135deg,${T.purple},${T.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Mentor</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.875rem' }}>Connect with industry professionals for guidance, portfolio reviews, and career growth.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, padding:'1.2rem 1.4rem', display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:200 }}>
          <SearchBar onSearch={setSearch} placeholder="Search by name, role, or skill..."/>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'.75rem', alignItems:'center' }}>
          <IndustryFilter selectedIndustry={industry} onSelect={setIndustry}/>
          <select value={sort} onChange={e=>setSort(e.target.value)}
            style={{ padding:'.6rem 1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#fff', fontSize:'.85rem', fontFamily:"'Sora',sans-serif", outline:'none', cursor:'pointer' }}>
            <option value="Most Experienced" style={{ background:'#1a1a2e' }}>Most Experienced</option>
            <option value="Top Rated" style={{ background:'#1a1a2e' }}>Top Rated</option>
            <option value="Most Sessions" style={{ background:'#1a1a2e' }}>Most Sessions</option>
          </select>
          <AvailabilityToggle isAvailableOnly={availability} onToggle={setAvailability}/>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.2rem', borderRadius:14, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:T.coral }}>
          ⚠ {error}
        </div>
      )}

      {/* Grid */}
      <MentorGrid mentors={mentors} isLoading={isLoading}/>
    </div>
  );
};

export default MentorDiscovery;
