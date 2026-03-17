import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPost, fetchComments, deletePost, getUserVote } from '../api/community';
import VoteButtons from '../components/community/VoteButtons';
import CommentSection from '../components/community/CommentSection';
import { useToast, ToastContainer } from '../hooks/useToast';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, toast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          fetchPost(id),
          fetchComments(id),
        ]);
        setPost(postRes.data.data);
        setComments(commentRes.data.data);
        if (user) {
          try {
            const voteRes = await getUserVote(id);
            setUserVote(voteRes.data.data);
          } catch {}
        }
      } catch {
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this question?')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      toast.success('Post deleted');
      setTimeout(() => navigate('/community'), 800);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 860, margin: '0 auto' }}>
        <div style={{ height: 20, width: '70%', background: '#f1f5f9', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: 14, width: '40%', background: '#f1f5f9', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "-apple-system,'Segoe UI',sans-serif" }}>
        <p style={{ color: '#64748b' }}>Post not found.</p>
        <Link to="/community" style={{ color: '#4f46e5', fontWeight: 700 }}>← Back to Forum</Link>
      </div>
    );
  }

  const isAuthor = user && String(post.author?._id) === String(user._id);

  return (
    <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 860, margin: '0 auto' }}>
      <ToastContainer toasts={toasts} />

      {/* Breadcrumb */}
      <Link to="/community" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
        ← Back to Forum
      </Link>

      {/* Main question block */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '24px', marginTop: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Vote column */}
          <VoteButtons
            postId={post._id}
            initialUpvotes={post.upvotes}
            initialDownvotes={post.downvotes}
            initialUserVote={userVote}
            isLoggedIn={!!user}
            onLoginPrompt={() => toast.info('Login to vote')}
            vertical
          />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#1e293b', lineHeight: 1.3 }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&size=28&background=4f46e5&color=fff`}
                  alt={post.author?.name}
                  style={{ width: 28, height: 28, borderRadius: '50%' }}
                />
                <Link to={`/community/profile/${post.author?._id}`} style={{ color: '#4f46e5', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  {post.author?.name}
                </Link>
              </div>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{formatDate(post.createdAt)}</span>
              {isAuthor && (
                <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                  <Link
                    to={`/community/edit/${post._id}`}
                    style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #fca5a5', color: '#ef4444', fontSize: 12, fontWeight: 600, background: 'transparent', cursor: 'pointer' }}
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 16px', fontSize: 15, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {post.description}
            </p>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{ padding: '2px 10px', borderRadius: 4, background: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments / Answers */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '24px' }}>
        <CommentSection
          postId={post._id}
          initialComments={comments}
          currentUser={user}
          onCommentCountChange={(delta) => setPost((p) => ({ ...p, commentCount: (p.commentCount || 0) + delta }))}
        />
      </div>
    </div>
  );
};

export default PostDetail;
