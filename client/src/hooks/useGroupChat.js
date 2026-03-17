import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { fetchMessages } from '../api/groups';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

export const useGroupChat = ({ groupId, user }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pollingRef = useRef(null);

  // ── Load initial messages ──────────────────────────────────────────────────
  useEffect(() => {
    if (!groupId) return;
    const load = async () => {
      try {
        const { data } = await fetchMessages(groupId);
        setMessages(data.data || []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupId]);

  // ── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!groupId || !user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', {
        groupId,
        userId: user._id,
        userName: user.name,
      });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', () => {
      setConnected(false);
      // Fallback polling every 5 seconds
      pollingRef.current = setInterval(async () => {
        try {
          const { data } = await fetchMessages(groupId);
          setMessages(data.data || []);
        } catch {
          // ignore
        }
      }, 5000);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('user-typing', ({ userName }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(userName)) return [...prev, userName];
        return prev;
      });
    });

    socket.on('stop-typing', () => {
      setTypingUsers([]);
    });

    socket.on('user-joined', ({ userName }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: `sys-${Date.now()}`,
          type: 'system',
          content: `${userName} joined the group`,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socket.on('user-left', ({ userName }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: `sys-${Date.now()}`,
          type: 'system',
          content: `${userName} left the group`,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current = socket;

    return () => {
      socket.emit('leave-room', { groupId, userId: user._id });
      socket.disconnect();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [groupId, user]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (content) => {
      if (!content.trim() || content.length > 1000) return;

      if (socketRef.current && connected) {
        socketRef.current.emit('send-message', {
          groupId,
          content,
          senderName: user?.name,
          senderAvatar: user?.profileImage,
          type: 'text',
        });
      }
    },
    [groupId, user, connected]
  );

  // ── Typing indicator ───────────────────────────────────────────────────────
  const emitTyping = useCallback(() => {
    if (!socketRef.current || !connected) return;
    socketRef.current.emit('typing', { groupId, userName: user?.name });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop-typing', { groupId });
    }, 2000);
  }, [groupId, user, connected]);

  // ── Add message locally (for optimistic resource shares) ──────────────────
  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return {
    messages,
    typingUsers,
    connected,
    loading,
    sendMessage,
    emitTyping,
    addMessage,
  };
};
