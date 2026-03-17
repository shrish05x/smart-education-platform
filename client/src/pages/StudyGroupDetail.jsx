import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchGroup } from '../api/groups';
import GroupHeader from '../components/groups/GroupHeader';
import MembersList from '../components/groups/MembersList';
import ResourcesList from '../components/groups/ResourcesList';
import ChatPanel from '../components/chat/ChatPanel';

const StudyGroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [mobilePanelView, setMobilePanelView] = useState('info'); // 'info' | 'chat'

  const loadGroup = async () => {
    try {
      const { data } = await fetchGroup(id);
      setGroup(data.data);
    } catch {
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadGroup();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#72767d', fontSize: 14 }}>
        Loading group…
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#72767d' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😢</div>
        <h2 style={{ color: '#fff' }}>Group not found</h2>
        <Link to="/groups" style={{ color: '#5865f2', textDecoration: 'none' }}>← Back to Study Groups</Link>
      </div>
    );
  }

  const tabStyle = (active) => ({
    flex: 1,
    padding: '10px 0',
    background: active ? '#5865f222' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #5865f2' : '2px solid transparent',
    color: active ? '#5865f2' : '#72767d',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .split-panel { display: flex; gap: 0; height: calc(100vh - 160px); min-height: 600px; }
        .left-panel { width: 380px; flex-shrink: 0; background: #1e1f26; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.06); }
        .right-panel { flex: 1; background: #0f0f13; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.06); margin-left: 16px; }
        .tab-scroll { flex: 1; overflow-y: auto; padding: 12px 16px; scrollbar-width: thin; scrollbar-color: #2b2d35 transparent; }
        @media (max-width: 900px) {
          .split-panel { flex-direction: column; height: auto; }
          .left-panel { width: 100%; }
          .right-panel { margin-left: 0; margin-top: 16px; height: 500px; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/groups"
          style={{ color: '#72767d', textDecoration: 'none', fontSize: 13 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b9bbbe')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#72767d')}
        >
          ← Study Groups
        </Link>
      </div>

      {/* Mobile panel switcher */}
      <div
        style={{
          display: 'none',
          gap: 8,
          marginBottom: 12,
        }}
        className="mobile-switcher"
      >
        <button
          onClick={() => setMobilePanelView('info')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 10,
            background: mobilePanelView === 'info' ? '#5865f2' : '#1e1f26',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          ℹ️ Group Info
        </button>
        <button
          onClick={() => setMobilePanelView('chat')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 10,
            background: mobilePanelView === 'chat' ? '#5865f2' : '#1e1f26',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          💬 Chat
        </button>
      </div>

      <div className="split-panel">
        {/* ── Left Panel ─────────────────────────────────────────────────── */}
        <div className="left-panel">
          {/* Group Header */}
          <GroupHeader group={group} currentUserId={user?._id} onUpdate={loadGroup} />

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}
          >
            <button
              style={tabStyle(activeTab === 'members')}
              onClick={() => setActiveTab('members')}
            >
              👥 Members ({group.members?.length || 0})
            </button>
            <button
              style={tabStyle(activeTab === 'resources')}
              onClick={() => setActiveTab('resources')}
            >
              📎 Resources
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-scroll">
            {activeTab === 'members' ? (
              <MembersList members={group.members || []} creatorId={group.creator?._id || group.creator} />
            ) : (
              <ResourcesList groupId={id} currentUserId={user?._id} />
            )}
          </div>
        </div>

        {/* ── Right Panel — Chat ──────────────────────────────────────────── */}
        <div className="right-panel">
          <ChatPanel groupId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default StudyGroupDetail;
