import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPost, fetchComments, deletePost, getUserVote, castVote, voteComment, createComment, deleteComment, acceptAnswer, ratePost, aiSuggestAnswer, aiSummarize } from '../api/community';
import { useToast, ToastContainer } from '../hooks/useToast.jsx';

const TYPE_ICONS = { question: '❓', discussion: '💬', resource: '📚', achievement: '🏆', challenge: '🎯' };
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const Star = ({ filled, onClick }) => (
  <span onClick={onClick} style={{ cursor: 'pointer', fontSize: 22, color: filled ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s' }}>★</span>
);

const Avatar = ({ name, src, size = 34 }) => (
  <img src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&size=${size}&background=0a66c2&color=fff`}
    alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
);

const CommentItem = ({ comment, replies, currentUser, postAuthorId, onDeleted, onReplied, postId, onAccept, acceptedId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votes, setVotes] = useState(comment.upvotes || 0);
  const [voted, setVoted] = useState(comment.voters?.some(v => v.toString?.() === currentUser?._id?.toString?.()));

  const isOwn = currentUser && comment.author?._id?.toString() === currentUser._id?.toString();
  const canAccept = postAuthorId && currentUser?._id?.toString() === postAuthorId.toString() && !comment.parentId;
  const isAccepted = acceptedId && comment._id?.toString() === acceptedId?.toString();

  const handleVote = async () => {
    if (!currentUser) return;
    try {
      const { data } = await voteComment(comment._id);
      setVotes(data.data.upvotes);
      setVoted(data.data.hasVoted);
    } catch {}
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createComment({ postId, parentId: comment._id, content: replyText.trim() });
      onReplied(data.data);
      setReplyText('');
      setShowReply(false);
    } catch { alert('Failed to post reply'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <button onClick={handleVote} style={{ background: 'none', border: 'none', fontSize: 16, cursor: currentUser ? 'pointer' : 'default', color: voted ? '#0a66c2' : '#94a3b8' }}>▲</button>
          <span style={{ fontWeight: 700, fontSize: 13, color: votes > 0 ? '#15803d' : '#94a3b8' }}>{votes}</span>
        </div>
        <Avatar name={comment.author?.name} src={comment.author?.profileImage} />
        <div style={{ flex: 1 }}>
          {isAccepted && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>
              ✅ Accepted Answer
            </div>
          )}
          <div style={{ background: isAccepted ? '#f0fdf4' : '#f8fafc', border: `1px solid ${isAccepted ? '#86efac' : '#e0ddd8'}`, borderRadius: 8, padding: '10px 14px', borderLeft: isAccepted ? '3px solid #10b981' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Link to={`/community/profile/${comment.author?._id}`} style={{ fontWeight: 700, fontSize: 13, color: '#1d2226', textDecoration: 'none' }}>{comment.author?.name}</Link>
              <span style={{ fontSize: 11, color: '#5f6b7a' }}>{formatDate(comment.createdAt)}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4, paddingLeft: 4 }}>
            {currentUser && <button onClick={() => setShowReply(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#0a66c2', fontWeight: 600 }}>Reply</button>}
            {canAccept && <button onClick={() => onAccept(comment._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: isAccepted ? '#ef4444' : '#10b981', fontWeight: 700 }}>{isAccepted ? 'Unaccept' : 'Accept Answer ✅'}</button>}
            {isOwn && <button onClick={async () => { if(window.confirm('Delete?')) { await deleteComment(comment._id); onDeleted(comment._id); } }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Delete</button>}
          </div>
          {showReply && (
            <div style={{ marginTop: 8 }}>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2} maxLength={3000} placeholder="Write a reply…" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e0ddd8', borderRadius: 8, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleReply} disabled={submitting} style={{ padding: '5px 14px', background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{submitting ? '…' : 'Reply'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Nested replies */}
      {replies?.length > 0 && (
        <div style={{ marginLeft: 56, marginTop: 8, borderLeft: '2px solid #e0ddd8', paddingLeft: 12 }}>
          {replies.map(r => (
            <div key={r._id} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <Avatar name={r.author?.name} src={r.author?.profileImage} size={26} />
              <div style={{ background: '#f8fafc', border: '1px solid #e0ddd8', borderRadius: 6, padding: '8px 12px', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{r.author?.name}</div>
                <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>{r.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, toast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([fetchPost(id), fetchComments(id)]);
        setPost(postRes.data.data);
        setUpvotes(postRes.data.data.upvotes);
        setDownvotes(postRes.data.data.downvotes);
        setComments(commentRes.data.data);
        if (user) {
          try { const v = await getUserVote(id); setUserVote(v.data.data); } catch {}
        }
      } catch { toast.error('Failed to load post'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  const handleVote = async (type) => {
    if (!user) { toast.info('Login to vote'); return; }
    try {
      const { data } = await castVote(id, type);
      setUpvotes(data.data.upvotes);
      setDownvotes(data.data.downvotes);
      setUserVote(data.data.userVote);
    } catch {}
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createComment({ postId: id, content: newComment.trim() });
      setComments(prev => [...prev, data.data]);
      setPost(p => ({ ...p, commentCount: (p.commentCount || 0) + 1 }));
      setNewComment('');
      toast.success('Answer posted!');
    } catch { toast.error('Failed to post answer'); }
    finally { setSubmitting(false); }
  };

  const handleAcceptAnswer = async (commentId) => {
    try {
      const { data } = await acceptAnswer(id, commentId);
      setPost(p => ({ ...p, acceptedAnswer: data.data.acceptedAnswer }));
      setComments(prev => prev.map(c => ({ ...c, isAcceptedAnswer: c._id?.toString() === data.data.acceptedAnswer?.toString() })));
    } catch { toast.error('Failed to accept answer'); }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    try {
      const { data } = await aiSuggestAnswer(id);
      setAiSuggestion(data.data.suggestion);
    } catch { toast.error('AI service unavailable'); }
    finally { setAiLoading(false); }
  };

  const handleAiSummarize = async () => {
    setAiLoading(true);
    try {
      const { data } = await aiSummarize(id);
      setAiSummary(data.data.summary);
    } catch { toast.error('AI service unavailable'); }
    finally { setAiLoading(false); }
  };

  const handleRate = async (rating) => {
    if (!user) { toast.info('Login to rate'); return; }
    try {
      setUserRating(rating);
      const { data } = await ratePost(id, rating);
      setPost(p => ({ ...p, averageRating: data.data.averageRating }));
      toast.success('Rating submitted!');
    } catch { toast.error('Failed to submit rating'); }
  };

  const score = upvotes - downvotes;
  const topLevel = comments.filter(c => !c.parentId);
  const getReplies = (pid) => comments.filter(c => c.parentId?.toString() === pid?.toString());
  const isAuthor = user && post?.author?._id?.toString() === user._id?.toString();

  if (loading) return <div style={{ fontFamily: 'Inter,sans-serif', maxWidth: 860, margin: '0 auto', padding: 20 }}><div style={{ height: 20, background: '#f3f2ef', borderRadius: 4, animation: 'pulse 1.5s infinite' }} /></div>;
  if (!post) return <div style={{ textAlign: 'center', padding: 60 }}><p>Post not found.</p><Link to="/community" style={{ color: '#0a66c2' }}>← Back</Link></div>;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <ToastContainer toasts={toasts} />
      <style>{`*{box-sizing:border-box}`}</style>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>← Back to Forum</Link>

        {/* Post */}
        <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 24, marginTop: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Vertical vote */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <button onClick={() => handleVote('upvote')} style={{ background: 'none', border: `2px solid ${userVote === 'upvote' ? '#0a66c2' : '#e0ddd8'}`, borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: userVote === 'upvote' ? '#0a66c2' : '#5f6b7a', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>▲</button>
              <span style={{ fontWeight: 800, fontSize: 20, color: score > 0 ? '#15803d' : score < 0 ? '#dc2626' : '#5f6b7a' }}>{score}</span>
              <button onClick={() => handleVote('downvote')} style={{ background: 'none', border: `2px solid ${userVote === 'downvote' ? '#ef4444' : '#e0ddd8'}`, borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: userVote === 'downvote' ? '#ef4444' : '#5f6b7a', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>▼</button>
            </div>

            <div style={{ flex: 1 }}>
              {/* Badges row */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#e8f0fe', color: '#0a66c2' }}>
                  {TYPE_ICONS[post.type]} {post.type}
                </span>
                {post.subject && <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#f0fdf4', color: '#15803d' }}>{post.subject}</span>}
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#5f6b7a' }}>👁 {post.views}</span>
              </div>

              <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#1d2226', lineHeight: 1.3 }}>{post.title}</h1>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Avatar name={post.author?.name} src={post.author?.profileImage} />
                <div>
                  <Link to={`/community/profile/${post.author?._id}`} style={{ fontWeight: 700, fontSize: 13, color: '#0a66c2', textDecoration: 'none' }}>{post.author?.name}</Link>
                  <div style={{ fontSize: 11, color: '#5f6b7a' }}>{formatDate(post.createdAt)}</div>
                </div>
                {isAuthor && (
                  <button onClick={async () => { if(window.confirm('Delete this post?')) { await deletePost(id); navigate('/community'); } }}
                    style={{ marginLeft: 'auto', padding: '4px 12px', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: 6, fontSize: 12, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                )}
              </div>

              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '0 0 14px' }}>{post.description}</p>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {post.tags.map(t => <span key={t} style={{ padding: '2px 10px', borderRadius: 12, background: '#e8f0fe', color: '#0a66c2', fontSize: 12, fontWeight: 600 }}>{t}</span>)}
                </div>
              )}

              {/* Resource rating */}
              {post.type === 'resource' && (
                <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#92400e' }}>Rate this resource:</div>
                  <div>
                    {[1,2,3,4,5].map(r => <Star key={r} filled={r <= (hoverRating || userRating)} onClick={() => handleRate(r)} onMouseEnter={() => setHoverRating(r)} onMouseLeave={() => setHoverRating(0)} />)}
                    <span style={{ fontSize: 12, color: '#5f6b7a', marginLeft: 8 }}>Avg: {post.averageRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              )}

              {/* AI buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {comments.length > 0 && user && (
                  <button onClick={handleAiSummarize} disabled={aiLoading} style={{ padding: '6px 14px', border: '1px solid #e0ddd8', borderRadius: 14, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#1d2226' }}>
                    {aiLoading ? '…' : '✨ AI Summary'}
                  </button>
                )}
              </div>

              {aiSummary && (
                <div style={{ marginTop: 10, padding: '12px 16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#0c4a6e' }}>
                  <strong>✨ AI Thread Summary</strong><br />{aiSummary}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answers */}
        <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#1d2226', borderBottom: '1px solid #e0ddd8', paddingBottom: 12 }}>
            {topLevel.length} {topLevel.length === 1 ? 'Answer' : 'Answers'}
          </h3>

          {topLevel.map(c => (
            <CommentItem key={c._id} comment={c} replies={getReplies(c._id)} currentUser={user}
              postAuthorId={post?.author?._id} onDeleted={(cid) => setComments(p => p.filter(x => x._id?.toString() !== cid?.toString() && x.parentId?.toString() !== cid?.toString()))}
              onReplied={(r) => setComments(p => [...p, r])} postId={id}
              onAccept={handleAcceptAnswer} acceptedId={post.acceptedAnswer} />
          ))}

          {topLevel.length === 0 && <div style={{ textAlign: 'center', padding: '30px 0', color: '#5f6b7a', fontSize: 14 }}>Be the first to answer!</div>}

          {/* AI Suggest */}
          {user && post.type === 'question' && (
            <div style={{ marginBottom: 16, padding: '12px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>✨ Need ideas? Get an AI-drafted answer</span>
                <button onClick={handleAiSuggest} disabled={aiLoading} style={{ padding: '5px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {aiLoading ? '…' : 'AI Suggest'}
                </button>
              </div>
              {aiSuggestion && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: '0 0 8px' }}>{aiSuggestion}</p>
                  <button onClick={() => setNewComment(aiSuggestion)} style={{ padding: '4px 12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Use as draft</button>
                </div>
              )}
            </div>
          )}

          {/* New answer input */}
          {user ? (
            <div style={{ borderTop: '1px solid #e0ddd8', paddingTop: 20 }}>
              <h4 style={{ margin: '0 0 10px', fontWeight: 700, color: '#1d2226' }}>Your Answer</h4>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={5} maxLength={3000}
                placeholder="Write a helpful answer… (max 3000 characters)"
                style={{ width: '100%', padding: '12px', border: '1px solid #e0ddd8', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#5f6b7a' }}>{newComment.length}/3000</span>
                <button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}
                  style={{ padding: '9px 22px', background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? 'Posting…' : 'Post Answer'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', background: '#f3f2ef', borderRadius: 8 }}>
              <a href="/login" style={{ color: '#0a66c2', fontWeight: 700 }}>Login</a> to post an answer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
