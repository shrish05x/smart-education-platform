import { Link } from 'react-router-dom';

const SUBJECT_COLORS = {
  Mathematics: '#5865f2',
  Physics: '#ed4245',
  Chemistry: '#3ba55c',
  Biology: '#57f287',
  History: '#faa61a',
  'Computer Science': '#fee75c',
  Literature: '#eb459e',
  Economics: '#9b59b6',
  Other: '#747f8d',
};

const AvatarStack = ({ members = [], max = 4 }) => {
  const shown = members.slice(0, max);
  const overflow = members.length - max;
  return (
    <div className="flex items-center" style={{ gap: 0 }}>
      {shown.map((m, i) => (
        <img
          key={m._id || i}
          src={
            m.profileImage ||
            `https://ui-avatars.com/api/?background=5865f2&color=fff&name=${encodeURIComponent(m.name || 'U')}&size=32`
          }
          alt={m.name || 'Member'}
          title={m.name}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid #1e1f26',
            marginLeft: i === 0 ? 0 : -8,
            objectFit: 'cover',
            zIndex: shown.length - i,
            position: 'relative',
          }}
        />
      ))}
      {overflow > 0 && (
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#2b2d35',
            border: '2px solid #1e1f26',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#b9bbbe',
            marginLeft: -8,
            zIndex: 0,
            position: 'relative',
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};

const GroupCard = ({ group, currentUserId, onJoin, joining }) => {
  const isMember = group.members?.some((m) => (m._id || m) === currentUserId);
  const subjectColor = SUBJECT_COLORS[group.subject] || '#5865f2';

  return (
    <div
      className="group-card"
      style={{
        background: '#1e1f26',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${group.coverColor || '#5865f2'}44`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Color Strip */}
      <div style={{ height: 6, background: group.coverColor || '#5865f2' }} />

      <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                }}
              >
                {group.name}
              </h3>
              {group.isPrivate && (
                <span title="Private Group" style={{ color: '#faa61a', fontSize: 14 }}>🔒</span>
              )}
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: subjectColor + '22',
                color: subjectColor,
                border: `1px solid ${subjectColor}44`,
              }}
            >
              {group.subject}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: '#b9bbbe',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {group.description}
        </p>

        {/* Tags */}
        {group.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {group.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  color: '#72767d',
                  background: '#2b2d35',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Members */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AvatarStack members={group.members || []} />
            <span style={{ fontSize: 12, color: '#72767d' }}>
              {group.memberCount || group.members?.length || 0} / {group.maxMembers}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Link
            to={`/groups/${group._id}`}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              background: '#2b2d35',
              color: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#3a3d47')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2b2d35')}
          >
            View Group
          </Link>
          {!isMember && (
            <button
              onClick={() => onJoin(group._id)}
              disabled={joining === group._id}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#5865f2',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: joining === group._id ? 'not-allowed' : 'pointer',
                opacity: joining === group._id ? 0.6 : 1,
                transition: 'background 0.15s',
              }}
            >
              {joining === group._id ? 'Joining…' : 'Join Group'}
            </button>
          )}
          {isMember && (
            <span
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#3ba55c22',
                color: '#57f287',
                border: '1px solid #57f28744',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Joined ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
