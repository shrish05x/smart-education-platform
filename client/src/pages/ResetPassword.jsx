import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF' };

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [form, setForm] = useState({ password:'', confirmPassword:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = e => { setForm({...form,[e.target.name]:e.target.value}); if(errors[e.target.name]) setErrors({...errors,[e.target.name]:''}); };

  const validate = () => {
    const e = {};
    if(!form.password) e.password='Password is required'; else if(form.password.length<6) e.password='Min 6 characters'; else if(!/\d/.test(form.password)) e.password='Must contain a number';
    if(!form.confirmPassword) e.confirmPassword='Please confirm password'; else if(form.password!==form.confirmPassword) e.confirmPassword='Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setServerError('');
    if(!validate()) return;
    setLoading(true);
    try { await resetPassword(token, form.password); setSuccess(true); setTimeout(()=>navigate('/login'),3000); }
    catch(err) { setServerError(err.response?.data?.message||'Reset failed. Token may be invalid or expired.'); }
    finally { setLoading(false); }
  };

  const BwPwInput = ({ id, name, label, error }) => (
    <div>
      <label htmlFor={id} style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:'.45rem' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', lineHeight:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <input id={id} type={showPw?'text':'password'} name={name} value={form[name]} onChange={handle} placeholder="••••••••" autoComplete="new-password"
          style={{ width:'100%', boxSizing:'border-box', padding:'.8rem 2.8rem .8rem 2.8rem', background:'rgba(255,255,255,0.05)', border:`1px solid ${error?T.coral:'rgba(255,255,255,0.1)'}`, borderRadius:12, color:'#fff', fontSize:'.9rem', outline:'none', fontFamily:"'Sora',sans-serif" }}
          onFocus={e=>{e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}
          onBlur={e=>{e.target.style.borderColor=error?T.coral:'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}/>
        <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:'.9rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'.9rem', lineHeight:1 }}>{showPw?'🙈':'👁'}</button>
      </div>
      {error && <span style={{ fontSize:'.75rem', color:T.coral, marginTop:'.3rem', display:'block' }}>{error}</span>}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', position:'relative', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;} input::placeholder{color:rgba(255,255,255,0.28)!important;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,rgba(122,219,120,0.2) 0%,transparent 70%)`, filter:'blur(90px)', zIndex:0, top:-160, right:-100 }}/>
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,rgba(172,106,255,0.15) 0%,transparent 70%)`, filter:'blur(80px)', zIndex:0, bottom:-80, left:-80 }}/>

      <motion.div initial={{ opacity:0, y:28, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.8, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:420, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'55%', height:1, background:`linear-gradient(90deg,transparent,${T.lime},transparent)` }}/>

        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:16, background:`linear-gradient(135deg,${T.lime},${T.blue})`, fontSize:'1.4rem', marginBottom:'1rem' }}>🔐</div>
          <h2 style={{ fontSize:'1.7rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.4rem' }}>Reset your password</h2>
          <p style={{ color:'rgba(255,255,255,0.43)', fontSize:'.875rem' }}>Enter your new password below.</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(122,219,120,0.12)', border:`1px solid rgba(122,219,120,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 1.2rem' }}>✓</div>
            <h3 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'.6rem', color:T.lime }}>Password reset successful!</h3>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.875rem', marginBottom:'1.4rem' }}>Your password has been changed. Redirecting to login...</p>
            <Link to="/login" style={{ display:'block', padding:'.9rem', borderRadius:14, background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.95rem', textAlign:'center', textDecoration:'none' }}>Go to Sign In</Link>
          </motion.div>
        ) : (
          <>
            {serverError && (
              <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.8rem 1rem', borderRadius:12, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:T.coral, fontSize:'.84rem', marginBottom:'1.2rem' }}>
                ⚠ {serverError}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
              <BwPwInput id="rp-pw" name="password" label="New Password" error={errors.password}/>
              <BwPwInput id="rp-confirm" name="confirmPassword" label="Confirm New Password" error={errors.confirmPassword}/>
              <button type="submit" disabled={loading}
                style={{ marginTop:'.4rem', padding:'.95rem 1.5rem', borderRadius:14, border:'none', cursor:loading?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.lime},${T.blue})`, color:'#0D0C1D', fontWeight:700, fontSize:'1rem', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 28px rgba(122,219,120,0.2)`, opacity:loading?.7:1, position:'relative', overflow:'hidden' }}>
                {loading ? <span style={{ display:'inline-block', width:18, height:18, border:'2px solid rgba(13,12,29,0.3)', borderTopColor:'#0D0C1D', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Reset Password →'}
              </button>
            </form>
            <p style={{ textAlign:'center', marginTop:'1.4rem', fontSize:'.875rem', color:'rgba(255,255,255,0.4)' }}>
              <Link to="/login" style={{ color:T.purple, fontWeight:600, textDecoration:'none' }}>← Back to Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
