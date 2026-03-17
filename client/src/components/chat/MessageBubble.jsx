import { useState } from 'react';

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ message, isSelf, isSystem }) => {
  const [showTime, setShowTime] = useState(false);

  if (isSystem || message.type === 'system') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4px 0',
          color: '#72767d',
          fontSize: 12,
          fontStyle: 'italic',
        }}
      >
        {message.content}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        padding: '2px 16px',
      }}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {/* Avatar (only for others) */}
      {!isSelf && (
        <img
          src={
            message.senderAvatar ||
            `https://ui-avatars.com/api/?background=5865f2&color=fff&name=${encodeURIComponent(message.senderName || 'U')}&size=32`
          }
          alt={message.senderName}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            marginBottom: 2,
          }}
        />
      )}

      <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
        {/* Sender name (for others) */}
        {!isSelf && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#b9bbbe', marginBottom: 3, paddingLeft: 4 }}>
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          style={{
            padding: message.type === 'resource' ? '0' : '10px 14px',
            borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isSelf ? '#5865f2' : '#2b2d35',
            color: '#fff',
            fontSize: 14,
            lineHeight: 1.5,
            wordBreak: 'break-word',
            overflow: 'hidden',
          }}
        >
          {message.type === 'resource' ? (
            <div style={{ padding: '10px 14px' }}>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: isSelf ? 'rgba(255,255,255,0.7)' : '#72767d' }}>
                📎 Shared a resource
              </p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                {message.content.replace(/^📎 [^"]*"/, '').replace(/"$/, '') || message.content }
              </p>
            </div>
          ) : (
            message.content
          )}
        </div>

        {/* Timestamp (on hover) */}
        <span
          style={{
            fontSize: 10,
            color: '#72767d',
            marginTop: 2,
            paddingLeft: 4,
            paddingRight: 4,
            opacity: showTime ? 1 : 0,
            transition: 'opacity 0.15s',
          }}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
