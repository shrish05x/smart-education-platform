import { useState } from 'react';
import { createComment, deleteComment } from '../../api/community';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const Avatar = ({ name, size = 32 }) => (
  <img
    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&size=${size}&background=4f46e5&color=fff`}
    alt={name}
    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
  />
);

const CommentItem = ({ comment, replies, currentUserId, onDeleted, onReplied, postId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment._id);
      onDeleted(comment._id);
    } catch {
      alert('Failed to delete comment');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createComment({ postId, content: replyText.trim(), parentId: comment._id });
      onReplied(data.data);
      setReplyText('');
      setShowReply(false);
    } catch {
      alert('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const isOwn = String(comment.author?._id) === String(currentUserId);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Comment */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar name={comment.author?.name} size={34} />
        <div style={{ flex: 1 }}>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                {comment.author?.name || 'Unknown'}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(comment.createdAt)}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{comment.content}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, paddingLeft: 4 }}>
            {currentUserId && (
              <button
                onClick={() => setShowReply((v) => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#4f46e5', fontWeight: 600 }}
              >
                {showReply ? 'Cancel' : 'Reply'}
              </button>
            )}
            {isOwn && (
              <button
                onClick={handleDelete}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444', fontWeight: 600 }}
              >
                Delete
              </button>
            )}
          </div>

          {/* Inline reply input */}
          {showReply && (
            <div style={{ marginTop: 8 }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                rows={2}
                maxLength={2000}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  onClick={handleReplySubmit}
                  disabled={submitting || !replyText.trim()}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 6,
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Posting…' : 'Post Reply'}
                </button>
                <button
                  onClick={() => { setShowReply(false); setReplyText(''); }}
                  style={{ padding: '6px 12px', borderRadius: 6, background: 'transparent', border: '1px solid #e2e8f0', fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {replies?.length > 0 && (
        <div style={{ marginLeft: 46, marginTop: 8, borderLeft: '2px solid #e2e8f0', paddingLeft: 16 }}>
          {replies.map((reply) => (
            <div key={reply._id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <Avatar name={reply.author?.name} size={26} />
              <div style={{ flex: 1 }}>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#1e293b' }}>{reply.author?.name || 'Unknown'}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(reply.createdAt)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{reply.content}</p>
                </div>
                {String(reply.author?._id) === String(currentUserId) && (
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete this reply?')) return;
                      try {
                        await deleteComment(reply._id);
                        onDeleted(reply._id);
                      } catch { alert('Failed to delete'); }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 2, paddingLeft: 4 }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({ postId, initialComments = [], currentUser, onCommentCountChange }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const topLevel = comments.filter((c) => !c.parentId);
  const getReplies = (parentId) => comments.filter((c) => String(c.parentId) === String(parentId));

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (newComment.trim().length > 2000) { setError('Comment must be under 2000 characters'); return; }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await createComment({ postId, content: newComment.trim(), parentId: null });
      setComments((prev) => [...prev, data.data]);
      setNewComment('');
      if (onCommentCountChange) onCommentCountChange(1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleted = (deletedId) => {
    setComments((prev) => prev.filter((c) => String(c._id) !== String(deletedId) && String(c.parentId) !== String(deletedId)));
    if (onCommentCountChange) onCommentCountChange(-1);
  };

  const handleReplied = (newReply) => {
    setComments((prev) => [...prev, newReply]);
    if (onCommentCountChange) onCommentCountChange(1);
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        {comments.length} {comments.length === 1 ? 'Answer' : 'Answers'}
      </h3>

      {/* Comment list */}
      {topLevel.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          replies={getReplies(comment._id)}
          currentUserId={currentUser?._id}
          onDeleted={handleDeleted}
          onReplied={handleReplied}
          postId={postId}
        />
      ))}

      {topLevel.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 14 }}>
          No answers yet. Be the first to help!
        </div>
      )}

      {/* Add comment */}
      <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Your Answer</h4>
        {currentUser ? (
          <>
            <textarea
              value={newComment}
              onChange={(e) => { setNewComment(e.target.value); if (error) setError(''); }}
              placeholder="Write a helpful answer… (max 2000 characters)"
              rows={4}
              maxLength={2000}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 14,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              {error ? (
                <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>
              ) : (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{newComment.length}/2000</span>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim()}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? 'Posting…' : 'Post Answer'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            <a href="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>Login</a> or{' '}
            <a href="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>register</a> to post an answer
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
