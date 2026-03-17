import ChatWindow from '../components/chat/ChatWindow';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', blue:'#858DFF', gold:'#FFC876' };

const AiAssistant = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', height:'100%' }}>
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
      <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>🤖</div>
      <div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.15rem',
          background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          AI Tutor
        </h1>
        <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'.82rem' }}>Your 24/7 personal study assistant — ask anything, get clear answers.</p>
      </div>
      <div style={{ marginLeft:'auto', padding:'.35rem .9rem', borderRadius:999, background:'rgba(122,219,120,0.12)', border:'1px solid rgba(122,219,120,0.25)', color:'#7ADB78', fontSize:'.75rem', fontWeight:700 }}>
        ● Online
      </div>
    </motion.div>
    <ChatWindow />
  </div>
);

export default AiAssistant;
