import api from '../services/api';

export const fetchPosts = (params = {}) => api.get('/posts', { params });
export const fetchPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const acceptAnswer = (postId, commentId) => api.post(`/posts/${postId}/accept-answer`, { commentId });
export const ratePost = (postId, rating) => api.post(`/posts/${postId}/rate`, { rating });

export const fetchComments = (postId) => api.get(`/comments/${postId}`);
export const createComment = (data) => api.post('/comments', data);
export const updateComment = (id, content) => api.put(`/comments/${id}`, { content });
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const voteComment = (id) => api.post(`/comments/${id}/vote`);

export const castVote = (postId, type) => api.post('/vote', { postId, type });
export const getUserVote = (postId) => api.get(`/vote/${postId}`);

export const fetchUserProfile = (id) => api.get(`/users/${id}/profile`);
export const updateUserProfile = (id, data) => api.put(`/users/${id}/profile`, data);
export const fetchLeaderboard = (period = 'weekly') => api.get('/users/leaderboard', { params: { period } });
export const fetchPeerMatches = () => api.get('/users/peer-match');

export const fetchNotifications = () => api.get('/notifications');
export const markAllRead = () => api.put('/notifications/read-all');
export const markOneRead = (id) => api.put(`/notifications/${id}/read`);

export const fetchEvents = (status) => api.get('/events', { params: status ? { status } : {} });
export const fetchEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const registerForEvent = (id) => api.post(`/events/${id}/register`);

export const fetchChallenges = () => api.get('/challenges');
export const fetchActiveChallenge = () => api.get('/challenges/active');
export const submitChallenge = (id, data) => api.post(`/challenges/${id}/submit`, data);

export const aiSuggestAnswer = (postId) => api.post('/ai-community/suggest-answer', { postId });
export const aiSummarize = (postId) => api.post('/ai-community/summarize', { postId });
export const aiAutoTag = (title, description) => api.post('/ai-community/auto-tag', { title, description });
export const aiSimilarPosts = (title) => api.get('/ai-community/similar-posts', { params: { title } });
