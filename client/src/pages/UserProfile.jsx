import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, updateUserProfile, fetchLeaderboard } from '../api/community';
import { useToast, ToastContainer } from '../hooks/useToast.jsx';
import ConnectionButton from '../components/connections/ConnectionButton';

const TABS = ['Posts', 'Answers'];

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { toasts, toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Posts');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', skills: '', goals: '' });
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);

  const isOwn = currentUser && currentUser._id?.toString() === userId;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchUserProfile(userId);
        setProfile(data.data.user);
        setPosts(data.data.recentPosts || []);
        setForm({ bio: data.data.user.bio || '', skills: (data.data.user.skills || []).join(', '), goals: data.data.user.goals || '' });
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      const { data } = await updateUserProfile(userId, { bio: form.bio, skills: skillsArr, goals: form.goals });
      setProfile(data.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const repTier = (points) => {
    if (!points) return { label: 'New', color: '#5f6b7a' };
    if (points >= 1000) return { label: 'Expert', color: '#f59e0b' };
    if (points >= 500) return { label: 'Helper', color: '#0a66c2' };
    if (points >= 200) return { label: 'Contributor', color: '#10b981' };
    return { label: 'Beginner', color: '#94a3b8' };
  };

  if (loading) return <div style={{ fontFamily: 'Inter,sans-serif', maxWidth: 860, margin: '60px auto', textAlign: 'center', color: '#5f6b7a' }}>Loading…</div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: 80 }}>User not found. <Link to="/community">← Back</Link></div>;

  const tier = repTier(profile.points);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <ToastContainer toasts={toasts} />
      <style>{`*{box-sizing:border-box}.profile-stat{background:#fff;border:1px solid #e0ddd8;border-radius:8px;padding:16px;text-align:center;flex:1;}.tab-btn{padding:8px 18px;border:none;border-bottom:3px solid transparent;background:transparent;font-weight:700;font-size:14px;cursor:pointer;color:#5f6b7a;transition:all 0.15s;}.tab-btn.active{color:#0a66c2;border-bottom-color:#0a66c2;}`}</style>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back to Forum</Link>

        {/* Hero card */}
        <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, marginTop: 12, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: 100, background: 'linear-gradient(135deg, #0a66c2 0%, #7c3aed 100%)' }} />
          <div style={{ padding: '0 24px 20px', position: 'relative' }}>
            <img src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=88&background=0a66c2&color=fff`}
              alt={profile.name} style={{ width: 88, height: 88, borderRadius: '50%', border: '4px solid #fff', marginTop: -44, display: 'block', objectFit: 'cover' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1d2226' }}>{profile.name}</h2>
                <span style={{ display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 12, background: tier.color + '20', color: tier.color, fontWeight: 700, fontSize: 12 }}>{tier.label}</span>
                {profile.goals && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#5f6b7a' }}>🎯 {profile.goals}</p>}
              </div>
              {isOwn && !editing ? (
                <button onClick={() => setEditing(true)} style={{ padding: '7px 16px', border: '1px solid #0a66c2', color: '#0a66c2', borderRadius: 20, fontWeight: 700, fontSize: 13, background: '#fff', cursor: 'pointer' }}>Edit Profile</button>
              ) : (
                !isOwn && profile && <ConnectionButton userId={profile._id} userName={profile.name} userProfileImage={profile.profileImage} />
              )}
            </div>

            {!editing ? (
              <>
                {profile.bio && <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: '12px 0 10px' }}>{profile.bio}</p>}
                {profile.skills?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {profile.skills.map(s => <span key={s} style={{ padding: '3px 10px', borderRadius: 12, background: '#f0fdf4', color: '#15803d', fontSize: 12, fontWeight: 600 }}>{s}</span>)}
                  </div>
                )}
              </>
            ) : (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5f6b7a', marginBottom: 3 }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} maxLength={500} style={{ width: '100%', padding: 8, border: '1px solid #e0ddd8', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5f6b7a', margin: '8px 0 3px' }}>Skills (comma-separated)</label>
                <input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="DSA, Java, React…" style={{ width: '100%', padding: 8, border: '1px solid #e0ddd8', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5f6b7a', margin: '8px 0 3px' }}>Goals</label>
                <input value={form.goals} onChange={e => setForm(p => ({ ...p, goals: e.target.value }))} maxLength={300} placeholder="e.g. Placement 2026" style={{ width: '100%', padding: 8, border: '1px solid #e0ddd8', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleSave} disabled={saving} style={{ padding: '7px 18px', background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
                  <button onClick={() => setEditing(false)} style={{ padding: '7px 18px', border: '1px solid #e0ddd8', background: '#fff', borderRadius: 16, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {[{ label: 'Points', val: profile.points || 0, icon: '⭐' }, { label: 'Reputation', val: profile.reputation || 0, icon: '🔥' }, { label: 'Posts', val: profile.postCount || 0, icon: '📝' }, { label: 'Answers', val: profile.answerCount || 0, icon: '💬' }].map(s => (
            <div key={s.label} className="profile-stat">
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1d2226' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#5f6b7a', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {profile.badges?.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1d2226' }}>Badges</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {profile.badges.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 20 }}>
                  <span style={{ fontSize: 18 }}>{b.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity tabs */}
        <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e0ddd8' }}>
            {TABS.map(t => <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>)}
          </div>
          <div style={{ padding: 16 }}>
            {activeTab === 'Posts' && (
              posts.length === 0 ? (
                <p style={{ color: '#5f6b7a', textAlign: 'center', padding: '20px 0' }}>No posts yet.</p>
              ) : (
                posts.map(p => (
                  <Link key={p._id} to={`/community/post/${p._id}`} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #f3f2ef', textDecoration: 'none', color: '#1d2226' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#5f6b7a' }}>▲ {(p.upvotes - p.downvotes)} · 💬 {p.commentCount} · {p.type}</div>
                  </Link>
                ))
              )
            )}
            {activeTab === 'Answers' && <p style={{ color: '#5f6b7a', textAlign: 'center', padding: '20px 0' }}>Answers tab — coming soon.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
