import api from './api';

export const resourceApi = {
  // Get all resources with optional search, subject filter, sorting, and pagination
  getAll: (params = {}) => {
    return api.get('/resources', { params });
  },

  // Get a single resource by ID
  getById: (id) => {
    return api.get(`/resources/${id}`);
  },

  // Get aggregated subject counts
  getSubjectCounts: () => {
    return api.get('/resources/subjects/counts');
  },

  // Create a new resource (supports multipart/form-data for files)
  create: (formData) => {
    return api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete a resource by ID
  delete: (id) => {
    return api.delete(`/resources/${id}`);
  },
};
