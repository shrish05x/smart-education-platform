import api from '../services/api';

// Posts
export const fetchPosts = (params = {}) => api.get('/posts', { params });
export const fetchPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

// Comments
export const fetchComments = (postId) => api.get(`/comments/${postId}`);
export const createComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Votes
export const castVote = (postId, type) => api.post('/vote', { postId, type });
export const getUserVote = (postId) => api.get(`/vote/${postId}`);

// Profile
export const fetchUserProfile = (userId) => api.get(`/users/${userId}/profile`);
