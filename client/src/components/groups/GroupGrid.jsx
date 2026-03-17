import { useState, useEffect, useCallback } from 'react';
import GroupCard from './GroupCard';
import { fetchGroups, joinGroup } from '../../api/groups';

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Computer Science', 'Literature', 'Economics'];

const SUBJECT_PILLS = {
  Mathematics: '#5865f2',
  Physics: '#ed4245',
  Chemistry: '#3ba55c',
  Biology: '#57f287',
  History: '#faa61a',
  'Computer Science': '#fee75c',
  Literature: '#eb459e',
  Economics: '#9b59b6',
  All: '#747f8d',
};

const SkeletonCard = () => (
  <div
    style={{
      background: '#1e1f26',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      height: 260,
    }}
  >
    <div style={{ height: 6, background: '#2b2d35' }} />
    <div style={{ padding: '16px 20px' }}>
      {[80, 50, 100, 60, 40].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? 20 : 14,
            width: `${w}%`,
            background: '#2b2d35',
            borderRadius: 6,
            marginBottom: 12,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  </div>
);

const GroupGrid = ({ currentUserId, onJoinSuccess }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [sort, setSort] = useState('newest');
  const [joining, setJoining] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchDebounced) params.search = searchDebounced;
      if (subject !== 'All') params.subject = subject;
      if (sort === 'members') params.sort = 'members';
      if (sort === 'name') params.sort = 'name';
      const { data } = await fetchGroups(params);
      setGroups(data.data || []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, subject, sort]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = async (groupId) => {
    setJoining(groupId);
    try {
      await joinGroup(groupId);
      showToast('Successfully joined the group! 🎉');
      loadGroups();
      if (onJoinSuccess) onJoinSuccess(groupId);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to join group', 'error');
    } finally {
      setJoining(null);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Toast */}
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
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Search & Filters */}
      <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#72767d' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups by name or description…"
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                background: '#1e1f26',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '10px 14px',
              background: '#1e1f26',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest</option>
            <option value="members">Most Members</option>
            <option value="name">A–Z</option>
          </select>
        </div>

        {/* Subject Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUBJECTS.map((s) => {
            const active = subject === s;
            const color = SUBJECT_PILLS[s] || '#5865f2';
            return (
              <button
                key={s}
                onClick={() => setSubject(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
                  background: active ? color + '22' : 'transparent',
                  color: active ? color : '#72767d',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : groups.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#72767d',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
          <h3 style={{ color: '#b9bbbe', fontSize: 20, margin: '0 0 8px' }}>No groups found</h3>
          <p style={{ margin: 0 }}>Try adjusting your search or filter, or create a new group!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {groups.map((g) => (
            <GroupCard
              key={g._id}
              group={g}
              currentUserId={currentUserId}
              onJoin={handleJoin}
              joining={joining}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupGrid;
