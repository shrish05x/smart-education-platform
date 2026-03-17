import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts } from '../api/community';
import PostCard from '../components/community/PostCard';
import { useToast, ToastContainer } from '../hooks/useToast.jsx';

const SUBJECTS = ['All', 'DSA', 'Java', 'Python', 'AI', 'ML', 'DBMS', 'OS', 'CN', 'Web Dev', 'System Design'];
const TYPES = [
  { value: '', label: 'All' },
  { value: 'question', label: '❓ Questions' },
  { value: 'discussion', label: '💬 Discussions' },
  { value: 'resource', label: '📚 Resources' },
  { value: 'achievement', label: '🏆 Achievements' },
];
const SORTS = [{ value: 'newest', label: 'Latest' }, { value: 'popular', label: 'Popular' }, { value: 'unanswered', label: 'Unanswered' }];

const Skeleton = () => (
  <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 16, marginBottom: 8 }}>
    {[60, 100, 80].map((w, i) => (
      <div key={i} style={{ height: i === 0 ? 12 : i === 1 ? 18 : 12, width: `${w}%`, background: '#f3f2ef', borderRadius: 4, marginBottom: 10, animation: 'pulse 1.5s infinite' }} />
    ))}
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
  </div>
);

const CommunityForum = () => {
  const { user } = useAuth();
  const { toasts, toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const debounceRef = useRef(null);

  const search = searchParams.get('search') || '';
  const subject = searchParams.get('subject') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort };
      if (search) params.search = search;
      if (subject) params.subject = subject;
      if (type) params.type = type;
      const { data } = await fetchPosts(params);
      setPosts(data.data.posts);
      setTotalPages(data.data.totalPages);
      setTotalPosts(data.data.totalPosts);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, subject, type]);

  useEffect(() => { load(); }, [load]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh' }}>
      <ToastContainer toasts={toasts} />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { background: #f3f2ef !important; }
        .community-layout { display: grid; grid-template-columns: 220px 1fr; gap: 16px; max-width: 900px; margin: 0 auto; padding: 20px 16px; }
        @media(max-width:700px){.community-layout{grid-template-columns:1fr;}.community-sidebar{display:none;}}
        .sidebar-card{background:#fff;border:1px solid #e0ddd8;border-radius:8px;padding:16px;margin-bottom:12px;}
        .filter-pill{padding:5px 14px;border-radius:16px;border:1px solid #e0ddd8;background:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
        .filter-pill.active{background:#0a66c2;color:#fff;border-color:#0a66c2;}
        .sort-btn{padding:6px 14px;border-radius:6px;border:1px solid #e0ddd8;background:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;}
        .sort-btn.active{background:#0a66c2;color:#fff;border-color:#0a66c2;}
        .nav-link{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;text-decoration:none;color:#1d2226;font-size:14px;font-weight:600;transition:background 0.15s;margin-bottom:2px;}
        .nav-link:hover,.nav-link.active{background:#e8f0fe;color:#0a66c2;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
      `}</style>

      <div className="community-layout">
        {/* Left Sidebar */}
        <aside className="community-sidebar">
          {user && (
            <div className="sidebar-card" style={{ textAlign: 'center', paddingBottom: 20 }}>
              <img
                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&size=56&background=0a66c2&color=fff`}
                alt={user.name}
                style={{ width: 56, height: 56, borderRadius: '50%', marginBottom: 8 }}
              />
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1d2226', marginBottom: 2 }}>{user.name}</div>
              {user.bio && <div style={{ fontSize: 12, color: '#5f6b7a', marginBottom: 8 }}>{user.bio.slice(0, 60)}</div>}
              <Link to="/community/create" style={{ display: 'block', padding: '8px', background: '#0a66c2', color: '#fff', borderRadius: 20, fontWeight: 700, fontSize: 13, textDecoration: 'none', marginTop: 8 }}>
                + Ask Question
              </Link>
            </div>
          )}
          <div className="sidebar-card">
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5f6b7a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigate</div>
            <Link to="/community" className="nav-link">🏠 Feed</Link>
            <Link to="/community/events" className="nav-link">📅 Events</Link>
            <Link to="/community/leaderboard" className="nav-link">🏆 Leaderboard</Link>
            <Link to="/community/challenges" className="nav-link">🎯 Challenges</Link>
            {user && <Link to="/community/notifications" className="nav-link">🔔 Notifications</Link>}
          </div>
        </aside>

        {/* Main Feed */}
        <main>
          {/* Header */}
          <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: '16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1d2226' }}>Community Forum</h1>
              <Link to="/community/create" style={{ padding: '8px 16px', background: '#0a66c2', color: '#fff', borderRadius: 20, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                + Ask
              </Link>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5f6b7a' }}>🔍</span>
              <input
                defaultValue={search}
                onChange={(e) => { clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => setParam('search', e.target.value), 350); }}
                placeholder="Search discussions, questions, resources…"
                style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid #e0ddd8', borderRadius: 20, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#f3f2ef' }}
              />
            </div>

            {/* Type filter tabs */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginBottom: 10 }}>
              {TYPES.map((t) => (
                <button key={t.value} onClick={() => setParam('type', t.value)} className={`filter-pill${type === t.value ? ' active' : ''}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Subject pills */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginBottom: 10 }}>
              {SUBJECTS.map((s) => {
                const val = s === 'All' ? '' : s;
                return (
                  <button key={s} onClick={() => setParam('subject', val)} className={`filter-pill${subject === val ? ' active' : ''}`} style={{ fontSize: 12 }}>
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', gap: 6 }}>
              {SORTS.map((s) => (
                <button key={s.value} onClick={() => setParam('sort', s.value)} className={`sort-btn${sort === s.value ? ' active' : ''}`}>
                  {s.label}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#5f6b7a', alignSelf: 'center' }}>{totalPosts} posts</span>
            </div>
          </div>

          {/* Post list */}
          {loading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} />)
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 8, border: '1px solid #e0ddd8' }}>
              <div style={{ fontSize: 42 }}>🤔</div>
              <h3 style={{ color: '#1d2226', margin: '12px 0 6px' }}>No posts found</h3>
              <p style={{ color: '#5f6b7a', marginBottom: 16 }}>Be the first to ask or start a discussion!</p>
              <Link to="/community/create" style={{ padding: '9px 20px', background: '#0a66c2', color: '#fff', borderRadius: 20, textDecoration: 'none', fontWeight: 700 }}>
                + Create Post
              </Link>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              {posts.map((post) => <PostCard key={post._id} post={post} isLoggedIn={!!user} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button disabled={page <= 1} onClick={() => setParam('page', String(page - 1))}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0ddd8', background: page <= 1 ? '#f3f2ef' : '#fff', cursor: page <= 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setParam('page', String(p))}
                  style={{ width: 34, height: 34, borderRadius: 6, border: '1px solid', borderColor: p === page ? '#0a66c2' : '#e0ddd8', background: p === page ? '#0a66c2' : '#fff', color: p === page ? '#fff' : '#1d2226', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {p}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setParam('page', String(page + 1))}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0ddd8', background: page >= totalPages ? '#f3f2ef' : '#fff', cursor: page >= totalPages ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityForum;
