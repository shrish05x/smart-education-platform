import { useGroupChat } from '../../hooks/useGroupChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatPanel = ({ groupId, user }) => {
  const { messages, typingUsers, connected, loading, sendMessage, emitTyping, addMessage } = useGroupChat({
    groupId,
    user,
  });

  const handleResourceShared = (resource, message) => {
    if (message) {
      addMessage({
        _id: message._id || `local-${Date.now()}`,
        senderId: user?._id,
        senderName: user?.name,
        senderAvatar: user?.profileImage,
        content: message.content,
        type: 'resource',
        createdAt: message.createdAt || new Date().toISOString(),
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0f0f13',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#1e1f26',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
            Group Chat
          </h3>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: connected ? '#57f287' : '#72767d',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: connected ? '#57f287' : '#faa61a',
              flexShrink: 0,
            }}
          />
          {connected ? 'Live' : 'Connecting…'}
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#72767d',
            fontSize: 14,
          }}
        >
          Loading messages…
        </div>
      ) : (
        <MessageList messages={messages} currentUserId={user?._id} />
      )}

      {/* Typing indicator */}
      <TypingIndicator users={typingUsers} />

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        onTyping={emitTyping}
        groupId={groupId}
        onResourceShared={handleResourceShared}
        disabled={!user}
      />
    </div>
  );
};

export default ChatPanel;
