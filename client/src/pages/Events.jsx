import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvents, fetchEvent, registerForEvent } from '../api/community';
import { useAuth } from '../context/AuthContext';

const TYPE_COLOR = { contest: '#ef4444', quiz: '#7c3aed', doubt_session: '#0a66c2', challenge: '#f59e0b' };
const TYPE_LABEL = { contest: '🏆 Contest', quiz: '📝 Quiz', doubt_session: '🎤 Doubt Session', challenge: '🎯 Challenge' };

const StatusBadge = ({ status }) => {
  const s = { live: { bg: '#dcfce7', color: '#15803d', dot: '#10b981' }, upcoming: { bg: '#e8f0fe', color: '#0a66c2', dot: '#0a66c2' }, completed: { bg: '#f3f2ef', color: '#5f6b7a', dot: '#5f6b7a' } };
  const c = s[status] || s.upcoming;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 12, background: c.bg, color: c.color, fontSize: 12, fontWeight: 700 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, animation: status === 'live' ? 'blink 1.2s infinite' : 'none', display: 'inline-block' }} />
      {status === 'live' ? 'LIVE' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EventCard = ({ event, onRegister, currentUser }) => {
  const isRegistered = currentUser && event.registrations?.some(r => r.toString?.() === currentUser._id?.toString() || r._id?.toString() === currentUser._id?.toString());
  const isFull = event.registrations?.length >= event.maxParticipants;
  const past = event.status === 'completed';
  const startDate = new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: '#fff', border: `1px solid ${event.status === 'live' ? '#86efac' : '#e0ddd8'}`, borderRadius: 8, padding: 20, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: TYPE_COLOR[event.type] + '20', color: TYPE_COLOR[event.type] }}>{TYPE_LABEL[event.type]}</span>
            <StatusBadge status={event.status} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1d2226' }}>
            <Link to={`/community/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{event.title}</Link>
          </h3>
          {event.description && <p style={{ margin: '0 0 8px', fontSize: 13, color: '#5f6b7a', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>}
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#5f6b7a', flexWrap: 'wrap' }}>
            <span>📅 {startDate}</span>
            <span>👥 {event.registrations?.length || 0}/{event.maxParticipants}</span>
            {event.prize && <span>🎁 {event.prize}</span>}
            <span>Hosted by {event.host?.name}</span>
          </div>
        </div>
        {!past && (
          <button onClick={() => onRegister(event._id)} disabled={isRegistered || isFull || !currentUser}
            style={{ padding: '8px 18px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 13, cursor: isRegistered || isFull ? 'default' : 'pointer', background: isRegistered ? '#f0fdf4' : isFull ? '#f3f2ef' : '#0a66c2', color: isRegistered ? '#15803d' : isFull ? '#5f6b7a' : '#fff', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {isRegistered ? '✅ Registered' : isFull ? 'Full' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await fetchEvents(filter || undefined); setEvents(data.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleRegister = async (id) => {
    if (!user) { alert('Login to register'); return; }
    try {
      await registerForEvent(id);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Registration failed'); }
  };

  const TABS = ['', 'live', 'upcoming', 'completed'];
  const TAB_LABELS = ['All', 'Live', 'Upcoming', 'Completed'];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <style>{`*{box-sizing:border-box}@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/community" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1d2226', margin: '12px 0 16px' }}>📅 Events</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setFilter(t)}
              style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #e0ddd8', background: filter === t ? '#0a66c2' : '#fff', color: filter === t ? '#fff' : '#1d2226', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {TAB_LABELS[i]}
            </button>
          ))}
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: '#5f6b7a' }}>Loading…</div>
          : events.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: '#5f6b7a' }}>No events found.</div>
          : events.map(e => <EventCard key={e._id} event={e} onRegister={handleRegister} currentUser={user} />)
        }
      </div>
    </div>
  );
};

export const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent(id).then(({ data }) => setEvent(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { alert('Login to register'); return; }
    try { const { data: r } = await registerForEvent(id); setEvent(e => ({ ...e, registrations: [...(e.registrations || []), { _id: user._id }] })); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Loading…</div>;
  if (!event) return <div style={{ textAlign: 'center', padding: 80 }}>Event not found. <Link to="/community/events">← Back</Link></div>;

  const isRegistered = user && event.registrations?.some(r => r._id?.toString() === user._id?.toString() || r.toString?.() === user._id?.toString());
  const startDate = new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/community/events" style={{ color: '#0a66c2', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Events</Link>
        <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 24, marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#e8f0fe', color: '#0a66c2' }}>{TYPE_LABEL[event.type]}</span>
            <StatusBadge status={event.status} />
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#1d2226' }}>{event.title}</h1>
          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 }}>{event.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[['📅 Start', startDate], ['👤 Host', event.host?.name || '—'], ['👥 Registered', `${event.registrations?.length || 0} / ${event.maxParticipants}`], ['🎁 Prize', event.prize || 'None']].map(([label, val]) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#5f6b7a', fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d2226', marginTop: 2 }}>{val}</div>
              </div>
            ))}
          </div>
          {event.status !== 'completed' && (
            <button onClick={handleRegister} disabled={isRegistered}
              style={{ padding: '10px 28px', border: 'none', borderRadius: 20, background: isRegistered ? '#f0fdf4' : '#0a66c2', color: isRegistered ? '#15803d' : '#fff', fontWeight: 700, fontSize: 15, cursor: isRegistered ? 'default' : 'pointer' }}>
              {isRegistered ? '✅ You are registered' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
