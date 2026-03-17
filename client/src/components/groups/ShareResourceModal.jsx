import { useState } from 'react';
import { shareResource } from '../../api/groups';

const RESOURCE_TYPES = ['link', 'pdf', 'note', 'image'];

const ShareResourceModal = ({ groupId, onClose, onShared }) => {
  const [form, setForm] = useState({ title: '', description: '', resourceType: 'link', fileURL: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.resourceType) { setError('Resource type is required'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await shareResource(groupId, form);
      onShared(data.data.resource, data.data.message);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to share resource');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#16171c',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
        backdropFilter: 'blur(4px)',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#1e1f26',
          borderRadius: 16,
          padding: 28,
          width: '100%',
          maxWidth: 460,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'fadeInUp 0.25s ease',
        }}
      >
        <style>{`@keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
            📎 Share Resource
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#72767d', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#b9bbbe' }}>
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. MIT OCW Calculus Notes"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#b9bbbe' }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of this resource…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#b9bbbe' }}>
              Resource Type
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {RESOURCE_TYPES.map((type) => {
                const icons = { link: '🔗', pdf: '📄', note: '📝', image: '🖼' };
                const active = form.resourceType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('resourceType', type)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 8,
                      background: active ? '#5865f222' : '#16171c',
                      border: active ? '1px solid #5865f2' : '1px solid rgba(255,255,255,0.1)',
                      color: active ? '#5865f2' : '#72767d',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{icons[type]}</span>
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#b9bbbe' }}>
              URL / Link
            </label>
            <input
              type="url"
              value={form.fileURL}
              onChange={(e) => set('fileURL', e.target.value)}
              placeholder="https://example.com/resource"
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#ed4245', fontSize: 12, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#b9bbbe',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                background: loading ? '#3a3d47' : '#5865f2',
                color: '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {loading ? 'Sharing…' : 'Share Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareResourceModal;
