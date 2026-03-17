const MembersList = ({ members = [], creatorId }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {members.length === 0 && (
        <p style={{ color: '#72767d', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No members yet</p>
      )}
      {members.map((member, i) => {
        const memberId = member._id || member;
        const isCreator = memberId === (creatorId?._id || creatorId);
        return (
          <div
            key={memberId || i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2b2d35')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <img
              src={
                member.profileImage ||
                `https://ui-avatars.com/api/?background=5865f2&color=fff&name=${encodeURIComponent(member.name || 'U')}&size=36`
              }
              alt={member.name || 'Member'}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.name || 'Unknown'}
                </span>
                {isCreator && (
                  <span
                    style={{
                      padding: '1px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      background: '#5865f222',
                      color: '#5865f2',
                      border: '1px solid #5865f244',
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Creator
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersList;
