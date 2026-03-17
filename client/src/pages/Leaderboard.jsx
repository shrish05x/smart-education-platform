import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeaderboard } from '../api/community';
import { useAuth } from '../context/AuthContext';

const PERIODS = ['weekly', 'monthly', 'all'];

const Leaderboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('weekly');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(period)
      .then(({ data }) => setUsers(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const podiumColors = ['#f59e0b', '#94a3b8', '#b45309'];
  const podiumLabels = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <style>{`*{box-sizing:border-box}@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap')`}</style>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1d2226', margin: '12px 0 20px' }}>🏆 Leaderboard</h1>

        {/* Period toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: '7px 18px', borderRadius: 20, border: '1px solid #e0ddd8', background: period === p ? '#0a66c2' : '#fff', color: period === p ? '#fff' : '#1d2226', fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
              {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#5f6b7a' }}>Loading…</div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {users.length >= 3 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 28, padding: '24px 0' }}>
                {[users[1], users[0], users[2]].map((u, i) => {
                  const rank = i === 0 ? 1 : i === 1 ? 0 : 2;
                  const heights = [130, 160, 110];
                  return (
                    <Link key={u._id} to={`/community/profile/${u._id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', flex: 1, maxWidth: 160 }}>
                      <span style={{ fontSize: 28 }}>{podiumLabels[rank]}</span>
                      <img src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=56&background=${rank === 0 ? 'f59e0b' : '94a3b8'}&color=fff`}
                        alt={u.name} style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${podiumColors[rank]}`, margin: '6px 0' }} />
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#1d2226', textAlign: 'center' }}>{u.name}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: podiumColors[rank] }}>{u.points} pts</div>
                      <div style={{ width: '100%', background: podiumColors[rank], height: heights[rank], borderRadius: '6px 6px 0 0', marginTop: 8, opacity: 0.9 }} />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e0ddd8' }}>
                    {['Rank', 'User', 'Points', 'Posts', 'Answers', 'Badges'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#5f6b7a', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isMe = user && u._id?.toString() === user._id?.toString();
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f3f2ef', background: isMe ? '#e8f0fe' : 'transparent', transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, fontSize: 15, color: i < 3 ? podiumColors[i] : '#5f6b7a' }}>{i + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <Link to={`/community/profile/${u._id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#1d2226' }}>
                            <img src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=32&background=0a66c2&color=fff`}
                              alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                            <span style={{ fontWeight: 700, fontSize: 13 }}>{u.name}{isMe && ' (You)'}</span>
                          </Link>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, fontSize: 14, color: '#0a66c2' }}>{u.points}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#5f6b7a' }}>{u.postCount || 0}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#5f6b7a' }}>{u.answerCount || 0}</td>
                        <td style={{ padding: '12px 14px', fontSize: 14 }}>{u.badges?.map(b => b.icon).join(' ') || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
