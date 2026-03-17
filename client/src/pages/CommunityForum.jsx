import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts } from '../api/community';
import PostCard from '../components/community/PostCard';
import TagFilter from '../components/community/TagFilter';
import { useToast, ToastContainer } from '../hooks/useToast';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'unanswered', label: 'Unanswered' },
];

const SkeletonCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 16 }}>
    <div style={{ width: 44, height: 44, background: '#f1f5f9', borderRadius: 8, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      {[80, 60, 40].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 18 : 13, width: `${w}%`, background: '#f1f5f9', borderRadius: 4, marginBottom: 10, animation: 'pulse 1.5s ease infinite' }} />
      ))}
    </div>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
  </div>
);

const CommunityForum = () => {
  const { user } = useAuth();
  const { toasts, toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const search = searchParams.get('search') || '';
  const activeTag = searchParams.get('tags') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort };
      if (search) params.search = search;
      if (activeTag) params.tags = activeTag;
      const { data } = await fetchPosts(params);
      setPosts(data.data.posts);
      setTotalPages(data.data.totalPages);
      setTotalPosts(data.data.totalPosts);
      // Collect unique tags from current posts for the tag filter
      const tags = [...new Set(data.data.posts.flatMap((p) => p.tags || []))].sort();
      setAllTags((prev) => [...new Set([...prev, ...tags])]);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, activeTag]);

  useEffect(() => { load(); }, [load]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam('search', val), 300);
  };

  return (
    <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 860, margin: '0 auto' }}>
      <ToastContainer toasts={toasts} />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e293b' }}>Community Forum</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {totalPosts} question{totalPosts !== 1 ? 's' : ''} from students like you
          </p>
        </div>
        <Link
          to="/community/create"
          style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}
        >
          + Ask Question
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>🔍</span>
        <input
          ref={searchInputRef}
          defaultValue={search}
          onChange={handleSearchChange}
          placeholder="Search questions…"
          style={{
            width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #e2e8f0', borderRadius: 8,
            fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1e293b',
          }}
        />
      </div>

      {/* Sort Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {SORT_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParam('sort', s.value)}
            style={{
              padding: '6px 16px', borderRadius: 6, border: '1px solid',
              borderColor: sort === s.value ? '#4f46e5' : '#e2e8f0',
              background: sort === s.value ? '#4f46e5' : 'transparent',
              color: sort === s.value ? '#fff' : '#64748b',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <TagFilter tags={allTags} activeTag={activeTag} onTagChange={(t) => updateParam('tags', t)} />
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤔</div>
          <h3 style={{ color: '#1e293b', margin: '0 0 8px' }}>No questions found</h3>
          <p style={{ margin: '0 0 20px' }}>Try adjusting your filters or be the first to ask!</p>
          <Link to="/community/create" style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
            Ask a Question
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn 0.25s ease' }}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isLoggedIn={!!user}
              onLoginPrompt={() => toast.info('Login to vote on posts')}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 32 }}>
          <button
            disabled={page <= 1}
            onClick={() => updateParam('page', String(page - 1))}
            style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid #e2e8f0', background: page <= 1 ? '#f8fafc' : '#fff', color: page <= 1 ? '#94a3b8' : '#1e293b', cursor: page <= 1 ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParam('page', String(p))}
              style={{
                width: 36, height: 36, borderRadius: 6, border: '1px solid',
                borderColor: p === page ? '#4f46e5' : '#e2e8f0',
                background: p === page ? '#4f46e5' : '#fff',
                color: p === page ? '#fff' : '#1e293b',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page >= totalPages}
            onClick={() => updateParam('page', String(page + 1))}
            style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid #e2e8f0', background: page >= totalPages ? '#f8fafc' : '#fff', color: page >= totalPages ? '#94a3b8' : '#1e293b', cursor: page >= totalPages ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
