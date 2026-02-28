import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
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

export const activitiesAPI = generateResource('/activities');
export const schoolsAPI = generateResource('/schools');
export const leadsAPI = generateResource('/leads');
export const reviewsAPI = generateResource('/reviews');
export const neighborhoodsAPI = generateResource('/neighborhoods');

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};
