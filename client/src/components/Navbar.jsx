import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const T = { purple:'#AC6AFF', blue:'#858DFF', bg:'rgba(13,12,29,0.80)' };

const NavLink = ({ to, children }) => (
  <Link to={to} style={{ color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'.875rem', fontWeight:500, transition:'color .2s', cursor:'pointer' }}
    onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}>
    {children}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mOpen, setMOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = user ? [
    { to:'/dashboard', label:'Dashboard' },
    { to:'/ai-assistant', label:'AI Tutor' },
    { to:'/mentors', label:'Mentors' },
    { to:'/community', label:'Community' },
    { to:'/internships', label:'Internships' },
  ] : [];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); nav * { font-family: 'Sora',sans-serif !important; }`}</style>
      <motion.nav initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.7, ease:[.16,1,.3,1] }}
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1rem 2.5rem', backdropFilter:'blur(24px)', background:T.bg, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ textDecoration:'none', fontWeight:800, fontSize:'1.15rem', letterSpacing:'-.02em',
          background:`linear-gradient(90deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ✦ EduSuccess
        </Link>

        <div style={{ display:'flex', gap:'2rem', alignItems:'center' }} className="hidden md:flex">
          {links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        </div>

        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          {user ? (
            <>
              <Link to="/dashboard/profile" style={{ display:'flex', alignItems:'center', gap:'.5rem', textDecoration:'none' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.85rem', color:'#fff' }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block" style={{ color:'rgba(255,255,255,0.75)', fontSize:'.875rem', fontWeight:600 }}>{user?.name}</span>
              </Link>
              <button onClick={handleLogout}
                style={{ background:'rgba(255,119,111,0.12)', border:'1px solid rgba(255,119,111,0.25)', color:'#FF776F', padding:'.5rem 1.2rem', borderRadius:10, fontSize:'.85rem', fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e=>{e.target.style.background='rgba(255,119,111,0.22)'}} onMouseLeave={e=>{e.target.style.background='rgba(255,119,111,0.12)'}}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color:'rgba(255,255,255,0.6)', fontSize:'.875rem', fontWeight:600, textDecoration:'none' }}>Sign In</Link>
              <Link to="/register" className="btn-shine"
                style={{ background:`linear-gradient(135deg,${T.purple},#C795FF)`, color:'#fff', padding:'.6rem 1.5rem', borderRadius:999, fontSize:'.875rem', fontWeight:700, textDecoration:'none', boxShadow:`0 0 24px rgba(172,106,255,0.28)` }}>
                Join Free →
              </Link>
            </>
          )}
          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={()=>setMOpen(!mOpen)} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mOpen && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            style={{ position:'fixed', top:64, left:0, right:0, zIndex:99, padding:'1.5rem', backdropFilter:'blur(24px)', background:'rgba(13,12,29,0.95)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={()=>setMOpen(false)} style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none', fontSize:'.95rem', fontWeight:500, padding:'.5rem 0' }}>
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
