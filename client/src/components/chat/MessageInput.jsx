import { useState, useRef } from 'react';
import ShareResourceModal from '../groups/ShareResourceModal';

const MessageInput = ({ onSend, onTyping, groupId, onResourceShared, disabled }) => {
  const [value, setValue] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (onTyping) onTyping();
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text || text.length > 1000 || disabled) return;
    onSend(text);
    setValue('');
    textareaRef.current?.focus();
  };

  const handleChange = (e) => {
    const v = e.target.value;
    if (v.length <= 1000) setValue(v);
    if (onTyping) onTyping();
  };

  const handleResourceShared = (resource, message) => {
    setShowResourceModal(false);
    if (onResourceShared) onResourceShared(resource, message);
  };

  return (
    <>
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#1e1f26',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            background: '#16171c',
            borderRadius: 14,
            padding: '8px 12px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Attach button */}
          <button
            type="button"
            onClick={() => setShowResourceModal(true)}
            title="Share a resource"
            style={{
              background: 'none',
              border: 'none',
              color: '#72767d',
              cursor: 'pointer',
              fontSize: 20,
              padding: '4px',
              flexShrink: 0,
              lineHeight: 1,
              transition: 'color 0.15s',
              marginBottom: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#b9bbbe')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#72767d')}
          >
            📎
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message the group… (Enter to send, Shift+Enter for new line)"
            rows={1}
            maxLength={1000}
            disabled={disabled}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 14,
              resize: 'none',
              lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif',
              minHeight: 24,
              maxHeight: 120,
              overflowY: 'auto',
              padding: '4px 0',
            }}
          />

          {/* Character count */}
          {value.length > 800 && (
            <span style={{ fontSize: 11, color: value.length > 950 ? '#ed4245' : '#faa61a', flexShrink: 0 }}>
              {1000 - value.length}
            </span>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            style={{
              background: value.trim() && !disabled ? '#5865f2' : '#2b2d35',
              border: 'none',
              color: '#fff',
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: value.trim() && !disabled ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {showResourceModal && (
        <ShareResourceModal
          groupId={groupId}
          onClose={() => setShowResourceModal(false)}
          onShared={handleResourceShared}
        />
      )}
    </>
  );
};

export default MessageInput;
