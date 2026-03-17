import { useEffect, useState } from 'react';
import { fetchResources } from '../../api/groups';
import ShareResourceModal from './ShareResourceModal';

const RESOURCE_ICONS = {
  pdf: '📄',
  note: '📝',
  link: '🔗',
  image: '🖼',
};

const ResourcesList = ({ groupId, currentUserId, onResourceShared }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      const { data } = await fetchResources(groupId);
      setResources(data.data || []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) load();
  }, [groupId]);

  const handleShared = (resource, message) => {
    setResources((prev) => [resource, ...prev]);
    setShowModal(false);
    if (onResourceShared) onResourceShared(message);
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 10,
          background: '#5865f222',
          color: '#5865f2',
          border: '1px solid #5865f244',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#5865f233')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#5865f222')}
      >
        📎 Share Resource
      </button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#72767d', fontSize: 13 }}>Loading resources…</div>
      ) : resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: '#72767d' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
          <p style={{ margin: 0, fontSize: 13 }}>No resources shared yet. Be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {resources.map((r) => (
            <div
              key={r._id}
              style={{
                padding: '12px 14px',
                background: '#16171c',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{RESOURCE_ICONS[r.resourceType] || '📎'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#fff', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title}
                </p>
                {r.description && (
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#b9bbbe' }}>{r.description}</p>
                )}
                <p style={{ margin: 0, fontSize: 11, color: '#72767d' }}>
                  By {r.uploaderName} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              {r.fileURL && (
                <a
                  href={r.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#2b2d35',
                    color: '#fff',
                    fontSize: 12,
                    textDecoration: 'none',
                    fontWeight: 600,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Open →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ShareResourceModal
          groupId={groupId}
          onClose={() => setShowModal(false)}
          onShared={handleShared}
        />
      )}
    </div>
  );
};

export default ResourcesList;
