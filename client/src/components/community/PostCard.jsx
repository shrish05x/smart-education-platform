import { Link } from 'react-router-dom';
import ConnectionButton from '../connections/ConnectionButton';

const TYPE_ICONS = { question: '❓', discussion: '💬', resource: '📚', achievement: '🏆', challenge: '🎯' };
const TYPE_COLORS = { question: '#0a66c2', discussion: '#7c3aed', resource: '#10b981', achievement: '#f59e0b', challenge: '#ef4444' };

const formatDate = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const StarRating = ({ avg, total }) => {
  if (!avg) return null;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#f59e0b' }}>
      {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
      <span style={{ color: '#5f6b7a', fontWeight: 500 }}>({total})</span>
    </span>
  );
};

const PostCard = ({ post, isLoggedIn, onLoginPrompt }) => {
  const score = (post.upvotes || 0) - (post.downvotes || 0);
  const typeColor = TYPE_COLORS[post.type] || '#0a66c2';

  return (
    <div className="post-card">
      <style>{`
        .post-card{background:#fff;border:1px solid #e0ddd8;border-radius:8px;padding:16px;transition:box-shadow 0.2s;margin-bottom:8px;}
        .post-card:hover{box-shadow:0 2px 12px rgba(0,0,0,0.1);}
        .post-title-link{color:#1d2226;text-decoration:none;font-weight:700;font-size:15px;line-height:1.4;display:block;margin-bottom:6px;}
        .post-title-link:hover{color:#0a66c2;}
        .pill{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:#e8f0fe;color:#0a66c2;}
        .tag-pill{padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;background:#e8f0fe;color:#0a66c2;}
        .score-chip{padding:3px 8px;border-radius:6px;font-weight:800;font-size:13px;}
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Link to={`/community/profile/${post.author?._id}`}>
          <img
            src={post.author?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&size=32&background=0a66c2&color=fff`}
            alt={post.author?.name}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Link to={`/community/profile/${post.author?._id}`} style={{ fontWeight: 700, fontSize: 13, color: '#1d2226', textDecoration: 'none' }}>
              {post.author?.name}
            </Link>
            {post.author?.badges?.[0] && (
              <span className="pill" style={{ background: '#fef3c7', color: '#92400e' }}>
                {post.author.badges[0].icon} {post.author.badges[0].name}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#5f6b7a' }}>{formatDate(post.createdAt)}</div>
        </div>
        {/* Type badge */}
        <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: typeColor + '15', color: typeColor, whiteSpace: 'nowrap' }}>
          {TYPE_ICONS[post.type]} {post.type ? post.type.charAt(0).toUpperCase() + post.type.slice(1) : ''}
        </span>
        {post.subject && (
          <span className="pill" style={{ background: '#f0fdf4', color: '#15803d', whiteSpace: 'nowrap' }}>
            {post.subject}
          </span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <ConnectionButton
            userId={post.author?._id}
            userName={post.author?.name}
            userProfileImage={post.author?.profileImage}
            buttonSize="sm"
          />
        </div>
      </div>

      {/* Title */}
      <Link to={`/community/post/${post._id}`} className="post-title-link">{post.title}</Link>

      {/* Description excerpt */}
      <p style={{ margin: '0 0 10px', color: '#5f6b7a', fontSize: 14, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.description}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {post.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
        </div>
      )}

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#5f6b7a', flexWrap: 'wrap' }}>
        {/* Score */}
        <span className="score-chip" style={{ background: score > 0 ? '#f0fdf4' : score < 0 ? '#fef2f2' : '#f8fafc', color: score > 0 ? '#15803d' : score < 0 ? '#dc2626' : '#5f6b7a' }}>
          {score > 0 ? '+' : ''}{score}
        </span>
        <span>💬 {post.commentCount || 0}</span>
        <span>👁 {post.views || 0}</span>
        {post.type === 'resource' && post.averageRating > 0 && (
          <StarRating avg={post.averageRating} total={post.resourceRatings?.length || 0} />
        )}
        {post.acceptedAnswer && <span style={{ color: '#10b981', fontWeight: 700 }}>✅ Answered</span>}
      </div>
    </div>
  );
};

export default PostCard;
