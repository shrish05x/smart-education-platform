import api from '../services/api';

// ── Groups ────────────────────────────────────────────────────────────────────

export const fetchGroups = (params = {}) => api.get('/groups', { params });

export const fetchGroup = (id) => api.get(`/groups/${id}`);

export const createGroup = (data) => api.post('/groups', data);

export const deleteGroup = (id) => api.delete(`/groups/${id}`);

// ── Membership ────────────────────────────────────────────────────────────────

export const joinGroup = (groupId, inviteCode = null) =>
  api.post('/groups/join', { groupId, ...(inviteCode && { inviteCode }) });

export const leaveGroup = (id) => api.post(`/groups/${id}/leave`);

// ── Messages ──────────────────────────────────────────────────────────────────

export const fetchMessages = (groupId) => api.get(`/groups/${groupId}/messages`);

export const postMessage = (groupId, content, type = 'text') =>
  api.post(`/groups/${groupId}/messages`, { content, type });

// ── Resources ─────────────────────────────────────────────────────────────────

export const fetchResources = (groupId) => api.get(`/groups/${groupId}/resources`);

export const shareResource = (groupId, data) =>
  api.post(`/groups/${groupId}/resources`, data);
