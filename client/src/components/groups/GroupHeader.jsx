import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGroup, leaveGroup, deleteGroup } from '../../api/groups';

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

const GroupHeader = ({ group, currentUserId, onUpdate }) => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);
  const [toast, setToast] = useState(null);

  if (!group) return null;

  const isMember = group.members?.some((m) => (m._id || m) === currentUserId);
  const isCreator = (group.creator?._id || group.creator) === currentUserId;
  const subjectColor = SUBJECT_COLORS[group.subject] || '#747f8d';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = async () => {
    setLoadingAction('join');
    try {
      await joinGroup(group._id);
      showToast('Joined group! 🎉');
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to join', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    setLoadingAction('leave');
    try {
      await leaveGroup(group._id);
      showToast('Left the group');
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to leave', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this group and all its messages/resources?')) return;
    setLoadingAction('delete');
    try {
      await deleteGroup(group._id);
      showToast('Group deleted');
      setTimeout(() => navigate('/groups'), 800);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            padding: '12px 20px',
            borderRadius: 10,
            background: toast.type === 'error' ? '#ed4245' : '#3ba55c',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Cover banner */}
      <div
        style={{
          height: 8,
          background: `linear-gradient(90deg, ${group.coverColor || '#5865f2'}, ${group.coverColor || '#5865f2'}99)`,
          borderRadius: '12px 12px 0 0',
        }}
      />

      <div style={{ padding: '20px 24px' }}>
        {/* Name + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'Space Grotesk, Sora, sans-serif',
              flex: 1,
              lineHeight: 1.2,
            }}
          >
            {group.name}
          </h1>
          {group.isPrivate && <span title="Private" style={{ fontSize: 16, marginTop: 3 }}>🔒</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '3px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              background: subjectColor + '22',
              color: subjectColor,
              border: `1px solid ${subjectColor}44`,
            }}
          >
            {group.subject}
          </span>
          {group.tags?.map((tag) => (
            <span
              key={tag}
              style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, color: '#72767d', background: '#2b2d35' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#b9bbbe', lineHeight: 1.6 }}>
          {group.description}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#72767d', marginBottom: 16, flexWrap: 'wrap' }}>
          <span>👥 {group.memberCount || group.members?.length} / {group.maxMembers} members</span>
          <span>👤 Created by {group.creator?.name || 'Unknown'}</span>
          <span>📅 {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!isMember && (
            <button
              onClick={handleJoin}
              disabled={loadingAction === 'join'}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: '#5865f2',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                opacity: loadingAction === 'join' ? 0.6 : 1,
              }}
            >
              {loadingAction === 'join' ? 'Joining…' : '+ Join Group'}
            </button>
          )}

          {isMember && !isCreator && (
            <button
              onClick={handleLeave}
              disabled={loadingAction === 'leave'}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: 'transparent',
                color: '#ed4245',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #ed4245',
                cursor: 'pointer',
                opacity: loadingAction === 'leave' ? 0.6 : 1,
              }}
            >
              {loadingAction === 'leave' ? 'Leaving…' : '← Leave Group'}
            </button>
          )}

          {isCreator && (
            <button
              onClick={handleDelete}
              disabled={loadingAction === 'delete'}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: 'transparent',
                color: '#ed4245',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #ed4245',
                cursor: 'pointer',
                opacity: loadingAction === 'delete' ? 0.6 : 1,
              }}
            >
              {loadingAction === 'delete' ? 'Deleting…' : '🗑 Delete Group'}
            </button>
          )}

          {group.isPrivate && isCreator && (
            <div
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: '#2b2d35',
                color: '#faa61a',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              Code: {group.inviteCode}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupHeader;
