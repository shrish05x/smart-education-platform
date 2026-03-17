import { useState, useEffect, useCallback } from 'react';
import { getConnectionStatus, sendConnectionRequest, acceptConnectionRequest, removeConnection } from '../api/connections';
import { useToast } from './useToast';

export const useConnectionStatus = (userId) => {
  const [status, setStatus] = useState('loading'); // loading, not_connected, pending_sent, pending_received, connected, blocked, self
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStatus = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data } = await getConnectionStatus(userId);
      setStatus(data.data.status);
      setConnectionId(data.data.connectionId);
    } catch (err) {
      console.error('Error fetching connection status', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const sendRequest = async (message = '') => {
    try {
      setLoading(true);
      const { data } = await sendConnectionRequest(userId, message);
      setStatus('pending_sent');
      setConnectionId(data.data._id);
      toast.success('Connection request sent!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async () => {
    if (!connectionId) return;
    try {
      setLoading(true);
      await acceptConnectionRequest(connectionId);
      setStatus('connected');
      toast.success('Connection accepted!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!connectionId) return;
    try {
      setLoading(true);
      await removeConnection(connectionId);
      setStatus('not_connected');
      setConnectionId(null);
      toast.success('Connection removed');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove connection');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    connectionId,
    sendRequest,
    acceptRequest,
    remove,
    refreshStatus: fetchStatus
  };
};
