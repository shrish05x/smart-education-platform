import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

// ─── STUDENT nav ────────────────────────────────────────────
const studentMenu = [
  { label:'Dashboard',     path:'/dashboard',           icon:'⊞', dot:T.purple },
  { label:'AI Tutor',      path:'/ai-assistant',        icon:'🤖', dot:T.blue   },
  { label:'Study Groups',  path:'/community',           icon:'💬', dot:T.lime   },
  { label:'Resources',     path:'/resources',           icon:'📚', dot:T.gold   },
  { label:'Find Mentors',  path:'/mentors',             icon:'👨‍🏫', dot:T.coral  },
  { label:'My Sessions',   path:'/mentorship/sessions', icon:'📅', dot:T.blue   },
  { label:'Internships',   path:'/internships',         icon:'💼', dot:T.gold   },
  { label:'Mental Health', path:'/mental-health',       icon:'🧘', dot:T.pink   },
  { label:'Meetups',       path:'/meetups',             icon:'📍', dot:T.lime   },
  { label:'Activity',      path:'/dashboard/activity',  icon:'🔔', dot:T.coral  },
  { label:'Progress',      path:'/dashboard/progress',  icon:'📈', dot:T.lime   },
  { label:'Profile',       path:'/dashboard/profile',   icon:'⚙️', dot:T.purple },
];

// ─── MENTOR nav ─────────────────────────────────────────────
const mentorMenu = [
  { label:'Dashboard',     path:'/mentor-dashboard',       icon:'⊞', dot:T.purple },
  { label:'My Mentees',    path:'/mentor/students',        icon:'👥', dot:T.blue   },
  { label:'Sessions',      path:'/mentorship/sessions',    icon:'📅', dot:T.lime   },
  { label:'Availability',  path:'/mentor/availability',    icon:'🗓️', dot:T.gold   },
  { label:'Analytics',     path:'/mentor/analytics',       icon:'📊', dot:T.coral  },
  { label:'Community',     path:'/community',              icon:'💬', dot:T.lime   },
  { label:'Resources',     path:'/resources',              icon:'📚', dot:T.gold   },
  { label:'Meetups',       path:'/meetups',                icon:'📍', dot:T.pink   },
  { label:'Profile',       path:'/dashboard/profile',      icon:'⚙️', dot:T.purple },
];

// ─── COUNSELLOR nav ─────────────────────────────────────────
const counselorMenu = [
  { label:'Dashboard',     path:'/counsellor-dashboard',   icon:'⊞', dot:T.purple },
  { label:'My Clients',    path:'/counsellor/clients',     icon:'👥', dot:T.pink   },
  { label:'Appointments',  path:'/counsellor/availability',icon:'🗓️', dot:T.gold   },
  { label:'Session Notes', path:'/counsellor/notes',       icon:'📝', dot:T.blue   },
  { label:'Mood Reports',  path:'/counsellor/reports',     icon:'📊', dot:T.lime   },
  { label:'Community',     path:'/community',              icon:'💬', dot:T.lime   },
  { label:'Meetups',       path:'/meetups',                icon:'📍', dot:T.coral  },
  { label:'Profile',       path:'/dashboard/profile',      icon:'⚙️', dot:T.purple },
];

const ROLE_LABELS = {
  student: { label:'Student', color:T.purple },
  mentor: { label:'Mentor', color:T.gold },
  counselor: { label:'Counsellor', color:T.pink },
};

const DashboardSidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const role = user?.role || 'student';
  const menuItems = role === 'mentor' ? mentorMenu : role === 'counselor' ? counselorMenu : studentMenu;
  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.student;

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
        <button onClick={onToggleCollapse} className="hidden lg:flex ml-auto"
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:'.25rem', borderRadius:6, transition:'color .2s' }}
          onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Role badge + Verification status */}
      {!collapsed && (
        <div style={{ padding:'.75rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding:'.45rem .85rem', borderRadius:10, background:`${roleInfo.color}12`, border:`1px solid ${roleInfo.color}30`, display:'inline-flex', alignItems:'center', gap:'.4rem', marginBottom: (role==='mentor'||role==='counselor')?'.5rem':0 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:roleInfo.color, flexShrink:0, display:'inline-block', boxShadow:`0 0 8px ${roleInfo.color}` }}/>
            <span style={{ fontSize:'.75rem', fontWeight:700, color:roleInfo.color, textTransform:'uppercase', letterSpacing:'.06em' }}>{roleInfo.label} Portal</span>
          </div>
          {(role==='mentor'||role==='counselor') && (
            <div>
              {user?.isVerified === true ? (
                <span style={{ display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.3rem .8rem', borderRadius:8, background:'rgba(122,219,120,0.12)', border:'1px solid rgba(122,219,120,0.3)', fontSize:'.7rem', fontWeight:700, color:'#7ADB78' }}>
                  ✓ Verified
                </span>
              ) : (
                <NavLink to="/verify" style={{ display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.3rem .8rem', borderRadius:8, background:'rgba(255,200,118,0.1)', border:'1px solid rgba(255,200,118,0.25)', fontSize:'.7rem', fontWeight:700, color:'#FFC876', textDecoration:'none' }}>
                  ⚠ Not Verified — Take Quiz
                </NavLink>
              )}
            </div>
          )}
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex:1, padding:'.75rem .6rem', overflowY:'auto', overflowX:'hidden', display:'flex', flexDirection:'column', gap:'.15rem' }}>
        {menuItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path==='/dashboard'||item.path==='/mentor-dashboard'||item.path==='/counsellor-dashboard'}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'.75rem', padding:collapsed?'.65rem':'.65rem .9rem', borderRadius:12,
              textDecoration:'none', color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? `${item.dot}15` : 'transparent',
              fontSize:'.875rem', fontWeight:500, transition:'all .2s', overflow:'hidden',
              borderLeft: isActive ? `2px solid ${item.dot}` : '2px solid transparent',
            })}
            onMouseEnter={e=>{ if(!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#fff'; } }}
            onMouseLeave={e=>{ if(!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; } }}>
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
          <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${roleInfo.color},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.85rem', flexShrink:0, boxShadow:`0 0 12px ${roleInfo.color}40` }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }}
                style={{ overflow:'hidden', minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize:'.7rem', color:`${roleInfo.color}`, fontWeight:600, textTransform:'capitalize' }}>{roleInfo.label}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={handleLogout}
          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'flex-start', gap:'.65rem', padding:collapsed?'.65rem':'.65rem .9rem', borderRadius:12, background:'transparent', border:'none', color:'rgba(255,119,111,0.7)', fontSize:'.875rem', fontWeight:500, cursor:'pointer', transition:'all .2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background=`rgba(255,119,111,0.1)`; e.currentTarget.style.color=T.coral; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,119,111,0.7)'; }}>
          <span style={{ fontSize:'1.1rem', flexShrink:0 }}>🚪</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:'auto' }} exit={{ opacity:0, width:0 }}
                style={{ whiteSpace:'nowrap', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:flex" style={{ width: collapsed ? 72 : 240, flexShrink:0, transition:'width .3s', zIndex:50 }}>
        <div style={{ position:'fixed', top:0, left:0, bottom:0, width: collapsed ? 72 : 240, transition:'width .3s', zIndex:50 }}>
          {content}
        </div>
      </div>
      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="lg:hidden" initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }} transition={{ type:'tween', duration:.28 }}
            style={{ position:'fixed', top:0, left:0, bottom:0, width:240, zIndex:60 }}>
            <div style={{ height:'100%' }}>{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
