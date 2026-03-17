import api from './api'; // The base axios instance

export const mentorApi = {
  // Get all mentors with filter/sort/search params
  getAllMentors: async (params = {}) => {
    // Expected params: { search, industry, availability, sort }
    const response = await api.get('/mentors', { params });
    return response.data;
  },

  // Get single mentor by ID
  getMentorById: async (id) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },

  // Submit mentorship request
  createMentorshipRequest: async (requestData) => {
    // Expected requestData: { mentorId, date, duration, goals }
    const response = await api.post('/mentorship/request', requestData);
    return response.data;
  },

  // Get user's mentorship sessions
  getSessions: async () => {
    const response = await api.get('/mentorship/sessions');
    return response.data;
  }
};

export default mentorApi;
