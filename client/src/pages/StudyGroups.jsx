import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GroupGrid from '../components/groups/GroupGrid';

const StudyGroups = () => {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Page Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5865f222, #0f0f13)',
          borderRadius: 16,
          padding: '32px 32px 28px',
          marginBottom: 32,
          border: '1px solid rgba(88,101,242,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: '#5865f211',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 32,
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'Space Grotesk, Sora, sans-serif',
            }}
          >
            📚 Study Groups
          </h1>
          <p style={{ margin: '0 0 20px', color: '#b9bbbe', fontSize: 15, lineHeight: 1.6 }}>
            Find your study tribe — collaborate, share resources, and grow together.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              to="/groups/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 12,
                background: '#5865f2',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Space Grotesk, Sora, sans-serif',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#4752c4')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#5865f2')}
            >
              + Create Group
            </Link>
          </div>
        </div>
      </div>

      {/* Group Grid */}
      <GroupGrid currentUserId={user?._id} />
    </div>
  );
};

export default StudyGroups;
