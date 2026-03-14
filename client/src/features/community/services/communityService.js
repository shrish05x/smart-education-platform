import api from '../../../services/api';

export const getPosts = async () => {
  const { data } = await api.get('/community/posts');
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/community/posts', postData);
  return data;
};

export const getPostById = async (id) => {
  const { data } = await api.get(`/community/posts/${id}`);
  return data;
};

export const addComment = async (postId, content) => {
  const { data } = await api.post(`/community/posts/${postId}/comments`, { content });
  return data;
};

export const likePost = async (postId) => {
  const { data } = await api.put(`/community/posts/${postId}/like`);
  return data;
};
