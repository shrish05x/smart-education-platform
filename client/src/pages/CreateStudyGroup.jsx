import { Link } from 'react-router-dom';
import CreateGroupForm from '../components/groups/CreateGroupForm';

const CreateStudyGroup = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 8 }}>
        <Link
          to="/groups"
          style={{
            color: '#72767d',
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b9bbbe')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#72767d')}
        >
          ← Back to Study Groups
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 28,
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Space Grotesk, Sora, sans-serif',
          }}
        >
          ✨ Create a Study Group
        </h1>
        <p style={{ margin: 0, color: '#b9bbbe', fontSize: 14 }}>
          Set up your collaborative workspace and invite classmates to join.
        </p>
      </div>

      <CreateGroupForm />
    </div>
  );
};

export default CreateStudyGroup;
