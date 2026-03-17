import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const BwInput = ({ label, id, type='text', name, value, onChange, disabled, placeholder }) => (
  <div>
    <label htmlFor={id} style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,0.55)', marginBottom:'.4rem' }}>{label}</label>
    <input id={id} type={type} name={name} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
      style={{ width:'100%', boxSizing:'border-box', padding:'.75rem 1rem', background: disabled?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.06)', border:`1px solid ${disabled?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.12)'}`, borderRadius:12, color: disabled?'rgba(255,255,255,0.35)':'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif", transition:'border-color .2s,box-shadow .2s' }}
      onFocus={e=>{ if(!disabled){e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}}
      onBlur={e=>{e.target.style.borderColor=disabled?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.12)';e.target.style.boxShadow='none'}}/>
  </div>
);

const DashboardProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name:user?.name||'', email:user?.email||'', university:user?.university||'', role:user?.role||'student' });
  const [saved, setSaved] = useState(false);

  const handleChange = e => { setForm({...form,[e.target.name]:e.target.value}); setSaved(false); };
  const handleSubmit = e => { e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false), 3000); };

  return (
    <div style={{ maxWidth:720, display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.25rem' }}>Profile Settings</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>Manage your account information</p>
      </motion.div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:22, padding:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'40%', height:1, background:`linear-gradient(90deg,transparent,${T.purple},transparent)` }}/>

        {/* Avatar & info */}
        <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width:68, height:68, borderRadius:18, background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:800, flexShrink:0, boxShadow:`0 0 30px rgba(172,106,255,0.3)` }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'1.05rem', marginBottom:'.25rem' }}>{user?.name}</div>
            <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,0.45)', marginBottom:'.5rem' }}>{user?.email}</div>
            <span style={{ padding:'.3rem .9rem', borderRadius:999, background:`rgba(172,106,255,0.12)`, border:`1px solid rgba(172,106,255,0.25)`, color:T.purple, fontSize:'.73rem', fontWeight:700, textTransform:'capitalize' }}>
              🎓 {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
            <BwInput label="Full Name" id="p-name" name="name" value={form.name} onChange={handleChange} placeholder="Your name"/>
            <BwInput label="Email" id="p-email" type="email" name="email" value={form.email} disabled/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
            <BwInput label="University" id="p-uni" name="university" value={form.university} onChange={handleChange} placeholder="Your university"/>
            <BwInput label="Role" id="p-role" name="role" value={form.role} disabled/>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', paddingTop:'.4rem' }}>
            <button type="submit"
              style={{ padding:'.75rem 2rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 28px rgba(172,106,255,0.25)`, transition:'transform .2s,box-shadow .2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 0 40px rgba(172,106,255,0.4)` }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 0 28px rgba(172,106,255,0.25)` }}>
              Save Changes
            </button>
            {saved && (
              <motion.span initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                style={{ fontSize:'.875rem', color:T.lime, fontWeight:600, display:'flex', alignItems:'center', gap:'.4rem' }}>
                ✓ Saved!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DashboardProfile;
