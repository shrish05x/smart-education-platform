import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages = [], currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        scrollbarWidth: 'thin',
        scrollbarColor: '#2b2d35 transparent',
      }}
    >
      <style>{`
        @keyframes fadeInMsg { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#72767d' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <p style={{ margin: 0, fontSize: 14 }}>No messages yet. Say hello!</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={msg._id || i}
          style={{ animation: 'fadeInMsg 0.2s ease' }}
        >
          <MessageBubble
            message={msg}
            isSelf={String(msg.senderId) === String(currentUserId)}
            isSystem={msg.type === 'system'}
          />
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
