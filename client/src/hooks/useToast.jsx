import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return { toasts, toast };
};

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };
const COLORS = {
  success: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  error: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  info: { bg: '#e0f2fe', border: '#7dd3fc', text: '#075985' },
};

export const ToastContainer = ({ toasts }) => (
  <div
    style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}
  >
    <style>{`
      @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    `}</style>
    {toasts.map((t) => {
      const c = COLORS[t.type] || COLORS.info;
      return (
        <div
          key={t.id}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.text,
            fontWeight: 600,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 260,
            maxWidth: 360,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            animation: 'slideIn 0.25s ease',
            pointerEvents: 'auto',
          }}
        >
          <span>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      );
    })}
  </div>
);
