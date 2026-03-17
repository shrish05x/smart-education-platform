import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════
   BRAINWAVE PALETTE
   #AC6AFF purple  #FFC876 gold  #FF776F coral
   #7ADB78 lime    #858DFF blue  #FF98E2 pink
═══════════════════════════════════════════════════════════════════════ */
const P = {
  purple: '#AC6AFF', gold: '#FFC876', coral: '#FF776F',
  lime: '#7ADB78',   blue: '#858DFF', pink: '#FF98E2',
  bg: '#0D0C1D',
};

/* ── Global CSS injected once ─────────────────────────────────────── */
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
html { scroll-behavior: smooth; }
body { font-family: 'Sora', sans-serif !important; background: #0D0C1D !important; }

.god-ray-l {
  position: fixed; top: -10%; left: 18%; width: 2px; height: 130vh; pointer-events: none; z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(172,106,255,0.08) 35%, rgba(133,141,255,0.1) 65%, transparent 100%);
  transform: rotate(-14deg); filter: blur(3px);
  animation: grl 12s ease-in-out infinite alternate;
}
.god-ray-r {
  position: fixed; top: -10%; right: 22%; width: 1px; height: 130vh; pointer-events: none; z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(255,119,111,0.05) 40%, rgba(255,200,118,0.07) 70%, transparent 100%);
  transform: rotate(11deg); filter: blur(5px);
  animation: grl 15s ease-in-out 3s infinite alternate;
}
@keyframes grl {
  from { opacity: .4; transform: rotate(-14deg) scaleX(1); }
  to   { opacity: .9; transform: rotate(-11deg) scaleX(2.6); }
}
.scanl { position: relative; }
.scanl::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 10;
  background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.013) 2px,rgba(255,255,255,0.013) 4px);
  opacity: 0; transition: opacity 0.3s;
}
.scanl:hover::before { opacity: 1; }
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: ''; position: absolute; top: -50%; left: -60%; width: 33%; height: 200%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
  transform: skewX(-25deg); transition: left 0.7s;
}
.btn-shine:hover::after { left: 178%; }
@keyframes orbf { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,38px) scale(1.08)} }
@keyframes chipf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
`;

/* ═══════════════════════════════════════════════════════════════════════
   THREE.JS ORB (brainwave conic ring style)
═══════════════════════════════════════════════════════════════════════ */
function CosmicOrb() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;
    const geo = new THREE.SphereGeometry(1.2, 64, 64);
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(P.bg), metalness: .9, roughness: .1, emissive: new THREE.Color(P.purple), emissiveIntensity: .12 });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);
    scene.add(new THREE.Mesh(geo.clone(), new THREE.MeshBasicMaterial({ color: P.purple, wireframe: true, transparent: true, opacity: .07 })));
    const mkR = (r, col, op, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, .01, 4, 200), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op }));
      m.rotation.set(rx, ry, rz); scene.add(m); return m;
    };
    const r1 = mkR(1.65, P.purple, .6, Math.PI/3);
    const r2 = mkR(1.9, P.coral, .4, Math.PI/6, Math.PI/5);
    const r3 = mkR(2.1, P.blue,  .3, 0, 0, Math.PI/4);
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) { const r = 2.4 + Math.random()*1.5, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1); pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph); }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: P.gold, size: .04, transparent: true, opacity: .7 }));
    scene.add(pts);
    scene.add(new THREE.AmbientLight('#fff', .4));
    const pL = new THREE.PointLight(P.purple, 4, 12); pL.position.set(3,2,2); scene.add(pL);
    const cL = new THREE.PointLight(P.coral, 3, 12); cL.position.set(-3,-2,1); scene.add(cL);
    const onMM = e => { const rc = el.getBoundingClientRect(); mouse.current.x = ((e.clientX-rc.left)/W-.5)*2; mouse.current.y = -((e.clientY-rc.top)/H-.5)*2; };
    el.addEventListener('mousemove', onMM);
    let t = 0, raf;
    const loop = () => { raf = requestAnimationFrame(loop); t += .008;
      sphere.rotation.y += .003; sphere.rotation.z += .001;
      sphere.position.x += (mouse.current.x*.25 - sphere.position.x)*.05;
      sphere.position.y += (mouse.current.y*.2 + Math.sin(t*.7)*.06 - sphere.position.y)*.05;
      r1.rotation.z += .004; r2.rotation.y += .003; r3.rotation.x += .002; r3.rotation.y -= .003; pts.rotation.y += .001;
      mat.emissiveIntensity = .1 + Math.sin(t*1.5)*.05; pL.intensity = 3 + Math.sin(t*2);
      renderer.render(scene, camera);
    };
    loop();
    return () => { cancelAnimationFrame(raf); el.removeEventListener('mousemove', onMM); renderer.dispose(); if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} style={{ width:'100%', height:'100%' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   STARFIELD CANVAS
═══════════════════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const cvs = ref.current; if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let W = innerWidth, H = innerHeight; cvs.width = W; cvs.height = H;
    const COLS = [`rgba(172,106,255,`, `rgba(133,141,255,`, `rgba(255,119,111,`, `rgba(255,200,118,`, `rgba(122,219,120,`, `rgba(255,152,226,`];
    const stars = Array.from({ length: 220 }, () => ({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.14, vy:(Math.random()-.5)*.14, r:Math.random()*1.5+.3, a:Math.random()*.5+.15, ad:Math.random()>.5?1:-1, col:COLS[Math.floor(Math.random()*COLS.length)] }));
    let sy = 0, raf;
    const draw = () => { ctx.clearRect(0,0,W,H); const off = sy*.03;
      for (const s of stars) { s.x+=s.vx; s.y+=s.vy; s.a+=s.ad*.003; if(s.a<.05||s.a>.8)s.ad*=-1; if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0; ctx.beginPath(); ctx.arc(s.x,s.y-off,s.r,0,Math.PI*2); ctx.fillStyle=s.col+s.a+')'; ctx.fill(); }
      for (let i=0;i<stars.length;i++) for (let j=i+1;j<stars.length;j++) { const dx=stars[i].x-stars[j].x, dy=(stars[i].y-off)-(stars[j].y-off), d=Math.sqrt(dx*dx+dy*dy); if(d<92){ctx.beginPath();ctx.moveTo(stars[i].x,stars[i].y-off);ctx.lineTo(stars[j].x,stars[j].y-off);ctx.strokeStyle='rgba(172,106,255,'+(1-d/92)*.09+')';ctx.lineWidth=.4;ctx.stroke()} }
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener('scroll', () => { sy = scrollY; }, { passive:true });
    window.addEventListener('resize', () => { W=innerWidth; H=innerHeight; cvs.width=W; cvs.height=H; });
    draw();
    return () => { cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   CURSOR TRAIL
═══════════════════════════════════════════════════════════════════════ */
function CursorTrail() {
  const [dots, setDots] = useState([]);
  const id = useRef(0);
  useEffect(() => {
    const fn = e => { const cur = id.current++; setDots(p => [...p.slice(-14), { id:cur, x:e.clientX, y:e.clientY }]); setTimeout(() => setDots(p => p.filter(d => d.id !== cur)), 550); };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}>
      {dots.map(d => <motion.div key={d.id} initial={{ opacity:.6, scale:1 }} animate={{ opacity:0, scale:0 }} transition={{ duration:.5 }}
        style={{ position:'absolute', left:d.x-6, top:d.y-6, width:12, height:12, borderRadius:'50%', background:P.purple, boxShadow:`0 0 14px ${P.purple}` }} />)}
    </div>
  );
}

/* ── Scroll Reveal ─────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity:0, y:55, scale:.97, filter:'blur(7px)' }}
      whileInView={{ opacity:1, y:0, scale:1, filter:'blur(0px)' }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.95, delay, ease:[.16,1,.3,1] }}>
      {children}
    </motion.div>
  );
}

/* ── Magnetic Button ───────────────────────────────────────────────── */
function MagBtn({ to, children, primary }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x:0, y:0 });
  return (
    <motion.div ref={ref} animate={{ x:pos.x, y:pos.y }} transition={{ type:'spring', stiffness:420, damping:26 }}
      onMouseMove={e => { const r=ref.current.getBoundingClientRect(); setPos({ x:(e.clientX-r.left-r.width/2)*.3, y:(e.clientY-r.top-r.height/2)*.3 }); }}
      onMouseLeave={() => setPos({ x:0, y:0 })}>
      <Link to={to} className="btn-shine" style={primary ? {
        display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'1rem 2.4rem', borderRadius:999, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1rem', textDecoration:'none', color:'#fff',
        background:`linear-gradient(135deg,${P.purple},#C795FF)`, boxShadow:`0 0 38px rgba(172,106,255,0.32),inset 0 1px 0 rgba(255,255,255,0.14)`, transition:'transform .3s,box-shadow .3s',
      } : {
        display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'1rem 2.4rem', borderRadius:999, fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'1rem', textDecoration:'none',
        color:'rgba(255,255,255,0.82)', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)',
      }}>
        {children}
      </Link>
    </motion.div>
  );
}

/* ── Tilt Card ─────────────────────────────────────────────────────── */
function TiltCard({ children, style, className = '' }) {
  const ref = useRef(null);
  return (
    <div ref={ref} className={`scanl ${className}`}
      onMouseMove={e => { const r=ref.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; ref.current.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*7}deg) translateY(-8px) scale(1.02)`; }}
      onMouseLeave={() => { ref.current.style.transform = ''; }}
      style={{ transition:'transform .4s cubic-bezier(.25,.46,.45,.94),box-shadow .4s,border-color .4s', cursor:'default', ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0,600], [0,-100]);
  const heroOp = useTransform(scrollY, [0,400], [1,0]);
  const springY = useSpring(heroY, { stiffness:80, damping:20 });

  const benefits = [
    { icon:'🧠', title:'Concept Explainer',    desc:'Breaks down any lecture or textbook chapter into simple language with real-world analogies that actually stick.', col:P.purple,  glow:'rgba(172,106,255,' },
    { icon:'🔢', title:'Step-by-Step Solver',  desc:'Walks through problems — maths, code, essays, case studies — one clear step at a time with full reasoning shown.',  col:P.blue,    glow:'rgba(133,141,255,' },
    { icon:'💬', title:'Instant Q&A',          desc:'Ask anything, anytime — from a specific exam question to "why do I even need this?" — and get an answer instantly.',  col:P.coral,   glow:'rgba(255,119,111,' },
    { icon:'📊', title:'Progress Dashboard',   desc:'See your academic condition, topic mastery, quiz scores, and weekly growth — all visualised in real time.',           col:P.gold,    glow:'rgba(255,200,118,' },
    { icon:'🏫', title:'Live Chat Classroom',  desc:'Study with friends in real-time chat rooms, share notes, ask the group, and solve problems together.',                col:P.lime,    glow:'rgba(122,219,120,' },
    { icon:'🎯', title:'Instant Quizzes',      desc:'Test yourself on any topic with AI-generated quizzes, get instant scored results, and see exactly what to improve.',   col:P.pink,    glow:'rgba(255,152,226,' },
  ];

  const services = [
    { n:'01', title:'AI Mentoring & Counselling', desc:'Personal mentoring from AI and real senior students — career advice, life decisions, academic planning, and emotional support. Available 24/7.',   col:P.purple },
    { n:'02', title:'Internship Suite',            desc:"AI guides your entire internship hunt — CV writing, cover letters, mock interviews, and curated job matches based on your skills and goals.",       col:P.blue   },
    { n:'03', title:'Live Video with Mentors',     desc:'Schedule or drop into live 1:1 or group video calls with seniors, faculty mentors, or friends — your virtual study room, always open.',            col:P.coral  },
    { n:'04', title:'Deep Topic Exploration',      desc:'Go beyond the syllabus — ask your AI to take any concept as deep as you want, from beginner basics to advanced research-level insights.',          col:P.gold   },
    { n:'05', title:'Group Study Rooms',           desc:'Create or join real-time study rooms with classmates — share screens, pin notes, drop resources, and learn together in perfect sync.',              col:P.lime   },
    { n:'06', title:'Personal Life Coach',         desc:'Beyond academics — your AI helps with time management, goal tracking, mental wellness check-ins, and professional habit building.',                  col:P.pink   },
  ];

  const testimonials = [
    { q:'"The concept explainer got me through Thermodynamics in 3 days. I\'d been stuck for weeks. It used a cooking analogy and suddenly it all clicked. Best tool I\'ve used."', name:'Rohan Mehra',   role:'Mech. Eng., NIT Trichy',    init:'R', gc:[P.purple,P.blue],   rot:-1.5 },
    { q:'"Got my internship at Razorpay after the AI mock interview and CV builder. The feedback was shockingly accurate — better than most coaching institutes."',                 name:'Sneha Iyer',    role:'CS, BITS Pilani',           init:'S', gc:[P.blue,P.lime],     rot:1    },
    { q:'"The live study rooms are my entire academic existence now. We do Pomodoro sessions, quiz each other, share notes — it feels like a real campus library but online."',    name:'Aayush Sharma', role:'MBA, IIM Bangalore',         init:'A', gc:[P.coral,P.gold],   rot:-.8  },
    { q:'"At 2 AM during finals, I was breaking down. The AI counsellor listened and helped me refocus. I didn\'t expect it to feel that real. Life-saver."',                     name:'Priya Nair',    role:'Psychology, Delhi Univ.',   init:'P', gc:[P.pink,P.purple],   rot:1.2  },
  ];

  // grid positions for overlapping testimonial layout
  const tGrid = [
    { gridColumn:'1', gridRow:'1 / span 2' },
    { gridColumn:'2', gridRow:'1' },
    { gridColumn:'3', gridRow:'1 / span 2' },
    { gridColumn:'2', gridRow:'2' },
  ];

  return (
    <div style={{ background:P.bg, minHeight:'100vh', overflowX:'hidden', fontFamily:"'Sora',sans-serif", color:'#fff' }}>
      <style>{GCSS}</style>
      <StarField />
      <div className="god-ray-l" />
      <div className="god-ray-r" />
      <CursorTrail />

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <motion.nav initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.7, ease:[.16,1,.3,1] }}
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1.15rem 2.8rem', backdropFilter:'blur(24px)', background:'rgba(13,12,29,0.76)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'1.15rem', letterSpacing:'-.02em', background:`linear-gradient(90deg,${P.purple},${P.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ✦ EduSuccess
        </div>
        <div className="hidden md:flex" style={{ gap:'2.5rem' }}>
          {['Features','Services','Students'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color:'rgba(255,255,255,0.54)', textDecoration:'none', fontSize:'.875rem', fontWeight:500, fontFamily:"'Sora',sans-serif", transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.54)'}>{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          <Link to="/login" style={{ color:'rgba(255,255,255,0.58)', fontSize:'.875rem', fontWeight:600, textDecoration:'none', fontFamily:"'Sora',sans-serif" }}>Sign In</Link>
          <Link to="/register" className="btn-shine"
            style={{ background:`linear-gradient(135deg,${P.purple},#C795FF)`, color:'#fff', padding:'.65rem 1.6rem', borderRadius:999, fontSize:'.875rem', fontWeight:700, textDecoration:'none', boxShadow:`0 0 28px rgba(172,106,255,0.28)`, fontFamily:"'Sora',sans-serif" }}>
            Join Free →
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:120, zIndex:2, overflow:'hidden',
        background:`radial-gradient(ellipse 90% 60% at 50% -10%,rgba(172,106,255,0.18) 0%,transparent 70%), radial-gradient(ellipse 55% 40% at 82% 80%,rgba(133,141,255,0.09) 0%,transparent 60%), radial-gradient(ellipse 50% 30% at 10% 70%,rgba(255,119,111,0.08) 0%,transparent 60%)` }}>

        {/* Parallax nebula orbs */}
        {[{c:P.purple,t:-180,l:-160,s:520,d:0},{c:P.blue,t:'auto',l:'auto',r:-120,b:-120,s:420,d:-8},{c:P.coral,t:'30%',l:'auto',r:'6%',s:320,d:-14},{c:P.gold,t:'auto',b:'22%',l:'6%',s:260,d:-4}].map((o,i)=>(
          <div key={i} style={{ position:'absolute', width:o.s, height:o.s, borderRadius:'50%', zIndex:0, filter:'blur(90px)', pointerEvents:'none',
            background:`radial-gradient(circle,${o.c}40 0%,transparent 70%)`,
            ...(o.t!=='auto'&&o.t!==undefined?{top:o.t}:{}), ...(o.l!=='auto'&&o.l!==undefined?{left:o.l}:{}),
            ...(o.r!==undefined?{right:o.r}:{}), ...(o.b!==undefined?{bottom:o.b}:{}),
            animation:`orbf ${18+i*5}s ease-in-out ${o.d}s infinite alternate` }} />
        ))}

        {/* Three.js Orb */}
        <motion.div style={{ y:springY, position:'relative', zIndex:10, width:340, height:340, marginBottom:-24 }}>
          <CosmicOrb />
        </motion.div>

        {/* Hero copy */}
        <motion.div style={{ y:heroY, opacity:heroOp, position:'relative', zIndex:10, textAlign:'center', maxWidth:1020, padding:'0 1.5rem' }}>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.8,delay:.2 }}
            style={{ display:'inline-flex', alignItems:'center', gap:'.55rem', marginBottom:'1.6rem', padding:'.45rem 1.15rem', borderRadius:999,
              border:`1px solid rgba(172,106,255,0.3)`, background:'rgba(172,106,255,0.09)', backdropFilter:'blur(12px)',
              color:P.purple, fontFamily:"'Sora',sans-serif", fontSize:'.77rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:P.purple,animation:'pulse 2s infinite' }} />
            Powered by AI · Built for University Students
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:42,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} transition={{ duration:1,delay:.3,ease:[.16,1,.3,1] }}
            style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(3rem,7.5vw,7.5rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-.04em', marginBottom:'1.3rem' }}>
            Your Personal<br/>
            <span style={{ background:`linear-gradient(135deg,${P.purple},${P.blue},${P.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:`drop-shadow(0 0 35px rgba(172,106,255,0.45))` }}>
              AI Tutor
            </span>
            {' '}
            <span style={{ color:'rgba(255,255,255,0.85)' }}>&amp;</span>
            <br/>
            <span style={{ background:`linear-gradient(135deg,${P.gold},${P.coral},${P.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Campus Best Friend
            </span>
          </motion.h1>

          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.9,delay:.65 }}
            style={{ fontFamily:"'Sora',sans-serif", color:'rgba(255,255,255,0.5)', fontSize:'1.1rem', lineHeight:1.8, maxWidth:580, margin:'0 auto 2.5rem' }}>
            Deep understanding. Real mentoring. Live together.<br/>
            Study smarter, grow faster, and never face university alone — with a 24/7 AI companion that actually gets you.
          </motion.p>

          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.9,delay:.85 }}
            style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <MagBtn to="/register" primary>Start Studying Free →</MagBtn>
            <MagBtn to="/login">Sign In</MagBtn>
          </motion.div>

          {/* Feature chips */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            style={{ display:'flex', flexWrap:'wrap', gap:'.9rem', justifyContent:'center', marginTop:'2.8rem' }}>
            {['🤖 24/7 AI Tutor','📹 Live Video Rooms','💬 Chat Classrooms','📊 Progress Dashboard','🎓 Internship Guidance'].map((c,i)=>(
              <div key={i} style={{ padding:'.5rem 1.1rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(12px)',
                fontFamily:"'Sora',sans-serif", fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,0.66)',
                animation:`chipf ${5.5+i}s ease-in-out ${i*.4}s infinite` }}>{c}</div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
            style={{ marginTop:'3rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'.4rem', color:'rgba(255,255,255,0.18)', fontFamily:"'Sora',sans-serif", fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.1em' }}>
            <motion.div animate={{ y:[0,7,0] }} transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}>↓</motion.div>
            Scroll to explore
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <Reveal>
            <div style={{ borderRadius:28, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', padding:'2.8rem 3rem',
              display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2rem', textAlign:'center' }}>
              {[['500K+','Students',P.purple],['50+','Universities',P.blue],['98%','Satisfaction',P.coral],['4.9★','Avg Rating',P.gold]].map(([v,l,c])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'2.6rem', fontWeight:900, color:c, letterSpacing:'-.04em', lineHeight:1 }}>{v}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.7rem', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'.1em', marginTop:'.4rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENEFITS GRID ─────────────────────────────────────────── */}
      <section id="features" style={{ position:'relative', zIndex:2, padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.38rem 1rem', borderRadius:999, border:`1px solid rgba(172,106,255,0.38)`, background:'rgba(172,106,255,0.09)', color:P.purple, fontFamily:"'Sora',sans-serif", fontSize:'.73rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.2rem' }}>✦ Core Capabilities</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1 }}>
                Everything you need.{' '}
                <span style={{ background:`linear-gradient(135deg,${P.purple},${P.blue},${P.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>In one place.</span>
              </h2>
              <p style={{ fontFamily:"'Sora',sans-serif", color:'rgba(255,255,255,0.43)', maxWidth:470, margin:'.8rem auto 0', lineHeight:1.75 }}>Your senior, professor, therapist, and career advisor — all baked into one AI campus companion.</p>
            </div>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))', gap:'1.5rem' }}>
            {benefits.map((b,i) => (
              <Reveal key={b.title} delay={i*.08}>
                <motion.div animate={{ y:[0,-7,0] }} transition={{ duration:5+i*.6, repeat:Infinity, ease:'easeInOut', delay:i*.5 }}>
                  <TiltCard style={{ borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)', padding:'2rem', position:'relative', overflow:'hidden' }}>
                    {/* Bloom */}
                    <div style={{ position:'absolute', inset:0, borderRadius:24, background:`radial-gradient(ellipse 80% 60% at 50% -10%,${b.glow}0.14) 0%,transparent 60%)`, opacity:0, transition:'opacity .4s', pointerEvents:'none' }} className="card-bloom" />
                    <div style={{ fontSize:'2.4rem', marginBottom:'1.1rem' }}>{b.icon}</div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1.05rem', marginBottom:'.5rem', letterSpacing:'-.01em', color:b.col }}>{b.title}</div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.86rem', color:'rgba(255,255,255,0.47)', lineHeight:1.73 }}>{b.desc}</div>
                  </TiltCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORBITAL BRAIN VISUAL ──────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'5rem 1.5rem', textAlign:'center', background:`radial-gradient(ellipse 80% 60% at 50% 50%,rgba(172,106,255,0.07) 0%,transparent 70%)` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.38rem 1rem', borderRadius:999, border:`1px solid rgba(133,141,255,0.38)`, background:'rgba(133,141,255,0.09)', color:P.blue, fontFamily:"'Sora',sans-serif", fontSize:'.73rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.2rem' }}>⬡ Your Campus, Connected</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1 }}>
              One AI core.{' '}
              <span style={{ color:P.blue }}>An entire university experience.</span>
            </h2>
            <p style={{ fontFamily:"'Sora',sans-serif", color:'rgba(255,255,255,0.4)', maxWidth:500, margin:'.8rem auto 0', lineHeight:1.75 }}>Students, mentors, AI tutors, and career guides — all connected in one real-time space designed around you.</p>
          </Reveal>

          {/* Orbital diagram */}
          <Reveal delay={.2}>
            <div style={{ position:'relative', width:390, height:390, margin:'4rem auto' }}>
              <motion.div animate={{ rotate:360 }} transition={{ duration:22, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:0, borderRadius:'50%', background:`conic-gradient(from 0deg,${P.purple},${P.blue},${P.coral},${P.gold},${P.lime},${P.pink},${P.purple})`, filter:'blur(3px) brightness(0.76)' }} />
              <div style={{ position:'absolute', inset:12, borderRadius:'50%', background:'radial-gradient(circle,#0D0C1D 53%,rgba(13,12,29,0.9) 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'.4rem', fontSize:'3rem' }}>
                🎓<span style={{ fontFamily:"'Sora',sans-serif", fontSize:'.9rem', fontWeight:700, letterSpacing:'-.01em' }}>AI Campus</span>
              </div>
              {[[28,`rgba(172,106,255,0.35)`,1],[52,`rgba(133,141,255,0.22)`,1],[78,`rgba(255,119,111,0.15)`,-1]].map(([gap,c,dir],i)=>(
                <motion.div key={i} animate={{ rotate: dir===1?360:-360 }} transition={{ duration:28+i*15, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', inset:-gap, borderRadius:'50%', border:`1px solid ${c}` }} />
              ))}
              <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:-78, borderRadius:'50%' }}>
                {[P.purple,P.blue,P.coral,P.gold,P.lime,P.pink].map((c,i)=>(
                  <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:10, height:10, borderRadius:'50%', background:c, boxShadow:`0 0 10px ${c}`, transform:`rotate(${i*60}deg) translateX(192px) translateY(-5px)`, transformOrigin:'0 0' }} />
                ))}
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────── */}
      <section id="services" style={{ position:'relative', zIndex:2, padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ marginBottom:'3.5rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.38rem 1rem', borderRadius:999, border:`1px solid rgba(255,200,118,0.38)`, background:'rgba(255,200,118,0.09)', color:P.gold, fontFamily:"'Sora',sans-serif", fontSize:'.73rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.2rem' }}>✦ What You Get</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1 }}>
                From study help{' '}
                <span style={{ background:`linear-gradient(135deg,${P.gold},${P.coral},${P.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>to life advice</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))', gap:'1.75rem' }}>
            {services.map((s,i) => (
              <Reveal key={s.n} delay={i*.08}>
                <TiltCard style={{ borderRadius:26, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', padding:'2.3rem', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${s.col},transparent)`, opacity:.7 }} />
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em', color:'rgba(255,255,255,0.2)', textTransform:'uppercase', marginBottom:'.9rem' }}>{s.n}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'1.15rem', fontWeight:700, letterSpacing:'-.02em', marginBottom:'.6rem', color:s.col }}>{s.title}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.875rem', color:'rgba(255,255,255,0.44)', lineHeight:1.76 }}>{s.desc}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section id="students" style={{ position:'relative', zIndex:2, padding:'5rem 1.5rem', background:`radial-gradient(ellipse 100% 60% at 50% 50%,rgba(172,106,255,0.07) 0%,transparent 70%)` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:'4rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.38rem 1rem', borderRadius:999, border:`1px solid rgba(255,119,111,0.38)`, background:'rgba(255,119,111,0.09)', color:P.coral, fontFamily:"'Sora',sans-serif", fontSize:'.73rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.2rem' }}>★ Real Student Stories</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:800, letterSpacing:'-.03em' }}>
                Students who{' '}
                <span style={{ color:P.coral }}>actually used it</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={.2}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'auto auto', gap:'1.5rem' }}>
              {testimonials.map((t,i) => (
                <motion.div key={i} style={{ ...tGrid[i], transform:`rotate(${t.rot}deg)` }} whileHover={{ rotate:0, y:-8, scale:1.03 }} transition={{ duration:.35 }}>
                  <div className="scanl" style={{ height:'100%', padding:'1.9rem', borderRadius:24, border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(28px)', position:'relative', overflow:'hidden', cursor:'default' }}>
                    <div style={{ color:P.gold, fontSize:'.92rem', letterSpacing:'.1em', marginBottom:'.9rem' }}>★★★★★</div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.88rem', lineHeight:1.77, color:'rgba(255,255,255,0.57)', marginBottom:'1.4rem' }}>{t.q}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                      <div style={{ width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,${t.gc[0]},${t.gc[1]})`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:"'Sora',sans-serif",fontSize:'.9rem' }}>{t.init}</div>
                      <div>
                        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'.84rem' }}>{t.name}</div>
                        <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'.72rem', color:'rgba(255,255,255,0.37)' }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'7rem 1.5rem', background:`radial-gradient(ellipse 80% 80% at 50% 50%,rgba(172,106,255,0.1) 0%,transparent 70%)` }}>
        <Reveal>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center', padding:'5rem 2.5rem', borderRadius:40, border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(40px)', background:'rgba(255,255,255,0.03)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:`linear-gradient(90deg,transparent,${P.purple},transparent)` }} />
            <div style={{ fontSize:'2.8rem', marginBottom:'1rem' }}>🚀</div>
            <motion.h2 animate={{ y:[0,-5,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
              style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.5rem,5.5vw,5.5rem)', fontWeight:800, letterSpacing:'-.04em', lineHeight:1.08, marginBottom:'1.3rem' }}>
              Your smartest friend<br/>is waiting for you.<br/>
              <span style={{ background:`linear-gradient(135deg,${P.purple},${P.blue},${P.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Right now.
              </span>
            </motion.h2>
            <p style={{ fontFamily:"'Sora',sans-serif", color:'rgba(255,255,255,0.47)', fontSize:'1.05rem', maxWidth:520, margin:'0 auto 3rem', lineHeight:1.76 }}>
              Join 500,000+ university students using EduSuccess to study smarter, grow faster, and never feel alone in their academic journey.
            </p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <MagBtn to="/register" primary>Start Free — No Credit Card →</MagBtn>
              <MagBtn to="/login">Sign In</MagBtn>
            </div>
            <p style={{ fontFamily:"'Sora',sans-serif", marginTop:'2rem', color:'rgba(255,255,255,0.2)', fontSize:'.77rem' }}>Free forever plan · Student email signup · Works on any device</p>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ position:'relative', zIndex:2, borderTop:'1px solid rgba(255,255,255,0.06)', padding:'2.5rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'1.1rem', background:`linear-gradient(90deg,${P.purple},${P.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>✦ EduSuccess</div>
          <div style={{ display:'flex', gap:'2rem' }}>
            {['Privacy','Terms','Blog','Careers','Support'].map(l => (
              <a key={l} href="#" style={{ fontFamily:"'Sora',sans-serif", color:'rgba(255,255,255,0.34)', textDecoration:'none', fontSize:'.82rem', transition:'color .2s' }}
                onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.34)'}>{l}</a>
            ))}
          </div>
        </div>
        <p style={{ fontFamily:"'Sora',sans-serif", textAlign:'center', color:'rgba(255,255,255,0.14)', fontSize:'.77rem', marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          © 2026 EduSuccess AI Inc. · Built for students, by people who remember university.
        </p>
      </footer>
    </div>
  );
}
