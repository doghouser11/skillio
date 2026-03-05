import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default api;

const generateResource = (endpoint: string) => ({
  getAll: (params?: any) => api.get(endpoint, { params }),
  getOne: (id: any) => api.get(`${endpoint}/${id}`),
  getMy: () => api.get(`${endpoint}/my`),
  getSchool: () => api.get(`${endpoint}/school`),
  create: (data: any) => api.post(endpoint, data),
  update: (id: any, data: any) => api.put(`${endpoint}/${id}`, data),
  updateStatus: (id: any, status: string) => api.patch(`${endpoint}/${id}/status`, { status }),
  verify: (id: any) => api.post(`${endpoint}/${id}/verify`),
  delete: (id: any) => api.delete(`${endpoint}/${id}`),
});

// All with /api prefix for backend compatibility
export const activitiesAPI = generateResource('/api/activities');
export const schoolsAPI = generateResource('/api/schools');
export const leadsAPI = generateResource('/api/leads');
export const reviewsAPI = generateResource('/api/reviews');
export const neighborhoodsAPI = generateResource('/api/neighborhoods');

export const authAPI = {
  login: (data: any) => api.post('/api/emergency/login', data),
  register: (data: any) => api.post('/api/emergency/register', data),
  me: () => api.get('/api/auth/me'),
};

// Emergency endpoints for data
export const emergencyAPI = {
  schools: () => api.get('/api/emergency/schools'),  
  activities: () => api.get('/api/emergency/activities'),
};
