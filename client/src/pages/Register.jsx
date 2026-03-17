import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', blue:'#858DFF', coral:'#FF776F', gold:'#FFC876', lime:'#7ADB78' };

function BwInput({ id, type='text', name, value, onChange, placeholder, icon, error, autoComplete }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none', lineHeight:0 }}>{icon}</div>
      <input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        style={{ width:'100%', boxSizing:'border-box', padding:'.75rem 1rem .75rem 2.8rem', background:'rgba(255,255,255,0.05)', border:`1px solid ${error?T.coral:'rgba(255,255,255,0.1)'}`,
          borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none', fontFamily:"'Sora',sans-serif" }}
        onFocus={e=>{e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}
        onBlur={e=>{e.target.style.borderColor=error?T.coral:'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}/>
    </div>
  );
}

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'student', university:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => { setForm({...form,[e.target.name]:e.target.value}); if(errors[e.target.name]) setErrors({...errors,[e.target.name]:''}); };

  const validate = () => {
    const e = {};
    if(!form.name.trim()) e.name='Name is required'; else if(form.name.trim().length<2) e.name='Min 2 characters';
    if(!form.email) e.email='Email is required'; else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email';
    if(!form.password) e.password='Password is required'; else if(form.password.length<6) e.password='Min 6 characters'; else if(!/\d/.test(form.password)) e.password='Must contain a number';
    if(!form.confirmPassword) e.confirmPassword='Please confirm password'; else if(form.password!==form.confirmPassword) e.confirmPassword='Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setServerError('');
    if(!validate()) return;
    setLoading(true);
    try { await register(form.name, form.email, form.password, form.role, form.university); navigate('/dashboard'); }
    catch(err) { setServerError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const roles = [
    { value:'student',   label:'Student',   icon:'🎓' },
    { value:'mentor',    label:'Mentor',    icon:'👨‍🏫' },
    { value:'counselor', label:'Counselor', icon:'🧘' },
  ];

  const IconUser = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IconMail = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>;
  const IconLock = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  const IconUni  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M4 20V10l8-6 8 6v10"/></svg>;
  const IconShield = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

  const Err = ({msg}) => msg ? <span style={{ fontSize:'.72rem', color:T.coral, marginTop:'.3rem', display:'block' }}>{msg}</span> : null;
  const Label = ({htmlFor, children}) => <label htmlFor={htmlFor} style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:'.4rem' }}>{children}</label>;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', position:'relative', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;} input::placeholder{color:rgba(255,255,255,0.3)!important;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Bg orbs */}
      {[[T.purple,-200,-180,500],[T.blue,'auto','auto',-140,-160,380],[T.coral,'25%','auto','auto','4%',260]].map(([c,t,b,l,r,s],i)=>(
        <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', background:`radial-gradient(circle,${c}30 0%,transparent 70%)`, filter:'blur(90px)', zIndex:0,
          ...(t!=='auto'?{top:t}:{}), ...(b!=='auto'?{bottom:b}:{}), ...(l!=='auto'?{left:l}:{}), ...(r!=='auto'?{right:r}:{}) }} />
      ))}

      <motion.div initial={{ opacity:0, y:28, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.85, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:560, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem' }}>

        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:`linear-gradient(90deg,transparent,${T.purple},transparent)` }}/>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:16, background:`linear-gradient(135deg,${T.purple},${T.blue})`, fontSize:'1.4rem', marginBottom:'1rem' }}>✦</div>
          <h2 style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.4rem' }}>Create your account</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.875rem' }}>Join 500K+ students on EduSuccess</p>
        </div>

        {serverError && (
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.8rem 1rem', borderRadius:12, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:T.coral, fontSize:'.84rem', marginBottom:'1.4rem' }}>
            ⚠ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
          {/* Name + Email */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <Label htmlFor="reg-name">Full Name</Label>
              <BwInput id="reg-name" name="name" value={form.name} onChange={handle} placeholder="Your Name" icon={IconUser} error={errors.name} autoComplete="name"/>
              <Err msg={errors.name}/>
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <BwInput id="reg-email" type="email" name="email" value={form.email} onChange={handle} placeholder="you@uni.edu" icon={IconMail} error={errors.email} autoComplete="email"/>
              <Err msg={errors.email}/>
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <Label htmlFor="reg-pw">Password</Label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', lineHeight:0 }}>{IconLock}</div>
                <input id="reg-pw" type={showPw?'text':'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••" autoComplete="new-password"
                  style={{ width:'100%', boxSizing:'border-box', padding:'.75rem 2.8rem .75rem 2.8rem', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.password?T.coral:'rgba(255,255,255,0.1)'}`, borderRadius:12, color:'#fff', fontSize:'.875rem', outline:'none' }}
                  onFocus={e=>{e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}
                  onBlur={e=>{e.target.style.borderColor=errors.password?T.coral:'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:'.9rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'.9rem', lineHeight:1 }}>{showPw?'🙈':'👁'}</button>
              </div>
              <Err msg={errors.password}/>
            </div>
            <div>
              <Label htmlFor="reg-confirm">Confirm</Label>
              <BwInput id="reg-confirm" type={showPw?'text':'password'} name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="••••••••" icon={IconShield} error={errors.confirmPassword} autoComplete="new-password"/>
              <Err msg={errors.confirmPassword}/>
            </div>
          </div>

          {/* University */}
          <div>
            <Label htmlFor="reg-uni">University <span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>(optional)</span></Label>
            <BwInput id="reg-uni" name="university" value={form.university} onChange={handle} placeholder="e.g. IIT Delhi, BITS Pilani..." icon={IconUni}/>
          </div>

          {/* Role picker */}
          <div>
            <Label>I am a...</Label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem' }}>
              {roles.map(r => (
                <label key={r.value} style={{ position:'relative', cursor:'pointer' }}>
                  <input type="radio" name="role" value={r.value} checked={form.role===r.value} onChange={handle} style={{ position:'absolute', opacity:0, width:0, height:0 }}/>
                  <div style={{ padding:'.9rem .75rem', borderRadius:14, border:`1px solid ${form.role===r.value?T.purple:'rgba(255,255,255,0.1)'}`, background: form.role===r.value?'rgba(172,106,255,0.14)':'rgba(255,255,255,0.04)', textAlign:'center', transition:'all .2s',
                    boxShadow: form.role===r.value?'0 0 24px rgba(172,106,255,0.18)':'none' }}>
                    <div style={{ fontSize:'1.4rem', marginBottom:'.3rem' }}>{r.icon}</div>
                    <div style={{ fontSize:'.78rem', fontWeight:600, color: form.role===r.value?T.purple:'rgba(255,255,255,0.6)' }}>{r.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-shine"
            style={{ marginTop:'.4rem', padding:'.95rem 1.5rem', borderRadius:14, border:'none', cursor:loading?'not-allowed':'pointer',
              background:`linear-gradient(135deg,${T.purple},#C795FF)`, color:'#fff', fontWeight:700, fontSize:'1rem', fontFamily:"'Sora',sans-serif",
              boxShadow:'0 0 32px rgba(172,106,255,0.3)', transition:'transform .25s,box-shadow .25s', opacity:loading?.7:1, position:'relative', overflow:'hidden' }}>
            {loading ? <span style={{ display:'inline-block', width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Create My Account →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.875rem', color:'rgba(255,255,255,0.45)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:T.purple, fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
