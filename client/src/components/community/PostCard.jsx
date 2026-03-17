import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const PostCard = ({ post, isLoggedIn, onLoginPrompt }) => {
  const score = (post.upvotes || 0) - (post.downvotes || 0);

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '16px 20px',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Vote score badge */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <VoteButtons
          postId={post._id}
          initialUpvotes={post.upvotes}
          initialDownvotes={post.downvotes}
          isLoggedIn={isLoggedIn}
          onLoginPrompt={onLoginPrompt}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <Link
          to={`/community/post/${post._id}`}
          style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 700, fontSize: 16, lineHeight: 1.4, display: 'block', marginBottom: 6 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1e293b')}
        >
          {post.title}
        </Link>

        {/* Excerpt */}
        <p
          style={{
            margin: '0 0 10px',
            color: '#64748b',
            fontSize: 14,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.description}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: '#eef2ff',
                  color: '#4f46e5',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img
              src={
                post.author?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&size=20&background=4f46e5&color=fff`
              }
              alt={post.author?.name}
              style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
            />
            <Link
              to={`/community/profile/${post.author?._id}`}
              style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}
            >
              {post.author?.name || 'Unknown'}
            </Link>
          </div>
          <span>{formatDate(post.createdAt)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {post.commentCount || 0} {post.commentCount === 1 ? 'answer' : 'answers'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
