import api from '../../../services/api';

export const sendTutorMessage = async (message, chatId) => {
  const { data } = await api.post('/ai/tutor', { message, chatId });
  return data;
};

export const getRecommendations = async (topic, level) => {
  const { data } = await api.post('/ai/recommend', { topic, level });
  return data;
};

export const analyzeResume = async (resumeText) => {
  const { data } = await api.post('/ai/resume', { resumeText });
  return data;
};

export const getAiChats = async () => {
  const { data } = await api.get('/ai/chats');
  return data;
};
