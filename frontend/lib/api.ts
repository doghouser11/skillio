import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Експортираме базовия обект по подразбиране
export default api;

// Дефинираме и експортираме липсващите обекти, които Next.js търси:
export const activitiesAPI = {
  getAll: () => api.get('/activities'),
  getOne: (id: any) => api.get(`/activities/${id}`),
};

export const schoolsAPI = {
  getAll: () => api.get('/schools'),
  getOne: (id: any) => api.get(`/schools/${id}`),
};

export const neighborhoodsAPI = {
  getAll: () => api.get('/neighborhoods'),
};

export const leadsAPI = {
  getAll: () => api.get('/leads'),
};

export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
};
