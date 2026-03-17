import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', blue:'#858DFF', coral:'#FF776F' };

const DashboardTopbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <header style={{ height:64, display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 1.5rem', backdropFilter:'blur(24px)', background:'rgba(13,12,29,0.88)',
      borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0, position:'sticky', top:0, zIndex:40 }}>
      {/* Left */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <button onClick={onMenuClick} className="lg:hidden"
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', padding:'.3rem', borderRadius:8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:'.6rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'.5rem 1rem', width:280 }} className="hidden sm:flex">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything..."
            style={{ background:'none', border:'none', outline:'none', color:'rgba(255,255,255,0.75)', fontSize:'.875rem', width:'100%' }}/>
        </div>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
        {/* Bell */}
        <Link to="/dashboard/activity"
          style={{ position:'relative', display:'flex', padding:'.5rem', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.65)', textDecoration:'none', transition:'all .2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(172,106,255,0.12)'; e.currentTarget.style.color=T.purple; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.65)'; }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:T.coral, border:'1.5px solid #0D0C1D' }}/>
        </Link>

        <div style={{ width:1, height:28, background:'rgba(255,255,255,0.08)' }} className="hidden sm:block"/>

        {/* User */}
        <Link to="/dashboard/profile" style={{ display:'flex', alignItems:'center', gap:'.65rem', textDecoration:'none', padding:'.35rem .75rem', borderRadius:12, transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.82rem', color:'#fff', flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <div style={{ fontWeight:600, fontSize:'.82rem', color:'rgba(255,255,255,0.88)', lineHeight:1.2 }}>{user?.name}</div>
            <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.38)', textTransform:'capitalize' }}>{user?.role}</div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardTopbar;
