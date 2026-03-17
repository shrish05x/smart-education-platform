import { useState, useCallback } from 'react';
import { getPendingRequests, getSentRequests, getMyNetwork, getSuggestions } from '../api/connections';
import { useToast } from './useToast';

export const useConnections = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch pending requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSentRequests();
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch sent requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNetwork = useCallback(async (search = '', skills = '') => {
    try {
      setLoading(true);
      const res = await getMyNetwork({ search, skills });
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch network');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSuggestions();
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update local state when an action occurs (e.g. accepted/rejected) to avoid full refetch
  const removeProcessedItem = (connectionId) => {
    setData(prev => prev.filter(item => item._id !== connectionId && item.connectionId !== connectionId));
  };

  return {
    data,
    loading,
    fetchPending,
    fetchSent,
    fetchNetwork,
    fetchSuggestions,
    removeProcessedItem
  };
};
