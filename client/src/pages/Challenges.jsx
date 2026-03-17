import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchChallenges, fetchActiveChallenge, submitChallenge } from '../api/community';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastContainer } from '../hooks/useToast.jsx';

const DIFF_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

const Countdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate) - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [endDate]);
  return <span style={{ fontWeight: 700, color: '#ef4444' }}>⏳ {timeLeft}</span>;
};

const Challenges = () => {
  const { user } = useAuth();
  const { toasts, toast } = useToast();
  const [active, setActive] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetchActiveChallenge(), fetchChallenges()])
      .then(([a, b]) => { setActive(a.data.data); setAll(b.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (id) => {
    if (!answer.trim() && !link.trim()) { toast.info('Provide an answer or link'); return; }
    setSubmitting(true);
    try {
      const { data } = await submitChallenge(id, { answer, link });
      toast.success(data.message || 'Submitted!');
      setSelectedChallenge(null);
      setAnswer(''); setLink('');
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#5f6b7a' }}>Loading…</div>;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <ToastContainer toasts={toasts} />
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1d2226', margin: '12px 0 20px' }}>🎯 Weekly Challenges</h1>

        {/* Active challenge */}
        {active && (
          <div style={{ background: 'linear-gradient(135deg,#0a66c2 0%,#0284c7 100%)', borderRadius: 12, padding: 24, marginBottom: 20, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>🔥 Active Challenge</div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>{active.title}</h2>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 8, background: DIFF_COLOR[active.difficulty] + '40', color: '#fff', fontWeight: 700 }}>
                    {active.difficulty?.toUpperCase()}
                  </span>
                  <span>⭐ {active.points} pts</span>
                  {active.subject && <span>📚 {active.subject}</span>}
                  <Countdown endDate={active.endDate} />
                </div>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.9, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{active.description?.slice(0, 200)}…</p>
              </div>
              <button onClick={() => setSelectedChallenge(selectedChallenge?._id === active._id ? null : active)}
                style={{ padding: '9px 20px', background: '#fff', color: '#0a66c2', border: 'none', borderRadius: 20, fontWeight: 800, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>
                {selectedChallenge?._id === active._id ? 'Close' : 'Submit Answer'}
              </button>
            </div>

            {/* Inline submission form */}
            {selectedChallenge?._id === active._id && (
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Your Submission</div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4} placeholder="Explain your approach or paste your solution…"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1d2226', resize: 'vertical', boxSizing: 'border-box' }} />
                <input value={link} onChange={e => setLink(e.target.value)} placeholder="Or paste a solution link (GitHub, LeetCode, etc.)"
                  style={{ width: '100%', marginTop: 8, padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1d2226', boxSizing: 'border-box' }} />
                <button onClick={() => handleSubmit(active._id)} disabled={submitting}
                  style={{ marginTop: 10, padding: '9px 22px', background: '#fff', color: '#0a66c2', border: 'none', borderRadius: 20, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                  {submitting ? 'Submitting…' : `Submit (+${active.points} pts)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Past challenges */}
        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1d2226', margin: '0 0 12px' }}>All Challenges</h3>
        {all.map(c => {
          const isActive = active && c._id === active._id;
          return (
            <div key={c._id} style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 18, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 8, background: DIFF_COLOR[c.difficulty] + '20', color: DIFF_COLOR[c.difficulty], fontSize: 12, fontWeight: 700 }}>
                      {c.difficulty?.toUpperCase()}
                    </span>
                    {isActive && <span style={{ padding: '2px 8px', borderRadius: 8, background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 700 }}>ACTIVE</span>}
                    <span style={{ fontSize: 12, color: '#5f6b7a' }}>⭐ {c.points} pts</span>
                    {c.subject && <span style={{ fontSize: 12, color: '#5f6b7a' }}>📚 {c.subject}</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1d2226', marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: '#5f6b7a' }}>👥 {c.submissions?.length || 0} submissions</div>
                </div>
                {isActive && user && (
                  <button onClick={() => setSelectedChallenge(selectedChallenge?._id === c._id ? null : c)}
                    style={{ padding: '6px 14px', border: '1px solid #0a66c2', color: '#0a66c2', borderRadius: 14, fontSize: 12, fontWeight: 700, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
