import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T = { purple:'#AC6AFF', gold:'#FFC876', teal:'#5EEAD4' };

const TRACKS = [
  { id:'lofi',   label:'Focus Lofi',    icon:'🎵', url:'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { id:'nature', label:'Forest Sounds', icon:'🌿', url:'https://hls-live.metabroadcast.com/live/streaming_lofi_nature.m3u8' },
  { id:'brown',  label:'Brown Noise',   icon:'🌊', url:'https://stream.zeno.fm/4d61wp3p5rhvv' },
];

const FocusMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(TRACKS[0]);
  const [volume, setVolume] = useState(0.18);
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = track.url;
    if (playing) audioRef.current.play().catch(() => {});
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = track.url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
    setPlaying(p => !p);
  };

  return (
    <>
      <audio ref={audioRef} loop />

      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }}
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: '10.5rem', right: '1.6rem', zIndex: 850, width: 54, height: 54, borderRadius: 999, border: `1px solid ${playing ? T.teal : 'rgba(255,255,255,0.15)'}`, background: playing ? `rgba(94,234,212,0.15)` : 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: playing ? `0 0 20px ${T.teal}25` : 'none', transition: 'all .3s' }}
        title={playing ? 'Now playing — click to adjust' : 'Focus/Calm music'}
      >
        {playing ? (
          <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>🎵</motion.span>
        ) : '🎵'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: .95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 5 }}
            style={{ position: 'fixed', bottom: '15.5rem', right: '1.6rem', zIndex: 850, width: 260, background: 'rgba(13,12,29,0.96)', border: `1px solid rgba(255,255,255,0.1)`, backdropFilter: 'blur(24px)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
          >
            <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '.8rem', fontWeight: 700, color: T.teal }}>🎵 Focus Mode</div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
            </div>

            {/* Track selector */}
            <div style={{ padding: '.7rem .9rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {TRACKS.map(t => (
                <button key={t.id} onClick={() => setTrack(t)}
                  style={{ width: '100%', padding: '.55rem .8rem', borderRadius: 10, border: `1px solid ${track.id === t.id ? T.teal+'40' : 'rgba(255,255,255,0.07)'}`, background: track.id === t.id ? `${T.teal}12` : 'rgba(255,255,255,0.03)', cursor: 'pointer', fontFamily:"'Sora',sans-serif", fontSize: '.8rem', fontWeight: 600, color: track.id === t.id ? T.teal : 'rgba(255,255,255,0.55)', display: 'flex', gap: '.5rem', alignItems: 'center', transition: 'all .2s' }}>
                  <span>{t.icon}</span> {t.label}
                  {track.id === t.id && playing && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ marginLeft: 'auto', fontSize: '.65rem' }}>▶ playing</motion.span>}
                </button>
              ))}
            </div>

            {/* Volume */}
            <div style={{ padding: '.5rem 1rem .4rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.35)' }}>🔈</span>
              <input type="range" min={0} max={1} step={0.01} value={volume}
                onChange={e => { const v = parseFloat(e.target.value); setVolume(v); if(audioRef.current) audioRef.current.volume = v; }}
                style={{ flex: 1, accentColor: T.teal }} />
              <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.35)' }}>🔊</span>
            </div>

            {/* Play button */}
            <div style={{ padding: '.6rem 1rem .9rem' }}>
              <button onClick={togglePlay}
                style={{ width: '100%', padding: '.7rem', borderRadius: 12, border: 'none', background: playing ? `rgba(255,255,255,0.08)` : `linear-gradient(135deg,${T.teal},${T.purple})`, color: playing ? 'rgba(255,255,255,0.7)' : '#0D0C1D', fontWeight: 700, cursor: 'pointer', fontFamily:"'Sora',sans-serif", fontSize: '.85rem' }}>
                {playing ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FocusMusicPlayer;
