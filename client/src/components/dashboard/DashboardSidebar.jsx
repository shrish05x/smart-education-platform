import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const menuItems = [
  { label:'Dashboard',     path:'/dashboard',           icon:'⊞', dot: T.purple },
  { label:'AI Tutor',      path:'/ai-assistant',        icon:'🤖', dot: T.blue   },
  { label:'Study Groups',  path:'/community',           icon:'💬', dot: T.lime   },
  { label:'Resources',     path:'/resources',           icon:'📚', dot: T.gold   },
  { label:'Mentors',       path:'/mentors',             icon:'👨‍🏫', dot: T.coral  },
  { label:'My Sessions',   path:'/mentorship/sessions', icon:'📅', dot: T.blue   },
  { label:'Internships',   path:'/internships',         icon:'💼', dot: T.gold   },
  { label:'Mental Health', path:'/mental-health',       icon:'🧘', dot: T.pink   },
  { label:'Meetups',       path:'/meetups',             icon:'📍', dot: T.lime   },
  { label:'Activity',      path:'/dashboard/activity',  icon:'🔔', dot: T.coral  },
  { label:'Profile',       path:'/dashboard/profile',   icon:'⚙️', dot: T.purple },
];

const DashboardSidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const content = (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0D0C1D', borderRight:'1px solid rgba(255,255,255,0.07)', overflowX:'hidden' }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'0 1.1rem', height:64, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.75rem', flexShrink:0 }}>✦</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }}
              style={{ fontWeight:800, fontSize:'1.05rem', letterSpacing:'-.02em', background:`linear-gradient(90deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', whiteSpace:'nowrap', overflow:'hidden' }}>
              EduSuccess
            </motion.span>
          )}
        </AnimatePresence>
        {/* Toggle collapse */}
        <button onClick={onToggleCollapse} className="hidden lg:flex ml-auto"
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:'.25rem', borderRadius:6, transition:'color .2s' }}
          onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:'.75rem .6rem', overflowY:'auto', overflowX:'hidden', display:'flex', flexDirection:'column', gap:'.15rem' }}>
        {menuItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path==='/dashboard'}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'.75rem', padding:collapsed?'.65rem':'.65rem .9rem', borderRadius:12,
              textDecoration:'none', color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? `rgba(172,106,255,0.14)` : 'transparent',
              fontSize:'.875rem', fontWeight:500, transition:'all .2s', overflow:'hidden',
              borderLeft: isActive ? `2px solid ${T.purple}` : '2px solid transparent',
            })}
            onMouseEnter={e=>{ if(!e.currentTarget.style.borderLeft.includes(T.purple)) { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#fff'; } }}
            onMouseLeave={e=>{ if(!e.currentTarget.style.borderLeft.includes(T.purple)) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; } }}
          >
            <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }}
                  style={{ whiteSpace:'nowrap', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding:'.75rem .6rem', borderTop:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.6rem', padding:'.5rem .5rem' }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.85rem', flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }} style={{ overflow:'hidden' }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', whiteSpace:'nowrap', color:'#fff' }}>{user?.name}</div>
                <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.38)', textTransform:'capitalize' }}>{user?.role}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'.6rem', width:'100%', padding:'.6rem .9rem', borderRadius:10, background:'rgba(255,119,111,0.08)', border:'1px solid rgba(255,119,111,0.2)', color:'#FF776F', fontSize:'.82rem', fontWeight:600, cursor:'pointer', transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,119,111,0.16)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,119,111,0.08)'}>
          <span style={{ flexShrink:0 }}>↩</span>
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }} style={{ whiteSpace:'nowrap', overflow:'hidden' }}>Sign Out</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 64 : 228 }} transition={{ type:'spring', stiffness:300, damping:30 }}
        className="hidden lg:flex flex-col h-screen flex-shrink-0">
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }} transition={{ type:'spring', stiffness:300, damping:30 }}
            style={{ position:'fixed', top:0, left:0, bottom:0, width:228, zIndex:50 }} className="lg:hidden">
            {content}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
