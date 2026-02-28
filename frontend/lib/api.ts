import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const activitiesAPI = {
  getAll: (params?: any) => api.get('/activities', { params }),
  getOne: (id: any) => api.get(`/activities/${id}`),
};

export const schoolsAPI = {
  getAll: (params?: any) => api.get('/schools', { params }),
  getOne: (id: any) => api.get(`/schools/${id}`),
  // ТАЗИ ФУНКЦИЯ ЛИПСВАШЕ:
  verify: (id: any) => api.post(`/schools/${id}/verify`),
};

export const neighborhoodsAPI = {
  getAll: (params?: any) => api.get('/neighborhoods', { params }),
};

export const leadsAPI = {
  getAll: (params?: any) => api.get('/leads', { params }),
};

export const reviewsAPI = {
  getAll: (params?: any) => api.get('/reviews', { params }),
};

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};
