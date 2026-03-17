/* ═══════════════════════════════════════
   EduSuccess Brainwave Theme Constants
═══════════════════════════════════════ */
export const T = {
  purple: '#AC6AFF',
  gold:   '#FFC876',
  coral:  '#FF776F',
  lime:   '#7ADB78',
  blue:   '#858DFF',
  pink:   '#FF98E2',
  bg:     '#0D0C1D',
  bg2:    '#100D28',
  glass:  'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.09)',
};

export const SORA = "'Sora', sans-serif";

export const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
*, *::before, *::after { font-family: 'Sora', sans-serif !important; }
html { scroll-behavior: smooth; }
body { background: #0D0C1D !important; color: #fff; }

/* Scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
::-webkit-scrollbar-thumb { background: rgba(172,106,255,0.4); border-radius: 99px; }

/* Glass card base */
.glass-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(20px);
  border-radius: 18px;
}

/* Shine button */
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: ''; position: absolute; top: -50%; left: -60%; width: 33%; height: 200%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
  transform: skewX(-25deg); transition: left .65s;
}
.btn-shine:hover::after { left: 175%; }

/* Scanlines on hover */
.scanl { position: relative; }
.scanl::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 10;
  background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px);
  opacity: 0; transition: opacity .3s;
}
.scanl:hover::before { opacity: 1; }

/* God rays */
.god-ray-l {
  position: fixed; top: -10%; left: 18%; width: 2px; height: 130vh; pointer-events: none; z-index: 0;
  background: linear-gradient(180deg,transparent 0%,rgba(172,106,255,0.07) 35%,rgba(133,141,255,0.09) 65%,transparent 100%);
  transform: rotate(-14deg); filter: blur(3px);
  animation: grl 12s ease-in-out infinite alternate;
}
.god-ray-r {
  position: fixed; top: -10%; right: 22%; width: 1px; height: 130vh; pointer-events: none; z-index: 0;
  background: linear-gradient(180deg,transparent 0%,rgba(255,119,111,0.05) 40%,rgba(255,200,118,0.07) 70%,transparent 100%);
  transform: rotate(11deg); filter: blur(5px);
  animation: grl 15s ease-in-out 3s infinite alternate;
}
@keyframes grl {
  from { opacity: .4; transform: rotate(-14deg) scaleX(1); }
  to   { opacity: .9; transform: rotate(-11deg) scaleX(2.5); }
}

/* Form inputs */
.bw-input {
  width: 100%; padding: .75rem 1rem .75rem 2.8rem;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; color: #fff; font-size: .9rem; outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.bw-input::placeholder { color: rgba(255,255,255,0.3); }
.bw-input:focus { border-color: #AC6AFF; box-shadow: 0 0 0 3px rgba(172,106,255,0.12); }
.bw-input-error { border-color: #FF776F !important; }

/* Primary purple button */
.bw-btn-primary {
  width: 100%; padding: .875rem 1.5rem; border-radius: 12px; border: none; cursor: pointer;
  background: linear-gradient(135deg,#AC6AFF,#C795FF); color: #fff; font-weight: 700; font-size: 1rem;
  box-shadow: 0 0 32px rgba(172,106,255,0.28); transition: transform .25s, box-shadow .25s;
  position: relative; overflow: hidden;
}
.bw-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 50px rgba(172,106,255,0.45); }
.bw-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

/* Sidebar active */
.sidebar-link { display: flex; align-items: center; gap: .75rem; padding: .65rem .9rem; border-radius: 12px; text-decoration: none; color: rgba(255,255,255,0.52); font-size: .875rem; font-weight: 500; transition: all .2s; }
.sidebar-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
.sidebar-link.active { color: #AC6AFF; background: rgba(172,106,255,0.12); }
.sidebar-link.active svg { color: #AC6AFF; }
`;
