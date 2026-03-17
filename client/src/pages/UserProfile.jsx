import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserProfile } from '../api/community';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const formatShort = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const StatCard = ({ label, value, color }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px', textAlign: 'center' }}>
    <p style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color }}>{value}</p>
    <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</p>
  </div>
);

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchUserProfile(userId);
        setProfile(data.data);
      } catch {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 720, margin: '0 auto' }}>
        {[40, 24, 16].map((h, i) => (
          <div key={i} style={{ height: h, background: '#f1f5f9', borderRadius: 8, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "-apple-system,'Segoe UI',sans-serif" }}>
        <p style={{ color: '#64748b' }}>{error || 'User not found'}</p>
        <Link to="/community" style={{ color: '#4f46e5', fontWeight: 700 }}>← Back to Forum</Link>
      </div>
    );
  }

  const { user, postCount, commentCount, recentPosts } = profile;
  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 720, margin: '0 auto' }}>
      <Link to="/community" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
        ← Back to Forum
      </Link>

      {/* Profile Header */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 28, marginTop: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 26, fontWeight: 800, flexShrink: 0,
          }}
        >
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          ) : initials}
        </div>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{user.name}</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Member since {formatDate(user.createdAt)}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Questions" value={postCount} color="#4f46e5" />
        <StatCard label="Answers" value={commentCount} color="#10b981" />
        <StatCard label="Reputation" value={user.reputation || 0} color={user.reputation > 0 ? '#16a34a' : user.reputation < 0 ? '#dc2626' : '#64748b'} />
      </div>

      {/* Recent posts */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Recent Questions</h2>
        {recentPosts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14 }}>No questions posted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts.map((post) => {
              const score = (post.upvotes || 0) - (post.downvotes || 0);
              const scoreColor = score > 0 ? '#16a34a' : score < 0 ? '#dc2626' : '#94a3b8';
              return (
                <div key={post._id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div
                    style={{
                      minWidth: 44, textAlign: 'center', padding: '4px 8px',
                      borderRadius: 6, background: score > 0 ? '#dcfce7' : score < 0 ? '#fee2e2' : '#f1f5f9',
                      color: scoreColor, fontWeight: 800, fontSize: 14, flexShrink: 0,
                    }}
                  >
                    {score > 0 ? '+' : ''}{score}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/community/post/${post._id}`}
                      style={{ color: '#1e293b', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#1e293b')}
                    >
                      {post.title}
                    </Link>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
                      <span>{formatShort(post.createdAt)}</span>
                      <span>💬 {post.commentCount || 0}</span>
                      {post.tags?.slice(0, 2).map((t) => (
                        <span key={t} style={{ color: '#4f46e5', fontWeight: 600 }}>#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
