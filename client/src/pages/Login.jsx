import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', blue:'#858DFF', coral:'#FF776F', gold:'#FFC876' };

function BwInput({ id, type='text', name, value, onChange, placeholder, icon, error, rightEl, autoComplete }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }}>{icon}</div>
      <input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        style={{ width:'100%', padding:'.8rem 1rem .8rem 2.8rem', background:'rgba(255,255,255,0.05)', border:`1px solid ${error?T.coral:'rgba(255,255,255,0.1)'}`,
          borderRadius:12, color:'#fff', fontSize:'.9rem', outline:'none', boxSizing:'border-box', paddingRight: rightEl?'3rem':'1rem',
          fontFamily:"'Sora',sans-serif" }}
        onFocus={e=>{e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}
        onBlur={e=>{e.target.style.borderColor=error?T.coral:'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}/>
      {rightEl && <div style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  );
}

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => { setForm({...form,[e.target.name]:e.target.value}); if(errors[e.target.name]) setErrors({...errors,[e.target.name]:''}); };

  const validate = () => {
    const e = {};
    if(!form.email) e.email='Email is required';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email';
    if(!form.password) e.password='Password is required';
    else if(form.password.length<6) e.password='Min 6 characters';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setServerError('');
    if(!validate()) return;
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch(err) { setServerError(err.response?.data?.message || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', position:'relative', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;}`}</style>

      {/* Background orbs */}
      {[[T.purple,-200,-180,480],[T.blue,'auto','auto',-200,-160,400],['#FF776F','30%','auto','auto','6%',280]].map(([c,t,b,l,r,s],i)=>(
        <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', background:`radial-gradient(circle,${c}30 0%,transparent 70%)`, filter:'blur(90px)', zIndex:0,
          ...(t!=='auto'?{top:t}:{}), ...(b!=='auto'?{bottom:b}:{}), ...(l!=='auto'?{left:l}:{}), ...(r!=='auto'?{right:r}:{}) }} />
      ))}

      <motion.div initial={{ opacity:0, y:30, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.8, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem' }}>

        {/* Top shimmer */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:`linear-gradient(90deg,transparent,${T.purple},transparent)` }}/>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:16, background:`linear-gradient(135deg,${T.purple},${T.blue})`, fontSize:'1.4rem', marginBottom:'1.1rem' }}>✦</div>
          <h2 style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.4rem' }}>Welcome back</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.875rem' }}>Sign in to your EduSuccess account</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.85rem 1rem', borderRadius:12, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:'#FF776F', fontSize:'.85rem', marginBottom:'1.4rem' }}>
            ⚠ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }} noValidate>
          <div>
            <label htmlFor="login-email" style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'rgba(255,255,255,0.65)', marginBottom:'.45rem' }}>Email Address</label>
            <BwInput id="login-email" type="email" name="email" value={form.email} onChange={handle} placeholder="you@university.edu"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>}
              error={errors.email} autoComplete="email"/>
            {errors.email && <span style={{ fontSize:'.75rem', color:T.coral, marginTop:'.3rem', display:'block' }}>{errors.email}</span>}
          </div>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.45rem' }}>
              <label htmlFor="login-pw" style={{ fontSize:'.8rem', fontWeight:600, color:'rgba(255,255,255,0.65)' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize:'.78rem', color:T.purple, textDecoration:'none' }}>Forgot password?</Link>
            </div>
            <BwInput id="login-pw" type={showPw?'text':'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
              error={errors.password} autoComplete="current-password"
              rightEl={<button type="button" onClick={()=>setShowPw(!showPw)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:0, lineHeight:0 }}>{showPw?'🙈':'👁'}</button>}/>
            {errors.password && <span style={{ fontSize:'.75rem', color:T.coral, marginTop:'.3rem', display:'block' }}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-shine"
            style={{ marginTop:'.4rem', padding:'.95rem 1.5rem', borderRadius:14, border:'none', cursor: loading?'not-allowed':'pointer',
              background:`linear-gradient(135deg,${T.purple},#C795FF)`, color:'#fff', fontWeight:700, fontSize:'1rem', fontFamily:"'Sora',sans-serif",
              boxShadow:'0 0 32px rgba(172,106,255,0.3)', transition:'transform .25s,box-shadow .25s', opacity: loading?.7:1, position:'relative', overflow:'hidden' }}>
            {loading ? <span style={{ display:'inline-block', width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.6rem', fontSize:'.875rem', color:'rgba(255,255,255,0.45)' }}>
          No account yet?{' '}
          <Link to="/register" style={{ color:T.purple, fontWeight:600, textDecoration:'none' }}>Create one free</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Login;
