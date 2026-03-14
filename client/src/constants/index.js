export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  COUNSELOR: 'counselor',
  ADMIN: 'admin',
};

export const SESSION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};
