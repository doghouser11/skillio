import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export const activitiesAPI = {
  getAll: (params?: any) => api.get('/activities', { params }),
  getOne: (id: any) => api.get(`/activities/${id}`),
  verify: (id: any) => api.post(`/activities/${id}/verify`),
  getMy: () => api.get('/activities/my'),
};

export const schoolsAPI = {
  getAll: (params?: any) => api.get('/schools', { params }),
  getOne: (id: any) => api.get(`/schools/${id}`),
  verify: (id: any) => api.post(`/schools/${id}/verify`),
  getMy: () => api.get('/schools/my'),
};

export const leadsAPI = {
  getAll: (params?: any) => api.get('/leads', { params }),
  getMy: () => api.get('/leads/my'),
  getSchool: () => api.get('/leads/school'),
  // ТОВА Е ПОСЛЕДНАТА ГРЕШКА:
  updateStatus: (id: any, status: string) => api.patch(`/leads/${id}/status`, { status }),
};

export const reviewsAPI = {
  getAll: (params?: any) => api.get('/reviews', { params }),
  getMy: () => api.get('/reviews/my'),
};

export const neighborhoodsAPI = {
  getAll: (params?: any) => api.get('/neighborhoods', { params }),
};

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};
