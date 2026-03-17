import { useState } from 'react';

const TypingIndicator = ({ users = [] }) => {
  if (!users.length) return null;

  const label = users.length === 1 ? `${users[0]} is typing…` : `${users.join(', ')} are typing…`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 16px 8px',
        color: '#72767d',
        fontSize: 12,
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#72767d',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span style={{ fontStyle: 'italic' }}>{label}</span>
    </div>
  );
};

export default TypingIndicator;
