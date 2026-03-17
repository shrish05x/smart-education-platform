import { useState } from 'react';
import { castVote } from '../../api/community';

const VoteButtons = ({ postId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null, isLoggedIn, onLoginPrompt, vertical = false }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  const score = upvotes - downvotes;

  const handleVote = async (type) => {
    if (!isLoggedIn) {
      if (onLoginPrompt) onLoginPrompt();
      return;
    }
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const prevUp = upvotes;
    const prevDown = downvotes;
    const prevVote = userVote;

    if (!userVote) {
      if (type === 'upvote') setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
      setUserVote(type);
    } else if (userVote === type) {
      // toggle off
      if (type === 'upvote') setUpvotes((v) => Math.max(0, v - 1));
      else setDownvotes((v) => Math.max(0, v - 1));
      setUserVote(null);
    } else {
      // switch
      if (type === 'upvote') { setUpvotes((v) => v + 1); setDownvotes((v) => Math.max(0, v - 1)); }
      else { setDownvotes((v) => v + 1); setUpvotes((v) => Math.max(0, v - 1)); }
      setUserVote(type);
    }

    try {
      const { data } = await castVote(postId, type);
      setUpvotes(data.data.upvotes);
      setDownvotes(data.data.downvotes);
      setUserVote(data.data.userVote);
    } catch {
      // rollback on error
      setUpvotes(prevUp);
      setDownvotes(prevDown);
      setUserVote(prevVote);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = score > 0 ? '#16a34a' : score < 0 ? '#dc2626' : '#64748b';

  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
        <button
          onClick={() => handleVote('upvote')}
          title={isLoggedIn ? 'Upvote' : 'Login to vote'}
          style={{
            background: 'none', border: 'none', cursor: isLoggedIn ? 'pointer' : 'default',
            fontSize: 22, lineHeight: 1, color: userVote === 'upvote' ? '#16a34a' : '#94a3b8',
            transition: 'color 0.15s, transform 0.1s',
            transform: userVote === 'upvote' ? 'scale(1.15)' : 'scale(1)',
          }}
        >▲</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: scoreColor, fontVariantNumeric: 'tabular-nums' }}>
          {score}
        </span>
        <button
          onClick={() => handleVote('downvote')}
          title={isLoggedIn ? 'Downvote' : 'Login to vote'}
          style={{
            background: 'none', border: 'none', cursor: isLoggedIn ? 'pointer' : 'default',
            fontSize: 22, lineHeight: 1, color: userVote === 'downvote' ? '#dc2626' : '#94a3b8',
            transition: 'color 0.15s, transform 0.1s',
            transform: userVote === 'downvote' ? 'scale(1.15)' : 'scale(1)',
          }}
        >▼</button>
      </div>
    );
  }

  // Inline (horizontal) variant for PostCard
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 20,
        background: score > 0 ? '#dcfce7' : score < 0 ? '#fee2e2' : '#f1f5f9',
        border: `1px solid ${score > 0 ? '#86efac' : score < 0 ? '#fca5a5' : '#e2e8f0'}`,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor }}>
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  );
};

export default VoteButtons;
