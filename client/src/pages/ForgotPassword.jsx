import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF' };

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const validate = () => {
    if (!email) { setFieldError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('Enter a valid email address'); return false; }
    setFieldError(''); return true;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!validate()) return;
    setLoading(true);
    try { const data = await forgotPassword(email); setSuccess(true); setResetUrl(data.resetUrl||''); }
    catch (err) { setError(err.response?.data?.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0C1D', padding:'2rem 1.5rem', position:'relative', overflow:'hidden', fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'); *{font-family:'Sora',sans-serif!important;} input::placeholder{color:rgba(255,255,255,0.3)!important;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Bg orbs */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,rgba(255,200,118,0.2) 0%,transparent 70%)`, filter:'blur(90px)', zIndex:0, top:-160, left:-100 }}/>
      <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle,rgba(172,106,255,0.15) 0%,transparent 70%)`, filter:'blur(80px)', zIndex:0, bottom:-80, right:-80 }}/>

      <motion.div initial={{ opacity:0, y:28, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:.8, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:420, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(28px)', borderRadius:28, padding:'2.8rem 2.5rem' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'55%', height:1, background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:16, background:`linear-gradient(135deg,${T.gold},${T.coral})`, fontSize:'1.5rem', marginBottom:'1rem' }}>🔑</div>
          <h2 style={{ fontSize:'1.7rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.4rem' }}>Forgot password?</h2>
          <p style={{ color:'rgba(255,255,255,0.43)', fontSize:'.875rem' }}>No worries — enter your email and we'll send reset instructions.</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(122,219,120,0.12)', border:`1px solid rgba(122,219,120,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 1.2rem' }}>✓</div>
            <h3 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'.6rem', color:T.lime }}>Reset link generated!</h3>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.875rem', marginBottom:'1.2rem', lineHeight:1.65 }}>A password reset link has been created. In production, this gets sent to your email automatically.</p>
            {resetUrl && (
              <div style={{ padding:'.9rem', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', marginBottom:'1.4rem', textAlign:'left' }}>
                <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,0.35)', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.08em' }}>Reset Link (dev only)</div>
                <a href={resetUrl} style={{ fontSize:'.76rem', color:T.gold, wordBreak:'break-all', textDecoration:'none' }}>{resetUrl}</a>
              </div>
            )}
            <Link to="/login"
              style={{ display:'block', padding:'.9rem', borderRadius:14, background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.95rem', textAlign:'center', textDecoration:'none', boxShadow:`0 0 28px rgba(172,106,255,0.25)` }}>
              Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.8rem 1rem', borderRadius:12, background:'rgba(255,119,111,0.1)', border:'1px solid rgba(255,119,111,0.25)', color:T.coral, fontSize:'.84rem', marginBottom:'1.2rem' }}>
                ⚠ {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
              <div>
                <label htmlFor="fp-email" style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:'.45rem' }}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', lineHeight:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>
                  </div>
                  <input id="fp-email" type="email" value={email} onChange={e=>{ setEmail(e.target.value); setFieldError(''); }}
                    placeholder="you@university.edu" autoComplete="email"
                    style={{ width:'100%', boxSizing:'border-box', padding:'.8rem 1rem .8rem 2.8rem', background:'rgba(255,255,255,0.05)', border:`1px solid ${fieldError?T.coral:'rgba(255,255,255,0.1)'}`, borderRadius:12, color:'#fff', fontSize:'.9rem', outline:'none', fontFamily:"'Sora',sans-serif" }}
                    onFocus={e=>{e.target.style.borderColor=T.purple;e.target.style.boxShadow='0 0 0 3px rgba(172,106,255,0.12)'}}
                    onBlur={e=>{e.target.style.borderColor=fieldError?T.coral:'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}/>
                </div>
                {fieldError && <span style={{ fontSize:'.75rem', color:T.coral, marginTop:'.3rem', display:'block' }}>{fieldError}</span>}
              </div>

              <button type="submit" disabled={loading}
                style={{ padding:'.95rem 1.5rem', borderRadius:14, border:'none', cursor:loading?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.gold},${T.coral})`, color:'#fff', fontWeight:700, fontSize:'1rem', fontFamily:"'Sora',sans-serif", boxShadow:`0 0 28px rgba(255,200,118,0.25)`, opacity:loading?.7:1, position:'relative', overflow:'hidden' }}>
                {loading ? <span style={{ display:'inline-block', width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Send Reset Link →'}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.875rem', color:'rgba(255,255,255,0.42)' }}>
              Remember it?{' '}
              <Link to="/login" style={{ color:T.purple, fontWeight:600, textDecoration:'none' }}>Sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
