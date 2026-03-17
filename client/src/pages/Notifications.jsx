import { useState } from 'react';
import { Link } from 'react-router-dom';
import { markAllRead as apiMarkAll, markOneRead } from '../api/community';
import { useNotifications } from '../hooks/useNotifications';

const TYPE_ICONS = { reply: '💬', mention: '@', upvote: '▲', accepted_answer: '✅', badge: '🏅', event: '📅' };

const groupByDay = (notifications) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const groups = { Today: [], 'This Week': [], Earlier: [] };
  notifications.forEach(n => {
    const d = new Date(n.createdAt);
    if (d >= today) groups['Today'].push(n);
    else if (d >= weekAgo) groups['This Week'].push(n);
    else groups['Earlier'].push(n);
  });
  return groups;
};

const Notifications = () => {
  const { notifications, unreadCount, loading, markAllRead, reload } = useNotifications();

  const handleMarkOne = async (id) => {
    try { await markOneRead(id); reload(); } catch {}
  };

  const groups = groupByDay(notifications);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 16px' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1d2226' }}>
            🔔 Notifications {unreadCount > 0 && <span style={{ fontSize: 14, padding: '3px 8px', background: '#0a66c2', color: '#fff', borderRadius: 12, marginLeft: 8 }}>{unreadCount}</span>}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ padding: '6px 14px', border: '1px solid #e0ddd8', background: '#fff', borderRadius: 14, fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#0a66c2' }}>
              Mark all read
            </button>
          )}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 60, color: '#5f6b7a' }}>Loading…</div>}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 8, border: '1px solid #e0ddd8' }}>
            <div style={{ fontSize: 40 }}>🔔</div>
            <p style={{ color: '#5f6b7a', marginTop: 10 }}>No notifications yet. Start participating!</p>
          </div>
        )}

        {Object.entries(groups).map(([label, items]) => items.length === 0 ? null : (
          <div key={label}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5f6b7a', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '14px 0 6px' }}>{label}</div>
            <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, overflow: 'hidden' }}>
              {items.map((n, i) => (
                <div key={n._id} onClick={() => !n.isRead && handleMarkOne(n._id)}
                  style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: i < items.length - 1 ? '1px solid #f3f2ef' : 'none', background: n.isRead ? '#fff' : '#f0f6ff', cursor: n.isRead ? 'default' : 'pointer', transition: 'background 0.15s' }}>
                  {/* Sender avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={n.sender?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(n.sender?.name || 'S')}&size=38&background=0a66c2&color=fff`}
                      alt="" style={{ width: 38, height: 38, borderRadius: '50%' }} />
                    <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 13, background: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {TYPE_ICONS[n.type] || '🔔'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#1d2226', lineHeight: 1.5 }}>
                      {n.message}
                      {n.postId && (
                        <Link to={`/community/post/${n.postId}`} onClick={e => e.stopPropagation()}
                          style={{ color: '#0a66c2', textDecoration: 'none', fontWeight: 600, marginLeft: 6 }}>View →</Link>
                      )}
                    </p>
                    <div style={{ fontSize: 11, color: '#5f6b7a', marginTop: 3 }}>
                      {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a66c2', flexShrink: 0, alignSelf: 'center' }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
