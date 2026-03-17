import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications, markAllRead as apiMarkAllRead } from '../api/community';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  const load = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await fetchNotifications();
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch {
      // silently fail for background polling
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiMarkAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  // Add a new notification to the list (called from socket handler)
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((c) => c + 1);
  };

  useEffect(() => {
    if (!user) return;
    load();
    // Poll every 30 seconds as a fallback if socket isn't available
    pollRef.current = setInterval(load, 30000);
    return () => clearInterval(pollRef.current);
  }, [user]);

  return { notifications, unreadCount, loading, markAllRead, addNotification, reload: load };
};
