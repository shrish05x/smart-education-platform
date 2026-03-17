import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api/connections`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendConnectionRequest = (receiverId, message) => api.post('/request', { receiverId, message });
export const acceptConnectionRequest = (id) => api.put(`/${id}/accept`);
export const rejectConnectionRequest = (id) => api.put(`/${id}/reject`);
export const blockConnection = (id) => api.put(`/${id}/block`);
export const removeConnection = (id) => api.delete(`/${id}`);

export const getPendingRequests = () => api.get('/requests');
export const getSentRequests = () => api.get('/sent');
export const getMyNetwork = (params) => api.get('/my-network', { params });
export const getSuggestions = () => api.get('/suggestions');
export const getConnectionStatus = (userId) => api.get(`/status/${userId}`);
